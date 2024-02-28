<script>
import { Tippy, TippyDirective } from 'tippy.vue';

export default {
  components: {
    Tippy,
  },
  directives: {
    tippy: TippyDirective,
  },
};
</script>

<script setup>
import { ref } from 'vue';
import i18n from '@/utils/i18n';
import fr from '@/i18n/gw2-api-item-tooltip.json';

const props = defineProps(['item']);
const itemTooltipData = ref(null);

async function getItem(id) {
  try {
    const res = await fetch('https://api.guildwars2.com/v2/items/' + id + '?lang=fr');
    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

function showItemTooltip() {
  itemTooltipData.value = null;
  getItem(props.item.id).then((data) => {
    itemTooltipData.value = data;
  });
}
</script>

<template>
  <div>
    <img
      :src="props.item.icon"
      alt=""
      :class="['border-gw2-rarity-' + props.item.rarity, 'w-16 h-16 border border-2 rounded']"
      v-if="props.item.icon"
      v-tippy
    />
    <tippy @show="showItemTooltip" placement="auto" followCursor="true">
      <div v-if="itemTooltipData">
        <div v-if="itemTooltipData.text">Error: {{ itemTooltipData.text }}</div>
        <div v-else class="flex flex-col gap-2 text-md">
          <div class="flex gap-3 items-center">
            <img :src="itemTooltipData.icon" class="self-start rounded w-12 h-12" alt="" />
            <div class="font-bold text-base" :class="'text-gw2-rarity-' + itemTooltipData.rarity">
              {{ itemTooltipData.name }}
            </div>
          </div>
          <div v-if="itemTooltipData.description">{{ itemTooltipData.description }}</div>
          <div>
            <!-- <div>{{ i18n('Rarity.' + itemTooltipData.rarity, fr) }}</div> -->
            <div>
              {{ i18n('Type.' + itemTooltipData.type, fr) }}
              <span
                v-if="
                  itemTooltipData.details?.type &&
                  ['Default', 'Generic'].indexOf(itemTooltipData.details?.type) < 0
                "
              >
                ({{ i18n('Details.Type.' + itemTooltipData.details?.type, fr) }})
              </span>
            </div>
          </div>

          <div
            v-if="itemTooltipData.flags.length > 0"
            class="flex flex-wrap gap-1 text-xs text-white opacity-60"
          >
            <span v-for="flag in itemTooltipData.flags" :key="flag">
              {{ i18n('Flag.' + flag, fr) }}
            </span>
          </div>
        </div>
      </div>
      <div v-else>Chargement en cours...</div>
    </tippy>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
