<script>
import { Tippy, TippyDirective } from 'tippy.vue';

export default {
    components: {
        Tippy
    },
    directives: {
        tippy: TippyDirective
    }
}
</script>

<script setup>
import { ref } from 'vue';
import GW2WizardVaultRewards from '@/data/gw2-wizard-vault-rewards.json';

import MarkdownIt from "markdown-it";
const markdown = new MarkdownIt();

const panel = ref('objectives');
const tab = ref('daily');
const objectives = ref({ 'daily': [], 'weekly': [], 'special': [] });
const rewards = ref(null);
const legacyRewards = ref(null);
const itemTooltipData = ref(null);
const currentVaultTotal = ref(0);

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

async function getObjectives() {
    try {
        const res = await fetch('https://api.lebusmagique.fr/api/gw2/wizard-vault/objectives');
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}

getObjectives().then(data => {
    data.forEach(o => {
        objectives.value[o.period].push(o);
    });
});

async function getItem(id) {
    try {
        const res = await fetch('https://api.guildwars2.com/v2/items/' + id + '?lang=fr');
        return await res.json();
    } catch (error) {
        console.error(error);
    }
}

function showItemToolip(id) {
    itemTooltipData.value = null;
    getItem(id).then(data => {
        itemTooltipData.value = data;
    });
}

async function getApiItems() {
    const ids = GW2WizardVaultRewards.current.map((r) => r.item_id).join(',');
    try {
        const res = await fetch('https://api.guildwars2.com/v2/items?ids=' + ids);
        const items = await res.json();
        return items;
    } catch (error) {
        console.error(error);
    }
}

getApiItems().then(items => {
    GW2WizardVaultRewards.current.forEach((r, ri) => {
        const index = items.findIndex((i) => r.item_id == i.id);
        if (index >= 0) {
            GW2WizardVaultRewards.current[ri].icon = items[index].icon;
            GW2WizardVaultRewards.current[ri].rarity = items[index].rarity;
        }
        if (r.limit > 0) {
            currentVaultTotal.value += r.limit * r.price;
        }
    });
    rewards.value = GW2WizardVaultRewards.current;
});

async function getApiItemsLegacy() {
    const ids = GW2WizardVaultRewards.legacy.map((r) => r.item_id).join(',');
    try {
        const res = await fetch('https://api.guildwars2.com/v2/items?ids=' + ids);
        const items = await res.json();
        return items;
    } catch (error) {
        console.error(error);
    }
}

getApiItemsLegacy().then(items => {
    GW2WizardVaultRewards.legacy.forEach((r, ri) => {
        const index = items.findIndex((i) => r.item_id == i.id);
        if (index >= 0) {
            GW2WizardVaultRewards.legacy[ri].icon = items[index].icon;
            GW2WizardVaultRewards.legacy[ri].rarity = items[index].rarity;
        }
        if (r.limit > 0) {
            currentVaultTotal.value += r.limit * r.price;
        }
    });
    legacyRewards.value = GW2WizardVaultRewards.legacy;
});

function markdownToHtml(md) {
    return markdown.render(md);
}

function formatGold(total) {
    const copper = Math.floor(total % 100);
    const silver = Math.floor((total % 10000) / 100);
    const gold = Math.floor(total / 10000);
    let currency;

    if (gold) {
        currency = "<span class=\"lbm-currency\"><span class=\"gold\">" + gold + "</span><span class=\"silver\">" + silver.toString().padStart(2, '0') + "</span><span class=\"copper\">" + copper.toString().padStart(2, '0') + "</span></span>";
    } else if (silver) {
        currency = "<span class=\"lbm-currency\"><span class=\"silver\">" + silver + "</span><span class=\"copper\">" + copper.toString().padStart(2, '0') + "</span></span>";
    } else {
        currency = "<span class=\"lbm-currency\"><span class=\"copper\">" + Math.floor(total) + "</span></span>";
    }

    return currency;
}

</script>

<template>
    <div class="gw2-wizard-vault w-full bg-black bg-opacity-50 p-4 rounded-lg text-neutral-content">
        <h4 class="flex-col md:flex-row mb-6 md:mb-0 text-center md:text-left">
            <img src="@/assets/img/IconWizardVault.png" />
            <span class="text-white">Chambre forte du&nbsp;sorcier</span>
            <span class="block text-base mt-2 ml-2" v-if="panel === 'objectives'">&ndash; Objectifs</span>
            <span class="block text-base mt-2 ml-2" v-if="panel === 'rewards'">&ndash; Récompenses astrales</span>
            <span class="block text-base mt-2 ml-2" v-if="panel === 'legacy'">&ndash; Récompenses d'héritage</span>
        </h4>
        <div class="wizard-vault flex-col md:flex-row">
            <div class="wizard-vault__menu flex-row md:flex-col">
                <button @click="switchPanel('objectives')"
                    :class="{ 'lbm-btn-primary': panel === 'objectives', 'lbm-btn-neutral': panel !== 'objectives' }"
                    class="lbm-btn lbm-btn-square">
                    <img src="@/assets/img/IconWizardVaultObjectives.png" alt="Objectifs" title="Objectifs" />
                </button>
                <button @click="switchPanel('rewards')"
                    :class="{ 'lbm-btn-primary': panel == 'rewards', 'lbm-btn-neutral': panel !== 'rewards' }"
                    class="lbm-btn lbm-btn-square">
                    <img src="@/assets/img/IconWizardVaultRewards.png" alt="Récompenses astrales"
                        title="Récompenses astrales" />
                </button>
                <button @click="switchPanel('legacy')"
                    :class="{ 'lbm-btn-primary': panel == 'legacy', 'lbm-btn-neutral': panel !== 'legacy' }"
                    class="lbm-btn lbm-btn-square">
                    <img src="@/assets/img/IconWizardVaultLegacyRewards.png" alt="Récompenses d'héritage"
                        title="Récompenses d'héritage" />
                </button>
            </div>
            <div class="wizard-vault__objectives-panel" v-if="panel == 'objectives'">
                <div class="wizard-vault__tabs flex-col sm:flex-row">
                    <button @click="switchTab('daily')" class="lbm-btn"
                        :class="{ 'lbm-btn-primary': tab === 'daily', 'lbm-btn-neutral': tab !== 'daily' }">Quotidien</button>
                    <button @click="switchTab('weekly')" class="lbm-btn"
                        :class="{ 'lbm-btn-primary': tab === 'weekly', 'lbm-btn-neutral': tab !== 'weekly' }">Hebdomadaire</button>
                    <button @click="switchTab('special')" class="lbm-btn"
                        :class="{ 'lbm-btn-primary': tab === 'special', 'lbm-btn-neutral': tab !== 'special' }">Spécial</button>
                </div>
                <div class="wizard-vault__objectives" v-if="objectives[tab].length > 0">
                    <div class="wizard-vault__objective flex gap-4 items-center relative" v-for="obj in objectives[tab]"
                        :key="obj.title" :class="'wizard-vault__objective--' + obj.type">
                        <div class="w-full">
                            <div class="lbm-badge lbm-badge-sm absolute -top-2 left-2">{{ obj.type }}</div>
                            <div class="font-bold text-white">{{ obj.title }}</div>
                            <div class="wizard-vault__objective__tip" v-html="markdownToHtml(obj.tip)"></div>
                        </div>
                        <div class="text-lg font-bold w-20 shrink-0 flex gap-2 items-center justify-end">
                            {{ obj.astralAcclaim }}
                            <img src="@/assets/img/CurrencyAstralAcclaim.png" class="inline w-6 h-6"
                                alt="Acclamation astrale" />
                        </div>
                    </div>
                </div>
                <div v-else>Aucun objectif dans cette catégorie pour le moment...</div>
            </div>
            <div id="wizard-vault__rewards-panel" class="w-full" v-if="panel == 'rewards'">
                <div class="mb-4">
                    Vous avez besoin de <strong>{{ new Intl.NumberFormat('fr-FR').format(currentVaultTotal) }} <img
                            src="@/assets/img/CurrencyAstralAcclaim.png" class="inline w-6 h-6" /> acclamations
                        astrales</strong> pour
                    acheter toutes les récompenses limitées.
                </div>
                <div class="wizard-vault__rewards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                    v-if="rewards">
                    <div v-for="reward, r in rewards" class="wizard-vault__reward" :key="r">
                        <img :src="reward.icon" alt="" class="wizard-vault__reward__icon"
                            :class="'border-gw2-rarity-' + reward.rarity" v-if="reward.icon" v-tippy>
                        <tippy @show="showItemToolip(reward.item_id)" placement="auto" followCursor="true">
                            <div v-if="itemTooltipData">
                                <div v-if="itemTooltipData.text">Error: {{ itemTooltipData.text }}</div>
                                <div v-else class="flex flex-col gap-2 text-md">
                                    <div class="flex gap-3 items-center">
                                        <img :src="itemTooltipData.icon" class="self-start rounded w-12 h-12" alt="">
                                        <div class="font-bold text-base">{{ itemTooltipData.name }}</div>
                                    </div>
                                    <div>
                                        <div>{{ itemTooltipData.rarity }}</div>
                                        <div>
                                            {{ itemTooltipData.type }}
                                            <span v-if="itemTooltipData.details?.type">
                                                ({{ itemTooltipData.details?.type }})
                                            </span>
                                        </div>
                                    </div>
                                    <div v-if="itemTooltipData.description">{{ itemTooltipData.description }}</div>
                                    <div v-if="itemTooltipData.flags.length > 0"
                                        class="flex flex-wrap gap-1 text-xs text-white opacity-60">
                                        <span v-for="flag in itemTooltipData.flags" :key="flag">
                                            {{ flag }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div v-else>Chargement en cours...</div>
                        </tippy>
                        <div class="wizard-vault__reward__price text-white">
                            {{ reward.price }}
                            <img src="@/assets/img/CurrencyAstralAcclaim.png" />
                        </div>
                        <div v-if="reward.value && reward.price" v-html="formatGold(reward.value / reward.price)"></div>
                        <div class="wizard-vault__reward__name text-white" v-html="reward.name"></div>
                        <div class="wizard-vault__reward__limit" v-if="reward.limit">
                            {{ reward.limit }} {{ (reward.limit) > 1 ? 'disponibles' : 'disponible' }}
                        </div>
                    </div>
                </div>
                <div v-else>Chargement en cours...</div>
            </div>
            <div id="wizard-vault__legacy-panel" class="w-full" v-if="panel == 'legacy'">
                <div class="wizard-vault__rewards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                    v-if="legacyRewards">
                    <div v-for="reward, r in legacyRewards" class="wizard-vault__reward" :key="r">
                        <img :src="reward.icon" alt="" class="wizard-vault__reward__icon"
                            :class="'border-gw2-rarity-' + reward.rarity" v-if="reward.icon" v-tippy>
                        <tippy @show="showItemToolip(reward.item_id)" placement="auto" followCursor="true">
                            <div v-if="itemTooltipData">
                                <div v-if="itemTooltipData.text">Error: {{ itemTooltipData.text }}</div>
                                <div v-else class="flex flex-col gap-2 text-md">
                                    <div class="flex gap-3 items-center">
                                        <img :src="itemTooltipData.icon" class="self-start rounded w-12 h-12" alt="">
                                        <div class="font-bold text-base">{{ itemTooltipData.name }}</div>
                                    </div>
                                    <div>
                                        <div>{{ itemTooltipData.rarity }}</div>
                                        <div>
                                            {{ itemTooltipData.type }}
                                            <span v-if="itemTooltipData.details?.type">
                                                ({{ itemTooltipData.details?.type }})
                                            </span>
                                        </div>
                                    </div>
                                    <div v-if="itemTooltipData.description">{{ itemTooltipData.description }}</div>
                                    <div v-if="itemTooltipData.flags.length > 0"
                                        class="flex flex-wrap gap-1 text-xs text-white opacity-60">
                                        <span v-for="flag in itemTooltipData.flags" :key="flag">
                                            {{ flag }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div v-else>Chargement en cours...</div>
                        </tippy>
                        <div class="wizard-vault__reward__price text-white">
                            {{ reward.price }}
                            <img src="@/assets/img/CurrencyAstralAcclaim.png" />
                        </div>
                        <div class="wizard-vault__reward__name text-white" v-html="reward.name"></div>
                        <div class="wizard-vault__reward__limit" v-if="reward.limit">
                            {{ reward.limit }} {{ (reward.limit) > 1 ? 'disponibles' : 'disponible' }}
                        </div>
                    </div>
                </div>
                <div v-else>Chargement en cours...</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../../assets/main.scss';

// input[type="checkbox"] {
//     @apply hidden;
// }

// input[type="checkbox"]+label {
//     @apply inline-flex gap-1 items-center cursor-pointer;
// }

// input[type="checkbox"]+label:before {
//     @apply w-5 h-5 block bg-center bg-no-repeat;
//     content: '';
//     background-image: url('@/assets/img/CheckboxUnchecked.png');
// }

// input[type="checkbox"]:checked+label:before {
//     background-image: url('@/assets/img/CheckboxChecked.png');
// }

.gw2-wizard-vault {

    h4 {
        @apply text-3xl flex items-center font-bold;

        img {
            @apply w-20 h-20;
        }
    }

    :deep(.lbm-currency) {
        @apply flex gap-1 items-center text-sm -mt-2;

        .gold,
        .silver,
        .copper {
            @apply flex gap-1 items-center;

            &:after {
                content: '';
                display: block;
                width: .66rem;
                height: .66rem;
                border-radius: 1rem;
            }
        }

        .gold:after {
            background: gold;
        }

        .silver:after {
            background: silver;
        }

        .copper:after {
            background: #D3824C;
        }
    }

    .wizard-vault {
        @apply flex gap-4 w-full p-4 pt-0;

        &__panel-title {
            @apply text-2xl font-semibold mb-4;
        }

        &__tabs {
            @apply flex gap-2 mb-4;
        }

        &__objectives-panel,
        &__rewards-panel,
        &__legacy-panel {
            @apply flex-1 w-full;
        }

        &__objectives-toolbar {
            @apply flex gap-6 items-center justify-between border border-gray-800 py-2 px-3 rounded-lg mb-4;
        }

        &__objectives {
            @apply flex flex-col gap-4;
        }

        &__objective {
            @apply w-full bg-no-repeat bg-left bg-black py-3 px-4 border-2 rounded-xl;

            &--pve {
                border-color: var(--gw2-wizard-vault-objective-pve) !important;

                .lbm-badge {
                    @apply text-white text-neutral uppercase;
                    background: var(--gw2-wizard-vault-objective-pve);
                    border-color: var(--gw2-wizard-vault-objective-pve);
                }
            }

            &--pvp {
                border-color: var(--gw2-wizard-vault-objective-pvp) !important;

                .lbm-badge {
                    @apply text-white text-white uppercase;
                    background: var(--gw2-wizard-vault-objective-pvp);
                    border-color: var(--gw2-wizard-vault-objective-pvp);
                }
            }

            &--wvw {
                border-color: var(--gw2-wizard-vault-objective-wvw) !important;

                .lbm-badge {
                    @apply text-white text-neutral uppercase;
                    background: var(--gw2-wizard-vault-objective-wvw);
                    border-color: var(--gw2-wizard-vault-objective-wvw);
                }
            }

            &__tip {
                :deep(p) {
                    padding: 0;
                    margin: 0;
                }
            }
        }

        &__reward {
            @apply border border-neutral p-4 rounded-lg flex flex-col items-center justify-start text-center gap-2;

            &__icon {
                @apply w-16 h-16 rounded;
                border: 3px solid transparent;
            }

            &__name {
                @apply font-semibold leading-5;
            }

            &__limit {
                @apply text-sm;
            }

            &__price {
                @apply flex gap-1 items-center font-bold text-lg;

                img {
                    @apply w-6 h-6;
                }
            }
        }


        &__menu {
            @apply flex gap-2;

            img {
                @apply grayscale;
            }
        }
    }


}
</style>