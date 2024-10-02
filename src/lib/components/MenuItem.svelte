<script>
   import { createEventDispatcher } from "svelte";
   import Button from "$lib/components/ui/button/button.svelte";
   import { toBRLCurrency } from "$lib/utils";

   export let item;

   const dispatch = createEventDispatcher();

   function increaseAmount() {
      item.amount++;
      dispatch('update', item);
   }
   
   function decreaseAmount() {
      if (item.amount > 0) {
         item.amount--;
         dispatch('update', item);
      }
   }
</script>

<div class="flex flex-col w-full overflow-hidden gap-y-2 py-2">
   <!-- <div class="h-[6rem] aspect-square bg-neutral-200 row-span-2">
      <img class="h-full object-cover" src={ item.img } alt="">
   </div> -->

   <span class="font-semibold line-clamp-1">{ item.name }</span>

   {#if item.description}
      <p class="line-clamp-2 text-sm text-neutral-500">{ item.description }</p>
   {/if}

   <div class="flex">
      <span class="w-full font-medium text-neutral-500">{ toBRLCurrency(item.price) }</span>
   
      <div class="flex justify-between items-center w-[12rem]">
         <Button on:click={decreaseAmount} size="icon" variant="ghost">
            <i class="ti ti-minus"></i>
         </Button>
   
         <span class="flex font-mono text-sm">{ item.amount }</span>
   
         <Button on:click={increaseAmount} size="icon" variant="ghost">
            <i class="ti ti-plus"></i>
         </Button>
      </div>
   </div>
</div>