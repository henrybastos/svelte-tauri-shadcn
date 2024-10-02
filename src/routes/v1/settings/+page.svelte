<script>
   import { toggleMode } from "mode-watcher";
   import Button from "$lib/components/ui/button/button.svelte";
</script>

<article class="flex flex-col gap-3 h-full">
   <h1 class="text-4xl font-semibold">Configurações</h1>

   <section class="border-t border-neutral-800 py-3 space-y-1">
      <h2 class="text-2xl font-semibold">Tema</h2>
      <p class="text-lg text-neutral-400">Mude o tema para Claro ou Escuro, de acordo com a sua preferência.</p>

      <Button class="text-xl " on:click={toggleMode} variant="ghost" size="icon">
         <i class="ti ti-sun rotate-0 scale-100 dark:-rotate-90 dark:scale-0"></i>
         <i class="ti ti-moon absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100"></i>
         <span class="sr-only">Toggle theme</span>
      </Button>
   </section>
</article>