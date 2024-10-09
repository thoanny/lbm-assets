<script setup>
// Icons : https://remixicon.com
import { onMounted, ref, computed, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import Gw2ApiService from '@/services/gw2ApiService';
import {
    cats as localCats,
    nodes as localNodes,
    glyphs as localGlyphs,
} from '@/data/gw2-homestead.json';

const gw2 = Gw2ApiService;

const user = useUserStore();
const { currentToken } = storeToRefs(user);

const modalCat = ref();
const modalNode = ref();
const cats = ref([]);
const nodes = ref([]);
const glyphs = ref([]);
const decorations = ref([]);
const categories = ref([]);
const hideCheckedCatsAndNodes = ref(false);
const isLoading = ref(false);

const LBMApp = ref();

const markdown = new MarkdownIt({ html: true });

const currentDecoration = ref(null);
const currentCat = ref(null);
const currentNode = ref(null);
const searchValue = ref('');
const searchType = ref('');

const copyToClipboard = (content) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
};

const chunk = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
    );
};

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

const loadData = async () => {
    isLoading.value = true;
    return await Promise.all([
        gw2.getCats(),
        gw2.getNodes(),
        gw2.getGlyphs(),
        gw2.getCategories(),
        gw2.getDecorations(),
    ]).then((res) => {
        const [$cats, $nodes, $glyphs, $categories, $decorations] = res;

        cats.value = $cats.data.map((d) => ({
            ...d,
            ...localCats.find((lc) => lc.id === d.id),
        }));

        nodes.value = $nodes.data.map((d) => ({
            ...d,
            ...localNodes.find((ln) => ln.id === d.id),
        }));

        glyphs.value = $glyphs.data.map((g) => ({
            ...g,
            ...localGlyphs.find((lg) => lg.id === g.id),
        }));
        categories.value = $categories.data.sort((a, b) => a.name.localeCompare(b.name));

        decorations.value = [];
        let req = [];

        chunk($decorations.data, 200).forEach((ids) => {
            req.push(Gw2ApiService.getDecorationsByIds(ids));
        });

        Promise.all(req)
            .then((res) => {
                res.forEach((r) => {
                    decorations.value = decorations.value.concat(r.data);
                });
            })
            .then(() => {
                decorations.value = decorations.value.sort((a, b) => a.name.localeCompare(b.name));
                isLoading.value = false;
            });
    });
};

const loadUserData = async () => {
    if (!currentToken.value) return;

    return await Promise.all([
        gw2.getUserCats(currentToken.value),
        gw2.getUserNodes(currentToken.value),
        gw2.getUserGlyphs(currentToken.value),
        gw2.getUserDecorations(currentToken.value),
    ]).then((res) => {
        const [$cats, $nodes, $glyphs, $decorations] = res;

        cats.value = cats.value.map((cat) => ({
            ...cat,
            checked: $cats.data.findIndex((d) => d.id === cat.id) >= 0,
        }));

        nodes.value = nodes.value.map((node) => ({
            ...node,
            checked: $nodes.data.findIndex((d) => d === node.id) >= 0,
        }));

        glyphs.value = glyphs.value.map((glyph) => ({
            ...glyph,
            checked: $glyphs.data.findIndex((d) => d === glyph.id) >= 0,
        }));

        decorations.value = decorations.value.map((decoration) => ({
            ...decoration,
            ...$decorations.data.find((d) => d.id === decoration.id),
        }));
    });
};

const getDecoration = (decoration_id) => {
    LBMApp.value.scrollIntoView({ behaviour: 'smooth' });
    currentDecoration.value = decorations.value.find(
        (decoration) => decoration.id === decoration_id,
    );
};

onMounted(() => {
    initUserSettings();
    loadData().then(() => loadUserData());
});

const filteredDecorations = computed(() => {
    const s = searchValue.value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();

    return decorations.value.filter((decoration) => {
        if (searchType.value && searchValue.value) {
            return (
                decoration.categories.indexOf(searchType.value) >= 0 &&
                decoration.name
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
                    .toLowerCase()
                    .indexOf(s) >= 0
            );
        } else if (searchType.value) {
            return decoration.categories.indexOf(searchType.value) >= 0;
        } else if (searchValue.value) {
            return (
                decoration.name
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
                    .toLowerCase()
                    .indexOf(s) >= 0
            );
        }
        return true;
    });
});

const handleModalCat = (cat_id) => {
    currentCat.value = cats.value.find((cat) => cat.id === cat_id);
    modalCat.value.showModal();
};

const handleModalNode = (node_id) => {
    currentNode.value = nodes.value.find((node) => node.id === node_id);
    modalNode.value.showModal();
};

const initUserSettings = () => {
    const localHideCheckedCatsAndNodes = localStorage.getItem('gw2-homestead-hide-cats-nodes');
    if (!!localHideCheckedCatsAndNodes) {
        hideCheckedCatsAndNodes.value = localHideCheckedCatsAndNodes == 'true';
    }
};

const handleHideCheckedCatsAndNodes = () => {
    localStorage.setItem('gw2-homestead-hide-cats-nodes', hideCheckedCatsAndNodes.value);
};

watch(currentToken, () => {
    loadData().then(() => loadUserData());
});
</script>

<template>
    <!-- <pre>{{ currentToken }}</pre> -->
    <!-- <pre>{{ decorations }}</pre> -->
    <div class="lbm-app" ref="LBMApp">
        <div class="lbm-app__header">
            <div class="lbm-app__brand">
                <img src="" alt="" class="lbm-app__logo bg-primary" v-if="false" />
                <div class="lbm-app__title">
                    Décorations du pavillon
                    <div class="lbm-app__subtitle">
                        {{ decorations.length }} décorations, {{ cats.length }} chats et
                        {{ nodes.length }} zones de récolte
                        <!-- Version α (alpha) -->
                    </div>
                </div>
            </div>
            <div class="lbm-app__sidebar">
                <gw2-user-auth></gw2-user-auth>
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-primary"
                    v-model="hideCheckedCatsAndNodes"
                    @change="handleHideCheckedCatsAndNodes"
                />
            </div>
        </div>

        <div
            class="lbm-app__main flex flex-col-reverse sm:flex-row gap-4 items-start"
            v-if="isLoading"
        >
            <span class="lbm-loading"></span>Chargement en cours
        </div>
        <div class="lbm-app__main flex flex-col-reverse sm:flex-row gap-4 items-start" v-else>
            <div class="w-full sm:max-w-xs bg-base-200 rounded-box p-2 sm:sticky top-4">
                <div class="flex flex-col gap-2 mb-2">
                    <select
                        class="lbm-select lbm-select-bordered lbm-select-sm w-full"
                        v-model="searchType"
                    >
                        <option value="">Toutes</option>
                        <option
                            v-for="category in categories"
                            :value="category.id"
                            :key="category.id"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                    <input
                        type="text"
                        class="lbm-input lbm-input-bordered lbm-input-sm w-full"
                        placeholder="Chercher une décoration"
                        v-model="searchValue"
                    />
                </div>

                <div
                    class="overflow-y-auto lbm-scrollbar min-h-96 pr-2"
                    style="max-height: calc(100dvh - 15rem)"
                >
                    <ul class="lbm-menu w-full p-0">
                        <li v-for="decoration in filteredDecorations">
                            <a
                                @click.prevent="getDecoration(decoration.id)"
                                :class="{
                                    'active lbm-active': currentDecoration?.id === decoration.id,
                                }"
                                class="px-2"
                            >
                                <img :src="decoration.icon" alt="" class="h-5 w-5 rounded" />
                                <span class="truncate">{{ decoration.name }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex-1">
                <div class="flex items-start gap-4" v-if="currentDecoration">
                    <div class="w-full">
                        <!-- <pre>{{ currentDecoration }}</pre> -->
                        <div class="">
                            <div class="flex gap-4 items-center relative z-20">
                                <img
                                    :src="currentDecoration.icon"
                                    alt=""
                                    class="w-16 h-16 bg-red-500 rounded border-2"
                                />
                                <div class="flex flex-col flex-1">
                                    <h2 class="text-xl font-semibold text-white">
                                        {{ currentDecoration.name }}
                                    </h2>
                                    <div>
                                        <strong>{{ currentDecoration.count ?? '0' }}</strong
                                        >/{{ currentDecoration.max_count }}
                                    </div>
                                </div>
                                <button
                                    class="lbm-btn lbm-btn-circle"
                                    @click="currentDecoration = null"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div v-if="false">
                            <p v-html="currentDecoration.description"></p>
                        </div>
                        <div class="mt-4">
                            <img
                                :src="`https://outils.lebusmagique.fr/homestead/${currentDecoration.id}.jpg`"
                                class="w-full h-full object-cover"
                                onerror="this.src='https://lebusmagique.netlify.app/assets/img/guilds/decorations/thumbs/defaut.jpg';"
                                alt=""
                            />
                        </div>
                        <div class="text-xs mt-4">Décoration&nbsp;: {{ currentDecoration.id }}</div>
                    </div>
                </div>
                <div class="flex flex-col gap-4" v-else>
                    <div class="w-full">
                        <h3 class="text-xl">Chats</h3>
                        <dialog ref="modalCat" class="lbm-modal">
                            <div class="lbm-modal-box" v-if="currentCat">
                                <form method="dialog">
                                    <button
                                        class="lbm-btn lbm-btn-sm lbm-btn-circle lbm-btn-ghost absolute right-2 top-2"
                                    >
                                        ✕
                                    </button>
                                </form>
                                <h3 class="text-lg font-bold text-white">
                                    {{ currentCat.name ?? currentCat.hint }}
                                </h3>
                                <div
                                    v-if="currentCat.description"
                                    v-html="markdown.render(currentCat.description)"
                                    class="text-white"
                                ></div>
                                <template v-if="currentCat.item_name && currentCat.item_id">
                                    <div class="font-bold mt-4">Nourriture&nbsp;:</div>
                                    <a
                                        class="inline-flex gap-2 items-center mt-2"
                                        :class="[`text-gw2-rarity-${currentCat.item_rarity}`]"
                                        :href="`https://v2.lebusmagique.fr/fr/items/${currentCat.item_id}`"
                                        target="_blank"
                                    >
                                        <img
                                            :src="`https://v2.lebusmagique.fr/img/api/items/${currentCat.item_id}.png`"
                                            alt=""
                                            v-if="currentCat.item_id"
                                            class="h-8 w-8 rounded border-2"
                                            :class="[`border-gw2-rarity-${currentCat.item_rarity}`]"
                                        />
                                        {{ currentCat.item_name }}
                                    </a>
                                </template>
                                <template v-if="currentCat.map">
                                    <div class="font-bold mt-4">Localisation&nbsp;:</div>
                                    <div class="flex gap-2 items-center mt-2" v-if="currentCat.map">
                                        <a
                                            v-if="currentCat.map_url"
                                            :href="`https://lebusmagique.fr${currentCat.map_url}`"
                                            target="_blank"
                                            >{{ currentCat.map }}</a
                                        >
                                        <span v-else>{{ currentCat.map }}</span>
                                        <button
                                            class="lbm-btn lbm-btn-sm lbm-btn-secondary"
                                            v-if="currentCat.wp"
                                            @click="
                                                copyToClipboard(
                                                    `${currentCat.name ?? currentCat.hint} - ${currentCat.wp}`,
                                                )
                                            "
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                class="h-4 w-6"
                                            >
                                                <path
                                                    d="M6 4V8H18V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H6ZM8 2H16V6H8V2Z"
                                                ></path>
                                            </svg>

                                            {{ currentCat.wp }}
                                        </button>
                                    </div>
                                </template>
                                <a
                                    :href="`https://www.lebusmagique.fr${currentCat.guide}`"
                                    target="_blank"
                                    class="lbm-btn lbm-btn-block lbm-btn-primary mt-4"
                                    v-if="currentCat.guide"
                                    >Guide détaillé</a
                                >
                                <!-- <pre>{{ currentCat }}</pre> -->
                            </div>
                            <form method="dialog" class="lbm-modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                        <div
                            class="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 text-sm"
                        >
                            <button
                                v-for="cat in cats"
                                class="lbm-btn"
                                @click="handleModalCat(cat.id)"
                                v-show="
                                    !hideCheckedCatsAndNodes ||
                                    (hideCheckedCatsAndNodes && !cat.checked)
                                "
                            >
                                <div class="inline-flex flex-1 gap-2 items-center text-left">
                                    <img
                                        :src="
                                            cat.icon
                                                ? cat.icon
                                                : `https://v2.lebusmagique.fr/img/api/items/${cat.item_id}.png`
                                        "
                                        alt=""
                                        class="rounded h-6 w-6"
                                        v-if="cat.icon || cat.item_id"
                                    />
                                    <span>
                                        {{ cat.name ?? cat.item_name ?? cat.hint }}
                                    </span>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="w-4 h-4"
                                    :class="{
                                        'text-red-500': cat.checked === false,
                                        'text-green-500': cat.checked === true,
                                    }"
                                >
                                    <path
                                        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="w-full">
                        <h3 class="text-xl">Zones de récolte</h3>
                        <!-- <pre>{{ nodes }}</pre> -->
                        <dialog ref="modalNode" class="lbm-modal">
                            <div class="lbm-modal-box" v-if="currentNode">
                                <form method="dialog">
                                    <button
                                        class="lbm-btn lbm-btn-sm lbm-btn-circle lbm-btn-ghost absolute right-2 top-2"
                                    >
                                        ✕
                                    </button>
                                </form>
                                <h3 class="text-lg font-bold text-white">
                                    {{ currentNode.name ?? currentNode.id }}
                                </h3>
                                <div
                                    v-if="currentNode.description"
                                    v-html="markdown.render(currentNode.description)"
                                    class="text-white"
                                ></div>
                                <a
                                    class="inline-flex gap-2 items-center mt-2"
                                    :class="[`text-gw2-rarity-${currentNode.item_rarity}`]"
                                    :href="`https://v2.lebusmagique.fr/fr/items/${currentNode.item_id}`"
                                    target="_blank"
                                    v-if="currentNode.item_name && currentNode.item_id"
                                >
                                    <img
                                        :src="`https://v2.lebusmagique.fr/img/api/items/${currentNode.item_id}.png`"
                                        alt=""
                                        v-if="currentNode.item_id"
                                        class="h-8 w-8 rounded border-2"
                                        :class="[`border-gw2-rarity-${currentNode.item_rarity}`]"
                                    />
                                    {{ currentNode.item_name }}
                                </a>
                                <!-- <div class="font-bold mt-4">Nourriture&nbsp;:</div>
                                <a
                                    class="inline-flex gap-2 items-center mt-2"
                                    :class="[`text-gw2-rarity-${currentCat.item_rarity}`]"
                                    :href="`https://v2.lebusmagique.fr/fr/items/${currentCat.item_id}`"
                                    target="_blank"
                                    v-if="currentCat.item_name && currentCat.item_id"
                                >
                                    <img
                                        :src="`https://v2.lebusmagique.fr/img/api/items/${currentCat.item_id}.png`"
                                        alt=""
                                        v-if="currentCat.item_id"
                                        class="h-8 w-8 rounded border-2"
                                        :class="[`border-gw2-rarity-${currentCat.item_rarity}`]"
                                    />
                                    {{ currentCat.item_name }}
                                </a>
                                <div class="font-bold mt-4">Localisation&nbsp;:</div>
                                <div class="flex gap-2 items-center mt-2" v-if="currentCat.map">
                                    {{ currentCat.map }}
                                    <button class="lbm-btn lbm-btn-xs" v-if="currentCat.wp">
                                        {{ currentCat.wp }}
                                    </button>
                                </div>
                                <a
                                    :href="`https://www.lebusmagique.fr${currentCat.guide}`"
                                    target="_blank"
                                    class="lbm-btn lbm-btn-block lbm-btn-primary mt-4"
                                    v-if="currentCat.guide"
                                    >Guide détaillé</a
                                > -->
                                <pre>{{ currentNode }}</pre>
                            </div>
                            <form method="dialog" class="lbm-modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                        <div
                            class="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 text-sm"
                        >
                            <button
                                v-for="node in nodes"
                                class="lbm-btn"
                                @click="handleModalNode(node.id)"
                                :key="node.id"
                                v-show="
                                    !hideCheckedCatsAndNodes ||
                                    (hideCheckedCatsAndNodes && !node.checked)
                                "
                            >
                                <div class="inline-flex flex-1 gap-2 items-center text-left">
                                    <img
                                        :src="`https://v2.lebusmagique.fr/img/api/items/${node.item_id}.png`"
                                        alt=""
                                        class="rounded h-6 w-6"
                                        v-if="node.item_id"
                                    />
                                    <span>
                                        {{ node.name ?? node.item_name ?? node.id }}
                                    </span>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="w-4 h-4"
                                    :class="{
                                        'text-red-500': node.checked === false,
                                        'text-green-500': node.checked === true,
                                    }"
                                >
                                    <path
                                        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="w-full">
                        <h3 class="text-xl">Glyphes</h3>
                        <div
                            class="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 text-sm"
                        >
                            <a
                                :href="`https://v2.lebusmagique.fr/fr/items/${glyph.item_id}`"
                                target="_blank"
                                v-for="glyph in glyphs"
                                class="lbm-btn"
                            >
                                <div class="inline-flex flex-1 gap-2 items-center text-left">
                                    <img
                                        :src="`https://v2.lebusmagique.fr/img/api/items/${glyph.item_id}.png`"
                                        alt=""
                                        class="rounded h-6 w-6"
                                        v-if="glyph.item_id"
                                    />
                                    <span>
                                        {{ glyph.name ?? glyph.id }}
                                    </span>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="w-4 h-4"
                                    :class="{
                                        'text-red-500': glyph.checked === false,
                                        'text-green-500': glyph.checked === true,
                                    }"
                                >
                                    <path
                                        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"
                                    ></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="lbm-app__footer">
            <lbm-app-footer></lbm-app-footer>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/main.scss';

h4.lbm-menu-title {
    @apply p-0 uppercase w-full justify-between flex items-center;
}

summary {
    @apply flex !important;
}

ul {
    @apply my-0;
}

.recipe :deep(li ul:before) {
    @apply bg-gray-500 opacity-100;
}

.recipe :deep(li) {
    @apply list-none;
}

.recipe :deep(li img) {
    @apply w-5 h-5 rounded;
}

.lbm-table thead,
.lbm-table tfoot {
    @apply bg-neutral;
}

:deep(.currency) {
    @apply inline-flex gap-1 items-center;

    .gold,
    .silver,
    .copper {
        @apply flex gap-1 items-center;

        &:after {
            @apply w-2 h-2 rounded-full block;
            content: '';
        }
    }

    .gold:after {
        @apply bg-yellow-400;
    }

    .silver:after {
        @apply bg-gray-400;
    }

    .copper:after {
        @apply bg-orange-400;
    }
}

.tip :deep(p) {
    margin-bottom: 0;
}
</style>
