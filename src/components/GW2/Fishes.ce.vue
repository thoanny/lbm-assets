<script setup>

import { onMounted, onUnmounted, ref, watch } from 'vue';

const refreshFishesInterval = ref(null);

const apiKey = ref(null);
const hideCompleted = ref(false);
const token = ref(null);

const allFishes = ref(null);
const fishes = ref(null);
const daily = ref({});

const achievements = ref([]);
const holes = ref([]);
const baits = ref([]);

const currentAchievement = ref('');
const currentHole = ref('');
const currentBait = ref('');

const isLoading = ref(false);

const TIMER_INTERVAL = 300000; // 5 minutes

const _times = {
    'n': 'Nuit',
    'd': 'Jour',
    'dd': 'Aube/Crépuscule'
};

async function getFishes() {
    isLoading.value = true;
    try {
        const res = await fetch('https://api.lebusmagique.fr/api/gw2/fishes?token=' + apiKey.value);
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}

function updateFishes(reset = false) {
    fishes.value = allFishes.value;

    if (reset) {
        holes.value = [];
        baits.value = [];
        currentHole.value = '';
        currentBait.value = '';
    }

    if (hideCompleted.value) {
        fishes.value = fishes.value.filter(f => !f.status);
    }

    if (currentAchievement.value) {
        fishes.value = fishes.value.filter(f => f.achievement?.id === currentAchievement.value);
    }

    if (currentHole.value) {
        fishes.value = fishes.value.filter(f => f.hole?.id === currentHole.value);
    }

    if (currentBait.value) {
        fishes.value = fishes.value.filter(f => f.bait?.uid === currentBait.value);
    }

    updateFilters();
}

function updateFilters() {

    fishes.value.forEach(f => {
        const i = achievements.value.findIndex(a => a.id === f.achievement?.id);
        if (i < 0) {
            achievements.value.push(f.achievement);
        }

        achievements.value = sortArrayOfObjects(achievements.value, "name");

        if (f.hole) {
            const j = holes.value.findIndex(h => h.id === f.hole?.id);
            if (j < 0) {
                holes.value.push(f.hole);
            }

            holes.value = sortArrayOfObjects(holes.value, "name");
        }

        if (f.bait) {
            const k = baits.value.findIndex(b => b.uid === f.bait?.uid);
            if (k < 0) {
                baits.value.push(f.bait);
            }

            baits.value = sortArrayOfObjects(baits.value, "name");
        }
    });
}

function resetFilters() {
    currentAchievement.value = '';
    currentHole.value = '';
    currentBait.value = '';
    achievements.value = [];
    updateFishes();
}

const sortArrayOfObjects = (arr, propertyName, order = 'ascending') => {
    const sortedArr = arr.sort((a, b) => {
        if (a[propertyName] < b[propertyName]) {
            return -1;
        }
        if (a[propertyName] > b[propertyName]) {
            return 1;
        }
        return 0;
    });

    if (order === 'descending') {
        return sortedArr.reverse();
    }

    return sortedArr;
};

function initUserSettings() {
    const localApiKey = localStorage.getItem('gw2-fishes-api-key');
    if (localApiKey) {
        apiKey.value = localApiKey;
    }

    const localHideCompleted = localStorage.getItem('gw2-fishes-hide-completed');
    if (localHideCompleted) {
        hideCompleted.value = (localHideCompleted === 'true');
    }
}

function loadFishes() {
    getFishes().then(d => {
        allFishes.value = d.fishes;
        daily.value = d.daily;
        token.value = d.token;
        updateFishes();
        isLoading.value = false;
    });
}

initUserSettings();

onMounted(() => {
    loadFishes();

    if (!refreshFishesInterval.value) {
        refreshFishesInterval.value = setInterval(loadFishes, TIMER_INTERVAL);
    }
});

onUnmounted(() => {
    if (refreshFishesInterval.value) clearInterval(refreshFishesInterval.value);
    refreshFishesInterval.value = null;
});

watch(hideCompleted, async () => {
    localStorage.setItem('gw2-fishes-hide-completed', hideCompleted.value);
    if (fishes.value) {
        resetFilters();
    }
});

watch(apiKey, async () => {
    localStorage.setItem('gw2-fishes-api-key', apiKey.value);
    loadFishes();
});

</script>

<template>
    <div class="bg-black bg-opacity-50 p-4 rounded-lg text-neutral-content">
        <div class="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 items-center">
            <div class="text-2xl font-bold flex gap-2 items-center text-white">
                <img src="@/assets/img/fishing-companion.png" alt="" class="w-12 h-12 shrink-0">
                Compagnon de pêche
            </div>
            <div class="font-bold text-lg" v-if="fishes">
                {{ fishes.length }}/{{ allFishes.length }} poissons
            </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between gap-4 items-center mt-4">
            <div class="flex flex-wrap gap-2">
                <select class="lbm-select lbm-select-sm lbm-selected-bordered w-full sm:w-auto" v-model="currentAchievement"
                    @change="updateFishes(1)">
                    <option value="">- Région -</option>
                    <option v-for="achievement in achievements" :key="achievement.id" :value="achievement.id">
                        {{ achievement.name }}
                    </option>
                </select>
                <select class="lbm-select lbm-select-sm lbm-selected-bordered w-full sm:w-auto" v-model="currentHole"
                    @change="updateFishes()" v-if="currentAchievement">
                    <option value="">- Zone -</option>
                    <option v-for="hole in holes" :key="hole.id" :value="hole.id">
                        {{ hole.name }}
                    </option>
                </select>
                <select class="lbm-select lbm-select-sm lbm-selected-bordered w-full sm:w-auto" v-model="currentBait"
                    @change="updateFishes()" v-if="currentAchievement">
                    <option value="">- Appât -</option>
                    <option v-for="bait in baits" :key="bait.uid" :value="bait.uid">
                        {{ bait.name }}
                    </option>
                </select>
                <button class="lbm-btn lbm-btn-sm lbm-btn-square" @click="resetFilters"
                    v-if="currentAchievement || currentHole || currentBait">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path
                            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button>
            </div>
            <div class="flex gap-2 items-center">
                <label class="lbm-btn lbm-btn-error lbm-btn-sm gap-1" v-if="token === 'notok'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path
                            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>

                    API GW2
                </label>
                <label class="lbm-btn lbm-btn-sm w-full sm:w-auto" for="fishes-settings-modal">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Paramètres
                </label>
            </div>
        </div>
        <div v-if="fishes && !isLoading">
            <div class="flex flex-col gap-3 mt-4">
                <!-- Daily -->
                <div v-if="daily" class="flex gap-4 items-center p-4 bg-black rounded rounded-lg border border-base-100">
                    <img :src="'https://api.lebusmagique.fr/uploads/api/gw2/items/' + daily.uid + '.png'"
                        class="rounded rounded-lg border w-18 h-18 shrink-0" :class="'border-gw2-rarity-' + daily.rarity"
                        alt="">
                    <div class="flex flex-col gap-1">
                        <div class="inline-flex flex-wrap gap-2 items-center">
                            <span class="font-bold text-white">{{ daily.name }}</span>
                            <span class="lbm-badge lbm-badge-primary">
                                Poisson du jour
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-x-2 gap-y-1 text-sm">
                            <span class="inline-flex gap-1 items-center" v-if="daily.achievement">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"
                                    fill="currentColor" class="h-3 w-3">
                                    <path
                                        d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                                </svg>
                                {{ daily.achievement.name }}
                            </span>
                            <span class="inline-flex gap-1 items-center" v-if="daily.hole">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-3 w-3" height="1em"
                                    viewBox="0 0 352 512">
                                    <path
                                        d="M205.22 22.09c-7.94-28.78-49.44-30.12-58.44 0C100.01 179.85 0 222.72 0 333.91 0 432.35 78.72 512 176 512s176-79.65 176-178.09c0-111.75-99.79-153.34-146.78-311.82zM176 448c-61.75 0-112-50.25-112-112 0-8.84 7.16-16 16-16s16 7.16 16 16c0 44.11 35.89 80 80 80 8.84 0 16 7.16 16 16s-7.16 16-16 16z" />
                                </svg>
                                {{ daily.hole.name }}
                            </span>
                            <span class="inline-flex gap-1 items-center" v-if="daily.bait">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="h-3 w-3"
                                    viewBox="0 0 512 512">
                                    <path
                                        d="M511.988 288.9c-.478 17.43-15.217 31.1-32.653 31.1H424v16c0 21.864-4.882 42.584-13.6 61.145l60.228 60.228c12.496 12.497 12.496 32.758 0 45.255-12.498 12.497-32.759 12.496-45.256 0l-54.736-54.736C345.886 467.965 314.351 480 280 480V236c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v244c-34.351 0-65.886-12.035-90.636-32.108l-54.736 54.736c-12.498 12.497-32.759 12.496-45.256 0-12.496-12.497-12.496-32.758 0-45.255l60.228-60.228C92.882 378.584 88 357.864 88 336v-16H32.666C15.23 320 .491 306.33.013 288.9-.484 270.816 14.028 256 32 256h56v-58.745l-46.628-46.628c-12.496-12.497-12.496-32.758 0-45.255 12.498-12.497 32.758-12.497 45.256 0L141.255 160h229.489l54.627-54.627c12.498-12.497 32.758-12.497 45.256 0 12.496 12.497 12.496 32.758 0 45.255L424 197.255V256h56c17.972 0 32.484 14.816 31.988 32.9zM257 0c-61.856 0-112 50.144-112 112h224C369 50.144 318.856 0 257 0z" />
                                </svg>
                                {{ daily.bait.name }}
                            </span>
                            <span class="inline-flex gap-1 items-center" v-if="daily.power">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"
                                    fill="currentColor" class="h-3 w-3">
                                    <path
                                        d="M510.28 445.86l-73.03-292.13c-3.8-15.19-16.44-25.72-30.87-25.72h-60.25c3.57-10.05 5.88-20.72 5.88-32 0-53.02-42.98-96-96-96s-96 42.98-96 96c0 11.28 2.3 21.95 5.88 32h-60.25c-14.43 0-27.08 10.54-30.87 25.72L1.72 445.86C-6.61 479.17 16.38 512 48.03 512h415.95c31.64 0 54.63-32.83 46.3-66.14zM256 128c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32z" />
                                </svg>
                                {{ daily.power }}
                            </span>
                            <span class="inline-flex gap-1 items-center" v-if="daily.time">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"
                                    fill="currentColor" class="h-3 w-3">
                                    <path
                                        d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z" />
                                </svg>
                                {{ _times[daily.time] }}
                            </span>
                        </div>
                    </div>
                </div>
                <!-- Fishes -->
                <div v-if="fishes.length === 0">
                    <div class="flex gap-2 items-center font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd"
                                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                clip-rule="evenodd" />
                        </svg>
                        Aucun poisson trouvé
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                            <path fill-rule="evenodd"
                                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div id="fishes"
                    class="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-screen border border-base-100 overflow-y-auto p-4 rounded rounded-lg items-start"
                    v-else>
                    <div v-for="fish in fishes" :key="fish.uid" class="flex gap-4 items-center">
                        <div class="lbm-indicator w-18 h-18 shrink-0">
                            <span class="lbm-indicator-item lbm-indicator-bottom lbm-badge bottom-2 right-2 shadow"
                                v-if="fish.status" :class="'fish-completed-' + fish.status"></span>
                            <img :src="'https://api.lebusmagique.fr/uploads/api/gw2/items/' + fish.uid + '.png'"
                                class="rounded rounded-lg border w-18 h-18 shrink-0"
                                :class="'border-gw2-rarity-' + fish.rarity" alt="">
                        </div>

                        <div>
                            <div class="font-bold text-white">
                                {{ fish.name }}
                            </div>
                            <div class="flex flex-wrap gap-x-2 gap-y-1 text-sm">
                                <span class="inline-flex gap-1 items-center" v-if="fish.achievement">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"
                                        fill="currentColor" class="h-3 w-3">
                                        <path
                                            d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                                    </svg>
                                    {{ fish.achievement.name }}
                                </span>
                                <span class="inline-flex gap-1 items-center" v-if="fish.hole">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-3 w-3" height="1em"
                                        viewBox="0 0 352 512">
                                        <path
                                            d="M205.22 22.09c-7.94-28.78-49.44-30.12-58.44 0C100.01 179.85 0 222.72 0 333.91 0 432.35 78.72 512 176 512s176-79.65 176-178.09c0-111.75-99.79-153.34-146.78-311.82zM176 448c-61.75 0-112-50.25-112-112 0-8.84 7.16-16 16-16s16 7.16 16 16c0 44.11 35.89 80 80 80 8.84 0 16 7.16 16 16s-7.16 16-16 16z" />
                                    </svg>
                                    {{ fish.hole.name }}
                                </span>
                                <span class="inline-flex gap-1 items-center" v-if="fish.bait">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="h-3 w-3"
                                        viewBox="0 0 512 512">
                                        <path
                                            d="M511.988 288.9c-.478 17.43-15.217 31.1-32.653 31.1H424v16c0 21.864-4.882 42.584-13.6 61.145l60.228 60.228c12.496 12.497 12.496 32.758 0 45.255-12.498 12.497-32.759 12.496-45.256 0l-54.736-54.736C345.886 467.965 314.351 480 280 480V236c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v244c-34.351 0-65.886-12.035-90.636-32.108l-54.736 54.736c-12.498 12.497-32.759 12.496-45.256 0-12.496-12.497-12.496-32.758 0-45.255l60.228-60.228C92.882 378.584 88 357.864 88 336v-16H32.666C15.23 320 .491 306.33.013 288.9-.484 270.816 14.028 256 32 256h56v-58.745l-46.628-46.628c-12.496-12.497-12.496-32.758 0-45.255 12.498-12.497 32.758-12.497 45.256 0L141.255 160h229.489l54.627-54.627c12.498-12.497 32.758-12.497 45.256 0 12.496 12.497 12.496 32.758 0 45.255L424 197.255V256h56c17.972 0 32.484 14.816 31.988 32.9zM257 0c-61.856 0-112 50.144-112 112h224C369 50.144 318.856 0 257 0z" />
                                    </svg>
                                    {{ fish.bait.name }}
                                </span>
                                <span class="inline-flex gap-1 items-center" v-if="fish.power">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"
                                        fill="currentColor" class="h-3 w-3">
                                        <path
                                            d="M510.28 445.86l-73.03-292.13c-3.8-15.19-16.44-25.72-30.87-25.72h-60.25c3.57-10.05 5.88-20.72 5.88-32 0-53.02-42.98-96-96-96s-96 42.98-96 96c0 11.28 2.3 21.95 5.88 32h-60.25c-14.43 0-27.08 10.54-30.87 25.72L1.72 445.86C-6.61 479.17 16.38 512 48.03 512h415.95c31.64 0 54.63-32.83 46.3-66.14zM256 128c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32z" />
                                    </svg>
                                    {{ fish.power }}
                                </span>
                                <span class="inline-flex gap-1 items-center" v-if="fish.time">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"
                                        fill="currentColor" class="h-3 w-3">
                                        <path
                                            d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z" />
                                    </svg>
                                    {{ _times[fish.time] }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex gap-2 items-center mt-4" v-else>
            <span class="lbm-loading"></span> Chargement en cours...
        </div>
    </div>

    <input type="checkbox" id="fishes-settings-modal" class="lbm-modal-toggle" />
    <div class="lbm-modal">
        <div class="lbm-modal-box">
            <h3 class="font-bold text-lg">Paramètres</h3>
            <div class="lbm-form-control w-full">
                <label class="lbm-label">
                    <span class="lbm-label-text">Clé API Guild Wars 2</span>
                </label>
                <input type="text" placeholder="" class="lbm-input lbm-input-bordered w-full" v-model="apiKey" />
            </div>
            <div class="text-error mt-2" v-if="token === 'notok'">Clé API invalide ou problème avec l'API Guild Wars 2...
            </div>
            <div class="lbm-form-control mt-3">
                <label class="lbm-label cursor-pointer justify-start gap-2">
                    <input type="checkbox" class="lbm-toggle lbm-toggle-success" v-model="hideCompleted" />
                    <span class="label-text">Masquer les poissons pêchés</span>
                </label>
            </div>
            <div class="lbm-modal-action">
                <label for="fishes-settings-modal" class="lbm-btn lbm-btn-primary">Fermer</label>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../../assets/main.scss';

img.border {
    border-width: 3px;
}

#fishes {
    max-height: calc(100dvh - 17rem);
    min-height: 13rem;
    height: auto;
}

.fish-completed-done {
    @apply bg-success;
}

.fish-completed-repeat {
    @apply bg-info;
}
</style>