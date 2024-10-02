<script lang="ts">
   import * as Sheet from '$lib/components/ui/sheet';
   import Button from "$lib/components/ui/button/button.svelte";
   import Label from '$lib/components/ui/label/label.svelte';
   import Input from '$lib/components/ui/input/input.svelte';
   import * as Select from '$lib/components/ui/select';
   import { slide } from 'svelte/transition';

   export let open = false;

   let client: string;
   let changes: boolean = false;
   
   let newProduct: string = '';
   let newProductTrayOpen: boolean = false;

   function close() {
      open = false;
      client = '';
      changes = false;
   }

   function closeNewProductTray() {
      newProduct = '';
      newProductTrayOpen = false;
   }

   $: canClose = !changes;
</script>

<Sheet.Root bind:closeOnOutsideClick={canClose} bind:closeOnEscape={canClose} bind:open={open}>
   <Sheet.Content class="flex flex-col gap-y-6 !max-w-[35rem]">
      <Sheet.Header>
         <h2 class="text-3xl font-semibold">Novo pedido</h2>
      </Sheet.Header>

      <div class="flex flex-col gap-y-3">
         <div>
            <Label class="text-lg">Cliente</Label>
            <Input on:change={() => changes = true} type="text" bind:value={client}/>
         </div>

         <div>
            <Label class="text-lg">Produto</Label>
            <div class="flex gap-x-2">
               <Select.Root>
                  <Select.Trigger>
                     <Select.Value placeholder="Selecione um produto"/>
                  </Select.Trigger>
                  <Select.Content>
                     <Select.Item value="mousse" label="Mousse" />
                     <Select.Item value="pudim" label="Pudim" />
                  </Select.Content>
               </Select.Root>
               <Button on:click={() => newProductTrayOpen = true} size="icon" variant="ghost">
                  <i class="ti ti-square-plus text-2xl"></i>
               </Button>
            </div>
            {#if newProductTrayOpen}   
               <div transition:slide class="flex flex-col rounded-lg border border-neutral-800 mt-3 p-3 gap-y-3">
                  <h3 class="text-sm/none uppercase font-medium whitespace-nowrap">Novo produto</h3>
                  <Input type="text" bind:value={newProduct}/>

                  <div class="flex justify-end gap-x-3">
                     <Button variant="outline" on:click={closeNewProductTray}>Descartar</Button>
                     <Button data-changes={changes} variant="secondary" class="data-[changes=false]:no_dot dot relative">Salvar</Button>
                  </div>
               </div>
            {/if}
         </div>
      </div>

      <Sheet.Footer >
         <div class="flex flex-col gap-y-3">
            <div class="flex gap-x-3">
               <Button disabled={canClose} variant="outline" on:click={close}>Descartar alterações</Button>
               <Button data-changes={changes} class="data-[changes=false]:no_dot dot relative">Cadastrar</Button>
            </div>

            <span data-changes={changes} class="text-hbs-accent text-right data-[changes=true]:opacity-100 opacity-0">Alterações foram feitas.</span>
         </div>
      </Sheet.Footer>
   </Sheet.Content>
</Sheet.Root>