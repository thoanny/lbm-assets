<template>
    <div class="@container" v-if="false">
        <div class="hidden @xs:block @sm:hidden">XS</div>
        <div class="hidden @sm:block @md:hidden">SM</div>
        <div class="hidden @md:block @lg:hidden">MD</div>
        <div class="hidden @lg:block @xl:hidden">LG</div>
        <div class="hidden @xl:block @2xl:hidden">XL</div>
        <div class="hidden @2xl:block @3xl:hidden">2XL</div>
        <div class="hidden @3xl:block @4xl:hidden">3XL</div>
        <div class="hidden @4xl:block @5xl:hidden">4XL</div>
        <div class="hidden @5xl:block @6xl:hidden">5XL</div>
        <div class="hidden @6xl:block @7xl:hidden">6XL</div>
        <div class="hidden @7xl:block">7XL</div>
    </div>

    <dialog ref="modal" class="lbm-modal">
        <div class="lbm-modal-box" v-if="currentEvent">
            <h3 class="text-lg font-bold">{{ currentEvent.title }}</h3>
            <div
                class="py-4"
                v-if="currentEvent.description"
                v-html="markdown.render(currentEvent.description)"
            ></div>
            <div class="flex flex-col gap-1">
                <div class="flex gap-2">
                    <div class="w-6 shrink-0">
                        <IconCalendarWeek class="size-5" />
                    </div>
                    <div class="text-sm">
                        {{
                            new Date(Date.parse(currentEvent.startAt)).toLocaleDateString('FR-fr', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                        }}
                        &rarr;
                        {{
                            new Date(Date.parse(currentEvent.endAt)).toLocaleTimeString('FR-fr', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                        }}
                    </div>
                </div>
                <div class="flex gap-2">
                    <div class="w-6 shrink-0">
                        <IconUserSquareRounded class="size-5" />
                    </div>
                    <div class="text-sm">
                        {{ currentEvent.leaderGw2 }}
                    </div>
                </div>
                <div class="flex gap-2">
                    <div class="w-6 shrink-0">
                        <IconBus class="size-5" />
                    </div>
                    <div class="text-sm">{{ currentEvent.seats }} inscrits</div>
                </div>
            </div>
            <div class="lbm-modal-action">
                <form method="dialog" class="w-full">
                    <button class="lbm-btn w-full">Fermer</button>
                </form>
            </div>
        </div>
        <form method="dialog" class="lbm-modal-backdrop">
            <button>close</button>
        </form>
    </dialog>

    <div class="@container" style="max-width: 308px">
        <div class="flex gap-2 items-center mt-4" v-if="isLoading">
            <span class="lbm-loading"></span> Chargement en cours...
        </div>
        <div class="grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 gap-4" v-else>
            <a
                class="bg-base-100 aspect-video relative rounded-box overflow-hidden no-underline text-white group"
                v-for="event in events"
                :key="event.uid"
                href="#!"
                @click.prevent="handleOpenModal(event.uid)"
            >
                <img
                    :src="`https://api.lebusmagique.fr/uploads/lbm/events/${event.image}`"
                    alt=""
                    class="absolute w-full h-full object-cover z-10 transform group-hover:scale-110 transition-all"
                    v-if="event.image"
                />
                <img
                    :src="`https://lbm-assets.vercel.app/img/events/${event.type}.png`"
                    alt=""
                    class="top-0 left-0 absolute z-30 size-10 bg-base-100 rounded-br-box p-2 object-contain"
                />
                <div
                    class="text-shadow transition-all bg-gradient-to-b from-base-100/70 to-base-100/90 hover:from-base-100/80 hover:to-base-100 relative z-20 w-full h-full flex flex-col p-4 gap-1 justify-end"
                >
                    <h2 class="line-clamp-1">
                        {{ event.title }}
                    </h2>
                    <div class="text-xs font-semibold uppercase tracking-wide opacity-75">
                        {{
                            new Date(Date.parse(event.startAt)).toLocaleDateString('FR-fr', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                        }}
                    </div>
                    <div class="text-xs opacity-75">
                        avec <strong>{{ event.leaderGw2 }}</strong> &bull;
                        {{ event.seats }} inscrits
                    </div>
                </div>
            </a>
            <div v-for="event in events" :key="event.uid">
                <div class="">{{ event.title }}</div>
                <div v-html="markdown.render(event.description)"></div>
            </div>
        </div>
    </div>
    <hr />
    <pre v-if="false">{{ events }}</pre>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { markdown } from '../../services/markdown';

import IconCalendarWeek from '../icons/IconCalendarWeek.vue';
import IconUserSquareRounded from '../icons/IconUserSquareRounded.vue';
import IconBus from '../icons/IconBus.vue';

const url = 'https://api.lebusmagique.fr/api/lbm/events';
const isLoading = ref();
const events = ref([]);
const currentEvent = ref({});

const modal = ref();

const handleOpenModal = (eventUid) => {
    currentEvent.value = events.value.find((event) => event.uid === eventUid);
    modal.value.showModal();
};

const loadEvents = async () => {
    isLoading.value = true;

    await fetch(url)
        .then((res) => res.json())
        .then((data) => {
            events.value = data;
        })
        .finally(() => {
            isLoading.value = false;
        });
};

onMounted(() => {
    loadEvents();
});
</script>

<style lang="scss" scoped>
@use '../../assets/main.scss';

.text-shadow {
    text-shadow: 1px 1px 1px oklch(var(--b1));
}
</style>
