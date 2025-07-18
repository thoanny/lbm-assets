<script setup>
import { ref, watch, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import Gw2ApiService from '@/services/gw2ApiService';
import axios from 'axios';

const user = useUserStore();
const { currentToken } = storeToRefs(user);

const gw2 = Gw2ApiService;

const isLoading = ref(false);
const isDataLoaded = ref(false);
const characters = ref([]);

const neverUsedCharacters = computed(() => {
    return characters.value
        ?.filter((character) => character.total === 0)
        .map((character) => character.name)
        .join(', ');
});

const usedCharacters = computed(() => {
    return characters.value?.filter((character) => character.total > 0);
});

const loadSuperAdventureBoxData = () => {
    isLoading.value = true;
    if (!currentToken.value) {
        isLoading.value = false;
        return;
    }
    gw2.getCharacters(currentToken.value).then((res) => {
        axios
            .all(
                res.data.map((character) =>
                    gw2.getCharacterByNameSuperAdventureBox(currentToken.value, character),
                ),
            )
            .then((res) => {
                isLoading.value = false;
                characters.value = [];
                res.forEach((item) => {
                    const total =
                        item.data.zones.length + item.data.unlocks.length + item.data.songs.length;

                    const zones = [
                        { id: 13, mode: 'infantile', world: 1, zone: 1 },
                        { id: 14, mode: 'infantile', world: 1, zone: 2 },
                        { id: 15, mode: 'infantile', world: 1, zone: 3 },
                        { id: 16, mode: 'infantile', world: 2, zone: 1 },
                        { id: 17, mode: 'infantile', world: 2, zone: 2 },
                        { id: 18, mode: 'infantile', world: 2, zone: 3 },
                        { id: 1, mode: 'normal', world: 1, zone: 1 },
                        { id: 2, mode: 'normal', world: 1, zone: 2 },
                        { id: 3, mode: 'normal', world: 1, zone: 3 },
                        { id: 4, mode: 'normal', world: 2, zone: 1 },
                        { id: 5, mode: 'normal', world: 2, zone: 2 },
                        { id: 6, mode: 'normal', world: 2, zone: 3 },
                        { id: 25, mode: 'tribulation', world: 1, zone: 1 },
                        { id: 26, mode: 'tribulation', world: 1, zone: 2 },
                        { id: 27, mode: 'tribulation', world: 1, zone: 3 },
                        { id: 28, mode: 'tribulation', world: 2, zone: 1 },
                        { id: 29, mode: 'tribulation', world: 2, zone: 2 },
                        { id: 30, mode: 'tribulation', world: 2, zone: 3 },
                    ].map((zone) => {
                        const idx = item.data.zones.findIndex((z) => z.id === zone.id);
                        zone.done = idx >= 0 ? true : false;
                        return zone;
                    });

                    const modes = {
                        infantile: zones.filter((z) => z.mode === 'infantile'),
                        normal: zones.filter((z) => z.mode === 'normal'),
                        tribulation: zones.filter((z) => z.mode === 'tribulation'),
                    };

                    const unlocks = [
                        { id: 1, name: 'chain_stick' },
                        { id: 3, name: 'slingshot' },
                        { id: 4 },
                        { id: 6, name: 'whip' },
                        { id: 9, name: 'mini_bomb' },
                        { id: 10 },
                        { id: 12, name: 'candle' },
                        { id: 13, name: 'torch' },
                        { id: 15, name: 'wooden_whistle' },
                        { id: 18, name: 'digger' },
                        { id: 19, name: 'nice_scoop' },
                        { id: 21, name: 'glove_of_wisdom' },
                        { id: 24, name: 'bauble_purse' },
                        { id: 25, name: 'bauble_tote_bag' },
                        { id: 26 },
                        { id: 27, name: 'moto_breath' },
                        { id: 28, name: 'moto_finger' },
                        { id: 31, name: 'health_vessel_1' },
                        { id: 32, name: 'health_vessel_2' },
                        { id: 34, name: 'medium_health_potion' },
                    ].map((unlock) => {
                        const idx = item.data.unlocks.findIndex((u) => u.id === unlock.id);
                        unlock.done = idx >= 0 ? true : false;
                        return unlock;
                    });

                    const songs = [
                        { id: 1, name: 'secret_song' },
                        { id: 2, name: 'gatekeeper_lullaby' },
                        { id: 3, name: 'shatter_serenade' },
                    ].map((song) => {
                        const idx = item.data.songs.findIndex((s) => s.id === song.id);
                        song.done = idx >= 0 ? true : false;
                        return song;
                    });

                    characters.value.push({
                        name: item.config.character,
                        // ...item.data,
                        modes: modes,
                        unlocks: unlocks,
                        songs: songs,
                        total: total,
                    });
                });
            })
            .then(() => {
                isDataLoaded.value = true;
            });
    });
};

loadSuperAdventureBoxData();

watch(currentToken, async () => {
    loadSuperAdventureBoxData();
});
</script>
<template>
    <div class="lbm-app">
        <div class="lbm-app__header">
            <div class="lbm-app__brand">
                <img src="/img/sab/SAB_Shield_Icon.png" alt="" class="lbm-app__logo" />
                <div class="lbm-app__title">
                    Super Adventure box
                    <div class="lbm-app__subtitle">S.A.B.M.A.T.</div>
                </div>
            </div>
            <div class="lbm-app__sidebar">
                <button
                    class="lbm-btn lbm-btn-primary"
                    v-show="currentToken && !isLoading"
                    :disabled="isLoading"
                    @click="loadSuperAdventureBoxData"
                >
                    Reload
                </button>
                <gw2-user-auth></gw2-user-auth>
            </div>
        </div>
        <div class="lbm-app__main gw2-wizard-vault">
            <div v-if="isLoading" class="px-4 flex gap-2">
                <span class="lbm-loading lbm-loading-spinner"></span>
                Chargement en cours...
            </div>
            <div v-else-if="isDataLoaded">
                Vos personnages qui n'ont jamais mis les pieds dans la SAB&nbsp;:
                {{ neverUsedCharacters }}.
                <!-- <pre>{{ usedCharacters }}</pre> -->
                <!-- <hr /> -->
                <div v-for="character in usedCharacters" :key="character.name" class="mt-4">
                    <h4 class="mb-2">{{ character.name }}</h4>
                    <div class="">
                        <div>
                            <div
                                class="grid grid-cols-6 sm:grid-cols-12 lg:grid-cols-[repeat(23,_minmax(0,_1fr))]"
                            >
                                <label
                                    :for="`modal_unlock_${unlock.id}`"
                                    v-for="unlock in character.unlocks"
                                    class="aspect-square w-full"
                                    :class="{
                                        'bg-black opacity-25': !unlock.done,
                                        'bg-white': unlock.done,
                                    }"
                                >
                                    <img
                                        :src="`/img/sab/unlocks/${unlock.id}.png`"
                                        class="w-full h-full block"
                                        alt=""
                                    />
                                </label>
                                <span
                                    v-for="song in character.songs"
                                    class="aspect-square w-full"
                                    :class="{
                                        'bg-black opacity-25': !song.done,
                                        'bg-white': song.done,
                                    }"
                                >
                                    <img
                                        :src="`/img/sab/songs/${song.id}.png`"
                                        class="w-full h-full block"
                                        alt=""
                                    />
                                </span>
                            </div>
                        </div>
                        <div>
                            <div
                                v-for="(zones, mode) in character.modes"
                                class="grid grid-cols-6 sm:grid-cols-8 text-sm text-center border-t border-base-100"
                            >
                                <span
                                    class="bg-neutral col-span-6 sm:col-span-2 py-2 px-3 font-semibold flex items-center justify-center capitalize"
                                >
                                    {{ mode }}
                                </span>
                                <span
                                    v-for="zone in zones"
                                    class="py-2 px-3 flex items-center justify-center border-r border-base-100"
                                    :class="{
                                        'bg-error text-error-content': !zone.done,
                                        'bg-success text-success-content': zone.done,
                                    }"
                                >
                                    <span class="hidden sm:inline"
                                        >Monde {{ zone.world }} Zone {{ zone.zone }}</span
                                    >
                                    <span class="inline sm:hidden text-xs"
                                        >M{{ zone.world }}Z{{ zone.zone }}</span
                                    >
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <pre>{{ characters }}</pre> -->
            </div>
            <div v-else>Aucune donnée...</div>
            <div data-x="modals">
                <input type="checkbox" id="modal_unlock_1" class="lbm-modal-toggle" />
                <div class="lbm-modal" role="dialog">
                    <div class="lbm-modal-box max-w-xs">
                        <h3 class="text-lg font-bold flex gap-4 items-center">
                            <img
                                src="/img/sab/unlocks/1.png"
                                class="size-12 shrink-0 rounded"
                                alt=""
                            />
                            Nunchaku
                        </h3>
                        <p class="text-white">
                            S'achète au
                            <a
                                href="https://www.lebusmagique.fr/pages/mises-a-jour-passees/sab-2016/monde-2/major-en-ameliorations.html#nunchaku"
                                target="_blank"
                                >2e marchand (caché)</a
                            >
                            du Monde 2, zone 3, pour 400 babioles.
                        </p>
                        <div class="lbm-modal-action">
                            <label for="modal_unlock_1" class="lbm-btn lbm-btn-neutral w-full"
                                >Fermer</label
                            >
                        </div>
                    </div>
                </div>
                <input type="checkbox" id="modal_unlock_3" class="lbm-modal-toggle" />
                <div class="lbm-modal" role="dialog">
                    <div class="lbm-modal-box max-w-xs">
                        <h3 class="text-lg font-bold flex gap-4 items-center">
                            <img
                                src="/img/sab/unlocks/3.png"
                                class="size-12 shrink-0 rounded"
                                alt=""
                            />
                            Fronde
                        </h3>
                        <p class="text-white">xxx</p>
                        <div class="lbm-modal-action">
                            <label for="modal_unlock_3" class="lbm-btn lbm-btn-neutral w-full"
                                >Fermer</label
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="lbm-app__footer">
            <lbm-app-footer></lbm-app-footer>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../../assets/main.scss';
.lbm-avatar.lbm-offline::before {
    background-color: oklch(var(--er) / 1);
}
</style>
