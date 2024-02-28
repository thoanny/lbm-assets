<script setup>
import { ref, watch, onMounted } from 'vue';

import MarkdownIt from 'markdown-it';
const markdown = new MarkdownIt();

const GW2_API = 'https://api.guildwars2.com/v2';
const LBM_API = 'https://api.lebusmagique.fr/api';

const apiKey = ref('');
const panel = ref('objectives');
const tab = ref('daily');
const objectives = ref({ daily: null, weekly: null, special: null });
const rewards = ref([]);
const accountRewards = ref([]);
const lbmApiObjectives = ref([]);
const isLoading = ref(true);

const itemsIds = ref([]);
const itemsData = ref([]);

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

const getWizardsVaultListing = async () => {
  const res = await fetch(`${GW2_API}/wizardsvault/listings?ids=all`);
  return await res.json();
};

const getItemsData = async () => {
  const ids = itemsIds.value.join(',');
  const res = await fetch(`${GW2_API}/items?ids=${ids}`);
  return await res.json();
};

const initUserSettings = () => {
  const localApiKey = localStorage.getItem('gw2-wizard-vault-api-key');
  if (localApiKey) {
    apiKey.value = localApiKey;
  } else {
    loadWizardsVault();
  }
};

const getAccountDaily = async () => {
  const res = await fetch(`${GW2_API}/account/wizardsvault/daily?access_token=${apiKey.value}`);
  objectives.value.daily = await res.json();
};

const getAccountWeekly = async () => {
  const res = await fetch(`${GW2_API}/account/wizardsvault/weekly?access_token=${apiKey.value}`);
  objectives.value.weekly = await res.json();
};

const getAccountSpecial = async () => {
  const res = await fetch(`${GW2_API}/account/wizardsvault/special?access_token=${apiKey.value}`);
  objectives.value.special = await res.json();
};

const getAccountRewards = async () => {
  const res = await fetch(`${GW2_API}/account/wizardsvault/listings?access_token=${apiKey.value}`);
  return await res.json();
};

const getLbmApiObjectives = async (ids) => {
  const res = await fetch(`${LBM_API}/gw2/wizard-vault/objectives`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });
  isLoading.value = false;
  return await res.json();
};

const loadWizardsVault = async () => {
  isLoading.value = true;
  getWizardsVaultListing()
    .then((data) => {
      data.forEach((d) => {
        if (itemsIds.value.indexOf(d.item_id) < 0) {
          itemsIds.value.push(d.item_id);
        }
      });
      rewards.value = data;
    })
    .then(() => {
      getItemsData().then((data) => {
        itemsData.value = data;
      });
    });

  if (apiKey.value) {
    accountRewards.value = await getAccountRewards();

    Promise.all([getAccountDaily(), getAccountWeekly(), getAccountSpecial()]).then(async () => {
      const objectivesIds = [
        ...objectives.value.daily.objectives.map((objective) => objective.id),
        ...objectives.value.weekly.objectives.map((objective) => objective.id),
        ...objectives.value.special.objectives.map((objective) => objective.id),
      ];

      lbmApiObjectives.value = await getLbmApiObjectives(objectivesIds);
    });
  } else {
    accountRewards.value = [];
    objectives.value = { daily: null, weekly: null, special: null };
    isLoading.value = false;
  }
};

const getItemById = (item_id) => {
  return itemsData.value.find((item) => item.id === item_id);
};

const getItemNameById = (item_id) => {
  return itemsData.value.find((item) => item.id === item_id).name;
};

const currentRewards = () => {
  return rewards.value.filter((reward) => reward.type === 'Featured' || reward.type === 'Normal');
};

const legacyRewards = () => {
  return rewards.value.filter((reward) => reward.type === 'Legacy');
};

const getAccountRewardLimit = (reward_id) => {
  if (!accountRewards) {
    return;
  }

  const reward = accountRewards.value.find((r) => r.id === reward_id);

  if (!reward) return;
  if (!reward.purchase_limit) return 'illimité';
  if (reward.purchased === reward.purchase_limit) return 'Épuisé';

  return `${reward.purchased}/${reward.purchase_limit} acheté${
    reward.purchase_limit > 1 ? 's' : ''
  }`;
};

const getObjectiveTitle = (obj) => {
  const LbmObjective = lbmApiObjectives.value.find((objective) => objective.uid === obj.id);
  if (LbmObjective) {
    return LbmObjective.title;
  }

  return `[${obj.id}] ${obj.title}`;
};

const getObjectiveTip = (id) => {
  const LbmObjective = lbmApiObjectives.value.find((objective) => objective.uid === id);
  if (!LbmObjective) return;
  return markdown.render(LbmObjective.tip);
};

watch(apiKey, async () => {
  localStorage.setItem('gw2-wizard-vault-api-key', apiKey.value);
  loadWizardsVault();
});

onMounted(() => {
  initUserSettings();
});

function formatGold(total) {
  const copper = Math.floor(total % 100);
  const silver = Math.floor((total % 10000) / 100);
  const gold = Math.floor(total / 10000);
  let currency;

  if (gold) {
    currency =
      '<span class="lbm-currency"><span class="gold">' +
      gold +
      '</span><span class="silver">' +
      silver.toString().padStart(2, '0') +
      '</span><span class="copper">' +
      copper.toString().padStart(2, '0') +
      '</span></span>';
  } else if (silver) {
    currency =
      '<span class="lbm-currency"><span class="silver">' +
      silver +
      '</span><span class="copper">' +
      copper.toString().padStart(2, '0') +
      '</span></span>';
  } else {
    currency =
      '<span class="lbm-currency"><span class="copper">' + Math.floor(total) + '</span></span>';
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
      <span class="block text-base mt-2 ml-2" v-if="panel === 'rewards'"
        >&ndash; Récompenses astrales</span
      >
      <span class="block text-base mt-2 ml-2" v-if="panel === 'legacy'"
        >&ndash; Récompenses d'héritage</span
      >
    </h4>
    <div class="p-4 pt-0">
      <input
        type="password"
        v-model="apiKey"
        class="lbm-input lbm-inpu-bordered w-full"
        placeholder="Clé API Guild Wars 2"
      />
    </div>
    <div v-if="isLoading" class="px-4 flex gap-2">
      <span class="lbm-loading lbm-loading-spinner"></span>
      Chargement en cours...
    </div>
    <div class="wizard-vault flex-col md:flex-row" v-else>
      <div class="wizard-vault__menu flex-row md:flex-col">
        <button
          @click="switchPanel('objectives')"
          :class="{
            'lbm-btn-primary': panel === 'objectives',
            'lbm-btn-neutral': panel !== 'objectives',
          }"
          class="lbm-btn lbm-btn-square"
        >
          <img src="@/assets/img/IconWizardVaultObjectives.png" alt="Objectifs" title="Objectifs" />
        </button>
        <button
          @click="switchPanel('rewards')"
          :class="{ 'lbm-btn-primary': panel == 'rewards', 'lbm-btn-neutral': panel !== 'rewards' }"
          class="lbm-btn lbm-btn-square"
        >
          <img
            src="@/assets/img/IconWizardVaultRewards.png"
            alt="Récompenses astrales"
            title="Récompenses astrales"
          />
        </button>
        <button
          @click="switchPanel('legacy')"
          :class="{ 'lbm-btn-primary': panel == 'legacy', 'lbm-btn-neutral': panel !== 'legacy' }"
          class="lbm-btn lbm-btn-square"
        >
          <img
            src="@/assets/img/IconWizardVaultLegacyRewards.png"
            alt="Récompenses d'héritage"
            title="Récompenses d'héritage"
          />
        </button>
      </div>
      <div class="wizard-vault__objectives-panel" v-if="panel == 'objectives'">
        <div class="wizard-vault__tabs flex-col sm:flex-row">
          <button
            @click="switchTab('daily')"
            class="lbm-btn"
            :class="{ 'lbm-btn-primary': tab === 'daily', 'lbm-btn-neutral': tab !== 'daily' }"
          >
            Quotidien
          </button>
          <button
            @click="switchTab('weekly')"
            class="lbm-btn"
            :class="{ 'lbm-btn-primary': tab === 'weekly', 'lbm-btn-neutral': tab !== 'weekly' }"
          >
            Hebdomadaire
          </button>
          <button
            @click="switchTab('special')"
            class="lbm-btn"
            :class="{ 'lbm-btn-primary': tab === 'special', 'lbm-btn-neutral': tab !== 'special' }"
          >
            Spécial
          </button>
        </div>
        <div class="wizard-vault__objectives" v-if="objectives[tab]">
          <progress
            class="lbm-progress lbm-progress-primary w-full"
            :value="objectives[tab].meta_progress_current"
            :max="objectives[tab].meta_progress_complete"
            v-if="objectives[tab].meta_progress_complete"
          ></progress>
          <div
            class="wizard-vault__objective flex gap-4 items-center relative"
            v-for="obj in objectives[tab].objectives"
            :key="obj.title"
            :class="[`wizard-vault__objective--${obj.track}`, obj.claimed ? 'opacity-25' : '']"
          >
            <div class="w-full">
              <div class="lbm-badge lbm-badge-sm absolute -top-2 left-2">{{ obj.track }}</div>
              <div class="font-bold text-white">
                <span v-text="getObjectiveTitle(obj)"></span>&nbsp;
                <small class="opacity-75 font-semibold"
                  >({{ obj.progress_current }}/{{ obj.progress_complete }})</small
                >
              </div>
              <div
                class="wizard-vault__objective__tip text-sm"
                v-html="getObjectiveTip(obj.id)"
                v-if="!obj.claimed"
              ></div>
            </div>
            <div class="text-lg font-bold w-20 shrink-0 self-start">
              <span class="flex gap-1 items-center justify-end">
                {{ obj.acclaim }}
                <img
                  src="@/assets/img/CurrencyAstralAcclaim.png"
                  class="inline w-6 h-6"
                  alt="Acclamation astrale"
                />
              </span>
            </div>
          </div>
        </div>
        <div v-else>
          Une clé API Guild Wars 2 est requise pour afficher la rubrique des objectifs quotidiens,
          hebdomadaires et spéciaux...
        </div>
      </div>
      <div id="wizard-vault__rewards-panel" class="w-full" v-if="panel == 'rewards'">
        <!-- [ ] Recalculer le max, sachant que la limite ne peut être calculé que si clé API -->
        <!-- <div class="mb-4">
          Vous avez besoin de
          <strong
            >{{ new Intl.NumberFormat('fr-FR').format(currentVaultTotal) }}
            <img src="@/assets/img/CurrencyAstralAcclaim.png" class="inline w-6 h-6" /> acclamations
            astrales</strong
          >
          pour acheter toutes les récompenses limitées.
        </div> -->
        <!-- Rewards -->
        <div
          class="wizard-vault__rewards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
          v-if="rewards"
        >
          <div v-for="(reward, r) in currentRewards()" class="wizard-vault__reward" :key="r">
            <gw2-api-item-tooltip :item="getItemById(reward.item_id)"></gw2-api-item-tooltip>
            <div class="wizard-vault__reward__price text-white">
              {{ reward.cost }}
              <img src="@/assets/img/CurrencyAstralAcclaim.png" />
            </div>
            <div
              v-if="reward.value && reward.price"
              v-html="formatGold(reward.value / reward.price)"
            ></div>
            <div
              class="wizard-vault__reward__name text-white"
              v-html="getItemNameById(reward.item_id)"
            ></div>
            <div
              class="wizard-vault__reward__limit"
              v-text="getAccountRewardLimit(reward.id)"
            ></div>
          </div>
        </div>
        <div v-else>Chargement en cours...</div>
      </div>
      <!-- Legacy Rewards -->
      <div id="wizard-vault__legacy-panel" class="w-full" v-if="panel == 'legacy'">
        <div
          class="wizard-vault__rewards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
          v-if="legacyRewards"
        >
          <div v-for="(reward, r) in legacyRewards()" class="wizard-vault__reward" :key="r">
            <gw2-api-item-tooltip :item="getItemById(reward.item_id)"></gw2-api-item-tooltip>
            <div class="wizard-vault__reward__price text-white">
              {{ reward.cost }}
              <img src="@/assets/img/CurrencyAstralAcclaim.png" />
            </div>
            <div
              class="wizard-vault__reward__name text-white"
              v-html="getItemNameById(reward.item_id)"
            ></div>
            <div
              class="wizard-vault__reward__limit"
              v-text="getAccountRewardLimit(reward.id)"
            ></div>
          </div>
        </div>
        <div v-else>Chargement en cours...</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../assets/main.scss';

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
        width: 0.66rem;
        height: 0.66rem;
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
      background: #d3824c;
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

      &--PvE {
        @apply border-neutral;

        .lbm-badge {
          @apply text-white text-neutral uppercase bg-gw2-wizard-vault-objective-pve border-gw2-wizard-vault-objective-pve;
        }
      }

      &--PvP {
        @apply border-neutral;

        .lbm-badge {
          @apply text-white text-white uppercase bg-gw2-wizard-vault-objective-pvp border-gw2-wizard-vault-objective-pvp;
        }
      }

      &--WvW {
        @apply border-neutral;

        .lbm-badge {
          @apply text-white text-neutral uppercase bg-gw2-wizard-vault-objective-wvw border-gw2-wizard-vault-objective-wvw;
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
