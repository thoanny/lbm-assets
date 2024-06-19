<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useGw2CharactersExploration } from '@/stores/gw2-characters-exploration.js';
import exploration from '@/data/gw2-characters-exploration.json';

const Gw2CharactersExploration = useGw2CharactersExploration();
const { progression, characters } = storeToRefs(Gw2CharactersExploration);

const editProgression = ref(null);

const handleEditProgression = (character) => {
  if (editProgression.value === character) {
    editProgression.value = null;
  } else {
    editProgression.value = character;
  }
};

const getCharacterMapsProgression = (character, maps) => {
  let total = 0;
  maps.forEach((m) => {
    total += progression.value[character][m];
  });

  return Math.floor(total / maps.length);
};

const getMapProgression = (map) => {
  let total = 0;

  for (const [character, maps] of Object.entries(progression.value)) {
    total += maps[map];
  }

  return Math.floor(total / Object.entries(progression.value).length);
};

const handleDeleteCharacter = (name) => {
  Gw2CharactersExploration.onDeleteCharacter(name);
};

const characterName = ref(null);
const handleAddCharacter = () => {
  Gw2CharactersExploration.onAddCharacter(characterName.value);
  characterName.value = null;
};
</script>

<template>
  <h2 class="mb-4">Suivi d'exploration</h2>
  <form @submit.prevent="handleAddCharacter" class="flex gap-2 items-center mb-4">
    <input
      type="text"
      v-model="characterName"
      class="lbm-input lbm-input-bordered lbm-input-sm"
      placeholder="Nom du personnage"
    />
    <button type="submit" class="lbm-btn lbm-btn-sm lbm-btn-primary">Ajouter</button>
    <button
      type="button"
      class="lbm-btn lbm-btn-error lbm-btn-sm"
      @click="Gw2CharactersExploration.onReset()"
    >
      Réinitialiser
    </button>
  </form>
  <div class="overflow-x-auto" style="max-height: 75dvh" v-if="characters.length > 0">
    <table class="lbm-table lbm-table-pin-cols whitespace-nowrap">
      <thead class="">
        <tr>
          <th rowspan="2" class="bg-primary text-white">Personnage</th>
          <td
            v-for="exp in exploration"
            :colspan="exp.id === 'tyria' ? exp.maps.length : exp.maps.length + 1"
            :rowspan="exp.id === 'tyria' ? 2 : 1"
            class="text-center bg-primary text-white"
          >
            {{ exp.name }}
          </td>
        </tr>
        <tr>
          <template v-for="exp in exploration">
            <td
              v-for="map in exp.maps"
              v-if="exp.id !== 'tyria'"
              class="text-center bg-primary text-white"
            >
              {{ map.shortname }}
            </td>
            <td v-if="exp.id !== 'tyria'" class="text-center bg-primary text-white">Total</td>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="character in characters" class="h-14">
          <th>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="lbm-btn lbm-btn-secondary lbm-btn-xs aspect-square"
                @click="handleDeleteCharacter(character)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="size-4 shrink-0"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <span>{{ character }}</span>
            </div>
          </th>
          <template v-for="exp in exploration">
            <td
              v-for="map in exp.maps"
              v-if="character"
              class="min-w-[8rem] text-center"
              :class="{
                'bg-error text-error-content': progression[character][map.id] < 33,
                'bg-warning text-warning-content':
                  progression[character][map.id] >= 33 && progression[character][map.id] < 66,
                'bg-info text-info-content':
                  progression[character][map.id] >= 66 && progression[character][map.id] < 100,
                'bg-success text-success-content': progression[character][map.id] === 100,
              }"
            >
              <template v-if="editProgression === character">
                <form @submit.prevent="handleEditProgression(character)">
                  <input
                    v-model="progression[character][map.id]"
                    class="lbm-input lbm-input-bordered lbm-input-sm w-18 text-center"
                    type="number"
                    min="0"
                    max="100"
                    @input="
                      () => {
                        if (progression[character][map.id] > 100) {
                          progression[character][map.id] = 100;
                        } else if (progression[character][map.id] < 0) {
                          progression[character][map.id] = 0;
                        }
                      }
                    "
                  />
                </form>
              </template>
              <template v-else>
                <span @click="handleEditProgression(character)" class="cursor-pointer"
                  >{{ progression[character][map.id] }}%</span
                >
              </template>
            </td>
            <td
              v-if="exp.id !== 'tyria'"
              class="text-center bg-base-100 text-base-content font-bold min-w-[6rem]"
            >
              {{
                getCharacterMapsProgression(
                  character,
                  exp.maps.map((m) => m.id),
                )
              }}%
            </td>
          </template>
        </tr>
      </tbody>
      <tfoot class="">
        <tr>
          <th class="bg-primary text-white">Totaux</th>
          <template v-for="exp in exploration">
            <td v-for="map in exp.maps" class="text-center bg-primary text-white">
              {{ getMapProgression(map.id) }}%
            </td>
            <td v-if="exp.id !== 'tyria'" class="text-center bg-base-100">&times;</td>
          </template>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
