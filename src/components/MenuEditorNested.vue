<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import { computed, ref } from 'vue';
import sprite from '@/data/sprite.json';

interface IList {
  id: string;
  title: string;
  url: string;
  icon: string;
  active: boolean;
  access: array;
  childs: IList[];
}

interface Props {
  modelValue: IList[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:modelValue', value: IList[]): void;
}

const emits = defineEmits<Emits>();
const list = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});

// ---------------------------

const currentItem = ref({});

const editActive = ref(null);

const editHandle = (el) => {
  console.log('editHandle', el.id);
  editActive.value = el.id;
  currentItem.value = { ...el };
};

const cancelEdit = () => {
  currentItem.value = {};
  editActive.value = null;
};

const saveHandle = () => {
  console.log('save');
  const idx = list.value.findIndex((item) => item.id === currentItem.value.id);
  list.value[idx] = currentItem.value;
  editActive.value = null;
};

const accessList = ['HoT', 'PoF', 'EoD', 'SotO'];

const updateAccess = (access) => {
  if (currentItem.value.access.includes(access)) {
    const idx = currentItem.value.access.findIndex((a) => a === access);
    currentItem.value.access.splice(idx, 1);
  } else {
    currentItem.value.access.push(access);
  }
};

const deleteHandle = (id) => {
  const idx = list.value.findIndex((item) => item.id === id);
  list.value.splice(idx, 1);
};
</script>

<template>
  <VueDraggable class="drag-area" tag="ul" v-model="list" group="g1">
    <li v-for="el in modelValue" :key="el.id">
      <div class="flex flex-col w-full gap-2">
        <div class="flex gap-4 items-center justify-between">
          <div class="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 shrink-0 handle"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
            <span :class="['lbm-icon', el.icon]" v-if="el.icon.length > 0"></span>
            <span
              :class="{
                'font-semibold': el.title.length > 0,
                'italic text-base-content': el.title.length === 0,
                'line-through italic text-base-content': !el.active,
              }"
              >{{ el.title.length > 0 ? el.title : 'Aucun titre' }}</span
            >
            <span v-if="el.access.length > 0" class="inline-flex gap-1 text-sm">
              [
              <span v-for="access in el.access">{{ access }}</span>
              ]
            </span>
          </div>
          <div class="flex gap-2 items-center">
            <button @click="deleteHandle(el.id)" class="lbm-btn lbm-btn-xs lbm-btn-primary">
              Supprimer
            </button>
            <button @click="editHandle(el)" class="lbm-btn lbm-btn-xs lbm-btn-secondary">
              Modifier
            </button>
          </div>
        </div>

        <form
          @submit.prevent="saveHandle"
          v-if="editActive === el.id"
          class="flex gap-2 items-center"
        >
          <input
            type="text"
            v-model="currentItem.title"
            class="lbm-input lbm-input-bordered lbm-input-sm w-full"
            placeholder="Titre de la page"
          />
          <input
            type="text"
            v-model="currentItem.url"
            class="lbm-input lbm-input-bordered lbm-input-sm w-full"
            placeholder="URL de la page"
          />
          <select
            class="lbm-select lbm-select-bordered lbm-select-sm w-full"
            v-model="currentItem.icon"
          >
            <option value="">Choisir une icone</option>
            <option v-for="icon in sprite">{{ icon.name }}</option>
          </select>
          <template v-for="a in accessList">
            <label class="flex gap-1 items-center text-sm">
              <input
                type="checkbox"
                class="lbm-checkbox lbm-checkbox-sm lbm-checkbox-secondary"
                :checked="currentItem.access.includes(a)"
                @change="updateAccess(a)"
              />
              {{ a }}
            </label>
          </template>
          <input
            type="checkbox"
            class="lbm-toggle lbm-toggle-sm lbm-toggle-secondary"
            v-model="currentItem.active"
          />
          <button type="button" @click="cancelEdit" class="lbm-btn lbm-btn-xs">Annuler</button>
          <button type="submit" class="lbm-btn lbm-btn-success lbm-btn-xs">Enregistrer</button>
        </form>
      </div>
      <MenuEditorNested v-model="el.childs" />
    </li>
  </VueDraggable>
</template>

<style scoped>
.drag-area {
  @apply border-2 border-base-content rounded-lg list-none p-2 m-0 min-h-8;
}

.drag-area ul {
  @apply ml-8 mt-2 mb-2;
}
</style>
