<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps(['item', 'active', 'level', 'open', 'mobile']);
const emit = defineEmits(['openMenuItem']);
</script>

<template>
  <li
    :class="{
      'lbm-main-menu__has-childs': item.childs?.length,
      'hidden lg:block': !mobile,
      active: open.includes(item.id),
    }"
    :data-level="level"
    v-if="item.active"
  >
    <a href="#!" v-if="item.childs?.length" @click.prevent="$emit('openMenuItem', item.id, level)">
      <span class="lbm-main-menu__item-wrapper">
        <span :class="['lbm-icon', item.icon]" v-if="item.icon"></span>
        <span class="lbm-main-menu__item-title">
          {{ item.title }}
          <span class="lbm-main-menu__item-access" v-if="item.access.length > 0 && level > 0">
            <span :class="`bg-access-${access}`" v-for="access in item.access">
              {{ access }}
            </span>
          </span>
        </span>
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="carret"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </a>
    <a :href="item.url" v-else>
      <span class="lbm-main-menu__item-wrapper">
        <span :class="['lbm-icon', item.icon]" v-if="item.icon"></span>
        <span class="lbm-main-menu__item-title">
          {{ item.title }}
          <span class="lbm-main-menu__item-access">
            <span :class="`bg-access-${access}`" v-for="access in item.access">
              {{ access }}
            </span>
          </span>
        </span>
      </span>
    </a>
    <ul class="lbm-main-menu__dropdown" v-if="item.childs?.length">
      <MainMenuItem
        :item="child"
        v-for="child in item.childs"
        :key="child.id"
        :level="level + 1"
        :open="open"
        :mobile="mobile"
        @open-menu-item="$emit('openMenuItem', child.id, level + 1)"
      />
    </ul>
  </li>
</template>

<style scoped>
@import '@/assets/main.scss';
</style>
