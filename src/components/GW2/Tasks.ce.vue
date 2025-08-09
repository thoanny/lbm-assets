<template>
    <div class="lbm-app">
        <div class="lbm-app__header">
            <div class="lbm-app__brand">
                <!-- <img src="@/assets/img/IconWizardVault.png" alt="" class="lbm-app__logo" /> -->
                <div class="lbm-app__title">
                    Les Tâches Magiques
                    <div class="lbm-app__subtitle">
                        {{ currentPanel?.name }}
                    </div>
                </div>
            </div>
            <div class="lbm-app__sidebar">
                <gw2-user-auth></gw2-user-auth>
            </div>
        </div>
        <div class="lbm-app__main">
            <div v-if="isLoading" class="px-4 flex gap-2">
                <span class="lbm-loading lbm-loading-spinner"></span>
                Chargement en cours... (1)
            </div>
            <div class="flex gap-4 w-full py-4 pt-0 flex-col md:flex-row" v-else>
                <div class="flex gap-2 flex-row md:flex-col">
                    <button
                        class="lbm-btn lbm-btn-square"
                        :class="{
                            'lbm-btn-primary': activePanel === panel.id,
                            'lbm-btn-neutral': activePanel !== panel.id,
                        }"
                        v-for="panel in menu"
                        :key="panel.id"
                        @click="switchPanel(panel.id, Object.keys(panel.tabs).shift() || '')"
                    >
                        <component :is="icons[panel.icon]" v-if="panel.icon && icons[panel.icon]" />
                        <template v-else>{{ panel.name.substring(0, 2).toUpperCase() }}</template>
                    </button>
                </div>
                <div class="flex-1 w-full">
                    <div class="flex gap-2 mb-4" v-if="currentPanel?.tabs">
                        <button
                            class="lbm-btn"
                            v-for="tab in currentPanel.tabs"
                            :key="tab.id"
                            :class="{
                                'lbm-btn-primary': activeTab === tab.id,
                                'lbm-btn-neutral': activeTab !== tab.id,
                            }"
                            @click="switchTab(tab.id)"
                        >
                            {{ tab.name }}
                        </button>
                    </div>
                    <div v-if="activePanel === 'daily' && activeTab === 'mapchests'">
                        <div
                            class="flex gap-2 items-center"
                            v-for="chest in data.mapchests"
                            :key="chest.id"
                        >
                            <input
                                type="checkbox"
                                class="lbm-checkbox lbm-checkbox-primary"
                                :checked="chest.checked"
                                disabled
                            />
                            {{ chest.id }}
                        </div>
                    </div>
                    <div v-if="activePanel === 'daily' && activeTab === 'worldbosses'">
                        <div
                            class="flex gap-2 items-center"
                            v-for="boss in data.worldbosses"
                            :key="boss.id"
                        >
                            <input
                                type="checkbox"
                                class="lbm-checkbox lbm-checkbox-primary"
                                :checked="boss.checked"
                                disabled
                            />
                            {{ boss.id }}
                        </div>
                    </div>
                    <div v-if="activePanel === 'daily' && activeTab === 'dungeons'">
                        <template v-for="dungeon in data.dungeons" :key="dungeon.id">
                            <h4>{{ dungeon.id }}</h4>
                            <div
                                class="flex gap-2 items-center"
                                v-for="path in dungeon.paths"
                                :key="path.id"
                            >
                                <input
                                    type="checkbox"
                                    class="lbm-checkbox lbm-checkbox-primary"
                                    :checked="path.checked"
                                    disabled
                                />
                                {{ path.id }} ({{ path.type }})
                            </div>
                        </template>
                    </div>
                    <div v-if="activePanel === 'daily' && activeTab === 'dailycrafting'">
                        <div
                            class="flex gap-2 items-center"
                            v-for="craft in data.dailycrafting"
                            :key="craft.id"
                        >
                            <input
                                type="checkbox"
                                class="lbm-checkbox lbm-checkbox-primary"
                                :checked="craft.checked"
                                disabled
                            />
                            {{ craft.id }}
                        </div>
                    </div>
                    <div v-if="activePanel === 'daily' && activeTab === 'achievements'">
                        <template v-for="category in data.dailyachievements" :key="category.id">
                            <h4 class="flex items-center gap-2">
                                <img
                                    :src="category.icon"
                                    class="size-8"
                                    alt=""
                                    v-if="category.icon"
                                />
                                {{ category.name }}
                            </h4>
                            <pre>{{ showAchievement(category.name) }}</pre>
                            <template
                                v-for="achievement in category.achievements"
                                :key="achievement.id"
                            >
                                <div class="flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        class="lbm-checkbox lbm-checkbox-primary"
                                        :checked="getUserAchievementDone(achievement.id)"
                                        disabled
                                    />
                                    {{ achievement.name }}
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
            <!-- <pre>{{ data }}</pre> -->
        </div>
        <div class="lbm-app__footer">
            <lbm-app-footer version="tasks-0.1.0"></lbm-app-footer>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../../assets/main.scss';

div + h4,
h4 + h4 {
    margin-top: 1rem;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import Gw2ApiService from '@/services/gw2ApiService';
import IconCalendar from '../icons/IconCalendar.vue';
import IconCalendarWeek from '../icons/IconCalendarWeek.vue';
import IconListCheck from '../icons/IconListCheck.vue';
import IconSettings from '../icons/IconSettings.vue';

const isLoading = ref();
const gw2 = Gw2ApiService;

const user = useUserStore();
const { currentToken } = storeToRefs(user);

const icons = {
    calendar: IconCalendar,
    calendarWeek: IconCalendarWeek,
    listCheck: IconListCheck,
    settings: IconSettings,
};

const menu = ref({
    daily: {
        id: 'daily',
        name: 'Quotidiennes',
        icon: 'calendar',
        tabs: {
            mapchests: { id: 'mapchests', name: 'Coffres de héros' },
            worldbosses: { id: 'worldbosses', name: 'World boss' },
            dungeons: { id: 'dungeons', name: 'Donjons' },
            dailycrafting: { id: 'dailycrafting', name: 'Crafts' },
            achievements: { id: 'achievements', name: 'Succès' },
            // fractals: { id: 'fractals', name: 'Fractales' },
        },
    },
    weekly: {
        id: 'weekly',
        name: 'Hebdomadaires',
        icon: 'calendarWeek',
        tabs: {
            raids: { id: 'raids', name: 'Raids' },
            fractals: { id: 'fractals', name: 'Fractales' },
        },
    },
    custom: {
        id: 'custom',
        name: 'Personnalisées',
        icon: 'listCheck',
        tabs: {},
    },
    settings: {
        id: 'settings',
        name: 'Paramètres',
        icon: 'settings',
        tabs: {},
    },
});

const data = ref({});

const activePanel = ref('');
const activeTab = ref('');

onMounted(() => {
    activePanel.value = Object.keys(menu.value).shift();
    activeTab.value = Object.keys(menu.value[activePanel.value].tabs).shift() || '';

    isLoading.value = true;
    loadDailyTasks()
        .then(() => loadUserDailyTasks())
        .finally(() => (isLoading.value = false));
});

function switchPanel(p, t) {
    if (activePanel.value !== p) {
        activePanel.value = p;
    }
    switchTab(t);
}

function switchTab(t) {
    console.log('switchTab', t);
    if (t !== activeTab.value) {
        activeTab.value = t || '';
    }
}

const currentPanel = computed(() => {
    return menu.value[activePanel.value] || null;
});

const getUserAchievementDone = (achievement_id) => {
    if (!data.value.userachievements) {
        return false;
    }

    const status = data.value.userachievements.find(
        (achievement) => achievement.id == achievement_id,
    );

    if (!status) {
        return false;
    }

    return status.done;
};

const loadDailyTasks = async () => {
    await Promise.all([
        gw2.getMapChests(),
        gw2.getWorldBosses(),
        gw2.getDungeons(),
        gw2.getDailyCrafting(),
        gw2.getAchievementsGroupById('18DB115A-8637-4290-A636-821362A3C4A8'), // Groupe 'quoti'
    ]).then(async (res) => {
        const [$mapchests, $worldbosses, $dungeons, $dailycrafting, $dailygroupachievement] = res;
        data.value.mapchests = $mapchests.data;
        data.value.worldbosses = $worldbosses.data;
        data.value.dungeons = $dungeons.data;
        data.value.dailycrafting = $dailycrafting.data;

        if ($dailygroupachievement.data) {
            gw2.getAchievementsCategoriesByIds($dailygroupachievement.data.categories).then(
                async (res) => {
                    const categories = res.data;
                    data.value.dailyachievements = categories;

                    console.log('categories:', categories);
                    const reqs = categories.map((category) =>
                        gw2.getAchievementsByIds(
                            category.achievements.map((achievement) => achievement.id),
                        ),
                    );
                    await Promise.all(reqs).then(async (res) => {
                        console.log('achievements:', res);
                        res.forEach((r, i) => {
                            if (r.data) {
                                data.value.dailyachievements[i].achievements =
                                    data.value.dailyachievements[i].achievements
                                        .map((achievement) => ({
                                            ...achievement,
                                            ...r.data.find((ach) => ach.id === achievement.id),
                                        }))
                                        .sort((a, b) => a.name.localeCompare(b.name));
                            }
                        });
                    });
                    console.log(categories);
                },
            );
        }
    });
};

const loadUserDailyTasks = async () => {
    if (!currentToken.value) {
        console.log('no token');
        return;
    }

    await Promise.all([
        gw2.getUserMapChests(currentToken.value),
        gw2.getUserWorldBosses(currentToken.value),
        gw2.getUserDungeons(currentToken.value),
        gw2.getUserDailyCrafting(currentToken.value),
        gw2.getUserAchievements(currentToken.value),
    ]).then(async (res) => {
        const [$mapchests, $worldbosses, $dungeons, $dailycrafting, $achievements] = res;
        if ($mapchests.data) {
            data.value.mapchests = data.value.mapchests.map((chest) => ({
                ...chest,
                checked: $mapchests.data.indexOf(chest) >= 0,
            }));
        }
        if ($worldbosses.data) {
            data.value.worldbosses = data.value.worldbosses.map((boss) => ({
                ...boss,
                checked: $worldbosses.data.indexOf(boss) >= 0,
            }));
        }

        if ($dungeons.data) {
            data.value.dungeons = data.value.dungeons.map((dungeon) => {
                dungeon.paths = dungeon.paths.map((path) => ({
                    ...path,
                    checked: $dungeons.data.indexOf(path.id) >= 0,
                }));
                return { ...dungeon };
            });
        }

        if ($dailycrafting.data) {
            data.value.dailycrafting = data.value.dailycrafting.map((craft) => ({
                ...craft,
                checked: $dailycrafting.data.indexOf(craft.id) >= 0,
            }));
        }

        data.value.userachievements = $achievements.data;
        console.log('user:', $achievements.data);

        // Todo, succès de l'utilsateur sur : data.value.dailyachievements
    });
};

const Y = new Date().getFullYear();

// TODO : corriger les dates
const festivals = {
    Halloween: {
        start: new Date(Date.parse(`1 november ${Y}`)),
        end: new Date(Date.parse(`31 november ${Y}`)),
    },
    Hivernel: {
        start: new Date(Date.parse(`1 december ${Y}`)),
        end: new Date(Date.parse(`15 january ${Y + 1}`)),
    },
    'nouvel an lunaire': {
        start: new Date(Date.parse(`1 february ${Y}`)),
        end: new Date(Date.parse(`15 february ${Y}`)),
    },
    'Super Adventure': {
        start: new Date(Date.parse(`1 april ${Y}`)),
        end: new Date(Date.parse(`15 april ${Y}`)),
    },
    'Quatre Vents': {
        start: new Date(Date.parse(`1 august ${Y}`)),
        end: new Date(Date.parse(`15 august ${Y}`)),
    },
    'Foire du Dragon': {
        start: new Date(Date.parse(`1 june ${Y}`)),
        end: new Date(Date.parse(`15 june ${Y}`)),
    },
};

const showAchievement = (achievement_name) => {
    const now = new Date();
    let i = 0;
    Object.keys(festivals).forEach((festival) => {
        console.log(festival.toLocaleLowerCase(), '-', achievement_name.toLocaleLowerCase());
        if (achievement_name.toLocaleLowerCase().includes(festival.toLocaleLowerCase())) {
            if (festivals[festival].start >= now && festivals[festival].end <= now) {
                $i = 0;
            } else {
                i++;
            }
        }
    });
    return i === 0;
};
console.log(festivals);
</script>
