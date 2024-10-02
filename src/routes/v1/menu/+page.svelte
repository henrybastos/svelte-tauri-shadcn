<script>
   import * as Ably from 'ably';
   import MenuItem from "$lib/components/MenuItem.svelte";
   import Button from "$lib/components/ui/button/button.svelte";
   import { toBRLCurrency } from "$lib/utils";
   import { onMount } from "svelte";

   // let isSheetOpen = false;
   let connected = false;
   let table = 1;
   let updateAcc = 0;
   let totalCost = 0;
   let mainChannel;

   const ABLY_API_KEY = import.meta.env.VITE_ABLY_API_KEY;
   const Menu = [
      {
         code: 'a2553dee',
         img: 'https://fastly.picsum.photos/id/26/4209/2769.jpg?hmac=vcInmowFvPCyKGtV7Vfh7zWcA_Z0kStrPDW3ppP0iGI',
         name: 'Bolo de chocolate',
         price: 17.89,
         description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia, quis! Dicta impedit corrupti cumque assumenda amet totam veniam iste vero.',
         amount: 0
      },
      {
         code: '26c20466',
         img: 'https://fastly.picsum.photos/id/27/3264/1836.jpg?hmac=p3BVIgKKQpHhfGRRCbsi2MCAzw8mWBCayBsKxxtWO8g',
         name: 'Docinho de pistache',
         price: 4.99,
         description: 'Docinho de pistache com cobertura de granulos de pistache. Aprox. 80g',
         amount: 0
      },
      {
         code: 'e0fa2ebe',
         img: '',
         name: 'Coxinha de frango com requeijão, catupiry e molho especial do chefinho',
         price: 8.59,
         description: '',
         amount: 0
      },
   ]

   async function processOrder() {
      const newOrderItems = Menu.filter(v => v.amount > 0).map(item => ({
         code: item.code,
         name: item.name,
         price: item.price,
         amount: item.amount
      }));

      const newOrder = {
         table,
         items: newOrderItems
      };

      console.log('[NEW ORDER]:', newOrder);

      if (mainChannel && connected) {
         await mainChannel.publish("new-order", {
            content: newOrder
         });
      }
   }

   async function connectAbly() {
      if (ABLY_API_KEY) {
         // Connect to Ably with your API key
         // const ably = new Ably.Realtime({
         //    key: ABLY_API_KEY,
         //    authUrl: '/auth' 
         // });
         const ably = new Ably.Realtime(ABLY_API_KEY);
   
         ably.connection.once("connected", () => {
            console.log(`Connected to Ably!`);
            connected = true;
         });
   
         // Channel: cafeteria
         mainChannel = ably.channels.get("cafeteria");
         
         // Name: new-order
         // await mainChannel.subscribe("new-order", (message) => {
         //    console.log("Message received: " + message.data);
         // });
   
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

   function updateItem(item) {
      updateAcc++;
   }

   $: if (updateAcc) {
      totalCost = Menu.map(v => v.price * v.amount).reduce((a,b) => a+b)
   };

   onMount(async () => {
      await connectAbly();
   });
</script>

<article class="flex flex-col gap-3 h-full">
   <div class="flex flex-col">
      <h1 class="text-2xl font-semibold">Cardápio</h1>
      <p>Faça o seu pedido abaixo!</p>
   </div>

   <div>
   </div>   

   <div class="flex flex-col items-center">
      <div class="flex flex-col gap-y-3 max-w-[45rem]">
      <!-- <div class="grid grid-cols-[min-content_auto_min-content_min-content]  gap-y-3 max-w-[45rem]"> -->
       
         <div class="flex justify-evenly items-center py-4 border border-neutral-300 rounded-lg">
            <Button on:click={() => table > 1 && table--} size="icon" variant="ghost">
               <i class="ti ti-minus text-2xl"></i>
            </Button>
      
            <div class="flex flex-col items-center">
               <h2 class="uppercase text-xl font-bold tracking-wider">Mesa</h2>
               <span class="text-4xl font-light">{ table.toString().padStart(2, '0') }</span>
            </div>
      
            <Button on:click={() => table++} size="icon" variant="ghost">
               <i class="ti ti-plus text-2xl"></i>
            </Button>
         </div>

         <div class="flex flex-col divide-y divide-y-neutral-300">
            {#each Menu as item}
               <MenuItem on:update={({ detail }) => updateItem(detail)} {item} />
            {/each}
         </div>

         <div class="flex col-span-full justify-evenly items-center py-4 border border-neutral-300 rounded-lg">
            <div>
               <span>Total:</span>
               <span>{ toBRLCurrency(totalCost) }</span>
            </div>
         </div>

         <Button disabled={totalCost == 0} on:click={processOrder} class="w-full col-span-full">{ totalCost == 0 ? 'Carrinho vazio' : 'Fazer pedido' }</Button>
      </div>
   </div>
</article>