<template>
    <div>
        <div class="flex flex-col xl:flex-row gap-4 items-start">
            <div class="w-full xl:w-3/4">
                <h2 class="mb-4">Derniers guides et articles</h2>
                <div v-if="isFeedLoading">
                    <div class="flex gap-2 items-center font-semibold text-sm">
                        <span class="lbm-loading lbm-loading-ring"></span>
                        Chargement des guides et articles...
                    </div>
                </div>
                <div v-else>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        <a
                            v-for="(item, k) in featured"
                            :key="item.id"
                            :href="item.link"
                            class="bg-base-100 relative rounded-box overflow-hidden h-full w-full group"
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
                                <div class="flex gap-2 items-center">
                                    <span
                                        class="lbm-badge gap-1 text-xs py-1 px-2 h-auto lbm-badge-lebusmagique"
                                    >
                                        <IconNews
                                            class="size-4"
                                            v-if="item.link.includes('.fr/blog/')"
                                        />
                                        <IconBook2 class="size-4" v-else />
                                        {{ item.link.includes('.fr/blog/') ? 'Article' : 'Guide' }}
                                    </span>
                                    <span class="text-xs flex gap-1 items-center">
                                        <IconCalendarWeek class="size-4" />
                                        {{
                                            new Date(Date.parse(item.pubDate)).toLocaleDateString(
                                                'FR-fr',
                                                {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                },
                                            )
                                        }}
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="w-full xl:w-1/4">
                <h2 class="mb-4">Prochains événements</h2>
                <div v-if="isEventsLoading">
                    <div class="flex gap-2 items-center font-semibold text-sm">
                        <span class="lbm-loading lbm-loading-ring"></span>
                        Chargement des événements...
                    </div>
                </div>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-4 xl:gap-3"
                    v-else
                >
                    <a
                        class="bg-base-100 aspect-video relative rounded-box overflow-hidden no-underline text-white group"
                        :class="{ 'block xl:hidden': e >= 7 }"
                        v-for="(event, e) in events"
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

                <dialog ref="modalEvent" class="lbm-modal">
                    <div class="lbm-modal-box" v-if="currentEvent">
                        <h3 class="text-lg font-bold">{{ currentEvent.title }}</h3>
                        <div class="flex flex-col gap-1 my-4">
                            <div class="flex gap-2">
                                <div class="w-6 shrink-0">
                                    <IconCalendarWeek class="size-5" />
                                </div>
                                <div class="text-sm">
                                    {{
                                        new Date(
                                            Date.parse(currentEvent.startAt),
                                        ).toLocaleDateString('FR-fr', {
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
                                        new Date(Date.parse(currentEvent.endAt)).toLocaleTimeString(
                                            'FR-fr',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            },
                                        )
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
                        <div
                            class="my-4"
                            v-if="currentEvent.description"
                            v-html="markdown.render(currentEvent.description)"
                        ></div>
                        <div class="lbm-modal-action justify-between">
                            <a :href="currentEvent.link" class="lbm-btn lbm-btn-primary">
                                <IconBrandDiscordFilled class="size-5" />
                                S'inscrire
                            </a>
                            <form method="dialog">
                                <button class="lbm-btn lbm-btn-neutral">Fermer</button>
                            </form>
                        </div>
                    </div>
                    <form method="dialog" class="lbm-modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>

        <h2 class="mb-4 mt-8">Flux d'actualités</h2>

        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label class="lbm-label cursor-pointer justify-start gap-1 p-0">
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-success lbm-toggle-sm m-0"
                    v-model="filters.lbm"
                    @change="handleUpdateFilters"
                />
                <span class="label-text text-sm">Guides et articles</span>
            </label>
            <label class="lbm-label cursor-pointer justify-start gap-1 p-0">
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-success lbm-toggle-sm m-0"
                    v-model="filters.rss"
                    @change="handleUpdateFilters"
                />
                <span class="label-text text-sm">Flux RSS</span>
            </label>
            <label class="lbm-label cursor-pointer justify-start gap-1 p-0">
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-success lbm-toggle-sm m-0"
                    v-model="filters.twitch"
                    @change="handleUpdateFilters"
                />
                <span class="label-text text-sm">Twitch</span>
            </label>
            <label class="lbm-label cursor-pointer justify-start gap-1 p-0">
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-success lbm-toggle-sm m-0"
                    v-model="filters.youtube"
                    @change="handleUpdateFilters"
                />
                <span class="label-text text-sm">YouTube</span>
            </label>
        </div>

        <template v-if="!isFeedLoading">
            <div class="lbm-alert mt-4" role="alert" v-if="filteredFeed.length == 0">
                <IconInfoCircle class="stroke-info h-6 w-6 shrink-0" />
                Aucun contenu trouvé... Merci de changer les filtres.
            </div>

            <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4"
                v-else
            >
                <a
                    v-for="item in filteredFeed"
                    :key="item.id"
                    :href="item.link"
                    target="_blank"
                    class="bg-base-100 relative rounded-box overflow-hidden h-full w-full group aspect-square"
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
                                <IconBrandYoutube
                                    class="size-4"
                                    v-else-if="item.type == 'youtube'"
                                />
                                <IconRss class="size-4" v-else-if="item.type == 'rss'" />
                                <template v-if="item.type">{{ item.username }}</template>
                                <template v-else>
                                    <IconNews
                                        class="size-4"
                                        v-if="item.link.includes('.fr/blog/')"
                                    />
                                    <IconBook2 class="size-4" v-else />
                                    {{ item.link.includes('.fr/blog/') ? 'Article' : 'Guide' }}
                                </template>
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
                Afficher plus d'éléments
            </button>
        </template>
        <div class="mt-4" v-else>
            <div class="flex gap-2 items-center font-semibold text-sm">
                <span class="lbm-loading lbm-loading-ring"></span>
                Chargement du flux d'actualités...
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { markdown } from '../../services/markdown';

// Icons
import IconRss from '../icons/IconRss.vue';
import IconBrandTwitch from '../icons/IconBrandTwitch.vue';
import IconBrandYoutube from '../icons/IconBrandYoutube.vue';
import IconCalendarWeek from '../icons/IconCalendarWeek.vue';
import IconNews from '../icons/IconNews.vue';
import IconBook2 from '../icons/IconBook2.vue';
import IconInfoCircle from '../icons/IconInfoCircle.vue';
import IconBus from '../icons/IconBus.vue';
import IconUserSquareRounded from '../icons/IconUserSquareRounded.vue';
import IconBrandDiscordFilled from '../icons/IconBrandDiscordFilled.vue';

const itemsPerPage = 12;
const itemsTotal = ref(0);
const currentPage = ref(1);

const isFeedLoading = ref(true);
const isEventsLoading = ref(true);

const currentEvent = ref({});
const modalEvent = ref();
const handleOpenModal = (eventUid) => {
    currentEvent.value = events.value.find((event) => event.uid === eventUid);
    modalEvent.value.showModal();
};

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
            events.value = data.slice(0, 9);
        })
        .finally(() => {
            isEventsLoading.value = false;
        });
};

onMounted(() => {
    loadFiltersInLocalStorage();
    loadFeed();
    loadEvents();
});

const handleUpdateFilters = () => {
    currentPage.value = 1;
    saveFiltersInLocalStorage();
};

const saveFiltersInLocalStorage = () => {
    localStorage.setItem('lbm-homepage-filters', JSON.stringify(filters.value));
};

const loadFiltersInLocalStorage = () => {
    const localFilters = JSON.parse(localStorage.getItem('lbm-homepage-filters'));
    if (localFilters) {
        filters.value = {
            lbm: !!localFilters.lbm ?? true,
            rss: !!localFilters.rss ?? true,
            twitch: !!localFilters.twitch ?? true,
            youtube: !!localFilters.youtube ?? true,
        };
    }
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
