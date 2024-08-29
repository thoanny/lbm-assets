<script setup>
// Icons : https://remixicon.com
import { onMounted, onUnmounted, ref, computed } from 'vue';
import MarkdownIt from 'markdown-it';

import { cats as localCats, nodes as localNodes } from '@/data/gw2-homestead.json';

const GW2API = 'https://api.guildwars2.com/v2';

const modalCat = ref();
const modalNode = ref();
const modalGlyph = ref();

const cats = ref([]);
const nodes = ref([]);
const glyphs = ref([]);
const decorations = ref([]);
const categories = ref([]);

const hideCheckedCatsAndNodes = ref(false);

const userKey = ref('');
const userInterval = ref();

const loadCats = async () => {
    return await fetch(`${GW2API}/home/cats?ids=all`)
        .then((res) => res.json())
        .then(
            (data) =>
                (cats.value = data.map((d) => ({
                    ...d,
                    ...localCats.find((lc) => lc.id === d.id),
                }))),
        )
        .then(() => {
            loadUserCats();
        });
};

const loadUserCats = async () => {
    if (!userKey.value) return;
    return await fetch(`${GW2API}/account/home/cats?access_token=${userKey.value}`)
        .then((res) => res.json())
        .then(
            (data) =>
                (cats.value = cats.value.map((cat) => ({
                    ...cat,
                    checked: data.findIndex((d) => d.id === cat.id) >= 0,
                }))),
        );
};

const loadNodes = async () => {
    return await fetch(`${GW2API}/home/nodes?ids=all`)
        .then((res) => res.json())
        .then(
            (data) =>
                (nodes.value = data.map((d) => ({
                    ...d,
                    ...localNodes.find((ln) => ln.id === d.id),
                }))),
        )
        .then(() => {
            loadUserNodes();
        });
};

const loadUserNodes = async () => {
    if (!userKey.value) return;
    return await fetch(`${GW2API}/account/home/nodes?access_token=${userKey.value}`)
        .then((res) => res.json())
        .then(
            (data) =>
                (nodes.value = nodes.value.map((node) => ({
                    ...node,
                    checked: data.findIndex((d) => d === node.id) >= 0,
                }))),
        );
};

const loadCategories = async () => {
    return await fetch(`${GW2API}/homestead/decorations/categories?ids=all`)
        .then((res) => res.json())
        .then((data) => (categories.value = data));
};

const chunk = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
    );
};

const loadDecorations = async () => {
    return await fetch(`${GW2API}/homestead/decorations`)
        .then((res) => res.json())
        .then((data) => {
            chunk(data, 200).forEach(async (ids) => {
                const _ids = ids.join(',');
                await fetch(`${GW2API}/homestead/decorations?ids=${_ids}`)
                    .then((res) => res.json())
                    .then((data) => (decorations.value = decorations.value.concat(data)))
                    .then(() => {
                        decorations.value = decorations.value.sort((a, b) =>
                            a.name.localeCompare(b.name),
                        );
                    });
            });
        })
        .then(() => {
            loadUserDecorations();
            // [ ] ajouter un interval pour chaque data de user
        });
};

const loadUserDecorations = async () => {
    if (!userKey.value) return;
    return await fetch(`${GW2API}/account/homestead/decorations?access_token=${userKey.value}`)
        .then((res) => res.json())
        .then(
            (data) =>
                (decorations.value = decorations.value.map((decoration) => ({
                    ...decoration,
                    ...data.find((d) => d.id === decoration.id),
                }))),
        );
};

const loadGlyphs = async () => {
    return await fetch(`${GW2API}/homestead/glyphs?ids=all`)
        .then((res) => res.json())
        .then((data) => (glyphs.value = data))
        .then(() => {
            loadUserGlyphs();
        });
};

const loadUserGlyphs = async () => {
    if (!userKey.value) return;
    return await fetch(`${GW2API}/account/homestead/glyphs?access_token=${userKey.value}`)
        .then((res) => res.json())
        .then(
            (data) =>
                (glyphs.value = glyphs.value.map((glyph) => ({
                    ...glyph,
                    checked: data.findIndex((d) => d === glyph.id) >= 0,
                }))),
        );
};

const LBMApp = ref();

const markdown = new MarkdownIt();

const currentDecoration = ref(null);
const currentCat = ref(null);
const currentNode = ref(null);
const currentGlyph = ref(null);
const searchValue = ref('');
const searchType = ref('');

const loadingCategories = ref(false);
const loadingDecoration = ref(false);

const getDecoration = (decoration_id) => {
    currentDecoration.value = decorations.value.find(
        (decoration) => decoration.id === decoration_id,
    );
};

const loadData = () => {
    loadCats();
    loadNodes();
    loadCategories();
    loadDecorations();
    loadGlyphs();
};

onMounted(() => {
    initUserSettings();
    loadData();
});

onUnmounted(() => {
    if (userInterval.value) clearInterval(userInterval.value);
    userInterval.value = null;
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
    const localUserKey = localStorage.getItem('gw2-api-key');
    if (localUserKey) {
        userKey.value = localUserKey;
    }
    const localHideCheckedCatsAndNodes = localStorage.getItem('gw2-homestead-hide-cats-nodes');
    console.log(typeof localHideCheckedCatsAndNodes);
    if (!!localHideCheckedCatsAndNodes) {
        hideCheckedCatsAndNodes.value = localHideCheckedCatsAndNodes == 'true';
    }
};

const loadUserData = () => {
    loadUserCats();
    loadUserNodes();
    loadUserGlyphs();
    loadUserDecorations();
};

const handleUserKey = () => {
    console.log('handleUserKey');
    localStorage.setItem('gw2-api-key', userKey.value);
    loadUserData();
};

const handleHideCheckedCatsAndNodes = () => {
    localStorage.setItem('gw2-homestead-hide-cats-nodes', hideCheckedCatsAndNodes.value);
};
</script>

<template>
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
                <input
                    type="checkbox"
                    class="lbm-toggle lbm-toggle-primary"
                    v-model="hideCheckedCatsAndNodes"
                    @change="handleHideCheckedCatsAndNodes"
                />
                <input
                    type="text"
                    placeholder="Clé API GW2"
                    class="lbm-input lbm-input-bordered"
                    v-model="userKey"
                    @input="handleUserKey"
                />

                <button class="lbm-btn lbm-btn-primary lbm-btn-square" v-if="false">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="h-6 w-6"
                    >
                        <path
                            d="M3.33946 17.0002C2.90721 16.2515 2.58277 15.4702 2.36133 14.6741C3.3338 14.1779 3.99972 13.1668 3.99972 12.0002C3.99972 10.8345 3.3348 9.824 2.36353 9.32741C2.81025 7.71651 3.65857 6.21627 4.86474 4.99001C5.7807 5.58416 6.98935 5.65534 7.99972 5.072C9.01009 4.48866 9.55277 3.40635 9.4962 2.31604C11.1613 1.8846 12.8847 1.90004 14.5031 2.31862C14.4475 3.40806 14.9901 4.48912 15.9997 5.072C17.0101 5.65532 18.2187 5.58416 19.1346 4.99007C19.7133 5.57986 20.2277 6.25151 20.66 7.00021C21.0922 7.7489 21.4167 8.53025 21.6381 9.32628C20.6656 9.82247 19.9997 10.8336 19.9997 12.0002C19.9997 13.166 20.6646 14.1764 21.6359 14.673C21.1892 16.2839 20.3409 17.7841 19.1347 19.0104C18.2187 18.4163 17.0101 18.3451 15.9997 18.9284C14.9893 19.5117 14.4467 20.5941 14.5032 21.6844C12.8382 22.1158 11.1148 22.1004 9.49633 21.6818C9.55191 20.5923 9.00929 19.5113 7.99972 18.9284C6.98938 18.3451 5.78079 18.4162 4.86484 19.0103C4.28617 18.4205 3.77172 17.7489 3.33946 17.0002ZM8.99972 17.1964C10.0911 17.8265 10.8749 18.8227 11.2503 19.9659C11.7486 20.0133 12.2502 20.014 12.7486 19.9675C13.1238 18.8237 13.9078 17.8268 14.9997 17.1964C16.0916 16.5659 17.347 16.3855 18.5252 16.6324C18.8146 16.224 19.0648 15.7892 19.2729 15.334C18.4706 14.4373 17.9997 13.2604 17.9997 12.0002C17.9997 10.74 18.4706 9.5632 19.2729 8.6665C19.1688 8.4405 19.0538 8.21822 18.9279 8.00021C18.802 7.78219 18.667 7.57148 18.5233 7.36842C17.3457 7.61476 16.0911 7.43414 14.9997 6.80405C13.9083 6.17395 13.1246 5.17768 12.7491 4.03455C12.2509 3.98714 11.7492 3.98646 11.2509 4.03292C10.8756 5.17671 10.0916 6.17364 8.99972 6.80405C7.9078 7.43447 6.65245 7.61494 5.47428 7.36803C5.18485 7.77641 4.93463 8.21117 4.72656 8.66637C5.52881 9.56311 5.99972 10.74 5.99972 12.0002C5.99972 13.2604 5.52883 14.4372 4.72656 15.3339C4.83067 15.5599 4.94564 15.7822 5.07152 16.0002C5.19739 16.2182 5.3324 16.4289 5.47612 16.632C6.65377 16.3857 7.90838 16.5663 8.99972 17.1964ZM11.9997 15.0002C10.3429 15.0002 8.99972 13.6571 8.99972 12.0002C8.99972 10.3434 10.3429 9.00021 11.9997 9.00021C13.6566 9.00021 14.9997 10.3434 14.9997 12.0002C14.9997 13.6571 13.6566 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z"
                        ></path>
                    </svg>
                </button>
                <button class="lbm-btn lbm-btn-primary" v-if="false">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            d="M10.7577 11.8281L18.6066 3.97919L20.0208 5.3934L18.6066 6.80761L21.0815 9.28249L19.6673 10.6967L17.1924 8.22183L15.7782 9.63604L17.8995 11.7574L16.4853 13.1716L14.364 11.0503L12.1719 13.2423C13.4581 15.1837 13.246 17.8251 11.5355 19.5355C9.58291 21.4882 6.41709 21.4882 4.46447 19.5355C2.51184 17.5829 2.51184 14.4171 4.46447 12.4645C6.17493 10.754 8.81633 10.5419 10.7577 11.8281ZM10.1213 18.1213C11.2929 16.9497 11.2929 15.0503 10.1213 13.8787C8.94975 12.7071 7.05025 12.7071 5.87868 13.8787C4.70711 15.0503 4.70711 16.9497 5.87868 18.1213C7.05025 19.2929 8.94975 19.2929 10.1213 18.1213Z"
                        ></path>
                    </svg>
                    Anthony.5487
                </button>
            </div>
        </div>

        <div class="lbm-app__main flex gap-4 items-start">
            <div class="flex gap-2 items-center" v-if="loadingCategories">
                <span class="lbm-loading lbm-loading-spinner"></span>
                Chargement en cours...
            </div>
            <div class="w-full max-w-xs bg-base-200 rounded-box p-2 sticky top-4" v-else>
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
                <div class="flex gap-2 items-center" v-if="loadingDecoration">
                    <span class="lbm-loading lbm-loading-spinner"></span>
                    Chargement en cours...
                </div>
                <div class="flex items-start gap-4" v-else-if="currentDecoration">
                    <div class="w-full">
                        <pre>{{ currentDecoration }}</pre>
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
                        <div v-if="currentDecoration.description">
                            <p v-html="currentDecoration.description"></p>
                        </div>
                        <div class="mt-4">
                            <img
                                :src="`https://outils.lebusmmagique.fr/homestead/${currentDecoration.id}.jpg`"
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
                                    Chat&nbsp;: {{ currentCat.name ?? currentCat.hint }}
                                </h3>
                                <div
                                    v-if="currentCat.description"
                                    v-html="markdown.render(currentCat.description)"
                                ></div>
                                <div class="font-bold mt-4">Nourriture&nbsp;:</div>
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
                                >
                                <pre>{{ currentCat }}</pre>
                            </div>
                            <form method="dialog" class="lbm-modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                        <div class="grid grid-cols-3 gap-2 mt-2 text-sm">
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
                                    {{ cat.name ?? cat.item_name ?? cat.hint }}
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
                                    Zone de récolte&nbsp;: {{ currentNode.name ?? currentNode.id }}
                                </h3>
                                <!-- <div
                                    v-if="currentCat.description"
                                    v-html="markdown.render(currentCat.description)"
                                ></div>
                                <div class="font-bold mt-4">Nourriture&nbsp;:</div>
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
                        <div class="grid grid-cols-3 gap-2 mt-2 text-sm">
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
                                    {{ node.name ?? node.item_name ?? node.id }}
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
                        <div class="grid grid-cols-3 gap-2 mt-2 text-sm">
                            <button v-for="glyph in glyphs" class="lbm-btn">
                                <div class="inline-flex flex-1 gap-2 items-center text-left">
                                    <img
                                        :src="`https://v2.lebusmagique.fr/img/api/items/${glyph.item_id}.png`"
                                        alt=""
                                        class="rounded h-6 w-6"
                                        v-if="glyph.item_id"
                                    />
                                    {{ glyph.name ?? glyph.id }}
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
                            </button>
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
