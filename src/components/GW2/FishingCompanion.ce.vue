<script setup>
const VERSION = '2.0.0';

import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import { pad } from '@/services/utils';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import Gw2ApiService from '@/services/gw2ApiService';

import localFishes from '../../data/gw2-fishes.json';
import localSpecializations from '../../data/gw2api-specializations.json';

// Icons
import IconX from '../icons/IconX.vue';
import IconSettings from '../icons/IconSettings.vue';
import IconSearch from '../icons/IconSearch.vue';
import IconInfoCircle from '../icons/IconInfoCircle.vue';
import IconCheck from '../icons/IconCheck.vue';
import IconInfinity from '../icons/IconInfinity.vue';
import IconCalendarStar from '../icons/IconCalendarStar.vue';
import IconCalendarCheck from '../icons/IconCalendarCheck.vue';
import IconAlertTriangle from '../icons/IconAlertTriangle.vue';

const refreshFishesInterval = ref(null);
const refreshClocksInterval = ref(null);

const gw2 = Gw2ApiService;
const user = useUserStore();
const { currentToken } = storeToRefs(user);

const showSearchInput = ref(false);
const searchValue = ref('');

const allFishes = ref(null);

const achievements = ref([]);

const currentAchievement = ref('');
const currentHole = ref('');
const currentBait = ref('');
const currentSpecial = ref('');

const specialFilters = [
    {
        id: 'legendary',
        name: 'Poissons légendaires',
    },
    {
        id: 'daily',
        name: 'Poissons elligibles aux quotis',
    },
    // {
    //     id: 'today',
    //     name: 'Poissons du jour',
    // },
    {
        id: 'strange-diet',
        name: 'Succès : Un régime particulier',
    },
    {
        id: 'specializations',
        name: 'Spécialisations élites (EoD)',
    },
    {
        id: 'i-have',
        name: 'Poissons en possession',
    },
    {
        id: 'can-open',
        name: 'Poissons à ouvrir',
    },
];

const currentClocks = ref({ tyria: null, cantha: null });

const isLoading = ref(false);
const isSoftLoading = ref(false);

const TIMER_INTERVAL = 5 * 60 * 1000;

const CLOCKS = {
    tyria: { 0: 'night', 25: 'dusk_dawn', 30: 'day', 140: 'dusk_dawn', 145: 'night' },
    cantha: { 0: 'night', 35: 'dusk_dawn', 40: 'day', 135: 'dusk_dawn', 140: 'night' },
};

const initUserSettings = () => {
    const localUserSettings = JSON.parse(localStorage.getItem('lbm-fishing-companion'));
    if (localUserSettings) {
        Object.keys(settings.value).forEach((setting) => {
            settings.value[setting] = localUserSettings[setting] === true || false;
        });
    }
};

const userAchievements = ref([]);
const userItems = ref();
const userItemsTmp = ref();

const loadUserFishes = async () => {
    console.log('load user fishes');
    isSoftLoading.value = 'Progression';
    if (currentToken.value) {
        await gw2
            .getUserAchievements(currentToken.value)
            .then((res) => (userAchievements.value = res.data))
            .then(() => (isSoftLoading.value = false))
            .then(() => {
                userItemsTmp.value = {};
            })
            .then(async () => {
                if (!settings.value['user-inventories']) {
                    return;
                }
                isSoftLoading.value = 'Personnages';
                await gw2
                    .getCharacters(currentToken.value)
                    .then((res) => {
                        isSoftLoading.value = false;
                        return res.data;
                    })
                    .then(async (characters) => {
                        isSoftLoading.value = 'Inventaires';
                        let reqs = characters.map((character) =>
                            gw2.getCharacterInventory(currentToken.value, character),
                        );
                        await Promise.all(reqs).then(async (res) => {
                            res.forEach((r) => {
                                r.data?.bags.forEach((bag) => {
                                    bag?.inventory.forEach((inv) => {
                                        if (inv) {
                                            if (userItemsTmp.value[inv.id]) {
                                                userItemsTmp.value[inv.id] += inv.count;
                                            } else {
                                                userItemsTmp.value[inv.id] = inv.count;
                                            }
                                        }
                                    });
                                });
                            });
                            isSoftLoading.value = false;
                        });
                    });
            })
            .then(async () => {
                if (!settings.value['user-bank']) {
                    return;
                }
                isSoftLoading.value = 'Banque';
                await gw2.getUserBank(currentToken.value).then((res) => {
                    res.data?.forEach((slot) => {
                        if (slot) {
                            if (userItemsTmp.value[slot.id]) {
                                userItemsTmp.value[slot.id] += slot.count;
                            } else {
                                userItemsTmp.value[slot.id] = slot.count;
                            }
                        }
                    });
                    isSoftLoading.value = false;
                });
            })
            .then(() => {
                userItems.value = JSON.parse(JSON.stringify(userItemsTmp.value));
            });
    } else {
        userAchievements.value = [];
        isSoftLoading.value = false;
    }
};

const loadFishes = async () => {
    allFishes.value = localFishes;

    const achievementsIds = [
        ...new Set(
            localFishes
                .map((fish) => [
                    fish.fields.achievement?.achievement_id,
                    fish.fields.achievement?.repeat_achievement_id,
                ])
                .flat()
                .filter((fish) => fish),
        ),
    ];

    isSoftLoading.value = 'Succès';
    await gw2
        .getAchievementsByIds(achievementsIds)
        .then((res) => {
            achievements.value = res.data;
            isSoftLoading.value = false;
        })
        .then(() => {
            loadUserFishes();
        });
};

const fishHolesToString = (holes) => {
    let res = [];
    holes.forEach((h) => {
        res.push(
            (h.frequency ? '<span class="frequency-' + h.frequency + '">' : '') +
                h.hole +
                (h.frequency ? '</span>' : ''),
        );
    });

    return res.join(', ');
};

const moments = {
    any: 'Quelconque',
    tyria_day: 'Jour [Tyrie centrale]',
    tyria_night: 'Nuit [Tyrie centrale]',
    tyria_dusk_dawn: 'Aube/Crépuscule [Tyrie centrale]',
    cantha_day: 'Jour [Cantha]',
    cantha_night: 'Nuit [Cantha]',
    cantha_dusk_dawn: 'Aube/Crépuscule [Cantha]',
};

const fishTimesToString = (times) => {
    let res = [];
    times.forEach((t) => {
        res.push(
            (t.frequency ? '<span class="frequency-' + t.frequency + '">' : '') +
                moments[t.moment] +
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

    if (currentClocks.value.tyria !== tyriaTime) {
        currentClocks.value.tyria = tyriaTime;
    }

    if (currentClocks.value.cantha !== canthaTime) {
        currentClocks.value.cantha = canthaTime;
    }
};

const toggleSearchInput = () => {
    searchValue.value = '';
    showSearchInput.value = !showSearchInput.value;
};

onMounted(() => {
    initUserSettings();
    loadFishes();

    updateClocks();

    if (!refreshClocksInterval.value) {
        refreshClocksInterval.value = setInterval(updateClocks, 3 * 1000);
    }

    if (!refreshFishesInterval.value) {
        refreshFishesInterval.value = setInterval(loadUserFishes, TIMER_INTERVAL);
    }
});

onUnmounted(() => {
    if (refreshFishesInterval.value) clearInterval(refreshFishesInterval.value);
    refreshFishesInterval.value = null;

    if (refreshClocksInterval.value) clearInterval(refreshClocksInterval.value);
    refreshClocksInterval.value = null;
});

watch(currentToken, async () => {
    // TODO : charger les infos de l'user et lancer la recharge auto si !null (sinon supprimer)
    console.log('currentToken', currentToken.value);
    loadUserFishes();
    if (currentToken.value) {
        if (!refreshFishesInterval.value) {
            refreshFishesInterval.value = setInterval(loadUserFishes, TIMER_INTERVAL);
        }
    } else {
        if (refreshFishesInterval.value) clearInterval(refreshFishesInterval.value);
        refreshFishesInterval.value = null;
    }
});

const settings = ref({
    'hide-completed': false,
    'hide-out-clock': false,
    'user-inventories': false,
    'user-bank': false,
});

const handleSaveSettings = () => {
    localStorage.setItem('lbm-fishing-companion', JSON.stringify(settings.value));
};

const checkUserAchievementStatus = (achievement, bit, bitRepeat) => {
    if (achievement && userAchievements.value.length > 0) {
        if (achievement.repeat_achievement_id) {
            const ridx = userAchievements.value.findIndex(
                (ach) => ach.id === achievement.repeat_achievement_id,
            );
            if (ridx >= 0) {
                const repeat = userAchievements.value[ridx];
                if (
                    repeat.done === true ||
                    (repeat.current > 0 && repeat.bits.indexOf(bitRepeat) >= 0)
                ) {
                    return 'repeat';
                }
            }
        }

        if (achievement.achievement_id) {
            const idx = userAchievements.value.findIndex(
                (ach) => ach.id === achievement.achievement_id,
            );
            if (idx >= 0) {
                const first = userAchievements.value[idx];
                if (first.done === true || (first.current > 0 && first.bits.indexOf(bit) >= 0)) {
                    return 'done';
                }
            }
        }
    }

    return null;
};

const checkAchievementBit = (itemId, achievementId) => {
    if (itemId && achievementId && achievements.value.length > 0) {
        const achievement = achievements.value.find((ach) => ach.id === achievementId);
        if (achievement) {
            return achievement.bits.findIndex((bit) => bit.id === itemId && bit.type === 'Item');
        }
    }
    return null;
};

const checkFishTime = (fishTimes) => {
    let i = 0;

    if (fishTimes.findIndex((ft) => ft.moment === 'any') >= 0) {
        i++;
    }

    const times = Object.keys(currentClocks.value).map((k) => `${k}_${currentClocks.value[k]}`);
    times.forEach((t) => {
        if (fishTimes.findIndex((ft) => ft.moment === t) >= 0) {
            i++;
        }
    });

    return i > 0;
};

const filteredFishes = computed(() => {
    return allFishes.value
        ?.map((fish) => {
            const bit = checkAchievementBit(
                fish.fields.item?.id,
                fish.fields.achievement?.achievement_id,
            );
            const bit_repeat = checkAchievementBit(
                fish.fields.item?.id,
                fish.fields.achievement?.repeat_achievement_id,
            );
            return {
                ...fish,
                bit: bit,
                bit_repeat: bit_repeat,
                status: checkUserAchievementStatus(fish.fields.achievement, bit, bit_repeat),
                current_time: checkFishTime(fish.fields.times),
                count: getItemCount(fish.fields.item.id),
            };
        })
        .filter((fish) => {
            // Masquer ceux terminés/répétés
            if (settings.value['hide-completed'] && !currentSpecial.value) {
                return fish.status === null;
            }
            return true;
        })
        .filter((fish) => {
            // Masquer indisponibles
            if (settings.value['hide-out-clock'] && !currentSpecial.value) {
                return fish.current_time;
            }
            return true;
        })
        .filter((fish) => {
            // Recherche texte
            if (searchValue.value) {
                const s = searchValue.value
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
                    .toLowerCase();

                return (
                    fish.fields.item.name
                        .normalize('NFD')
                        .replace(/\p{Diacritic}/gu, '')
                        .toLowerCase()
                        .indexOf(s) >= 0
                );
            }

            return true;
        })
        .filter((fish) => {
            // Achievements / Régions
            if (currentAchievement.value && !currentSpecial.value) {
                return fish.fields.achievement?.pk === currentAchievement.value;
            }
            return true;
        })
        .filter((fish) => {
            // Holes
            if (currentHole.value && !currentSpecial.value) {
                const ids = fish.fields.holes.map((hole) => hole.pk);
                if (ids.indexOf(currentHole.value) >= 0) {
                    return true;
                }
                return false;
            }
            return true;
        })
        .filter((fish) => {
            // Baits
            if (currentBait.value && !currentSpecial.value) {
                return fish.fields.bait?.pk == currentBait.value;
                // return fish.fields.bait?.pk == currentBait.value || fish.fields.bait_any === true;
            }
            return true;
        })
        .filter((fish) => {
            if (currentSpecial.value) {
                switch (currentSpecial.value) {
                    case 'legendary':
                        return fish.fields.item?.rarity === 'Legendary';
                    case 'strange-diet':
                        return fish.fields.strange_diet_achievement === true;
                    case 'specializations':
                        return fish.fields.specialization !== null;
                    case 'i-have':
                        return fish.count > 0;
                    case 'daily':
                        return fish.fields.daily_catch === true;
                    case 'can-open':
                        return fish.fields.daily_catch !== true && fish.count > 0;
                    default:
                        return true;
                }
            }
            return true;
        })
        .sort((a, b) => a.fields.item.name.localeCompare(b.fields.item.name));
});

const filteredAchievements = computed(() => {
    return allFishes.value
        ?.map((fish) => ({
            id: fish.fields.achievement?.pk,
            name: fish.fields.achievement?.name,
        }))
        .filter((obj, index, self) => index === self.findIndex((o) => o.id === obj.id))
        .sort((a, b) => a.name?.localeCompare(b.name));
});

const filteredHoles = computed(() => {
    return allFishes.value
        ?.filter((fish) => {
            if (currentAchievement.value) {
                if (fish.fields.achievement?.pk === currentAchievement.value) {
                    return true;
                }
                return false;
            }
            return true;
        })
        .map((fish) => fish.fields.holes)
        .flat()
        .map((hole) => ({ id: hole.pk, name: hole.hole }))
        .filter((obj, index, self) => index === self.findIndex((o) => o.id === obj.id))
        .sort((a, b) => a.name.localeCompare(b.name));
});

const filteredBaits = computed(() => {
    return allFishes.value
        ?.filter((fish) => {
            if (currentAchievement.value) {
                if (fish.fields.achievement?.pk === currentAchievement.value) {
                    return true;
                }
                return false;
            }
            return true;
        })
        .map((fish) => ({ id: fish.fields.bait?.pk, name: fish.fields.bait?.item?.name }))
        .filter((bait) => bait.id)
        .filter((obj, index, self) => index === self.findIndex((o) => o.id === obj.id))
        .sort((a, b) => a.name.localeCompare(b.name));
});

const handleAchievementChange = () => {
    resetFilter('hole');
    resetFilter('bait');
};

const resetFilter = (filter) => {
    if (filter === 'achievement') {
        currentAchievement.value = '';
    } else if (filter === 'hole') {
        currentHole.value = '';
    } else if (filter === 'bait') {
        currentBait.value = '';
    } else if (filter === 'special') {
        currentSpecial.value = '';
    } else {
        currentAchievement.value = '';
        currentHole.value = '';
        currentBait.value = '';
        currentSpecial.value = '';
    }
};

const getItemCount = (itemId) => {
    return userItems.value ? userItems.value[itemId] || null : null;
};

const specializationsIds = {
    vindicator: 69,
    mechanist: 70,
    harbinger: 64,
    specter: 71,
    willbender: 65,
    bladesworn: 68,
    untamed: 72,
    virtuoso: 66,
    catalyst: 67,
};

const getSpecializationById = (specializationId) => {
    const id = specializationsIds[specializationId];
    return localSpecializations.find((specialization) => specialization.id === id);
};
</script>

<template>
    <div class="lbm-app">
        <div class="lbm-app__header">
            <div class="lbm-app__brand">
                <img src="@/assets/img/fishing-companion.png" alt="" class="lbm-app__logo" />
                <div class="lbm-app__title">
                    <div class="flex gap-2 items-center">
                        Compagnon de pêche
                        <span v-if="isSoftLoading" class="flex gap-2 items-center text-sm">
                            <span class="lbm-loading text-secondary"></span> {{ isSoftLoading }}
                        </span>
                    </div>
                    <div class="lbm-app__subtitle" v-if="allFishes && !isLoading">
                        {{ filteredFishes.length }}/{{ allFishes.length }} poissons
                    </div>
                </div>
            </div>
            <div class="lbm-app__sidebar">
                <gw2-user-auth></gw2-user-auth>
                <label class="lbm-btn lbm-btn-square" for="fishes-settings-modal">
                    <IconSettings class="size-6" />
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
                        <IconSearch class="size-5" />
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
                        @change="handleAchievementChange"
                        @contextmenu.prevent="resetFilter('achievement')"
                        v-if="!showSearchInput && !currentSpecial"
                    >
                        <option value="">- Région -</option>
                        <option
                            v-for="achievement in filteredAchievements"
                            :key="achievement.id"
                            :value="achievement.id"
                        >
                            {{ achievement.name }}
                        </option>
                    </select>
                    <select
                        class="lbm-select lbm-select-sm lbm-selected-bordered w-full sm:w-auto max-w-[15rem]"
                        v-model="currentHole"
                        @contextmenu.prevent="resetFilter('hole')"
                        v-if="!showSearchInput && !currentSpecial"
                    >
                        <option value="">- Zone -</option>
                        <option v-for="hole in filteredHoles" :key="hole.id" :value="hole.id">
                            {{ hole.name }}
                        </option>
                    </select>
                    <select
                        class="lbm-select lbm-select-sm lbm-selected-bordered w-full sm:w-auto"
                        v-model="currentBait"
                        @contextmenu.prevent="resetFilter('bait')"
                        v-if="!showSearchInput && !currentSpecial"
                    >
                        <option value="">- Appât -</option>
                        <option v-for="bait in filteredBaits" :key="bait.id" :value="bait.id">
                            {{ bait.name }}
                        </option>
                    </select>
                    <select
                        class="lbm-select lbm-select-sm lbm-selected-bordered w-full sm:w-auto"
                        v-model="currentSpecial"
                        @contextmenu.prevent="resetFilter('special')"
                        v-if="!showSearchInput"
                    >
                        <option value="">- Spécial -</option>
                        <option
                            v-for="special in specialFilters"
                            :key="special.id"
                            :value="special.id"
                        >
                            {{ special.name }}
                        </option>
                    </select>
                    <button
                        class="lbm-btn lbm-btn-sm lbm-btn-square !h-8 !w-8 p-0"
                        @click="resetFilter"
                        v-if="
                            (currentAchievement || currentHole || currentBait || currentSpecial) &&
                            !showSearchInput
                        "
                    >
                        <IconX class="size-5" />
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
            <div>
                <div
                    role="alert"
                    class="lbm-alert rounded-lg py-3 text-sm mt-3"
                    v-show="currentSpecial === 'legendary'"
                >
                    <IconInfoCircle class="stroke-info h-5 w-5 shrink-0" />
                    <span
                        >Les poisson légendaires donnent des morceaux d'ambre gris anciens lorsque
                        vous les ouvrez.</span
                    >
                </div>
                <div
                    role="alert"
                    class="lbm-alert rounded-lg py-3 text-sm mt-3"
                    v-show="currentSpecial === 'daily'"
                >
                    <IconInfoCircle class="stroke-info h-5 w-5 shrink-0" />
                    <span
                        >Chaque jour, vous pouvez donner des poissons à trois PNJs contre des
                        récompenses, notamment en morceaux d'ambre gris anciens. [<a
                            href="https://wiki.guildwars2.com/wiki/Daily_Catch"
                            target="_blank"
                            class="text-base-content hover:text-white"
                            >Wiki anglais</a
                        >]</span
                    >
                </div>
                <div
                    role="alert"
                    class="lbm-alert rounded-lg py-3 text-sm mt-3"
                    v-show="currentSpecial === 'strange-diet'"
                >
                    <IconInfoCircle class="stroke-info h-5 w-5 shrink-0" />
                    <span
                        >Cette collection déverouille un bébé tortue de siège dans votre instance
                        personnelle. [<a
                            href="https://www.lebusmagique.fr/pages/extension/gw2-eod/trepas-du-dragon/un-regime-particulier.html"
                            target="_blank"
                            class="text-base-content hover:text-white"
                            >Guide</a
                        >]</span
                    >
                </div>
                <div
                    role="alert"
                    class="lbm-alert rounded-lg py-3 text-sm mt-3"
                    v-show="currentSpecial === 'specializations'"
                >
                    <IconInfoCircle class="stroke-info h-5 w-5 shrink-0" />
                    <span
                        >Ces poissons sont utiles pour les collections d'armes élevées des
                        spécialisations élites de End of Dragons. [<a
                            href="https://www.lebusmagique.fr/pages/succes/les-collections/collections-de-specialisation/armes-elevees-de-specialisation-elite-eod.html"
                            target="_blank"
                            class="text-base-content hover:text-white"
                            >Guide</a
                        >]</span
                    >
                </div>
                <div
                    role="alert"
                    class="lbm-alert rounded-lg py-3 text-sm mt-3"
                    v-show="currentSpecial === 'can-open'"
                >
                    <IconInfoCircle class="stroke-info h-5 w-5 shrink-0" />
                    <span
                        >Ces poissons ne semblent pas faire partie des poissons utiles pour les
                        poissons quotidiens. [<a
                            href="https://wiki.guildwars2.com/wiki/Daily_Catch"
                            target="_blank"
                            class="text-base-content hover:text-white"
                            >Wiki anglais</a
                        >]</span
                    >
                </div>
            </div>
            <div v-if="allFishes && !isLoading">
                <div class="flex flex-col gap-3 mt-4">
                    <!-- Fishes -->
                    <div v-if="filteredFishes.length === 0">
                        <div role="alert" class="lbm-alert">
                            <IconAlertTriangle class="stroke-warning size-6 shrink-0" />
                            <span>Aucun poisson ne correspond à votre recherche</span>
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
                            v-for="fish in filteredFishes"
                            :key="fish.pk"
                            class="flex flex-wrap md:flex-nowrap gap-2 items-center w-full"
                        >
                            <div class="lbm-indicator w-12 h-12 shrink-0">
                                <span
                                    class="lbm-indicator-item lbm-indicator-bottom lbm-badge bottom-2 right-2 shadow aspect-square p-0"
                                    v-if="fish.status"
                                    :class="'fish-completed-' + fish.status"
                                >
                                    <IconCheck
                                        stroke-width="3"
                                        class="size-3 text-success-content"
                                        v-if="fish.status === 'done'"
                                    />
                                    <IconInfinity
                                        stroke-width="3"
                                        class="size-3 text-info-content"
                                        v-else-if="fish.status === 'repeat'"
                                    />
                                </span>
                                <img
                                    :src="fish.fields.item.icon"
                                    v-if="fish.fields.item?.id"
                                    class="rounded rounded-lg border border-2 w-12 h-12 shrink-0"
                                    :class="'border-gw2-rarity-' + fish.fields.item.rarity"
                                    alt=""
                                />
                            </div>

                            <div class="w-auto md:w-1/4 shrink-0">
                                <div
                                    class="font-semibold text-sm"
                                    :class="'text-gw2-rarity-' + fish.fields.item.rarity"
                                >
                                    {{ fish.fields.item.name }}
                                    <span v-if="fish.count" class="text-white"
                                        >&times;&nbsp;{{ fish.count }}</span
                                    >
                                    <span
                                        class="text-white font-normal inline-flex gap-1 items-center align-bottom"
                                        v-if="
                                            fish.fields.specialization &&
                                            getSpecializationById(fish.fields.specialization)
                                        "
                                    >
                                        <img
                                            :src="
                                                getSpecializationById(fish.fields.specialization)
                                                    .profession_icon
                                            "
                                            alt=""
                                        />
                                        {{ getSpecializationById(fish.fields.specialization).name }}
                                    </span>
                                    <template v-if="fish.daily">
                                        <IconCalendarCheck
                                            class="text-white size-5 align-bottom mx-1"
                                            stroke-width="1.5"
                                        />
                                        <span class="text-base-content font-normal">xxx</span>
                                    </template>

                                    <IconCalendarStar
                                        v-else-if="fish.fields.daily_catch"
                                        class="text-white size-5 align-bottom ml-1"
                                        stroke-width="1.5"
                                    />
                                </div>
                                <div class="text-sm" v-if="fish.fields.achievement">
                                    {{ fish.fields.achievement.name }}
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
                                        v-if="fish.fields.holes.length > 0"
                                        v-html="fishHolesToString(fish.fields.holes)"
                                    ></span>
                                </div>

                                <div
                                    class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0"
                                >
                                    <span class="inline sm:hidden">Appât : </span>
                                    <span v-if="fish.fields.bait">
                                        {{ fish.fields.bait.item.name }}
                                    </span>
                                    <span v-if="fish.fields.bait_any">Quelconque</span>
                                </div>

                                <div
                                    class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0"
                                >
                                    <span class="inline sm:hidden">Puissance : </span>
                                    <span v-if="fish.fields.power_min && fish.fields.power_max"
                                        >{{ fish.fields.power_min }} &ndash;
                                        {{ fish.fields.power_max }}</span
                                    >
                                    <span
                                        v-else-if="fish.fields.power_min && !fish.fields.power_max"
                                        >{{ fish.fields.power_min }}</span
                                    >
                                    <span v-else>&ndash;</span>
                                </div>

                                <div
                                    class="rounded border-0 sm:border md:border-0 border-gray-500 p-0 sm:p-1 md:p-0"
                                >
                                    <span class="inline sm:hidden">Horaire : </span>
                                    <span
                                        v-if="fish.fields.times.length > 0"
                                        v-html="fishTimesToString(fish.fields.times)"
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
        <div class="text-sm flex flex-col sm:flex-row items-center gap-x-2 gap-y-1 flex-wrap">
            <strong>Légende&nbsp;:</strong>
            <div class="flex gap-1 items-center">
                <span class="lbm-badge shadow aspect-square p-0 fish-completed-done">
                    <IconCheck stroke-width="3" class="size-3 text-success-content" />
                </span>
                Poisson validé dans le succès
            </div>
            <div class="flex gap-1 items-center">
                <span class="lbm-badge shadow aspect-square p-0 fish-completed-repeat">
                    <IconInfinity stroke-width="3" class="size-3 text-info-content" />
                </span>
                Validé dans le succès répétable
            </div>
            <span class="hidden sm:block">&nbsp;</span>
            <strong>Coin de pêche/horaire&nbsp;:</strong>
            <span class="text-gw2-rarity-Fine">Faible chance</span>
            <span class="hidden sm:block">/</span>
            <span class="text-gw2-rarity-Rare">Meilleure chance</span>
            <span class="hidden sm:block">/</span>
            <span class="text-gw2-rarity-Ascended">Fréquemment reperé</span>
        </div>
        <div class="lbm-app__footer">
            <lbm-app-footer :version="`fishing-companion-${VERSION}`"></lbm-app-footer>
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
                        v-model="settings['hide-completed']"
                        @change="handleSaveSettings"
                    />
                    <span class="label-text">Masquer les poissons pêchés</span>
                </label>
            </div>
            <div class="text-sm opacity-75">
                Si vous êtes identifié·e avec votre compte Guild Wars 2, nous récupérons vos
                progressions des succès de pêche via l'API officielle.
            </div>
            <div class="lbm-form-control mt-1">
                <label class="lbm-label cursor-pointer justify-start gap-2">
                    <input
                        type="checkbox"
                        class="lbm-toggle lbm-toggle-success"
                        v-model="settings['hide-out-clock']"
                        @change="handleSaveSettings"
                    />
                    <span class="label-text">Masquer les poissons indisponibles</span>
                </label>
            </div>
            <div class="text-sm opacity-75">
                Certains poissons ne peuvent être attrapés qu'à certains moments de la journée (en
                jeu). Nous avons choisi de masquer les poissons disponibles le jour ou la nuit
                pendant la période de l'aube/crépuscule pour faciliter la lecture.
            </div>
            <div class="lbm-form-control mt-1">
                <label class="lbm-label cursor-pointer justify-start gap-2">
                    <input
                        type="checkbox"
                        class="lbm-toggle lbm-toggle-success"
                        v-model="settings['user-inventories']"
                        @change="handleSaveSettings"
                    />
                    <span class="label-text">Poissons dans mes inventaires</span>
                </label>
            </div>
            <div class="lbm-form-control mt-1">
                <label class="lbm-label cursor-pointer justify-start gap-2">
                    <input
                        type="checkbox"
                        class="lbm-toggle lbm-toggle-success"
                        v-model="settings['user-bank']"
                        @change="handleSaveSettings"
                    />
                    <span class="label-text">Poissons dans ma banque</span>
                </label>
            </div>
            <div class="lbm-modal-action">
                <label for="fishes-settings-modal" class="lbm-btn lbm-btn-primary">Fermer</label>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../../assets/main.scss';

#fishes {
    max-height: calc(100dvh - 17rem);
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
    &-day {
        @apply no-animation bg-gradient-to-b from-cyan-500 to-sky-500 text-sky-100;
    }

    &-dusk_dawn {
        @apply no-animation bg-gradient-to-b from-purple-700 to-orange-500 text-orange-100;
    }

    &-night {
        @apply no-animation bg-gradient-to-b from-slate-800 to-blue-900 text-blue-100;
    }

    &-day,
    &-dusk_dawn,
    &-night {
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
