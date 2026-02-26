<template>
    <div>
        <div class="flex flex-col xl:flex-row gap-4 items-start">
            <div class="w-full xl:w-3/4">
                <h2 class="mb-4">Derniers guides et actualités</h2>
                <div v-if="isFeedLoading">Chargement du flux en cours</div>
                <div v-else>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        <a
                            v-for="(item, k) in featured"
                            :key="item.id"
                            :href="item.link"
                            class="relative rounded-box overflow-hidden h-full w-full group"
                            :class="{
                                'md:col-span-3 aspect-square md:aspect-video':
                                    [0, 2, 4, 5].indexOf(k) >= 0,
                                'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto':
                                    [1, 3].indexOf(k) >= 0,
                            }"
                        >
                            <div
                                class="w-full h-full absolute top-0 left-0 bg-gradient-to-t from-black/90 to-black/0 group-hover:from-black group-hover:to-black/10 z-20"
                            ></div>
                            <img
                                :src="`${item.imageUrl}`"
                                class="w-full h-full object-cover absolute top-0 left-0 z-10 transform group-hover:scale-110 transition-all"
                                loading="lazy"
                                alt=""
                            />
                            <div
                                class="absolute bottom-0 left-0 z-30 p-4 text-white flex flex-col gap-2"
                            >
                                <div
                                    style="
                                        font-family: var(--headings-font-family, 'Bangers');
                                        font-size: var(--h2-font-size, calc(1rem * 2 * 0.8));
                                    "
                                    class="leading-8 tracking-wider"
                                >
                                    {{ item.title }}
                                </div>
                                <div class="line-clamp-3">{{ item.description }}</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="w-full xl:w-1/4">
                <h2 class="mb-4">Prochains événements</h2>
                <div v-if="isEventsLoading">Chargement des événements en cours</div>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-4 xl:gap-3"
                    v-else
                >
                    <a
                        class="bg-base-100 aspect-video relative rounded-box overflow-hidden no-underline text-white group"
                        :class="{ 'block xl:hidden': e >= 7 }"
                        v-for="(event, e) in events.slice(0, 9)"
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
                            :src="`https://lbm-assets.vercel.app/img/events/thumbnails/${event.type}.jpg`"
                            onerror="
                                this.src =
                                    'https://lbm-assets.vercel.app/img/events/thumbnails/DEFAULT.jpg'
                            "
                            alt=""
                            class="absolute w-full h-full object-cover z-10 transform group-hover:scale-110 transition-all"
                            v-else
                        />
                        <img
                            :src="`https://lbm-assets.vercel.app/img/events/${event.type}.png`"
                            onerror="
                                this.src = 'https://lbm-assets.vercel.app/img/events/DEFAULT.png'
                            "
                            alt=""
                            class="top-0 left-0 absolute z-30 size-10 bg-base-100 rounded-br-box p-2 object-contain"
                        />
                        <div
                            class="text-shadow transition-all bg-gradient-to-b from-base-100/70 to-base-100/90 hover:from-base-100/80 hover:to-base-100 relative z-20 w-full h-full flex flex-col p-4 gap-1 justify-end"
                        >
                            <h2 class="line-clamp-1">{{ event.title }}</h2>
                            <div class="text-xs font-semibold uppercase tracking-wide opacity-75">
                                {{
                                    new Date(Date.parse(event.startAt)).toLocaleDateString(
                                        'FR-fr',
                                        {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        },
                                    )
                                }}
                            </div>
                            <div class="text-xs opacity-75">
                                avec <strong>{{ event.leaderGw2 }}</strong> &bull;
                                {{ event.seats }} inscrits
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <h2 class="mb-4 mt-8">Flux d'actualités</h2>

        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label class="lbm-label cursor-pointer justify-start gap-1 p-0">
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-success lbm-toggle-sm m-0"
                    v-model="filters.lbm"
                    @change="resetPage"
                />
                <span class="label-text text-sm">Guides et articles</span>
            </label>
            <label class="lbm-label cursor-pointer justify-start gap-1 p-0">
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-success lbm-toggle-sm m-0"
                    v-model="filters.rss"
                    @change="resetPage"
                />
                <span class="label-text text-sm">Flux RSS</span>
            </label>
            <label class="lbm-label cursor-pointer justify-start gap-1 p-0">
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-success lbm-toggle-sm m-0"
                    v-model="filters.twitch"
                    @change="resetPage"
                />
                <span class="label-text text-sm">Twitch</span>
            </label>
            <label class="lbm-label cursor-pointer justify-start gap-1 p-0">
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-success lbm-toggle-sm m-0"
                    v-model="filters.youtube"
                    @change="resetPage"
                />
                <span class="label-text text-sm">YouTube</span>
            </label>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <a
                v-for="item in filteredFeed"
                :key="item.id"
                :href="item.link"
                target="_blank"
                class="relative rounded-box overflow-hidden h-full w-full group aspect-square"
            >
                <div
                    class="w-full h-full absolute top-0 left-0 bg-gradient-to-t from-black/90 to-black/0 group-hover:from-black group-hover:to-black/10 z-20"
                ></div>
                <img
                    :src="`${item.imageUrl}`"
                    class="w-full h-full object-cover absolute top-0 left-0 z-10 transform group-hover:scale-110 transition-all"
                    loading="lazy"
                    alt=""
                />
                <div
                    class="absolute bottom-0 left-0 z-30 p-4 text-white flex flex-col gap-2 w-full"
                >
                    <div class="font-bold text-shadow">
                        {{ item.title }}
                    </div>
                    <div class="line-clamp-3 text-sm text-shadow" v-if="item.type !== 'twitch'">
                        {{ item.description.substring(0, 250) }}
                    </div>
                    <div class="flex items-center gap-2 justify-between">
                        <span
                            class="lbm-badge gap-1 text-xs py-1 px-2 h-auto"
                            :class="{
                                'lbm-badge-twitch': item.type == 'twitch',
                                'lbm-badge-youtube': item.type == 'youtube',
                                'lbm-badge-lebusmagique': !item.type,
                                'lbm-badge-rss': item.type == 'rss',
                            }"
                        >
                            <IconBrandTwitch class="size-4" v-if="item.type == 'twitch'" />
                            <IconBrandYoutube class="size-4" v-else-if="item.type == 'youtube'" />
                            <IconRss class="size-4" v-else-if="item.type == 'rss'" />
                            <template v-if="item.type">{{ item.username }}</template>
                            <template v-else>Le Bus Magique</template>
                        </span>
                        <span class="text-xs flex gap-1 items-center">
                            <IconCalendarWeek class="size-4" />
                            {{
                                new Date(Date.parse(item.pubDate)).toLocaleDateString('FR-fr', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                            }}
                        </span>
                    </div>
                </div>
            </a>
        </div>
        <button
            @click="loadMoreFeedItems"
            v-show="isLoadMoreActive"
            class="mt-4 lbm-btn lbm-btn lbm-btn-secondary"
        >
            Charger plus d'éléments
        </button>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import IconRss from '../icons/IconRss.vue';
import IconBrandTwitch from '../icons/IconBrandTwitch.vue';
import IconBrandYoutube from '../icons/IconBrandYoutube.vue';
import IconCalendarWeek from '../icons/IconCalendarWeek.vue';

const itemsPerPage = 12;
const itemsTotal = ref(0);
const currentPage = ref(1);

const isFeedLoading = ref(false);
const isEventsLoading = ref(false);

const feed = ref([]);
const events = ref([]);
const filters = ref({
    lbm: true,
    rss: true,
    twitch: true,
    youtube: true,
});

const featured = computed(() => {
    return feed.value.filter((item) => item.type == null).slice(0, 6);
});

const featuredIds = computed(() => {
    return featured.value.map((item) => item.id);
});

const filteredFeed = computed(() => {
    const items = feed.value
        .filter((item) => {
            return featuredIds.value.indexOf(item.id) < 0;
        })
        .filter((item) => {
            if (filters.value.lbm === false) {
                return item.type !== null;
            }
            return true;
        })
        .filter((item) => {
            if (filters.value.rss === false) {
                return item.type !== 'rss';
            }
            return true;
        })
        .filter((item) => {
            if (filters.value.twitch === false) {
                return item.type !== 'twitch';
            }
            return true;
        })
        .filter((item) => {
            if (filters.value.youtube === false) {
                return item.type !== 'youtube';
            }
            return true;
        });

    itemsTotal.value = items.length;

    return items.slice(0, currentPage.value * itemsPerPage);
});

const loadMoreFeedItems = () => {
    currentPage.value++;
};

const isLoadMoreActive = computed(() => {
    return currentPage.value * itemsPerPage < itemsTotal.value;
});

const loadFeed = () => {
    isFeedLoading.value = true;

    fetch('https://api.lebusmagique.fr/api/lbm/feed/')
        .then((res) => res.json())
        .then((data) => {
            feed.value = data;
        })
        .finally(() => {
            isFeedLoading.value = false;
        });
};

const loadEvents = () => {
    isEventsLoading.value = true;
    fetch('https://api.lebusmagique.fr/api/lbm/events')
        .then((res) => res.json())
        .then((data) => {
            console.log('data', data);
            events.value = data;
        })
        .finally(() => {
            isEventsLoading.value = false;
        });
};

onMounted(() => {
    loadFeed();
    loadEvents();
});

const resetPage = () => {
    currentPage.value = 1;
};
</script>

<style lang="scss" scoped>
@use '../../assets/main.scss';

.lbm-badge-youtube {
    background-color: #ff0000;
    border-color: #ff0000;
    color: #fff;
}

.lbm-badge-twitch {
    background-color: #9146ff;
    border-color: #9146ff;
    color: #f0f0ff;
}

.lbm-badge-rss {
    border-color: #e47417;
    background-color: #e47417;
    color: #fff;
}

.lbm-badge-lebusmagique {
    border-color: #ef4444;
    background-color: #ef4444;
    color: #fff;
}

.text-shadow {
    text-shadow: 1px 1px 3px #000;
}
</style>
