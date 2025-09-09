<!-- 
- Pouvoir masquer certaines lignes
- Pouvoir masquer une catégorie
- Hebdo : ajouter convergeances (JW/SotO)
    - [JW] Convergences (hebdomadaire) : mont Balrior
    - [JW] Convergences en mode défi (hebdomadaires) : Mont Balrior 
    - [SotO] Convergences (hebdomadaire)
    - [SotO] Convergences en mode défi (hebdomadaires) : Nayos extérieur
- Hebdo : chasse à la brèche (JW/SotO)
- Possibilité d'ajouter des tâches persos, qui s'ajoute dans quoti/hebdo/sans deadline
- Batch de tâches déjà perso par le LBM (pour avoir quelques idées)
- Ajout de tâche, pouvoir ajouter un ID de succès
- Dans les paramètres, pouvoir réafficher

- formulaire d'ajout :
    - intitulé
    - identifiant de succès
    - période (DAILY/WEEKLY/CUSTOM)

-->
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
                <button class="lbm-btn lbm-btn-square lbm-btn-secondary">
                    <IconPlus />
                </button>
                <gw2-user-auth></gw2-user-auth>
            </div>
        </div>
        <div class="lbm-app__main">
            <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="flex flex-col gap-1">
                    <progress
                        class="lbm-progress lbm-progress-success"
                        value="20"
                        max="100"
                    ></progress>
                    <span class="text-xs">Tâches quotidiennes</span>
                </div>
                <div class="flex flex-col gap-1">
                    <progress
                        class="lbm-progress lbm-progress-success"
                        value="50"
                        max="100"
                    ></progress>
                    <span class="text-xs">Tâches hebdomadaires</span>
                </div>
                <div class="flex flex-col gap-1">
                    <progress
                        class="lbm-progress lbm-progress-success"
                        value="75"
                        max="100"
                    ></progress>
                    <span class="text-xs">Mes objectifs</span>
                </div>
            </div>
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
                    <div
                        v-if="activePanel === 'daily' && activeTab === 'mapchests'"
                        class="flex flex-col gap-3"
                    >
                        <div v-for="chest in data.mapchests" :key="chest.id">
                            <div class="flex gap-2 items-center font-semibold">
                                <IconSquareCheck class="text-info" v-if="chest.checked" />
                                <IconSquare class="text-info/50" v-else />
                                {{ chest.title || chest.id }}
                            </div>
                            <div v-if="chest.description" class="text-sm">
                                {{ chest.description }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="activePanel === 'daily' && activeTab === 'worldbosses'"
                        class="flex flex-col gap-3"
                    >
                        <div v-for="boss in data.worldbosses" :key="boss.id">
                            <div class="flex gap-2 items-center font-semibold">
                                <IconSquareCheck class="text-info" v-if="boss.checked" />
                                <IconSquare class="text-info/50" v-else />
                                {{ boss.title || boss.id }}
                            </div>
                            <div v-if="boss.description" class="text-sm">
                                {{ boss.description }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="activePanel === 'daily' && activeTab === 'dungeons'"
                        class="flex flex-col gap-3"
                    >
                        <template v-for="dungeon in data.dungeons" :key="dungeon.id">
                            <h4 class="text-white">{{ dungeon.title || dungeon.id }}</h4>
                            <div v-if="dungeon.description" class="text-sm -mt-3">
                                {{ dungeon.description }}
                            </div>
                            <div v-for="path in dungeon.paths" :key="path.id">
                                <div class="flex gap-2 items-center font-semibold">
                                    <IconSquareCheck class="text-info" v-if="path.checked" />
                                    <IconSquare class="text-info/50" v-else />
                                    {{ path.title || path.id }}
                                </div>
                                <div v-if="path.description" class="text-sm">
                                    {{ path.description }}
                                </div>
                            </div>
                        </template>
                    </div>
                    <div
                        v-if="activePanel === 'daily' && activeTab === 'dailycrafting'"
                        class="flex flex-col gap-3"
                    >
                        <div v-for="craft in data.dailycrafting" :key="craft.id">
                            <div class="flex gap-2 items-center font-semibold">
                                <IconSquareCheck class="text-info" v-if="craft.checked" />
                                <IconSquare class="text-info/50" v-else />
                                {{ craft.title || craft.id }}
                            </div>
                            <div v-if="craft.description" class="text-sm">
                                {{ craft.description }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="activePanel === 'daily' && activeTab === 'achievements'"
                        class="flex flex-col gap-3"
                    >
                        <template v-for="category in data.dailyachievements" :key="category.id">
                            <template
                                v-if="
                                    !category.start_date ||
                                    !category.end_date ||
                                    (category.start_date &&
                                        category.end_date &&
                                        new Date(category.start_date) <= new Date() &&
                                        new Date(category.end_date) >= new Date())
                                "
                            >
                                <h4
                                    class="flex items-center gap-1 -ml-1"
                                    :data-category-id="category.id"
                                >
                                    <img
                                        :src="category.icon"
                                        class="size-8"
                                        alt=""
                                        v-if="category.icon"
                                    />
                                    {{ category.name }}
                                </h4>
                                <div v-if="category.description" class="text-sm -mt-3">
                                    {{ category.description }}
                                </div>
                                <template
                                    v-for="achievement in category.achievements"
                                    :key="achievement.id"
                                >
                                    <div class="flex gap-2 items-center">
                                        <IconSquareCheck
                                            class="text-info"
                                            v-if="getUserAchievementDone(achievement.id)"
                                        />
                                        <IconSquare class="text-info/50" v-else />
                                        {{ achievement.name }}
                                    </div>
                                </template>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
            <!-- <pre>{{ localTasks }}</pre> -->
            <!-- <pre>{{ data.dailyachievements }}</pre> -->
        </div>
        <div class="lbm-app__footer">
            <lbm-app-footer :version="VERSION"></lbm-app-footer>
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
const VERSION = 'tasks-0.1.1';

import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import Gw2ApiService from '@/services/gw2ApiService';
import localTasks from '@/data/gw2-tasks.json';

import IconCalendar from '../icons/IconCalendar.vue';
import IconCalendarWeek from '../icons/IconCalendarWeek.vue';
import IconListCheck from '../icons/IconListCheck.vue';
import IconSettings from '../icons/IconSettings.vue';
import IconPlus from '../icons/IconPlus.vue';
import IconSquareCheck from '../icons/IconSquareCheck.vue';
import IconSquare from '../icons/IconSquare.vue';

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
            // fractals: { id: 'fractals', name: 'Fractales' }, // Déjà dans la catégorie "succès"
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
        name: 'Mes objectifs',
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
        data.value.mapchests = $mapchests.data.map((mc) => ({
            ...mc,
            ...localTasks.find((t) => t.fields.uid === mc.id)?.fields,
        }));
        data.value.worldbosses = $worldbosses.data.map((wb) => ({
            ...wb,
            ...localTasks.find((t) => t.fields.uid === wb.id)?.fields,
        }));
        data.value.dungeons = $dungeons.data.map((d) => ({
            ...d,
            paths: d.paths.map((p) => ({
                ...p,
                ...localTasks.find((t) => t.fields.uid === `${d.id}_${p.id}`)?.fields,
            })),
            ...localTasks.find((t) => t.fields.uid === d.id)?.fields,
        }));
        data.value.dailycrafting = $dailycrafting.data.map((dc) => ({
            ...dc,
            ...localTasks.find((t) => t.fields.uid === dc.id)?.fields,
        }));

        if ($dailygroupachievement.data) {
            gw2.getAchievementsCategoriesByIds($dailygroupachievement.data.categories).then(
                async (res) => {
                    const categories = res.data;
                    data.value.dailyachievements = categories.map((da) => ({
                        ...da,
                        start_date: null,
                        end_date: null,
                        ...localTasks.find((t) => t.fields.uid === `achievement_category_${da.id}`)
                            ?.fields,
                    }));

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
                checked: $mapchests.data.indexOf(chest.id) >= 0,
            }));
            console.log('$mapchests', $mapchests.data);
        }
        if ($worldbosses.data) {
            data.value.worldbosses = data.value.worldbosses.map((boss) => ({
                ...boss,
                checked: $worldbosses.data.indexOf(boss.id) >= 0,
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
</script>
