<template>
    <div class="lbm-app">
        <div class="lbm-app__header">
            <div class="lbm-app__brand">
                <div class="lbm-app__title">
                    <div class="flex gap-2 items-center">
                        Spécialisations élites de Visions of Eternity
                    </div>
                    <div class="lbm-app__subtitle" v-if="false">
                        {{ currentSpecialization.name }}
                        <small>({{ currentSpecialization.profession }})</small>
                    </div>
                </div>
            </div>
            <div class="lbm-app__sidebar"></div>
        </div>
        <div class="lbm-alert">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="stroke-info shrink-0 w-6 h-6"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>
            <span class="text-sm"
                >Données de l'API officielle de Guild&nbsp;Wars&nbsp;2, du 20 août 2025 (début de la
                phase de bêta des spécialisations). Certaines informations peuvent être fausses ou
                incomplètes.</span
            >
        </div>
        <div class="lbm-app__main flex flex-col md:flex-row gap-4 items-start">
            <div class="flex gap-2 flex-row md:flex-col flex-wrap">
                <button
                    v-for="spec in specializations"
                    :key="spec.id"
                    class="lbm-btn lbm-btn-square"
                    :class="{
                        'lbm-btn-primary': currentSpecialization?.id === spec.id,
                        'lbm-btn-neutral': currentSpecialization?.id !== spec.id,
                    }"
                    @click="updateCurrentSpecialization(spec.id)"
                >
                    <img
                        :src="`/img/voe/specializations/icons/${spec.id}_compressed.png`"
                        class="w-full h-full object-fit"
                        :class="{
                            'grayscale contrast-150 brightness-150':
                                currentSpecialization?.id !== spec.id,
                        }"
                        alt=""
                    />
                </button>
            </div>

            <div class="w-full select-none">
                <div
                    class="xl:aspect-video w-full h-full overflow-hidden rounded-lg relative border border-neutral"
                    v-if="currentSpecialization"
                >
                    <img
                        :src="`/img/voe/specializations/backgrounds/${currentSpecialization.id}_compressed.jpg`"
                        class="absolute top-0 w-full h-full object-cover z-10"
                        alt=""
                        :class="{
                            'object-left sm:object-center':
                                currentSpecialization.wrapper === 'right',
                            'object-right sm:object-center':
                                currentSpecialization.wrapper === 'left',
                        }"
                    />
                    <div
                        class="w-full sm:w-2/3 md:w-1/2 h-full p-8 relative z-20"
                        :class="{ 'ml-auto': currentSpecialization.wrapper === 'right' }"
                    >
                        <div class="w-full h-full flex flex-col gap-8 items-center justify-center">
                            <!-- Header -->
                            <div class="flex flex-col items-center text-black">
                                <img
                                    :src="`/img/voe/specializations/icons/${currentSpecialization.id}_compressed.png`"
                                    alt=""
                                    class="w-36"
                                />
                                <span class="font-bold text-xl">{{
                                    currentSpecialization.name
                                }}</span>
                                <span>&rarr; {{ currentSpecialization.profession }}</span>
                            </div>
                            <!-- Skills -->
                            <div class="flex flex-wrap justify-center gap-1 max-w-[22rem]">
                                <tippy
                                    v-for="skill in currentSpecialization.skills"
                                    :key="skill.id"
                                    :arrow="false"
                                    :follow-cursor="true"
                                    :max-width="300"
                                    placement="auto-end"
                                    theme="gw2"
                                >
                                    <div
                                        class="rounded border border-black overflow-hidden size-[45px]"
                                    >
                                        <img
                                            :src="skill.icon"
                                            class="block size-[60px] -mt-[8px] -ml-[8px]"
                                            alt=""
                                        />
                                    </div>

                                    <template #content>
                                        <div class="w-full text-shadow bg-base-100/90 p-2">
                                            <div
                                                class="font-semibold leading-4 text-[#ffcc77] flex-1"
                                            >
                                                <span class="text-white text-xs"
                                                    >[{{ getSkillType(skill.type) }}]</span
                                                >
                                                {{ skill.name }}
                                            </div>
                                            <div class="text-xs leading-4 flex flex-col gap-1 mt-1">
                                                <div class="flex gap-1 items-center leading-none">
                                                    <div
                                                        v-if="skill.description"
                                                        class="text-white"
                                                    >
                                                        {{ skill.description }}
                                                    </div>
                                                </div>
                                                <SpecializationFact
                                                    v-for="(fact, f) in skill.facts"
                                                    :key="f"
                                                    :fact="fact"
                                                />
                                            </div>
                                        </div>
                                    </template>
                                </tippy>
                            </div>
                            <!-- Traits -->
                            <div class="flex gap-1">
                                <div class="grid grid-col-1 gap-1">
                                    <tippy
                                        v-for="trait in currentSpecialization.minor_traits"
                                        :key="trait.id"
                                        :arrow="false"
                                        :follow-cursor="true"
                                        :max-width="300"
                                        placement="auto-end"
                                        theme="gw2"
                                        :class="[`row-start-${trait.tier}`]"
                                    >
                                        <img
                                            :src="trait.icon"
                                            class="block size-[36px] lbm-mask lbm-mask-hexagon"
                                            alt=""
                                        />
                                        <template #content>
                                            <div class="w-full text-shadow bg-base-100/90 p-2">
                                                <div
                                                    class="font-semibold leading-4 text-[#ffcc77] flex-1"
                                                >
                                                    {{ trait.name }}
                                                </div>
                                                <div
                                                    class="text-xs leading-4 flex flex-col gap-1 mt-1"
                                                >
                                                    <div
                                                        class="flex gap-1 items-center leading-none"
                                                    >
                                                        <div
                                                            v-if="trait.description"
                                                            class="text-white"
                                                            v-html="cleanText(trait.description)"
                                                        ></div>
                                                    </div>
                                                    <!-- Trait facts -->
                                                    <SpecializationFact
                                                        v-for="(fact, f) in trait.facts"
                                                        :key="f"
                                                        :fact="fact"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                class="w-full text-shadow bg-base-100/90 p-2 mt-1"
                                                v-for="skill in trait.skills?.slice(0, 1)"
                                                :key="skill.id"
                                            >
                                                <div
                                                    class="font-semibold leading-4 text-[#ffcc77] flex-1"
                                                >
                                                    {{ skill.name }}
                                                </div>
                                                <div
                                                    class="text-xs leading-4 flex flex-col gap-1 mt-1"
                                                >
                                                    <div
                                                        class="flex gap-1 items-center leading-none"
                                                    >
                                                        <div
                                                            v-if="skill.description"
                                                            class="text-white"
                                                            v-html="cleanText(skill.description)"
                                                        ></div>
                                                    </div>
                                                    <!-- Trait facts -->
                                                    <SpecializationFact
                                                        v-for="(fact, f) in skill.facts"
                                                        :key="f"
                                                        :fact="fact"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                class="w-full text-shadow bg-base-100/90 p-2 mt-1 text-xs"
                                                v-if="trait.skills?.length > 1"
                                            >
                                                + {{ trait.skills.length - 1 }}
                                                {{
                                                    trait.skills.length - 1 > 1
                                                        ? 'compétences'
                                                        : 'compétence'
                                                }}
                                            </div>
                                            <!-- <pre>{{ trait.skills }}</pre> -->
                                        </template>
                                    </tippy>
                                </div>
                                <div class="grid grid-cols-3 gap-1">
                                    <tippy
                                        v-for="trait in currentSpecialization.major_traits"
                                        :key="trait.id"
                                        :arrow="false"
                                        :follow-cursor="true"
                                        :max-width="300"
                                        placement="auto-end"
                                        theme="gw2"
                                        :class="[
                                            `row-start-${trait.tier}`,
                                            `col-start-${trait.order + 1}`,
                                        ]"
                                    >
                                        <img
                                            :src="trait.icon"
                                            class="block size-[36px] rounded"
                                            alt=""
                                        />
                                        <template #content>
                                            <div class="w-full text-shadow bg-base-100/90 p-2">
                                                <div
                                                    class="font-semibold leading-4 text-[#ffcc77] flex-1"
                                                >
                                                    {{ trait.name }}
                                                </div>
                                                <div
                                                    class="text-xs leading-4 flex flex-col gap-1 mt-1"
                                                >
                                                    <div
                                                        class="flex gap-1 items-center leading-none"
                                                    >
                                                        <div
                                                            v-if="trait.description"
                                                            class="text-white"
                                                            v-html="cleanText(trait.description)"
                                                        ></div>
                                                    </div>
                                                    <!-- Trait facts -->
                                                    <SpecializationFact
                                                        v-for="(fact, f) in trait.facts"
                                                        :key="f"
                                                        :fact="fact"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                class="w-full text-shadow bg-base-100/90 p-2 mt-1"
                                                v-for="skill in trait.skills?.slice(0, 1)"
                                                :key="skill.id"
                                            >
                                                <div
                                                    class="font-semibold leading-4 text-[#ffcc77] flex-1"
                                                >
                                                    {{ skill.name }}
                                                </div>
                                                <div
                                                    class="text-xs leading-4 flex flex-col gap-1 mt-1"
                                                >
                                                    <div
                                                        class="flex gap-1 items-center leading-none"
                                                    >
                                                        <div
                                                            v-if="skill.description"
                                                            class="text-white"
                                                            v-html="cleanText(skill.description)"
                                                        ></div>
                                                    </div>
                                                    <!-- Trait facts -->
                                                    <SpecializationFact
                                                        v-for="(fact, f) in skill.facts"
                                                        :key="f"
                                                        :fact="fact"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                class="w-full text-shadow bg-base-100/90 p-2 mt-1 text-xs"
                                                v-if="trait.skills?.length > 1"
                                            >
                                                + {{ trait.skills.length - 1 }}
                                                {{
                                                    trait.skills.length - 1 > 1
                                                        ? 'compétences'
                                                        : 'compétence'
                                                }}
                                            </div>
                                            <!-- <pre>{{ trait.skills }}</pre> -->
                                        </template>
                                    </tippy>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <pre>{{ currentSpecialization }}</pre> -->
                <!-- <pre>{{ currentSpecialization?.skills.map((s) => s.id).join(',') }}</pre> -->
                <!-- <pre
                    >{{ currentSpecialization?.minor_traits.map((mt) => mt.id).join(',') }},{{
                        currentSpecialization?.major_traits.map((mt) => mt.id).join(',')
                    }}</pre
                > -->
            </div>
        </div>
        <div class="lbm-app__footer">
            <lbm-app-footer :version="`voe-specializations-${VERSION}`"></lbm-app-footer>
        </div>
    </div>
    <!-- <pre>{{ specializations }}</pre> -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Tippy } from 'vue-tippy';

import localSpecializations from '../../data/gw2api-specializations.json';
// https://api.guildwars2.com/v2/skills?lang=fr&ids=76552,76746,77079,76960,76931,76695,76850,77066,76611,77178,76971,77342,76782,77155,76755,77040,76769,76934,77114,76562,76806,77103,76927,76959,76798,77163,76642,76738,77069,76908,77018,77209,76993,77238,77003,76732,76647,77061,76864,76961,76684,76607,77259,76975,77022,76739,76752,76941,77397,76674,76702,76816,76633,77277,76886,76725,76808,77230,76879,77255,76966,76787,77183,76664,77319,77012,76807,76722,77174,77271,77264,77211,76619,76757,76979,76610,76641,77246,76644,76774,77251,77312,77368,77389,77371,77043,77243,77291,76917,76805,77141,77159,76643,76585,77225,76811,77370,77089,77226,76707,76634,76711,77190,77038,77320,76841,77073,76621,77321,77078,76813,77300,77198
import localSkills from '../../data/gw2-voe-skills.json';
// https://api.guildwars2.com/v2/traits?lang=fr&ids=2374,2386,2424,2326,2343,2353,2367,2414,2422,2427,2432,2441,2340,2373,2418,2345,2357,2369,2375,2385,2399,2426,2428,2433,2356,2377,2389,2334,2349,2366,2383,2387,2395,2406,2420,2434,2338,2371,2398,2327,2333,2339,2376,2378,2384,2392,2405,2421,2337,2362,2403,2346,2348,2350,2365,2393,2400,2409,2423,2431,2341,2359,2363,2336,2360,2370,2372,2396,2402,2408,2413,2425,2331,2364,2440,2352,2355,2358,2379,2390,2407,2411,2416,2429,2344,2351,2382,2335,2342,2354,2380,2391,2415,2436,2437,2438,2381,2394,2435,2328,2329,2330,2368,2388,2401,2410,2417,2419
import localTraits from '../../data/gw2-voe-traits.json';

import SpecializationFact from './SpecializationFact.vue';

const VERSION = '0.1.0';

const specializations = computed(() => {
    return localSpecializations
        .filter((spec) => {
            return _specializations.map((s) => s.id).indexOf(spec.id) >= 0;
        })
        .map((spec, i) => {
            const _spec = _specializations.find((s) => s.id === spec.id);
            const skills = _spec?.skills.map((skill) => localSkills.find((ls) => ls.id === skill));
            const minor_traits = localTraits.filter((lt) => spec.minor_traits.indexOf(lt.id) >= 0);
            const major_traits = localTraits.filter((mt) => spec.major_traits.indexOf(mt.id) >= 0);
            return {
                ...spec,
                skills: skills,
                active: i === 0,
                wrapper: _spec?.wrapper,
                minor_traits: minor_traits,
                major_traits: major_traits,
            };
        });
});

const _specializations = [
    {
        id: 73,
        skills: [
            76552, // Luth de réverbération
            // 77306, // Luth de réverbération
            76746, // Flûte troublante
            77079, // Tambour assourdissant
            76960, // Harpe harmonieuse
            // 77077, // Harpe harmonieuse
            76931, // Crescendo

            76695, // Conte de la deuxième descendante
            76850, // Conte de Garde-âme
            77066, // Conte de la génie torturée
            76611, // Conte de l'honorable fripouille
            77178, // Conte du vaillant maréchal
            76971, // Conte de l'auguste reine

            // 62560, // Appel des lames
            // 62568, // Bond coupant
            // 62675, // Lame de retour
            // 69344, // Pensées persistantes
            // 69385, // Axes de symétrie
        ],
        wrapper: 'right',
    },
    {
        id: 74,
        skills: [
            77342, // Chant d'action
            76782, // Chant de récupération
            77155, // Chant de liberté
            76755, // Nous reviendrons !
            77040, // Trouvez leur faiblesse !
            76769, // Aucune reddition !
            76934, // Préparez-vous !
            77114, // À genoux !
            76562, // Nous ne capitulerons jamais !
        ],
        wrapper: 'left',
    },
    {
        id: 75,
        skills: [
            76806, // Protocole offensif : oblitération
            77103, // Protocole offensif : déchiquètement
            76927, // Protocole offensif : démolition
            76959, // Protocole défensif : protection
            76798, // Protocole défensif : purification
            77163, // Protocole défensif : épines
            76642, // Évolution
            // 76651, // Évolution
            76738, // État de mitose
            77069, // État solide
            76908, // État liquide
            77018, // État gazeux
            77209, // État plasmatique
            76993, // État de flux
        ],
        wrapper: 'right',
    },
    {
        id: 76,
        skills: [
            77238, // Linceul de ritualiste
            77003, // Rupture d'angoisse
            // 77050, // Rupture d'angoisse
            76732, // Rupture d'errance
            // 76758, // Rupture d'errance
            76647, // Rupture de préservation

            77061, // Explosion d'essence
            76864, // Angoisse
            76961, // Errance
            // 76741, // Errance
            76684, // Préservation
            76607, // Invocation des esprits
            // 77191, // Invocation des esprits

            77259, // Arme résistante
            76975, // Arme à échardes
            77022, // Arme du remède
            76739, // Arme du cauchemar
            76752, // Arme de protection
            76941, // Arme de Xinrae
        ],
        wrapper: 'right',
    },
    {
        id: 77,
        skills: [
            77397, // Escamotage skritt
            76674, // Danseur holographique factice
            76702, // Marteau exalté
            76816, // Bouclier chak
            76633, // Ruée de surfeur forgé
            // 76550, // Ruée de surfeur forgé
            77277, // Mortier de Feu-de-Brume
            // 77288, // Mortier de Feu-de-Brume

            // 76881, // Gorgée d'antivenin : raté
            76886, // Gorgée d'antivenin
            76725, // Canon du Sommet de Pierre
            // 77092, // Canon du Sommet de Pierre (raté)
            76808, // Appareil de portail de l'Enqueste
            // 77361, // Appareil de portail de l'Enqueste : raté
            77230, // Lancer de pièces de Canach
            // 76744, // Lancer de pièces de Canach (raté)
            76879, // Bouclier de jade d'urgence
            // 76784, // Bouclier de jade d'urgence (raté)
            77255, // Rixe skritt

            76966, // Battage
        ],
        wrapper: 'right',
    },
    {
        id: 78,
        skills: [
            76787, // Invocation de l'arc cyclone
            77183, // Tir vif
            76664, // Œil-de-faucon
            77319, // Trombe
            77012, // Zéphyr fuyard
            76807, // Péril de la proie
            // 77334, // Péril de la proie
            76722, // Bombardement
            // 77270, // Bombardement
            77174, // Flèche supersonique

            77271, // Brise apaisante
            77264, // Bourrasques perforantes
            77211, // Cisaillement du vent
            76619, // Tourbillon
            76757, // Mistral
            76979, // Tempête parfaite

            // 77213, // Dissipation de l'arc cyclone
        ],
        wrapper: 'left',
    },
    {
        id: 79,
        skills: [
            76610, // Posture de l'entité légendaire
            76641, // Sagesse cosmique : envoûteur
            77246, // Sagesse cosmique : envoûteur
            76644, // Sagesse cosmique : derviche
            76774, // Sagesse cosmique : derviche
            77251, // Sagesse cosmique : assassin
            77312, // Sagesse cosmique : assassin
            77368, // Canalisation de la forme du guerrier
            77389, // Canalisation de la forme du guerrier
            77371, // Sagesse cosmique : moine
            77043, // Mains protectrices
            77243, // Vortex mangesort
            77291, // Défense du gladiateur
            76917, // Brume confondante
            76805, // Brume confondante
            77141, // Brume confondante
            77159, // Brume confondante
        ],
        wrapper: 'right',
    },
    {
        id: 80,
        skills: [
            76643, // Mise à feu
            // 77345, // Mise à feu
            76585, // Conflagration
            // 77074, // Conflagration
            77225, // Eclaboussure
            76811, // Déluge flottant
            // 76935, // Déluge flottant
            // 77357, // Déluge flottant
            77370, // Atomisation
            77089, // Choc éclair
            77226, // Calcification
            76707, // Impact sismique,

            76634, // Rajeunissement
            76711, // Furie du renard
            // 77282, // Furie du renard
            // 76563, // Compassion de la loutre
            77190, // Compassion de la loutre
            // 76583, // Agilité de la hase
            77038, // Agilité de la hase
            // 77247, // Courage du crapaud
            77320, // Courage du crapaud
            76841, // Procession élémentaire
            // 77096, // Procession élémentaire

            // 76580, // Affinité avec l'air
            // 76703, // Affinité avec le feu
            // 76988, // Affinité avec l'eau
            // 77082, // Affinité avec la terre
        ],
        wrapper: 'left',
    },
    {
        id: 81,
        skills: [
            77073, // Linceul rayonnant
            76621, // Posture déterminée
            77321, // Posture robuste
            77078, // Posture perforante
            76813, // Posture éclatante
            77300, // Posture valeureuse
            77198, // Avancée audacieuse
        ],
        wrapper: 'right',
    },
];

const current = ref();

const currentSpecialization = computed(() => {
    return specializations.value.find((specialization) => specialization.id === current.value);
});

const updateCurrentSpecialization = (specializationId) => {
    if (currentSpecialization.id === specializationId) {
        return;
    }

    current.value = specializationId;
};

const cleanText = (text) => {
    return text
        .replace('</c>', '</span>')
        .replace('<c=@abilitytype>', '<span style="color: #ffee88;">');
};

const skillTypes = [
    {
        id: 'Profession',
        name: 'Profession',
    },
    {
        id: 'Heal',
        name: 'Soin',
    },
    {
        id: 'Utility',
        name: 'Utilitaire',
    },
    {
        id: 'Elite',
        name: 'Élite',
    },
];

const getSkillType = (skillType) => {
    return skillTypes.find((sk) => sk.id === skillType)?.name || `__${skillType}__`;
};

onMounted(() => {
    current.value = specializations.value[0].id;
    // current.value = specializations.value.find((s) => s.id === 80)?.id;
});
</script>

<style lang="scss" scoped>
@use '@/assets/main.scss';
</style>
