<script setup>
import { ref } from 'vue';
import MenuEditorNested from '@/components/MenuEditorNested.vue';
import menu from '@/data/lbm-menu.json';
import sprite from '@/data/sprite.json';
import { v4 as uuidv4 } from 'uuid';

const menuEditor = ref(menu);

const itemDefault = {
  id: '',
  title: '',
  url: '',
  icon: '',
  active: true,
  access: [],
  childs: [],
};

const newItem = ref({ ...itemDefault });
const accessList = ['HoT', 'PoF', 'EoD', 'SotO'];

const addItem = () => {
  newItem.value.id = uuidv4();
  menuEditor.value.push({ ...newItem.value });
  newItem.value = { ...itemDefault };
  updateAccess();
};

const updateAccess = (access) => {
  if (newItem.value.access.includes(access)) {
    const idx = newItem.value.access.findIndex((a) => a === access);
    newItem.value.access.splice(idx, 1);
  } else if (access) {
    newItem.value.access.push(access);
  } else {
    newItem.value.access = [];
  }
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

    <form @submit.prevent="addItem" class="bg-base-100 p-4 rounded-lg mt-4">
      <div class="flex gap-2 items-center">
        <input
          type="text"
          v-model="newItem.title"
          class="lbm-input lbm-input-bordered lbm-input-sm w-full"
          placeholder="Titre de la page"
          required
        />
        <input
          type="text"
          v-model="newItem.url"
          class="lbm-input lbm-input-bordered lbm-input-sm w-full"
          placeholder="URL de la page"
        />
        <select class="lbm-select lbm-select-bordered lbm-select-sm w-full" v-model="newItem.icon">
          <option value="">Choisir une icone</option>
          <option v-for="icon in sprite">{{ icon.name }}</option>
        </select>
        <template v-for="a in accessList">
          <label class="flex gap-1 items-center text-sm">
            <input
              type="checkbox"
              class="lbm-checkbox lbm-checkbox-sm lbm-checkbox-secondary"
              :checked="newItem.access.includes(a)"
              @change="updateAccess(a)"
            />
            {{ a }}
          </label>
        </template>
        <input
          type="checkbox"
          class="lbm-toggle lbm-toggle-sm lbm-toggle-secondary"
          v-model="newItem.active"
        />
      </div>

      <button type="submit" class="lbm-btn lbm-btn-primary mt-2 lbm-btn-sm">
        Ajouter une page
      </button>
    </form>

    <!-- <pre>{{ newItem }}</pre> -->

    <div class="mt-8 text-xl font-bold">Contenu du menu</div>
    <textarea class="lbm-textarea lbm-textarea-xs w-full min-h-48 mt-4">{{ menuEditor }}</textarea>
    <div class="mt-8 text-xl font-bold">Icônes</div>
    <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 mt-4">
      <div
        v-for="icon in sprite"
        class="bg-base-100 rounded-lg flex items-center justify-center flex-col text-center py-4 px-2 gap-4 aspect-square"
      >
        <span :class="['lbm-icon', icon.name]"></span>
        <span class="text-xs">{{ icon.name }}</span>
      </div>
    </div>
  </div>
</template>
