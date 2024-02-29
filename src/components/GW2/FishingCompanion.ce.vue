<script setup>
// [x] Mettre à jour les infos de tous les poissons
// [x] Ajouter les horloges Tyrie centrale + Cantha
// [x] Ajouter un filtre basé sur les horloges
// [ ] Mettre à jour l'aspect graphique du poisson du jour
// [ ] Afficher le succès strange diet
// [ ] Afficher les spécialisations élites (EoD) sur les poissons concernés

import { onMounted, onUnmounted, ref, watch } from 'vue';
import pad from '@/utils/pad.js';
import objectSort from '@/utils/object-sort.js';

const refreshFishesInterval = ref(null);
const refreshClocksInterval = ref(null);

const apiKey = ref(null);
const hideCompleted = ref(false);
const hideOutClock = ref(false);
const hideDayNight = ref(false);
const token = ref(null);
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
  const res = await fetch(API_URL + (apiKey.value ? '?token=' + apiKey.value : ''));
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
  const localApiKey = localStorage.getItem('gw2-fishes-api-key');
  if (localApiKey) {
    apiKey.value = localApiKey;
  }

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

watch(apiKey, async () => {
  localStorage.setItem('gw2-fishes-api-key', apiKey.value);
  loadFishes();
});

watch(searchValue, async () => {
  updateFishes(1);
});
</script>

<template>
  <div class="bg-black bg-opacity-50 p-4 rounded-lg text-neutral-content">
    <div class="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 items-center">
      <div class="text-2xl font-bold flex gap-2 items-center text-white">
        <img src="@/assets/img/fishing-companion.png" alt="" class="w-12 h-12 shrink-0" />
        Compagnon de pêche
      </div>
      <div class="font-bold text-lg" v-if="fishes">
        {{ fishes.length }}/{{ allFishes.length }} poissons
      </div>
    </div>
    <div
      class="flex flex-col md:flex-row justify-between gap-4 items-center mt-4"
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
          <option v-for="achievement in achievements" :key="achievement.id" :value="achievement.id">
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
          class="lbm-btn lbm-btn-sm lbm-btn-square"
          @click="resetFilters"
          v-if="(currentAchievement || currentHole || currentBait) && !showSearchInput"
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
          <img :src="`https://lbm-assets.vercel.app/img/${currentClocks.tyria}.svg`" alt="" />
          Tyrie centrale
        </div>
        <div
          class="lbm-btn lbm-btn-sm pl-8 relative overflow-hidden w-full sm:w-auto"
          :class="`bg-moment-${currentClocks.cantha}`"
          v-if="currentClocks.cantha"
        >
          <img :src="`https://lbm-assets.vercel.app/img/${currentClocks.cantha}.svg`" alt="" />
          Cantha
        </div>
        <label
          class="lbm-btn lbm-btn-sm sm:lbm-btn-square w-full w-auto sm:!h-8 sm:!w-8"
          for="fishes-settings-modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span class="block sm:hidden">Paramètres</span>
        </label>
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
              'https://api.lebusmagique.fr/uploads/api/gw2/items/' + daily.fish?.item.uid + '.png'
            "
            class="rounded rounded-lg border border-2 w-18 h-18 shrink-0"
            :class="'border-gw2-rarity-' + daily.fish?.item.rarity"
            alt=""
          />
          <div class="flex flex-col gap-1">
            <div class="inline-flex flex-wrap gap-2 items-center">
              <span class="font-bold text-white">{{ daily.fish?.item.name }}</span>
              <span class="lbm-badge lbm-badge-primary"> Poisson du jour </span>
            </div>
            <div class="flex flex-wrap gap-x-2 gap-y-1 text-sm">
              <span class="inline-flex gap-1 items-center" v-if="daily.fish.achievement">
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
              <span class="inline-flex gap-1 items-center" v-if="daily.fish.fishHoles.length > 0">
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
                <span v-if="daily.fish.bait">{{ daily.fish.bait.item.name }}</span>
                <span v-if="daily.fish.baitAny">Quelconque</span>
              </span>
              <span class="inline-flex gap-1 items-center" v-if="daily.fish.power">
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
              <span class="inline-flex gap-1 items-center" v-if="daily.fish.fishTimes.length > 0">
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
                :src="'https://api.lebusmagique.fr/uploads/api/gw2/items/' + fish.item.uid + '.png'"
                class="rounded rounded-lg border border-2 w-12 h-12 shrink-0"
                :class="'border-gw2-rarity-' + fish.item.rarity"
                alt=""
              />
            </div>

            <div class="w-auto md:w-1/4 shrink-0">
              <div class="font-semibold text-sm" :class="'text-gw2-rarity-' + fish.item.rarity">
                {{ fish.item.name }}
              </div>
              <div class="text-sm" v-if="fish.achievement">
                {{ fish.achievement.name }}
              </div>
            </div>

            <div
              class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 sm:gap-2 items-center text-sm text-left sm:text-center"
            >
              <div class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0">
                <span class="inline sm:hidden">Coin de pêche : </span>
                <span
                  v-if="fish.fishHoles.length > 0"
                  v-html="fishHolesToString(fish.fishHoles)"
                ></span>
              </div>

              <div class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0">
                <span class="inline sm:hidden">Appât : </span>
                <span v-if="fish.bait">
                  {{ fish.bait.item.name }}
                </span>
                <span v-if="fish.baitAny">Quelconque</span>
              </div>

              <div class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0">
                <span class="inline sm:hidden">Puissance : </span>
                <span v-if="fish.power">{{ fish.power }}</span>
              </div>

              <div class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0">
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

  <input type="checkbox" id="fishes-settings-modal" class="lbm-modal-toggle" />
  <div class="lbm-modal">
    <div class="lbm-modal-box">
      <h3 class="font-bold text-lg">Paramètres</h3>
      <div class="lbm-form-control w-full">
        <label class="lbm-label">
          <span class="lbm-label-text">Clé API Guild Wars 2</span>
        </label>
        <input
          type="text"
          placeholder=""
          class="lbm-input lbm-input-bordered w-full"
          v-model="apiKey"
        />
      </div>
      <div class="text-error mt-2" v-if="token === 'notok'">
        Clé API invalide ou problème avec l'API Guild Wars 2...
      </div>
      <div class="lbm-form-control mt-3">
        <label class="lbm-label cursor-pointer justify-start gap-2">
          <input type="checkbox" class="lbm-toggle lbm-toggle-success" v-model="hideCompleted" />
          <span class="label-text">Masquer les poissons pêchés</span>
        </label>
      </div>
      <div class="lbm-form-control mt-1">
        <label class="lbm-label cursor-pointer justify-start gap-2">
          <input type="checkbox" class="lbm-toggle lbm-toggle-success" v-model="hideOutClock" />
          <span class="label-text">Masquer les poissons indisponibles</span>
        </label>
      </div>
      <div class="lbm-form-control mt-1" v-if="hideOutClock">
        <label class="lbm-label cursor-pointer justify-start gap-2">
          <input type="checkbox" class="lbm-toggle lbm-toggle-success" v-model="hideDayNight" />
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
