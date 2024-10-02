<script lang="ts">
   import * as Ably from 'ably';
   import Order from "$lib/components/Order.svelte";
   import OrderSheet from "$lib/components/OrderSheet.svelte";
   import Button from "$lib/components/ui/button/button.svelte";
   import { onMount } from "svelte";
   import { getCurrentTime } from '$lib/utils';
   import { db, type OrderType } from '$lib/db';
   import { liveQuery } from 'dexie';

   let isSheetOpen = false;
   let connected = false;
   let orders = liveQuery(() => db.orders.toArray());
   let mainChannel;
   
   const ABLY_API_KEY = import.meta.env.VITE_ABLY_API_KEY;
   const MockItems = [
      {
         table: "02",
         status: "preparando",
         start_time: "10:30:15",
         end_time: "",
         items: [
            {
               code: "a2553dee",
               amount: 1,
               name: "Bolo de chocolate",
               price: 17.89,
            },
            { 
               code: "06ec1008", 
               amount: 1, 
               name: "PS Coffee", 
               price: 14.0 
            },
            {
               code: "26c20466",
               amount: 2,
               name: "Docinho de pistache",
               price: 4.99,
            },
            { 
               code: "ee266d39", 
               amount: 3, 
               name: "Água sem gás", 
               price: 4.0 
            },
            {
               code: "e0fa2ebe",
               amount: 2,
               name: "Coxinha de frango com requeijão",
               price: 8.59,
            },
         ],
      },
      {
         table: "01",
         status: "entregue",
         start_time: "17:45:15",
         end_time: "18:00:00",
         items: [
            {
               code: "a2553dee",
               amount: 1,
               name: "Bolo de chocolate",
               price: 17.89,
            },
            { code: "06ec1008", amount: 1, name: "PS Coffee", price: 14.0 },
            {
               code: "e0fa2ebe",
               amount: 2,
               name: "Coxinha de frango com requeijão, catupiry e molho especial do chefinho",
               price: 8.59,
            },
         ],
      },
      {
         table: "03",
         status: "cancelado",
         start_time: "13:22:13",
         end_time: "14:42:13",
         items: [
            { code: "ee266d39", amount: 3, name: "Água sem gás", price: 4.0 },
            {
               code: "e0fa2ebe",
               amount: 2,
               name: "Coxinha de frango com requeijão",
               price: 8.59,
            },
         ],
      },
   ];

   async function connectAbly() {
      if (ABLY_API_KEY) {
         const ably = new Ably.Realtime(ABLY_API_KEY);
   
         ably.connection.once("connected", () => {
            console.log(`Connected to Ably!`);
            connected = true;
         });
   
         // Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
         mainChannel = ably.channels.get("cafeteria");
   
         await mainChannel.subscribe("new-order", async (message) => {
            console.log("Message received: " + message.data);
            const newOrder = {
               status: 'preparando',
               start_time: getCurrentTime(),
               end_time: '',
               ...message.data.content
            };

            console.log(newOrder);

            await addOrderToDB(newOrder);
            orders = liveQuery(() => db.orders.toArray());
         });
   
         // Close the connection to Ably after a 5 second delay
         // setTimeout(() => {
         //    ably.connection.close();
         //    ably.connection.once("closed", function () {
         //       console.log("Closed the connection to Ably.");
         //       connected = false;
         //    });
         // }, 15 * 60 * 1000);
      } else {
         console.error("Missing ABLY_API_KEY environment variable.");
      }
   }

   async function addOrderToDB (_order: OrderType) {
      const id = await db.orders.add({
         ..._order
      })

      console.log(`[ORDER ${ id }] Order added to the Database.`);
   }

   $: if ($orders) {
      console.log($orders);
   };

   onMount(async () => {
      await connectAbly();
   });
</script>

<article class="flex flex-col gap-3 h-full">
   <div class="flex items-center justify-between">
      <h1 class="text-4xl font-semibold">Pedidos</h1>

      <div class="flex gap-x-3">
         <div class="text-lg">
            <span class="font-semibold">Total:</span>
            <span class="text-neutral-500">{ MockItems.length } pedidos</span>
         </div>

         <!-- <div class="text-lg">
            <span class="font-semibold">Abertos:</span>
            <span class="text-neutral-500">{ MockItems.filter(v => v.status == 'preparando').length } pedidos</span>
         </div> -->
      </div>
   </div>

   <div>
      <Button on:click={() => (isSheetOpen = !isSheetOpen)} variant="ghost" class="text-base">
         <i class="ti ti-square-plus text-lg mr-2"></i>
         Novo pedido
      </Button>
   </div>

   <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
      {#if $orders}   
         {#each $orders as order}
            <Order order={order} />
         {/each}
      {/if}
   </div>
</article>

<OrderSheet bind:open={isSheetOpen} />
