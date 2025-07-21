<template>
    <div class="grid xl:grid-cols-5 gap-4">
        <a
            v-for="page in pages"
            :key="page.id"
            :href="page.link"
            class="relative rounded-lg overflow-hidden h-full w-full group"
            :class="{
                'xl:col-span-3 aspect-video': [0, 2, 4, 5, 6, 8].indexOf(page.id) >= 0,
                'xl:col-span-2 xl:row-span-2 aspect-video xl:aspect-auto':
                    [1, 3, 7].indexOf(page.id) >= 0,
            }"
        >
            <div
                class="w-full h-full absolute top-0 left-0 bg-gradient-to-t from-black/70 to-transparent z-20"
            ></div>
            <img
                :src="`${page.image}?fx=c_890_500`"
                class="w-full h-full object-cover absolute top-0 left-0 z-10 transform group-hover:scale-110 transition-all"
                loading="lazy"
                alt=""
            />
            <div class="absolute bottom-0 left-0 z-30 p-6 text-white flex flex-col gap-3">
                <div
                    style="
                        font-family: var(--headings-font-family, 'Bangers');
                        font-size: var(--h2-font-size, calc(1rem * 2 * 0.8));
                    "
                    class="leading-8 tracking-wider"
                >
                    {{ page.title }}
                </div>
                <div class="line-clamp-2">{{ page.description }}</div>
            </div>
        </a>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const data = ref([]);

const pages = computed(() => {
    return data.value.slice(0, 9);
});

fetch('/pages/do/rss.xml')
    .then((res) => res.text())
    .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
    .then((d) => {
        const items = d.querySelectorAll('item');
        items.forEach((el, i) => {
            const description = el
                .querySelector('description')
                .innerHTML.replace(/^<\!\[CDATA\[|\]\]>$/g, '');

            data.value.push({
                id: i,
                title: el.querySelector('title').innerHTML.replace(/^<\!\[CDATA\[|\]\]>$/g, ''),
                link: el.querySelector('link').innerHTML,
                description: description.replace(/<\/*p>|<img[^>]+\>/g, ''),
                image: description.replace(
                    /^<p>\<img src=\"([\S]+)\?fx=c_120_120\"(?:.*)<\/p>$/g,
                    '$1',
                ),
            });
        });
    });
</script>

<style scoped>
@import '@/assets/main.scss';
</style>
