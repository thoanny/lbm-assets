<script setup>
import { ref } from 'vue';

const panel = ref('objectives');

function switchPanel(p) {
    console.log(p)
    if (p !== panel.value) {
        panel.value = p;
    }
}

</script>

<template>
    <div class="gw2-wizard-vault">
        <h4>
            <img src="@/assets/img/IconWizardVault.png" />
            Chambre forte du sorcier
        </h4>
        <div class="wizard-vault">
            <div class="menu">
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
                <div class="wizard-vault__panel-title">Objectifs</div>
                <div class="wizard-vault__objectives-toolbar">
                    <div>
                        <label><input type="checkbox">JcE</label>
                        <label><input type="checkbox">JcJ</label>
                        <label><input type="checkbox">McM</label>
                    </div>
                    <div class="flex gap-2 items-center">
                        <label for="apikey">Clé API</label>
                        <input type="text" class="border rounded py-2 px-3 text-gray-900" id="apikey">
                    </div>
                </div>
                <div>
                    <button>Quotidien</button>
                    <button>Hebdomadaire</button>
                    <button>Spécial</button>
                </div>
                <div class="wizard-vault__objectives">
                    <div class="wizard-vault__objective wizard-vault__objective--pve">

                    </div>
                    <div class="wizard-vault__objective wizard-vault__objective--pvp">

                    </div>
                    <div class="wizard-vault__objective wizard-vault__objective--wvw">

                    </div>
                </div>
            </div>
            <div id="wizard-vault__rewards" v-if="panel == 'rewards'">
                <div class="wizard-vault__panel-title">Récompenses astrales</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.gw2-wizard-vault {
    @apply w-full bg-gray-900 text-gray-50 rounded-xl;

    h4 {
        @apply text-3xl flex items-center font-bold;

        img {
            @apply w-20 h-20;
        }
    }

    .wizard-vault {
        @apply flex gap-4 w-full p-4 pt-0;

        &__panel-title {
            @apply text-2xl font-semibold;
        }

        &__objectives-panel {
            @apply flex-1;
        }

        &__objectives-toolbar {
            @apply flex justify-between gap-4 items-center;


        }

        &__objectives {
            @apply flex flex-col gap-1;
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
    }

    .menu {
        @apply flex flex-col gap-2 w-12;

        button {
            @apply bg-gray-600 rounded py-2 block aspect-square flex items-center justify-center opacity-50;

            &.active {
                @apply opacity-100 ring-offset-2 ring-2 ring-gray-600 ring-offset-gray-900;
            }

            &[disabled] {
                @apply opacity-10;
            }
        }

        img {
            @apply grayscale;
        }
    }
}
</style>