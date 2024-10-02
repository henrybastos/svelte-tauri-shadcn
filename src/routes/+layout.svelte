<script lang="ts">
   import { ModeWatcher } from "mode-watcher";
   import "../app.css";
   import { Button } from "$lib/components/ui/button";
   import { beforeUpdate, onMount } from "svelte";
   import { WindowTitles } from "$lib/utils";
   import { slide } from "svelte/transition";

   const navbarButtons = [
      {
         label: 'Pedidos',
         icon: 'list-details',
         route: '/v1/orders'
      },
      {
         label: 'Estoque',
         icon: 'packages',
         route: '/v1/storage'
      },
      {
         label: 'Cardápio',
         icon: 'fridge',
         route: '/v1/menu'
      },
      // {
      //    label: 'Relatórios',
      //    icon: 'chart-bar',
      //    route: '/v1/reports'
      // }
   ];

   let currentLocation = '';
   let navMode = 'build';

   function switchNavMode() {
      navMode == 'build' ? navMode = 'dashboard' : navMode = 'build';
   }

   beforeUpdate(() => {
      currentLocation = window.location.pathname
   })
</script>

<ModeWatcher />

<svelte:head>
   <title>Business Manager - { WindowTitles[currentLocation] }</title>
</svelte:head>

<header class="flex justify-between items-center bg-neutral-50 dark:bg-neutral-900 w-full rounded-md h-fit overflow-hidden">
   <nav class="flex gap-x-1 w-full h-full relative items-center p-3">
      {#each navbarButtons as btn}   
         <div transition:slide>
            <Button data-active={currentLocation == btn.route} href={btn.route} variant="ghost" class="text-lg gap-x-3 data-[active=true]:text-hbs-accent text-neutral-500">
               <i class="ti ti-{ btn.icon } text-xl"></i> { btn.label }
            </Button>
         </div>
      {/each}
   </nav>

   <Button data-active={currentLocation == '/v1/settings'} href="/v1/settings" variant="ghost" size="icon" class="data-[active=true]:text-hbs-accent text-neutral-500 h-full w-auto aspect-square rounded-none">
      <i class="ti ti-settings text-xl"></i>
   </Button>
</header>

<main class="bg-neutral-50 dark:bg-neutral-900 mt-4 rounded-md min-h-fit h-full p-6">
   <slot></slot>
</main>