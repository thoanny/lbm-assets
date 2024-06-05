<script setup>
import { ref } from 'vue';
import MenuEditorNested from '@/components/MenuEditorNested.vue';
import menu from '@/data/lbm-menu.json';
import { v4 as uuidv4 } from 'uuid';

const menuEditor = ref(menu);
const addItem = () => {
  menuEditor.value.push({
    id: uuidv4(),
    title: '',
    url: '',
    icon: '',
    access: [],
    childs: [],
  });
};
</script>
<template>
  <div class="container mx-auto my-4">
    <div class="lbm-alert lbm-alert-info mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-current shrink-0 w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span
        >Après avoir modifié le menu, il faut <strong>impérativement copier</strong> le contenu du
        bloc en bas de page et le
        <strong>coller dans le fichier&nbsp;: ./src/data/lbm-menu.json</strong>.</span
      >
    </div>
    <MenuEditorNested
      v-model="menuEditor"
      class="w-full bg-black bg-opacity-50 p-4 rounded-lg text-white select-none"
    />
    <button @click="addItem" class="lbm-btn lbm-btn-primary mt-4 lbm-btn-sm">
      Ajouter une page
    </button>
    <div class="mt-8 text-xl font-bold">Contenu du menu</div>
    <textarea class="lbm-textarea lbm-textarea-xs w-full min-h-48 mt-4">{{ menuEditor }}</textarea>
    <!-- <NestedMenuEditor
      :items="menuEditor"
      class="bg-black bg-opacity-50 p-4 rounded-lg text-white"
    /> -->
  </div>
</template>
