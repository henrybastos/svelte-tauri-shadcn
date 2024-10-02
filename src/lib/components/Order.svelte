<script>
   import * as Select from "$lib/components/ui/select/index.ts";
   import { formatHHMMSS, getCurrentTime, toBRLCurrency } from "$lib/utils";
   import { onMount, tick } from "svelte";

   let elapsedTimeInterval;
   let elapsedTime = "00:00:00";
   let totalPrice;

   let status = [
      {
         label: 'Preparando',
         value: 'preparando'
      },
      {
         label: 'Cancelado',
         value: 'cancelado'
      },
      {
         label: 'Entregue',
         value: 'entregue'
      }
   ]

   export let order;

   onMount(() => {
      totalPrice = toBRLCurrency(order.items.map((v) => v.price * v.amount).reduce((a, b) => a + b));
      elapsedTime = formatHHMMSS(order.start_time, order.end_time);      
   });

   $: if (order.status == 'preparando') {
      elapsedTimeInterval = setInterval(() => {
         elapsedTime = formatHHMMSS(order.start_time);
      }, 1000);
   } else {
      clearInterval(elapsedTimeInterval);
      if (order.status == 'preparando') {
         order.end_time = getCurrentTime();
         elapsedTime = formatHHMMSS(order.start_time, order.end_time)
      }
   }
</script>

<div class="flex divide-x divide-neutral-200 dark:divide-neutral-800 border border-neutral-300 dark:border-neutral-800 rounded-md">
   <div class="flex flex-col justify-between items-center w-[6.5rem]">
      <div class="p-5">
         <span class="uppercase font-semibold">mesa</span>
         <h4 class="text-4xl text-center">{order.table}</h4>
      </div>

      <div class="flex flex-col items-center px-5 py-2 border-t border-t-neutral-200 dark:border-t-neutral-800 h-fit w-full">
         <!-- <span class="text-neutral-500">{ order.order_time.split(':').splice(0,2).replace(':', 'h') }</span> -->
         <span class="text-neutral-400 dark:text-neutral-500 font-mono text-sm">
            {order.start_time.split(":").splice(0, 2).join("h")}
         </span>

         <span data-status={order.status} class="font-mono text-sm data-[status=preparando]:text-neutral-950 text-neutral-400 dark:text-neutral-500">
            { elapsedTime }
         </span>
      </div>
   </div>

   <div class="w-full">
      <div class="flex justify-between">
         <Select.Root selected={{ value: order.status, label: order.status }} onSelectedChange={({ value }) => order.status = value} portal={null}>
            <Select.Trigger data-status={order.status} class="flex uppercase text-sm/none h-8 w-fit border-none rounded-none rounded-br-md tracking-wider min-w-[7rem] tag_colors">
               <Select.Value class="!text-neutral-50 text-center w-full" placeholder="-" />
            </Select.Trigger>
            <Select.Content>
               <div class="flex flex-col gap-y-1">
                  {#each status as tag}
                     <Select.Item data-status={tag.value} class="tag_colors cursor-pointer text-neutral-50" value={tag.value} label={tag.label}/>
                  {/each}
               </div>
            </Select.Content>
            <Select.Input name="status"/>
         </Select.Root>

         <div class="flex items-center gap-x-2 px-3 rounded-bl-md bg-neutral-300 dark:bg-neutral-800">
            <span class="font-semibold">Total:</span>
            <span class="text-neutral-950 dark:text-neutral-400 font-mono">{totalPrice}</span>
         </div>
      </div>

      <div class="grid grid-cols-[min-content_auto_min-content] gap-y-1 px-5 py-3">
         {#each order.items as item}
            <div class="grid grid-cols-subgrid col-span-full gap-x-2">
               <!-- <span class="text-neutral-600 mr-2">{ item.code }x</span> -->
               <span class="text-neutral-500 font-mono">{item.amount}x</span>
               <p class="w-full max-w-[20rem] whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {item.name}
               </p>
               <span class="text-neutral-500 font-mono">{toBRLCurrency(item.price)}</span>
            </div>
         {/each}
      </div>
   </div>
</div>