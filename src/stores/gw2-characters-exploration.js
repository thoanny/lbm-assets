import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import debounce from 'lodash/debounce';

import exploration from '@/data/gw2-characters-exploration.json';

export const useGw2CharactersExploration = defineStore('gw2-characters-exploration', () => {
  const progression = ref({});
  const characters = ref([]);

  const mapIds = [];
  exploration.forEach((exp) => {
    exp.maps.forEach((map) => {
      mapIds.push(map.id);
    });
  });

  // Load from localStorage

  const localProgression = localStorage.getItem('gw2-characters-exploration-progression');
  if (localProgression) {
    progression.value = JSON.parse(localProgression);
  }

  const localCharacters = localStorage.getItem('gw2-characters-exploration-characters');
  if (localCharacters) {
    characters.value = JSON.parse(localCharacters);
  }

  // Check if character have all maps

  characters.value.forEach((c) => {
    if (typeof progression.value[c] === 'undefined') {
      progression.value[c] = {};
    }
    mapIds.forEach((m) => {
      if (typeof progression.value[c][m] === 'undefined') {
        progression.value[c][m] = 0;
      }
    });
  });

  const onAddCharacter = (name) => {
    if (typeof progression.value[name] !== 'undefined') {
      alert('Chaque personnage doit avoir un nom unique !');
      return;
    }
    characters.value.push(name);
    progression.value[name] = {};
    mapIds.forEach((m) => {
      progression.value[name][m] = 0;
    });
  };

  const onDeleteCharacter = (name) => {
    const idx = characters.value.findIndex((c) => c === name);
    characters.value.splice(idx, 1);
    delete progression.value[name];
  };

  const onSaveProgression = debounce(() => {
    localStorage.setItem(
      'gw2-characters-exploration-progression',
      JSON.stringify(progression.value),
    );
  }, 500);

  const onSaveCharacters = debounce(() => {
    localStorage.setItem('gw2-characters-exploration-characters', JSON.stringify(characters.value));
  }, 500);

  watch(progression.value, async () => {
    onSaveProgression();
  });

  watch(characters.value, async () => {
    onSaveCharacters();
  });

  const onReset = () => {
    if (
      confirm(
        "Es-tu sûr de vouloir supprimer les données d'exploration ? Cette action est irréversible...",
      )
    ) {
      localStorage.removeItem('gw2-characters-exploration-characters');
      localStorage.removeItem('gw2-characters-exploration-progression');
      progression.value = {};
      characters.value = [];
    }
  };

  return {
    progression,
    characters,
    onAddCharacter,
    onDeleteCharacter,
    onReset,
  };
});
