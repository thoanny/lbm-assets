<script setup>
const VERSION = 'homestead-0.9.0';
// Icons : https://remixicon.com
import { onMounted, ref, computed, watch } from 'vue';
import { chunk, copyToClipboard, formatIntToGold } from '@/services/utils';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import Gw2ApiService from '@/services/gw2ApiService';
import localGlyphs from '@/data/gw2-homestead-glyphs.json';
import { markdown } from '../../services/markdown';

import localCats from '@/data/gw2-homestead-cats.json';
import localNodes from '@/data/gw2-homestead-nodes.json';

import IconHomeUp from '../icons/IconHomeUp.vue';
import IconArmchair2 from '../icons/IconArmchair2.vue';
import IconBuildingCastle from '../icons/IconBuildingCastle.vue';
import IconCards from '../icons/IconCards.vue';
import IconCat from '../icons/IconCat.vue';
import IconSeedling from '../icons/IconSeedling.vue';
import IconCopy from '../icons/IconCopy.vue';
import IconBook from '../icons/IconBook.vue';
import IconInfoSquareRoundedFilled from '../icons/IconInfoSquareRoundedFilled.vue';
import IconCircleCheckFilled from '../icons/IconCircleCheckFilled.vue';

const gw2 = Gw2ApiService;

const props = defineProps(['panel', 'tab']);

const user = useUserStore();
const { currentToken } = storeToRefs(user);

const modalCat = ref();
const modalNode = ref();
const cats = ref([]);
const nodes = ref([]);
const glyphs = ref([]);
const decorations = ref([]);
const categories = ref([]);
const prices = ref([]);
const isLoading = ref(false);

const LBMApp = ref();

const currentDecoration = ref(null);
const currentCat = ref(null);
const currentNode = ref(null);
const searchValue = ref('');
const searchType = ref('');

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
    ]).then(async (res) => {
        const [$cats, $nodes, $glyphs, $categories, $decorations] = res;

        cats.value = $cats.data.map((d) => ({
            ...d,
            local: localCats.find((lc) => lc.fields.api_id === d.id) || null,
        }));

        // Ajouter les chats du Bus qui ne sont pas dans l'API
        cats.value = cats.value.concat(
            localCats
                .filter((cat) => {
                    return cats.value.map((c) => c.id).indexOf(cat.fields.api_id) < 0;
                })
                .map((cat) => {
                    cat.fields.description = [
                        cat.fields.description,
                        "⚠️ **Ce chat n'est pas disponible dans l'API officielle de Guild Wars 2.**",
                    ].join('<br>');
                    return {
                        hint: `__cat_${cat.fields.api_id}__`,
                        id: cat.fields.api_id,
                        local: cat,
                    };
                }),
        );

        nodes.value = $nodes.data.map((d) => ({
            ...d,
            local: localNodes.find((ln) => ln.fields.api_id === d.id) || null,
        }));

        // Ajouter les zones du Bus qui ne sont pas dans l'API
        nodes.value = nodes.value.concat(
            localNodes
                .filter((node) => {
                    return nodes.value.map((n) => n.id).indexOf(node.fields.api_id) < 0;
                })
                .map((node) => {
                    node.fields.description = [
                        node.fields.description,
                        "⚠️ **Cette zone de récoltes n'est pas disponible dans l'API officielle de Guild Wars 2.**",
                    ].join('<br>');
                    return {
                        id: node.fields.api_id,
                        local: node,
                    };
                }),
        );

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

        const nodesPricesIds = localNodes
            .map((node) => node.fields.item?.id)
            .filter((node) => node);
        const catsFoodPricesIds = localCats.map((cat) => cat.fields.food?.id).filter((cat) => cat);
        const pricesIds = [...new Set([...nodesPricesIds, ...catsFoodPricesIds])];
        prices.value = await gw2.getCommercePrices(pricesIds).then((res) => res.data);
        console.log('nodesPricesIds', nodesPricesIds);
    });
};

const loadUserData = async () => {
    if (!currentToken.value) return;

    return await Promise.all([
        gw2.getUserCats(currentToken.value),
        gw2.getUserNodes(currentToken.value),
        gw2.getUserGlyphs(currentToken.value),
        gw2.getUserDecorations(currentToken.value),
    ]).then(async (res) => {
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

const getPriceById = (id) => {
    const price = prices.value.find((p) => p.id == id);
    console.log('getPriceById', prices.value, price);
    return price?.sells.unit_price ?? 0;
};

onMounted(() => {
    if (panels.indexOf(props.panel) >= 0) {
        panel.value = props.panel;
    }
    if (tabs.indexOf(props.tab) >= 0) {
        tab.value = props.tab;
    }
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
    currentCat.value = null;
    currentCat.value = cats.value.find((cat) => cat.id === cat_id);
    modalCat.value.showModal();
};

const handleModalNode = (node_id) => {
    currentNode.value = null;
    currentNode.value = nodes.value.find((node) => node.id === node_id);
    modalNode.value.showModal();
};

watch(currentToken, () => {
    loadData().then(() => loadUserData());
});

// Structure :
// - id : identifiant de l'api gw2
// - map : nom de la carte
// - map_url : url à mettre sur 'map'
// - guide : url pour créer un bouton
// - wp : shortcode du point de passage
// - item_id
// - item_name
// - item_rarity
// - icon
// - image : descriptive
// - name
// - description
// - price : si supérieur à 1, prix du comptoir récupéré via api

const panels = ['upgrades', 'homestead', 'guildhall'];
const panel = ref('upgrades');
const tabs = ['cats', 'nodes', 'glyphs'];
const tab = ref('cats'); // TODO

function switchPanel(p) {
    if (p !== panel.value) {
        panel.value = p;
    }
}

function switchTab(t) {
    if (t !== tab.value) {
        tab.value = t;
    }
}
</script>

<template>
    <!-- <pre>{{ currentToken }}</pre> -->
    <!-- <pre>{{ decorations }}</pre> -->
    <div class="lbm-app" ref="LBMApp">
        <div class="lbm-app__header">
            <div class="lbm-app__brand">
                <img src="" alt="" class="lbm-app__logo bg-primary" v-if="false" />
                <div class="lbm-app__title">
                    Décorations du pavillon et du hall de guilde
                    <div class="lbm-app__subtitle">
                        <template v-if="panel === 'upgrades'"> Améliorations du pavillon </template>
                        <template v-if="panel === 'homestead'"> Décorations du pavillon </template>
                        <template v-if="panel === 'guildhall'">
                            Décorations du hall de guilde
                        </template>
                    </div>
                </div>
            </div>
            <div class="lbm-app__sidebar">
                <gw2-user-auth></gw2-user-auth>
            </div>
        </div>

        <div class="lbm-app__main flex gap-4 items-center sm:items-start" v-if="isLoading">
            <span class="lbm-loading"></span>Chargement en cours
        </div>
        <div class="lbm-app__main flex flex-col md:flex-row gap-4 items-start" v-else>
            <div class="flex gap-2 flex-row md:flex-col">
                <button
                    @click="switchPanel('upgrades')"
                    :class="{
                        'lbm-btn-primary': panel === 'upgrades',
                        'lbm-btn-neutral': panel !== 'upgrades',
                    }"
                    class="lbm-btn lbm-btn-square"
                >
                    <IconHomeUp />
                </button>
                <button
                    @click="switchPanel('homestead')"
                    :class="{
                        'lbm-btn-primary': panel == 'homestead',
                        'lbm-btn-neutral': panel !== 'homestead',
                    }"
                    class="lbm-btn lbm-btn-square"
                >
                    <IconArmchair2 />
                </button>
                <button
                    @click="switchPanel('guildhall')"
                    :class="{
                        'lbm-btn-primary': panel == 'guildhall',
                        'lbm-btn-neutral': panel !== 'guildhall',
                    }"
                    class="lbm-btn lbm-btn-square"
                >
                    <IconBuildingCastle />
                </button>
            </div>

            <div v-if="panel === 'upgrades'" class="w-full">
                <div class="flex gap-2 flex-col sm:flex-row mb-4">
                    <button
                        @click="switchTab('cats')"
                        class="lbm-btn"
                        :class="{
                            'lbm-btn-primary': tab === 'cats',
                            'lbm-btn-neutral': tab !== 'cats',
                        }"
                    >
                        <IconCat />
                        Chats
                    </button>
                    <button
                        @click="switchTab('nodes')"
                        class="lbm-btn"
                        :class="{
                            'lbm-btn-primary': tab === 'nodes',
                            'lbm-btn-neutral': tab !== 'nodes',
                        }"
                    >
                        <IconSeedling />
                        Zones de récoltes
                    </button>
                    <button
                        @click="switchTab('glyphs')"
                        class="lbm-btn"
                        :class="{
                            'lbm-btn-primary': tab === 'glyphs',
                            'lbm-btn-neutral': tab !== 'glyphs',
                        }"
                    >
                        <IconCards />
                        Glyphes
                    </button>
                </div>
                <div v-if="tab === 'cats'">
                    <!-- Cats List -->
                    <div class="w-full">
                        <p class="flex gap-2 items-center text-sm">
                            <IconInfoSquareRoundedFilled class="size-5" />
                            Cliquez sur le nom d'un chat pour obtenir plus d'informations.
                        </p>
                        <!-- <pre>{{ cats }}</pre> -->
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
                                    {{
                                        currentCat.local?.fields.name ??
                                        currentCat.local?.fields.food?.name ??
                                        currentCat.hint
                                    }}
                                </h3>
                                <div
                                    v-if="currentCat.local?.fields.description"
                                    v-html="markdown.render(currentCat.local.fields.description)"
                                    class="text-white description"
                                ></div>
                                <!-- Cat: Food -->
                                <div
                                    class="inline-flex flex-wrap gap-2 items-center mt-4 w-full"
                                    v-if="currentCat.local?.fields.food"
                                >
                                    <strong>Nourriture&nbsp;:</strong>
                                    <a
                                        class="inline-flex flex-wrap gap-2 items-center underline-offset-2 no-underline hover:underline"
                                        :class="[
                                            `text-gw2-rarity-${currentCat.local.fields.food.rarity}`,
                                        ]"
                                        :href="`https://v2.lebusmagique.fr/fr/items/${currentCat.local.fields.food.id}`"
                                        target="_blank"
                                    >
                                        <img
                                            :src="currentCat.local.fields.food.icon"
                                            alt=""
                                            class="h-6 w-6 rounded border-2"
                                            :class="[
                                                `border-gw2-rarity-${currentCat.local.fields.food.rarity}`,
                                            ]"
                                        />
                                        {{ currentCat.local.fields.food.name }}
                                    </a>
                                </div>
                                <div
                                    v-if="
                                        currentCat.local.fields.food &&
                                        getPriceById(currentCat.local.fields.food.id)
                                    "
                                    class="flex gap-2 mt-4"
                                >
                                    <strong>Prix unitaire au comptoir&nbsp;:</strong>
                                    <span>
                                        ~
                                        <span
                                            v-html="
                                                formatIntToGold(
                                                    getPriceById(currentCat.local.fields.food.id),
                                                )
                                            "
                                        ></span>
                                    </span>
                                </div>
                                <!-- Cat: Location -->
                                <template v-if="currentCat.local?.fields.map_name">
                                    <div
                                        class="inline-flex flex-wrap gap-2 items-center mt-4 w-full"
                                    >
                                        <strong>Localisation&nbsp;:</strong>
                                        <button
                                            class="lbm-btn lbm-btn-sm lbm-btn-secondary"
                                            v-if="currentCat.local.fields.waypoint"
                                            @click="
                                                copyToClipboard(
                                                    `${
                                                        currentCat.local?.fields.name ??
                                                        currentCat.local?.fields.food?.name ??
                                                        currentCat.hint
                                                    } - ${currentCat.local.fields.waypoint}`,
                                                )
                                            "
                                        >
                                            <IconCopy class="size-5" />
                                            {{ currentCat.local.fields.map_name }}
                                        </button>
                                        <span v-else>{{ currentCat.local.fields.map_name }}</span>
                                    </div>
                                </template>
                                <!-- Cat: Guide -->
                                <a
                                    :href="currentCat.local.fields.guide"
                                    target="_blank"
                                    class="lbm-btn lbm-btn-block lbm-btn-primary mt-4"
                                    v-if="currentCat.local?.fields.guide"
                                >
                                    <IconBook />
                                    Guide détaillé
                                </a>
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
                                class="lbm-btn no-animation"
                                @click="handleModalCat(cat.id)"
                            >
                                <div class="inline-flex flex-1 gap-2 items-center text-left">
                                    <img
                                        :src="cat.local.fields.icon"
                                        alt=""
                                        class="rounded h-6 w-6"
                                        v-if="cat.local?.fields.icon"
                                    />
                                    <img
                                        :src="cat.local.fields.food.icon"
                                        alt=""
                                        class="rounded h-6 w-6"
                                        v-else-if="cat.local?.fields.food?.icon"
                                    />
                                    <span>
                                        {{
                                            cat.local?.fields.name ??
                                            cat.local?.fields.food?.name ??
                                            cat.hint
                                        }}
                                    </span>
                                </div>
                                <IconCircleCheckFilled
                                    class="size-4"
                                    :class="{
                                        'text-red-500': cat.checked === false,
                                        'text-green-500': cat.checked === true,
                                    }"
                                    v-show="cat.hint.slice(0, 2) !== '__'"
                                />
                            </button>
                        </div>
                    </div>
                    <!-- Cats List -->
                </div>
                <div v-else-if="tab === 'nodes'">
                    <div class="w-full">
                        <p class="flex gap-2 items-center text-sm">
                            <IconInfoSquareRoundedFilled class="size-5" />
                            Cliquez sur le nom d'une zone de récolte pour obtenir plus
                            d'informations.
                        </p>
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
                                    {{
                                        currentNode.local?.fields.name ??
                                        currentNode.local?.fields.items?.name ??
                                        currentNode.id
                                    }}
                                </h3>
                                <div
                                    v-if="currentNode.local?.fields.description"
                                    v-html="markdown.render(currentNode.local.fields.description)"
                                    class="text-white"
                                ></div>
                                <a
                                    class="inline-flex gap-2 items-center mt-2"
                                    :class="[
                                        `text-gw2-rarity-${currentNode.local.fields.item.rarity}`,
                                    ]"
                                    :href="`https://v2.lebusmagique.fr/fr/items/${currentNode.local.fields.item.id}`"
                                    target="_blank"
                                    v-if="currentNode.local?.fields.item"
                                >
                                    <img
                                        :src="currentNode.local.fields.item.icon"
                                        alt=""
                                        class="h-12 w-12 rounded border-2"
                                        :class="[
                                            `border-gw2-rarity-${currentNode.local.fields.item.rarity}`,
                                        ]"
                                    />
                                    {{ currentNode.local.fields.item.name }}
                                </a>
                                <div
                                    class="flex flex-col gap-1 mt-4"
                                    v-if="currentNode.local?.fields.costs.length > 0"
                                >
                                    <div class="font-bold">Prix&nbsp;:</div>
                                    <div
                                        class="flex gap-1 items-center"
                                        v-for="cost in currentNode.local?.fields.costs"
                                    >
                                        <template v-if="cost.currency?.api_id === 1">
                                            <span v-html="formatIntToGold(cost.amount)"></span>
                                        </template>
                                        <template v-else>
                                            {{ cost.amount }}
                                            &times;
                                            <img
                                                :src="cost.currency.icon"
                                                alt=""
                                                class="h-6 w-6 object-fit"
                                                v-if="cost.currency?.icon"
                                            />
                                            {{ cost.currency?.name }}
                                        </template>
                                    </div>
                                </div>
                                <div
                                    v-if="
                                        currentNode.local.fields.item &&
                                        getPriceById(currentNode.local.fields.item.id)
                                    "
                                    class="flex gap-2 mt-4"
                                >
                                    <strong>Prix au comptoir&nbsp;:</strong>
                                    <span>
                                        ~
                                        <span
                                            v-html="
                                                formatIntToGold(
                                                    getPriceById(currentNode.local.fields.item.id),
                                                )
                                            "
                                        ></span>
                                    </span>
                                </div>
                                <div
                                    class="flex flex-col gap-1 mt-4"
                                    v-if="currentNode.local?.fields.sources.length > 0"
                                >
                                    <div class="font-bold">
                                        {{
                                            currentNode.local.fields.sources.length > 1
                                                ? 'Sources'
                                                : 'Source'
                                        }}
                                        :
                                    </div>
                                    <div
                                        class="flex gap-1 items-center"
                                        v-for="source in currentNode.local.fields.sources"
                                    >
                                        <img
                                            :src="source.source.icon"
                                            alt=""
                                            class="h-6 w-6 object-fit"
                                            v-if="source.source?.icon"
                                        />
                                        {{ source.source?.name }}
                                    </div>
                                </div>
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
                                class="lbm-btn no-animation"
                                @click="handleModalNode(node.id)"
                                :key="node.id"
                            >
                                <div class="inline-flex flex-1 gap-2 items-center text-left">
                                    <img
                                        :src="node.local.fields.item.icon"
                                        alt=""
                                        class="rounded h-6 w-6"
                                        v-if="node.local?.fields.item?.icon"
                                    />
                                    <span>
                                        {{
                                            node.local?.fields.name ??
                                            node.local?.fields.item?.name ??
                                            node.id
                                        }}
                                    </span>
                                </div>
                                <IconCircleCheckFilled
                                    class="size-4"
                                    :class="{
                                        'text-red-500': node.checked === false,
                                        'text-green-500': node.checked === true,
                                    }"
                                    v-show="node.id.slice(0, 2) !== '__'"
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else-if="tab === 'glyphs'">
                    <div class="w-full">
                        <div
                            class="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 text-sm"
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
                                <IconCircleCheckFilled
                                    class="size-4"
                                    :class="{
                                        'text-red-500': glyph.checked === false,
                                        'text-green-500': glyph.checked === true,
                                    }"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else-if="panel === 'homestead'" class="flex flex-col-reverse sm:flex-row gap-4">
                <!-- Homestead -->
                <div
                    class="w-full sm:max-w-xs bg-base-200 rounded-box p-2 sm:sticky top-4 shrink-0"
                >
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
                                        'active lbm-active':
                                            currentDecoration?.id === decoration.id,
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
                            <div class="text-xs mt-4">
                                Identifiant de la décoration&nbsp;: {{ currentDecoration.id }}
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <p>
                            Il y a actuellement {{ decorations.length }} décorations disponibles
                            dans l'API officielle d'ArenaNet/Guild Wars 2.
                        </p>
                        <p>
                            Si vous souhaitez partager avec nous des idées d'améliorations, de
                            fonctionnalités, n'hésitez pas à nous contacter&nbsp;!
                        </p>
                        <p>
                            Pour le moment, il n'est pas possible de vous offrir un outil une
                            calculatrice de prix pour ces décorations, puisque les recettes
                            n'existent pas dans l'API, mais nous réfléchissons à un moyen de les
                            ajouter manuellement. Merci de votre patience.
                        </p>
                        <p class="font-bold text-white">
                            <span class="hidden sm:inline">&larr;</span
                            ><span class="sm:hidden">&darr;</span> Cliquez sur une décoration pour
                            avoir quelques détails.
                        </p>
                        <!-- <pre>{{ decorations }}</pre> -->
                    </div>
                </div>
            </div>
            <div v-else-if="panel === 'guildhall'">
                <p>Cet onglet n'est pas encore disponible.</p>
            </div>
        </div>

        <div class="lbm-app__footer">
            <lbm-app-footer :version="`${VERSION}`"></lbm-app-footer>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/assets/main.scss';

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

.description :deep(img) {
    width: 100%;
    height: auto;
}

.description :deep(p:last-of-type) {
    margin-bottom: 0;
}
</style>
