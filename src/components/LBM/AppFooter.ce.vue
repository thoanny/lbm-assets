<script setup>
import IconBrandGithubFilled from '../icons/IconBrandGithubFilled.vue';
defineProps(['version']);
const currentYear = new Date().toLocaleDateString('FR-fr', { year: 'numeric' });
</script>

<template>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 items-center text-xs">
        <div class="text-center sm:text-start">
            Réalisé par Thoanny
            <template v-if="version"> &bull; Version&nbsp;: {{ version }}</template>
        </div>
        <div class="text-center">Le Bus Magique - {{ currentYear }}</div>
        <div class="text-end flex gap-2 justify-center sm:justify-end">
            <a
                :href="`https://tally.so/r/nPx6lb?from=${version || 'lbm-assets'}`"
                target="_blank"
                class=""
            >
                Signaler un bug
            </a>
            &bull;
            <a href="https://github.com/thoanny/lbm-assets" target="_blank" class="">
                <IconBrandGithubFilled class="size-4" />
            </a>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/main.scss';
a {
    @apply text-neutral-content;
}
a:hover {
    color: white;
}
</style>
