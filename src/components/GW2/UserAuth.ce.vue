<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const user = useUserStore();

const { apiKey, accounts, accountId, accountName, isLoading, isLoggedIn } = storeToRefs(user);

const modal = ref();
</script>

<template>
    <button v-if="isLoading" class="lbm-btn lbm-btn-primary">
        <span class="lbm-loading"></span> Chargement...
    </button>
    <button class="lbm-btn lbm-btn-primary" @click="modal.showModal()" v-else>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-6 w-6"
        >
            <path
                d="M10.7577 11.8281L18.6066 3.97919L20.0208 5.3934L18.6066 6.80761L21.0815 9.28249L19.6673 10.6967L17.1924 8.22183L15.7782 9.63604L17.8995 11.7574L16.4853 13.1716L14.364 11.0503L12.1719 13.2423C13.4581 15.1837 13.246 17.8251 11.5355 19.5355C9.58291 21.4882 6.41709 21.4882 4.46447 19.5355C2.51184 17.5829 2.51184 14.4171 4.46447 12.4645C6.17493 10.754 8.81633 10.5419 10.7577 11.8281ZM10.1213 18.1213C11.2929 16.9497 11.2929 15.0503 10.1213 13.8787C8.94975 12.7071 7.05025 12.7071 5.87868 13.8787C4.70711 15.0503 4.70711 16.9497 5.87868 18.1213C7.05025 19.2929 8.94975 19.2929 10.1213 18.1213Z"
            ></path>
        </svg>
        {{ accountName ?? 'Connexion' }}
    </button>
    <dialog ref="modal" class="lbm-modal">
        <div class="lbm-modal-box">
            <form method="dialog">
                <button
                    class="lbm-btn lbm-btn-sm lbm-btn-circle lbm-btn-ghost absolute right-4 top-4"
                >
                    ✕
                </button>
            </form>
            <h3 class="text-lg font-bold mb-4 -mt-2">Connexion au(x) compte(s) GW2</h3>
            <div class="flex w-full flex-col border-opacity-50">
                <div class="flex flex-col gap-2">
                    <button
                        class="lbm-btn lbm-btn-primary lbm-btn-block"
                        @click="user.login"
                        v-if="!isLoggedIn"
                    >
                        Se connecter avec GW2Auth
                    </button>

                    <template v-else-if="isLoggedIn === 'gw2-auth'">
                        <select
                            class="lbm-select lbm-select-bordered"
                            v-model="accountId"
                            @change="user.handleAccountId"
                        >
                            <option :value="id" v-for="(token, id) in accounts" :key="id">
                                {{ token.name }}
                            </option>
                        </select>
                        <button class="lbm-btn lbm-btn-error" @click="user.logout">
                            Déconnexion
                        </button>
                    </template>
                </div>
                <div class="lbm-divider" v-if="!isLoggedIn">ou</div>
                <div class="">
                    <template v-if="!isLoggedIn">
                        <label class="lbm-form-control w-full">
                            <div class="lbm-label pt-0">
                                <span class="lbm-label-text">Clé API Guild Wars 2</span>
                            </div>
                            <input
                                type="text"
                                placeholder=""
                                class="lbm-input lbm-input-bordered"
                                v-model="apiKey"
                            />
                        </label>
                        <button
                            class="lbm-btn lbm-btn-primary lbm-btn-block mt-4"
                            :disabled="!apiKey || isLoading"
                            @click="user.handleApiKey"
                        >
                            <template v-if="isLoading">
                                <span class="lbm-loading"></span>
                                Chargement en cours...
                            </template>
                            <template v-else>Vérifier et enregistrer</template>
                        </button>
                    </template>
                    <div v-else-if="isLoggedIn === 'api-key'">
                        <div class="text-success font-semibold mb-4">
                            Connecté·e en tant que {{ accountName }}.
                        </div>
                        <button class="lbm-btn lbm-btn-error lbm-btn-block" @click="user.logout">
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <form method="dialog" class="lbm-modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<style lang="scss" scoped>
@import '@/assets/main.scss';
</style>
