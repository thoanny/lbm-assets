<script>
import { Tippy, TippyDirective } from 'tippy.vue'
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

const panel = ref('rewards');
const tab = ref('daily');
const rewards = ref(null);
const itemTooltipData = ref(null);
const currentVaultTotal = ref(0);

const user = ref({
    'content': {
        'pve': true,
        'pvp': true,
        'wvw': true
    },
    'extensions': {
        'hot': false,
        'pof': false,
        'eod': false,
        'soto': false,
    }
})

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

</script>

<template>
    <div class="gw2-wizard-vault w-full bg-black bg-opacity-50 p-4 rounded-lg text-neutral-content">
        <h4 class="flex-col md:flex-row mb-6 md:mb-0 text-center md:text-left">
            <img src="@/assets/img/IconWizardVault.png" />
            <span class="text-white">Chambre forte du&nbsp;sorcier</span>
            <span class="block text-base mt-2 ml-2" v-if="panel === 'objectives'">&ndash; Objectifs</span>
            <span class="block text-base mt-2 ml-2" v-if="panel === 'rewards'">&ndash; Récompenses astrales</span>
        </h4>
        <div class="wizard-vault flex-col md:flex-row">
            <div class="wizard-vault__menu flex-row md:flex-col">
                <button @click="switchPanel('objectives')" :class="{ 'active': panel == 'objectives' }">
                    <img src="@/assets/img/IconWizardVaultObjectives.png" alt="Objectifs" title="Objectifs" />
                </button>
                <button @click="switchPanel('rewards')" :class="{ 'active': panel == 'rewards' }">
                    <img src="@/assets/img/IconWizardVaultRewards.png" alt="Récompenses astrales"
                        title="Récompenses astrales" />
                </button>
                <button @click="switchPanel('rewards')" disabled>
                    <img src="@/assets/img/IconWizardVaultLegacyRewards.png" alt="Récompenses d'héritage"
                        title="Récompenses d'héritage" />
                </button>
            </div>
            <div class="wizard-vault__objectives-panel" v-if="panel == 'objectives'">
                <div class="wizard-vault__objectives-toolbar" v-if="false">
                    <div class="flex gap-2 items-center">
                        <span class="font-semibold">Préférences&nbsp;:</span>
                        <input type="checkbox" id="user_content_pve" v-model="user.content.pve">
                        <label for="user_content_pve">JcE</label>
                        <input type="checkbox" id="user_content_pvp" v-model="user.content.pvp">
                        <label for="user_content_pvp">JcJ</label>
                        <input type="checkbox" id="user_content_wvw" v-model="user.content.wvw">
                        <label for="user_content_wvw">McM</label>
                    </div>
                    <div class="flex gap-2 items-center">
                        <span class="font-semibold">Extensions&nbsp;:</span>
                        <input type="checkbox" id="user_extension_hot" v-model="user.extensions.hot">
                        <label for="user_extension_hot">HoT</label>
                        <input type="checkbox" id="user_extension_pof" v-model="user.extensions.pof">
                        <label for="user_extension_pof">PoF</label>
                        <input type="checkbox" id="user_extension_eod" v-model="user.extensions.eod">
                        <label for="user_extension_eod">EoD</label>
                        <input type="checkbox" id="user_extension_soto" v-model="user.extensions.soto">
                        <label for="user_extension_soto">SotO</label>
                    </div>
                </div>
                <div class="wizard-vault__tabs" v-if="false">
                    <button @click="switchTab('daily')" :class="{ 'active': tab == 'daily' }">Quotidien</button>
                    <button @click="switchTab('weekly')" :class="{ 'active': tab == 'weekly' }">Hebdomadaire</button>
                    <button @click="switchTab('special')" :class="{ 'active': tab == 'special' }">Spécial</button>
                </div>
                <div class="wizard-vault__objectives" v-if="false">
                    <div class="wizard-vault__objective wizard-vault__objective--pve">
                    </div>
                    <div class="wizard-vault__objective wizard-vault__objective--pvp">
                    </div>
                    <div class="wizard-vault__objective wizard-vault__objective--wvw">
                    </div>
                </div>
                <div v-else>Prochainement disponible...</div>
            </div>
            <div id="wizard-vault__rewards-panel" class="w-full" v-if="panel == 'rewards'">
                <div class="mb-4">
                    Vous avez besoin de <strong>{{ new Intl.NumberFormat('fr-FR').format(currentVaultTotal) }} <img
                            src="@/assets/img/CurrencyAstralAcclaim.png" class="inline w-6 h-6" /> acclamations
                        astrales</strong> pour
                    acheter toutes les récompenses limitées.
                </div>
                <div class="wizard-vault__rewards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
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
// GW2 Colors
$gw2-rarity-colors: "Junk", "Basic", "Fine", "Masterwork", "Rare", "Exotic", "Ascended", "Legendary";

@each $color in $gw2-rarity-colors {
    .text-gw2-rarity-#{$color} {
        color: var(--gw2-rarity-#{$color}) !important;
    }

    .bg-gw2-rarity-#{$color} {
        background-color: var(--gw2-rarity-#{$color}) !important;
    }

    .border-gw2-rarity-#{$color} {
        border-color: var(--gw2-rarity-#{$color}) !important;
    }
}

input[type="checkbox"] {
    @apply hidden;
}

input[type="checkbox"]+label {
    @apply inline-flex gap-1 items-center cursor-pointer;
}

input[type="checkbox"]+label:before {
    @apply w-5 h-5 block bg-center bg-no-repeat;
    content: '';
    background-image: url('@/assets/img/CheckboxUnchecked.png');
}

input[type="checkbox"]:checked+label:before {
    background-image: url('@/assets/img/CheckboxChecked.png');
}

button {
    @apply bg-gray-600 rounded py-2 px-3 inline-flex items-center justify-center opacity-50;

    &.active {
        @apply opacity-100 ring-offset-2 ring-2 ring-gray-600 ring-offset-gray-900;
    }

    &[disabled] {
        @apply opacity-10;
    }
}

.gw2-wizard-vault {

    h4 {
        @apply text-3xl flex items-center font-bold;

        img {
            @apply w-20 h-20;
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
        &__rewards-panel {
            @apply flex-1 w-full;
        }

        &__objectives-toolbar {
            @apply flex gap-6 items-center justify-between border border-gray-800 py-2 px-3 rounded-lg mb-4;
        }

        &__objectives {
            @apply flex flex-col gap-2;
        }

        &__objective {
            @apply w-full bg-no-repeat bg-left bg-black;
            height: 92px;

            &--pve {
                background-image: url('@/assets/img/BackgroundWizardVaultPve.png');
            }

            &--pvp {
                background-image: url('@/assets/img/BackgroundWizardVaultPvp.png');
            }

            &--wvw {
                background-image: url('@/assets/img/BackgroundWizardVaultWvw.png');
            }
        }

        &__reward {
            @apply border border-gray-800 p-4 rounded-lg flex flex-col items-center justify-start text-center gap-2;

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

            button {
                @apply px-0 aspect-square flex-shrink-0 w-12;
            }

            img {
                @apply grayscale;
            }
        }
    }


}
</style>