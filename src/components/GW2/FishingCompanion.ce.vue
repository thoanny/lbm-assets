<script setup>
// [x] Mettre à jour les infos de tous les poissons
// [x] Ajouter les horloges Tyrie centrale + Cantha
// [x] Ajouter un filtre basé sur les horloges
// [ ] Mettre à jour l'aspect graphique du poisson du jour
// [ ] Afficher le succès strange diet
// [ ] Afficher les spécialisations élites (EoD) sur les poissons concernés

import { onMounted, onUnmounted, ref, watch } from 'vue';
import { pad, objectSort } from '@/services/utils';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import Gw2ApiService from '@/services/gw2ApiService';

const refreshFishesInterval = ref(null);
const refreshClocksInterval = ref(null);

const gw2 = Gw2ApiService;
const user = useUserStore();
const { currentToken, isLoggedIn } = storeToRefs(user);

const hideCompleted = ref(false);
const hideOutClock = ref(false);
const hideDayNight = ref(false);
const showSearchInput = ref(false);
const searchValue = ref('');

const allFishes = ref(null);
const fishes = ref(null);
const daily = ref({});

const achievements = ref([]);
const holes = ref([]);
const baits = ref([]);

const currentAchievement = ref('');
const currentHole = ref('');
const currentBait = ref('');

const currentClocks = ref({
    tyria: null,
    cantha: null,
});

const isLoading = ref(false);

const API_URL = 'https://api.lebusmagique.fr/api/gw2/fishes';

const TIMER_INTERVAL = 5 * 60 * 1000;

const CLOCKS = {
    tyria: {
        0: 'n',
        25: 'dd',
        30: 'd',
        140: 'dd',
        145: 'n',
    },
    cantha: {
        0: 'n',
        35: 'dd',
        40: 'd',
        135: 'dd',
        140: 'n',
    },
};

const getFishes = async () => {
    isLoading.value = true;
    if (currentToken.value) {
        gw2.getUser(currentToken.value);
    }
    const res = await fetch(API_URL + (currentToken.value ? '?token=' + currentToken.value : ''));
    return await res.json();
};

const getDailyFish = async () => {
    const res = await fetch(`${API_URL}/daily`);
    return await res.json();
};

const updateFishes = (reset = false) => {
    fishes.value = allFishes.value;

    if (reset) {
        holes.value = [];
        baits.value = [];
        currentHole.value = '';
        currentBait.value = '';
    }

    if (searchValue.value) {
        currentAchievement.value = '';
        const s = searchValue.value
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .toLowerCase();
        fishes.value = fishes.value.filter(
            (f) =>
                f.item.name
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
                    .toLowerCase()
                    .indexOf(s) >= 0,
        );
        return;
    }

    if (hideOutClock.value) {
        let moments = [];
        moments.push('any');
        moments.push(`tyria-${currentClocks.value['tyria']}`);
        moments.push(`cantha-${currentClocks.value['cantha']}`);
        if (!hideDayNight.value) {
            moments.push('tyria-d');
            moments.push('tyria-n');
            moments.push('cantha-d');
            moments.push('cantha-n');
        }

        fishes.value = fishes.value.filter((f) =>
            f.fishTimes.find((x) => moments.indexOf(x.time.uid) >= 0),
        );
    }

    if (hideCompleted.value) {
        fishes.value = fishes.value.filter((f) => !f.status);
    }

    if (currentAchievement.value) {
        fishes.value = fishes.value.filter((f) => f.achievement?.id === currentAchievement.value);
    }

    if (currentHole.value) {
        fishes.value = fishes.value.filter((f) =>
            f.fishHoles.find((x) => x.hole.id === currentHole.value),
        );
    }

    if (currentBait.value) {
        fishes.value = fishes.value.filter(
            (f) => f.bait?.item.uid === currentBait.value || f.baitAny === true,
        );
    }

    updateFilters();
};

const updateFilters = () => {
    fishes.value.forEach((f) => {
        const i = achievements.value.findIndex((a) => a.id === f.achievement?.id);
        if (i < 0) {
            achievements.value.push(f.achievement);
        }

        achievements.value = objectSort(achievements.value, 'name');

        if (f.fishHoles) {
            f.fishHoles.forEach((hole) => {
                const j = holes.value.findIndex((h) => h.id === hole.hole.id);
                if (j < 0) {
                    holes.value.push(hole.hole);
                }
            });

            holes.value = objectSort(holes.value, 'name');
        }

        if (f.bait) {
            const k = baits.value.findIndex((b) => b.uid === f.bait.item.uid);
            if (k < 0) {
                baits.value.push(f.bait.item);
            }

            baits.value = objectSort(baits.value, 'name');
        }
    });
};

const resetFilters = () => {
    currentAchievement.value = '';
    currentHole.value = '';
    currentBait.value = '';
    achievements.value = [];
    updateFishes();
};

const initUserSettings = () => {
    const localHideCompleted = localStorage.getItem('gw2-fishes-hide-completed');
    if (localHideCompleted) {
        hideCompleted.value = localHideCompleted === 'true';
    }

    const localHideOutClock = localStorage.getItem('gw2-fishes-hide-out-clock');
    if (localHideOutClock) {
        hideOutClock.value = localHideOutClock === 'true';
    }

    const localHideDayNight = localStorage.getItem('gw2-fishes-hide-day-night');
    if (localHideDayNight) {
        hideDayNight.value = localHideDayNight === 'true';
    }
};

const loadFishes = async () => {
    allFishes.value = await getFishes();
    updateFishes();
    isLoading.value = false;

    daily.value = await getDailyFish();
};

const fishHolesToString = (holes) => {
    let res = [];
    holes.forEach((h) => {
        res.push(
            (h.frequency ? '<span class="frequency-' + h.frequency + '">' : '') +
                h.hole.name +
                (h.frequency ? '</span>' : ''),
        );
    });

    return res.join(', ');
};

const fishTimesToString = (times) => {
    let res = [];
    times.forEach((t) => {
        res.push(
            (t.frequency ? '<span class="frequency-' + t.frequency + '">' : '') +
                t.time.name +
                (t.frequency ? '</span>' : ''),
        );
    });

    return res.join(', ');
};

const findDayPeriod = (timer, region) => {
    for (const key of Object.keys(CLOCKS[region]).reverse()) {
        if (timer >= Number(key)) {
            return CLOCKS[region][key];
        }
    }
    return CLOCKS[region][0];
};

const updateClocks = () => {
    const date = new Date();
    const currentMinutes = date.getUTCMinutes();
    const t = parseInt((date.getUTCHours() % 2).toString() + pad(currentMinutes));

    const tyriaTime = findDayPeriod(t, 'tyria');
    const canthaTime = findDayPeriod(t, 'cantha');

    let fireFishUpdate = false;

    if (currentClocks.value.tyria !== tyriaTime) {
        currentClocks.value.tyria = tyriaTime;
        fireFishUpdate = true;
    }

    if (currentClocks.value.cantha !== canthaTime) {
        currentClocks.value.cantha = canthaTime;
        fireFishUpdate = true;
    }

    if (!isLoading.value && fireFishUpdate) {
        updateFishes();
    }
};

const toggleSearchInput = () => {
    if (showSearchInput.value) {
        searchValue.value = '';
    }
    showSearchInput.value = !showSearchInput.value;
};

onMounted(() => {
    initUserSettings();

    try {
        loadFishes();
    } catch (error) {
        console.error(error);
    }

    updateClocks();

    if (!refreshClocksInterval.value) {
        refreshClocksInterval.value = setInterval(updateClocks, 3 * 1000);
    }

    if (!refreshFishesInterval.value) {
        refreshFishesInterval.value = setInterval(() => {
            try {
                loadFishes();
            } catch (error) {
                console.error(error);
            }
        }, TIMER_INTERVAL);
    }
});

onUnmounted(() => {
    if (refreshFishesInterval.value) clearInterval(refreshFishesInterval.value);
    refreshFishesInterval.value = null;

    if (refreshClocksInterval.value) clearInterval(refreshClocksInterval.value);
    refreshClocksInterval.value = null;
});

watch(hideCompleted, async () => {
    localStorage.setItem('gw2-fishes-hide-completed', hideCompleted.value);
    if (fishes.value) {
        resetFilters();
    }
});

watch(hideOutClock, async () => {
    localStorage.setItem('gw2-fishes-hide-out-clock', hideOutClock.value);
    if (fishes.value) {
        resetFilters();
    }
});

watch(hideDayNight, async () => {
    localStorage.setItem('gw2-fishes-hide-day-night', hideDayNight.value);
    if (fishes.value) {
        resetFilters();
    }
});

watch(currentToken, async () => {
    loadFishes();
});

watch(searchValue, async () => {
    updateFishes(1);
});
</script>

<template>
    <div class="lbm-app">
        <div class="lbm-app__header">
            <div class="lbm-app__brand">
                <img src="@/assets/img/fishing-companion.png" alt="" class="lbm-app__logo" />
                <div class="lbm-app__title">
                    Compagnon de pêche
                    <div class="lbm-app__subtitle" v-if="fishes">
                        {{ fishes.length }}/{{ allFishes.length }} poissons
                    </div>
                </div>
            </div>
            <div class="lbm-app__sidebar">
                <gw2-user-auth></gw2-user-auth>
                <label class="lbm-btn lbm-btn-square" for="fishes-settings-modal">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="h-6 w-6"
                    >
                        <path
                            d="M2.21232 14.0601C1.91928 12.6755 1.93115 11.2743 2.21316 9.94038C3.32308 10.0711 4.29187 9.7035 4.60865 8.93871C4.92544 8.17392 4.50032 7.22896 3.62307 6.53655C4.3669 5.3939 5.34931 4.39471 6.53554 3.62289C7.228 4.50059 8.17324 4.92601 8.93822 4.60914C9.7032 4.29227 10.0708 3.32308 9.93979 2.21281C11.3243 1.91977 12.7255 1.93164 14.0595 2.21364C13.9288 3.32356 14.2964 4.29235 15.0612 4.60914C15.8259 4.92593 16.7709 4.5008 17.4633 3.62356C18.606 4.36739 19.6052 5.3498 20.377 6.53602C19.4993 7.22849 19.0739 8.17373 19.3907 8.93871C19.7076 9.70369 20.6768 10.0713 21.7871 9.94028C22.0801 11.3248 22.0682 12.726 21.7862 14.06C20.6763 13.9293 19.7075 14.2969 19.3907 15.0616C19.0739 15.8264 19.4991 16.7714 20.3763 17.4638C19.6325 18.6064 18.6501 19.6056 17.4638 20.3775C16.7714 19.4998 15.8261 19.0743 15.0612 19.3912C14.2962 19.7081 13.9286 20.6773 14.0596 21.7875C12.675 22.0806 11.2738 22.0687 9.93989 21.7867C10.0706 20.6768 9.70301 19.708 8.93822 19.3912C8.17343 19.0744 7.22848 19.4995 6.53606 20.3768C5.39341 19.633 4.39422 18.6506 3.62241 17.4643C4.5001 16.7719 4.92552 15.8266 4.60865 15.0616C4.29179 14.2967 3.32259 13.9291 2.21232 14.0601ZM3.99975 12.2104C5.09956 12.5148 6.00718 13.2117 6.45641 14.2963C6.90564 15.3808 6.75667 16.5154 6.19421 17.5083C6.29077 17.61 6.38998 17.7092 6.49173 17.8056C7.4846 17.2432 8.61912 17.0943 9.70359 17.5435C10.7881 17.9927 11.485 18.9002 11.7894 19.9999C11.9295 20.0037 12.0697 20.0038 12.2099 20.0001C12.5143 18.9003 13.2112 17.9927 14.2958 17.5435C15.3803 17.0942 16.5149 17.2432 17.5078 17.8057C17.6096 17.7091 17.7087 17.6099 17.8051 17.5081C17.2427 16.5153 17.0938 15.3807 17.543 14.2963C17.9922 13.2118 18.8997 12.5149 19.9994 12.2105C20.0032 12.0704 20.0033 11.9301 19.9996 11.7899C18.8998 11.4856 17.9922 10.7886 17.543 9.70407C17.0937 8.61953 17.2427 7.48494 17.8052 6.49204C17.7086 6.39031 17.6094 6.2912 17.5076 6.19479C16.5148 6.75717 15.3803 6.9061 14.2958 6.4569C13.2113 6.0077 12.5144 5.10016 12.21 4.00044C12.0699 3.99666 11.9297 3.99659 11.7894 4.00024C11.4851 5.10005 10.7881 6.00767 9.70359 6.4569C8.61904 6.90613 7.48446 6.75715 6.49155 6.1947C6.38982 6.29126 6.29071 6.39047 6.19431 6.49222C6.75668 7.48509 6.90561 8.61961 6.45641 9.70407C6.00721 10.7885 5.09967 11.4855 3.99995 11.7899C3.99617 11.93 3.9961 12.0702 3.99975 12.2104ZM11.9997 15.0002C10.3428 15.0002 8.99969 13.657 8.99969 12.0002C8.99969 10.3433 10.3428 9.00018 11.9997 9.00018C13.6565 9.00018 14.9997 10.3433 14.9997 12.0002C14.9997 13.657 13.6565 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z"
                        ></path>
                    </svg>
                </label>
            </div>
        </div>
        <div class="lbm-app__main">
            <div
                class="flex flex-col md:flex-row justify-between gap-4 items-center"
                v-if="!isLoading"
            >
                <div class="flex flex-wrap gap-2 w-full sm:w-auto">
                    <button
                        class="lbm-btn lbm-btn-sm sm:lbm-btn-square sm:!h-8 sm:!w-8"
                        :class="{ 'lbm-btn-primary': showSearchInput }"
                        @click="toggleSearchInput"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="w-5 h-5"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                    <div class="flex gap-2" v-if="showSearchInput">
                        <input
                            type="text"
                            class="lbm-input lbm-input-sm w-full"
                            placeholder="Chercher un poisson..."
                            v-model="searchValue"
                        />
                    </div>
                    <select
                        class="lbm-select lbm-select-sm lbm-selected-bordered w-full sm:w-auto"
                        v-model="currentAchievement"
                        @change="updateFishes(1)"
                        v-if="!showSearchInput"
                    >
                        <option value="">- Région -</option>
                        <option
                            v-for="achievement in achievements"
                            :key="achievement.id"
                            :value="achievement.id"
                        >
                            {{ achievement.name }}
                        </option>
                    </select>
                    <select
                        class="lbm-select lbm-select-sm lbm-selected-bordered w-full sm:w-auto"
                        v-model="currentHole"
                        @change="updateFishes()"
                        v-if="currentAchievement && !showSearchInput"
                    >
                        <option value="">- Zone -</option>
                        <option v-for="hole in holes" :key="hole.id" :value="hole.id">
                            {{ hole.name }}
                        </option>
                    </select>
                    <select
                        class="lbm-select lbm-select-sm lbm-selected-bordered w-full sm:w-auto"
                        v-model="currentBait"
                        @change="updateFishes()"
                        v-if="currentAchievement && !showSearchInput"
                    >
                        <option value="">- Appât -</option>
                        <option v-for="bait in baits" :key="bait.uid" :value="bait.uid">
                            {{ bait.name }}
                        </option>
                    </select>
                    <button
                        class="lbm-btn lbm-btn-sm lbm-btn-square !h-8 !w-8 p-0"
                        @click="resetFilters"
                        v-if="
                            (currentAchievement || currentHole || currentBait) && !showSearchInput
                        "
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            class="w-5 h-5"
                        >
                            <path
                                d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                            />
                        </svg>
                    </button>
                </div>
                <div class="flex-col sm:flex-row flex gap-2 items-center w-full sm:w-auto">
                    <div
                        class="lbm-btn lbm-btn-sm pl-8 relative overflow-hidden w-full sm:w-auto"
                        :class="`bg-moment-${currentClocks.tyria}`"
                        v-if="currentClocks.tyria"
                    >
                        <img
                            :src="`https://lbm-assets.vercel.app/img/${currentClocks.tyria}.svg`"
                            alt=""
                        />
                        Tyrie centrale
                    </div>
                    <div
                        class="lbm-btn lbm-btn-sm pl-8 relative overflow-hidden w-full sm:w-auto"
                        :class="`bg-moment-${currentClocks.cantha}`"
                        v-if="currentClocks.cantha"
                    >
                        <img
                            :src="`https://lbm-assets.vercel.app/img/${currentClocks.cantha}.svg`"
                            alt=""
                        />
                        Cantha
                    </div>
                </div>
            </div>
            <div v-if="fishes && !isLoading">
                <div class="flex flex-col gap-3 mt-4">
                    <!-- Daily -->
                    <div
                        v-if="daily && daily.fish"
                        class="flex gap-4 items-center p-4 bg-black rounded rounded-lg border border-base-100"
                    >
                        <img
                            :src="
                                'https://api.lebusmagique.fr/uploads/api/gw2/items/' +
                                daily.fish?.item.uid +
                                '.png'
                            "
                            class="rounded rounded-lg border border-2 w-18 h-18 shrink-0"
                            :class="'border-gw2-rarity-' + daily.fish?.item.rarity"
                            alt=""
                        />
                        <div class="flex flex-col gap-1">
                            <div class="inline-flex flex-wrap gap-2 items-center">
                                <span class="font-bold text-white">{{
                                    daily.fish?.item.name
                                }}</span>
                                <span class="lbm-badge lbm-badge-primary"> Poisson du jour </span>
                            </div>
                            <div class="flex flex-wrap gap-x-2 gap-y-1 text-sm">
                                <span
                                    class="inline-flex gap-1 items-center"
                                    v-if="daily.fish.achievement"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 384 512"
                                        fill="currentColor"
                                        class="h-3 w-3"
                                    >
                                        <path
                                            d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"
                                        />
                                    </svg>
                                    {{ daily.fish.achievement.name }}
                                </span>
                                <span
                                    class="inline-flex gap-1 items-center"
                                    v-if="daily.fish.fishHoles.length > 0"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        class="h-3 w-3"
                                        height="1em"
                                        viewBox="0 0 352 512"
                                    >
                                        <path
                                            d="M205.22 22.09c-7.94-28.78-49.44-30.12-58.44 0C100.01 179.85 0 222.72 0 333.91 0 432.35 78.72 512 176 512s176-79.65 176-178.09c0-111.75-99.79-153.34-146.78-311.82zM176 448c-61.75 0-112-50.25-112-112 0-8.84 7.16-16 16-16s16 7.16 16 16c0 44.11 35.89 80 80 80 8.84 0 16 7.16 16 16s-7.16 16-16 16z"
                                        />
                                    </svg>
                                    {{ fishHolesToString(daily.fish.fishHoles) }}
                                </span>
                                <span
                                    class="inline-flex gap-1 items-center"
                                    v-if="daily.fish.bait || daily.fish.baitAny"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        fill="currentColor"
                                        class="h-3 w-3"
                                        viewBox="0 0 512 512"
                                    >
                                        <path
                                            d="M511.988 288.9c-.478 17.43-15.217 31.1-32.653 31.1H424v16c0 21.864-4.882 42.584-13.6 61.145l60.228 60.228c12.496 12.497 12.496 32.758 0 45.255-12.498 12.497-32.759 12.496-45.256 0l-54.736-54.736C345.886 467.965 314.351 480 280 480V236c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v244c-34.351 0-65.886-12.035-90.636-32.108l-54.736 54.736c-12.498 12.497-32.759 12.496-45.256 0-12.496-12.497-12.496-32.758 0-45.255l60.228-60.228C92.882 378.584 88 357.864 88 336v-16H32.666C15.23 320 .491 306.33.013 288.9-.484 270.816 14.028 256 32 256h56v-58.745l-46.628-46.628c-12.496-12.497-12.496-32.758 0-45.255 12.498-12.497 32.758-12.497 45.256 0L141.255 160h229.489l54.627-54.627c12.498-12.497 32.758-12.497 45.256 0 12.496 12.497 12.496 32.758 0 45.255L424 197.255V256h56c17.972 0 32.484 14.816 31.988 32.9zM257 0c-61.856 0-112 50.144-112 112h224C369 50.144 318.856 0 257 0z"
                                        />
                                    </svg>
                                    <span v-if="daily.fish.bait">{{
                                        daily.fish.bait.item.name
                                    }}</span>
                                    <span v-if="daily.fish.baitAny">Quelconque</span>
                                </span>
                                <span
                                    class="inline-flex gap-1 items-center"
                                    v-if="daily.fish.power"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                        class="h-3 w-3"
                                    >
                                        <path
                                            d="M510.28 445.86l-73.03-292.13c-3.8-15.19-16.44-25.72-30.87-25.72h-60.25c3.57-10.05 5.88-20.72 5.88-32 0-53.02-42.98-96-96-96s-96 42.98-96 96c0 11.28 2.3 21.95 5.88 32h-60.25c-14.43 0-27.08 10.54-30.87 25.72L1.72 445.86C-6.61 479.17 16.38 512 48.03 512h415.95c31.64 0 54.63-32.83 46.3-66.14zM256 128c-17.64 0-32-14.36-32-32s14.36-32 32-32 32 14.36 32 32-14.36 32-32 32z"
                                        />
                                    </svg>
                                    {{ daily.fish.power }}
                                </span>
                                <span
                                    class="inline-flex gap-1 items-center"
                                    v-if="daily.fish.fishTimes.length > 0"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="1em"
                                        viewBox="0 0 512 512"
                                        fill="currentColor"
                                        class="h-3 w-3"
                                    >
                                        <path
                                            d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"
                                        />
                                    </svg>
                                    {{ fishTimesToString(daily.fish.fishTimes) }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- Fishes -->
                    <div v-if="fishes.length === 0">
                        <div class="flex gap-2 items-center font-semibold">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="w-5 h-5"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            Aucun poisson trouvé
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="w-5 h-5"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    <div
                        id="fishes"
                        class="flex flex-wrap gap-2 max-h-screen border border-base-100 overflow-y-auto p-2 rounded rounded-lg items-start"
                        v-else
                    >
                        <div
                            class="hidden md:block sticky -top-2 -mt-2 -mx-2 bg-base-100 z-50 p-2"
                            style="width: calc(100% + 1rem)"
                        >
                            <div class="flex gap-2 text-sm font-semibold">
                                <div class="w-12 shrink-0"></div>
                                <div class="w-1/4 shrink-0 text-left">Poisson</div>
                                <div class="w-full flex gap-2 text-center">
                                    <div class="w-1/4">Coin de pêche</div>
                                    <div class="w-1/4">Appât</div>
                                    <div class="w-1/4">Puissance</div>
                                    <div class="w-1/4">Horaire</div>
                                </div>
                            </div>
                        </div>
                        <div
                            v-for="fish in fishes"
                            :key="fish.uid"
                            class="flex flex-wrap md:flex-nowrap gap-2 items-center w-full"
                        >
                            <div class="lbm-indicator w-12 h-12 shrink-0">
                                <span
                                    class="lbm-indicator-item lbm-indicator-bottom lbm-badge bottom-2 right-2 shadow"
                                    v-if="fish.status"
                                    :class="'fish-completed-' + fish.status"
                                ></span>
                                <img
                                    :src="
                                        'https://api.lebusmagique.fr/uploads/api/gw2/items/' +
                                        fish.item.uid +
                                        '.png'
                                    "
                                    class="rounded rounded-lg border border-2 w-12 h-12 shrink-0"
                                    :class="'border-gw2-rarity-' + fish.item.rarity"
                                    alt=""
                                />
                            </div>

                            <div class="w-auto md:w-1/4 shrink-0">
                                <div
                                    class="font-semibold text-sm"
                                    :class="'text-gw2-rarity-' + fish.item.rarity"
                                >
                                    {{ fish.item.name }}
                                </div>
                                <div class="text-sm" v-if="fish.achievement">
                                    {{ fish.achievement.name }}
                                </div>
                            </div>

                            <div
                                class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 sm:gap-2 items-center text-sm text-left sm:text-center"
                            >
                                <div
                                    class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0"
                                >
                                    <span class="inline sm:hidden">Coin de pêche : </span>
                                    <span
                                        v-if="fish.fishHoles.length > 0"
                                        v-html="fishHolesToString(fish.fishHoles)"
                                    ></span>
                                </div>

                                <div
                                    class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0"
                                >
                                    <span class="inline sm:hidden">Appât : </span>
                                    <span v-if="fish.bait">
                                        {{ fish.bait.item.name }}
                                    </span>
                                    <span v-if="fish.baitAny">Quelconque</span>
                                </div>

                                <div
                                    class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0"
                                >
                                    <span class="inline sm:hidden">Puissance : </span>
                                    <span v-if="fish.power">{{ fish.power }}</span>
                                </div>

                                <div
                                    class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0"
                                >
                                    <span class="inline sm:hidden">Horaire : </span>
                                    <span
                                        v-if="fish.fishTimes.length > 0"
                                        v-html="fishTimesToString(fish.fishTimes)"
                                    ></span>
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
        <div class="lbm-app__footer">
            <lbm-app-footer v-if="!isLoading"></lbm-app-footer>
        </div>
    </div>

    <input type="checkbox" id="fishes-settings-modal" class="lbm-modal-toggle" />
    <div class="lbm-modal">
        <div class="lbm-modal-box">
            <h3 class="font-bold text-lg">Paramètres</h3>
            <div class="lbm-form-control mt-3">
                <label class="lbm-label cursor-pointer justify-start gap-2">
                    <input
                        type="checkbox"
                        class="lbm-toggle lbm-toggle-success"
                        v-model="hideCompleted"
                    />
                    <span class="label-text">Masquer les poissons pêchés</span>
                </label>
            </div>
            <div class="lbm-form-control mt-1">
                <label class="lbm-label cursor-pointer justify-start gap-2">
                    <input
                        type="checkbox"
                        class="lbm-toggle lbm-toggle-success"
                        v-model="hideOutClock"
                    />
                    <span class="label-text">Masquer les poissons indisponibles</span>
                </label>
            </div>
            <div class="lbm-form-control mt-1" v-if="hideOutClock">
                <label class="lbm-label cursor-pointer justify-start gap-2">
                    <input
                        type="checkbox"
                        class="lbm-toggle lbm-toggle-success"
                        v-model="hideDayNight"
                    />
                    <span class="label-text">Exclure Jour/Nuit pendant Aube/Crépuscule</span>
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

:deep(.frequency-low) {
    @apply text-gw2-rarity-Fine;
}

:deep(.frequency-best) {
    @apply text-gw2-rarity-Rare;
}

:deep(.frequency-high) {
    @apply text-gw2-rarity-Ascended;
}

.bg-moment {
    &-d {
        @apply no-animation bg-gradient-to-b from-cyan-500 to-sky-500 text-sky-100;
    }

    &-dd {
        @apply no-animation bg-gradient-to-b from-purple-700 to-orange-500 text-orange-100;
    }

    &-n {
        @apply no-animation bg-gradient-to-b from-slate-800 to-blue-900 text-blue-100;
    }

    &-d,
    &-dd,
    &-n {
        img {
            @apply absolute top-0 left-0;
            height: 1.875rem;
        }
    }
}

/* Scrollbar */

* {
    scrollbar-width: none;
    scrollbar-color: hsl(var(--nc)) hsl(var(--b1));
}

*::-webkit-scrollbar {
    width: 8px;
}

*::-webkit-scrollbar-track {
    background: hsl(var(--b1));
    border-radius: 0 4px 4px 0;
}

*::-webkit-scrollbar-thumb {
    background-color: hsl(var(--nc));
    border-radius: 4px;
    border: 0px none hsl(var(--nc));
}
</style>
