<script setup>
// Icons : https://remixicon.com
import { ref } from 'vue';
const recipeOpen = ref(true);
</script>

<template>
    <div class="lbm-app">
        <div class="lbm-app__header">
            <div class="lbm-app__brand">
                <img src="" alt="" class="lbm-app__logo bg-red-500" />
                <div class="lbm-app__title">
                    Décorations de guilde et du pavillon
                    <div class="lbm-app__subtitle">00000 décorations</div>
                </div>
            </div>
            <div class="lbm-app__sidebar">
                <button class="lbm-btn lbm-btn-primary lbm-btn-square">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="h-6 w-6"
                    >
                        <path
                            d="M3.33946 17.0002C2.90721 16.2515 2.58277 15.4702 2.36133 14.6741C3.3338 14.1779 3.99972 13.1668 3.99972 12.0002C3.99972 10.8345 3.3348 9.824 2.36353 9.32741C2.81025 7.71651 3.65857 6.21627 4.86474 4.99001C5.7807 5.58416 6.98935 5.65534 7.99972 5.072C9.01009 4.48866 9.55277 3.40635 9.4962 2.31604C11.1613 1.8846 12.8847 1.90004 14.5031 2.31862C14.4475 3.40806 14.9901 4.48912 15.9997 5.072C17.0101 5.65532 18.2187 5.58416 19.1346 4.99007C19.7133 5.57986 20.2277 6.25151 20.66 7.00021C21.0922 7.7489 21.4167 8.53025 21.6381 9.32628C20.6656 9.82247 19.9997 10.8336 19.9997 12.0002C19.9997 13.166 20.6646 14.1764 21.6359 14.673C21.1892 16.2839 20.3409 17.7841 19.1347 19.0104C18.2187 18.4163 17.0101 18.3451 15.9997 18.9284C14.9893 19.5117 14.4467 20.5941 14.5032 21.6844C12.8382 22.1158 11.1148 22.1004 9.49633 21.6818C9.55191 20.5923 9.00929 19.5113 7.99972 18.9284C6.98938 18.3451 5.78079 18.4162 4.86484 19.0103C4.28617 18.4205 3.77172 17.7489 3.33946 17.0002ZM8.99972 17.1964C10.0911 17.8265 10.8749 18.8227 11.2503 19.9659C11.7486 20.0133 12.2502 20.014 12.7486 19.9675C13.1238 18.8237 13.9078 17.8268 14.9997 17.1964C16.0916 16.5659 17.347 16.3855 18.5252 16.6324C18.8146 16.224 19.0648 15.7892 19.2729 15.334C18.4706 14.4373 17.9997 13.2604 17.9997 12.0002C17.9997 10.74 18.4706 9.5632 19.2729 8.6665C19.1688 8.4405 19.0538 8.21822 18.9279 8.00021C18.802 7.78219 18.667 7.57148 18.5233 7.36842C17.3457 7.61476 16.0911 7.43414 14.9997 6.80405C13.9083 6.17395 13.1246 5.17768 12.7491 4.03455C12.2509 3.98714 11.7492 3.98646 11.2509 4.03292C10.8756 5.17671 10.0916 6.17364 8.99972 6.80405C7.9078 7.43447 6.65245 7.61494 5.47428 7.36803C5.18485 7.77641 4.93463 8.21117 4.72656 8.66637C5.52881 9.56311 5.99972 10.74 5.99972 12.0002C5.99972 13.2604 5.52883 14.4372 4.72656 15.3339C4.83067 15.5599 4.94564 15.7822 5.07152 16.0002C5.19739 16.2182 5.3324 16.4289 5.47612 16.632C6.65377 16.3857 7.90838 16.5663 8.99972 17.1964ZM11.9997 15.0002C10.3429 15.0002 8.99972 13.6571 8.99972 12.0002C8.99972 10.3434 10.3429 9.00021 11.9997 9.00021C13.6566 9.00021 14.9997 10.3434 14.9997 12.0002C14.9997 13.6571 13.6566 15.0002 11.9997 15.0002ZM11.9997 13.0002C12.552 13.0002 12.9997 12.5525 12.9997 12.0002C12.9997 11.4479 12.552 11.0002 11.9997 11.0002C11.4474 11.0002 10.9997 11.4479 10.9997 12.0002C10.9997 12.5525 11.4474 13.0002 11.9997 13.0002Z"
                        ></path>
                    </svg>
                </button>
                <button class="lbm-btn lbm-btn-primary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6"
                    >
                        <path
                            d="M10.7577 11.8281L18.6066 3.97919L20.0208 5.3934L18.6066 6.80761L21.0815 9.28249L19.6673 10.6967L17.1924 8.22183L15.7782 9.63604L17.8995 11.7574L16.4853 13.1716L14.364 11.0503L12.1719 13.2423C13.4581 15.1837 13.246 17.8251 11.5355 19.5355C9.58291 21.4882 6.41709 21.4882 4.46447 19.5355C2.51184 17.5829 2.51184 14.4171 4.46447 12.4645C6.17493 10.754 8.81633 10.5419 10.7577 11.8281ZM10.1213 18.1213C11.2929 16.9497 11.2929 15.0503 10.1213 13.8787C8.94975 12.7071 7.05025 12.7071 5.87868 13.8787C4.70711 15.0503 4.70711 16.9497 5.87868 18.1213C7.05025 19.2929 8.94975 19.2929 10.1213 18.1213Z"
                        ></path>
                    </svg>
                    Anthony.5487
                </button>
            </div>
        </div>

        <div class="lbm-app__main flex gap-4 items-start">
            <div class="w-full max-w-xs bg-base-200 rounded-box p-2">
                <div
                    class="overflow-y-auto lbm-scrollbar min-h-96 pr-2"
                    style="max-height: calc(100dvh - 15rem)"
                >
                    <ul class="lbm-menu w-full p-0">
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">
                                        Décorations favorites
                                        <span class="lbm-badge lbm-badge-sm lbm-badge-primary"
                                            >8</span
                                        >
                                    </h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1 </a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">
                                        Nom de ma guilde 1
                                        <span class="lbm-badge lbm-badge-sm lbm-badge-primary"
                                            >3</span
                                        >
                                    </h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">
                                        Nom de ma guilde 3
                                        <span class="lbm-badge lbm-badge-sm lbm-badge-primary"
                                            >99</span
                                        >
                                    </h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">Architecture</h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">Meubles</h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">Éclairage</h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">Autre</h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">Plantes</h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">Statues</h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">Trophées</h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">Monuments</h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">Festival</h4>
                                </summary>
                                <ul>
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex-1">
                <div class="flex items-start gap-4">
                    <div class="w-3/5">
                        <div
                            class="border border-gray-500 rounded-box h-56 p-4 relative overflow-hidden"
                        >
                            <div class="aspect-video h-full absolute top-0 right-0 z-10">
                                <img
                                    src="https://lebusmagique.netlify.app/assets/img/guilds/decorations/thumbs/72409.jpg"
                                    class="w-full h-full object-cover"
                                    alt=""
                                    style="
                                        mask-image: linear-gradient(
                                            to right,
                                            rgba(0, 0, 0, 0),
                                            rgba(0, 0, 0, 1) 25%
                                        );
                                    "
                                />
                            </div>
                            <div class="flex gap-4 items-center relative z-20">
                                <img
                                    src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                    alt=""
                                    class="w-16 h-16 bg-red-500 rounded"
                                />
                                <div class="flex flex-col">
                                    <h2 class="text-xl font-semibold text-white">Nom de l'objet</h2>
                                </div>
                            </div>
                        </div>

                        <div class="border border-gray-500 rounded-box w-full mt-4">
                            <div class="flex justify-between">
                                <h3 class="text-lg px-4 pt-3">Recette</h3>
                                <div class="lbm-form-control">
                                    <label class="lbm-label cursor-pointer">
                                        <span class="lbm-label-text text-sm">Développer</span>
                                        <input
                                            type="checkbox"
                                            class="lbm-toggle lbm-toggle-primary lbm-toggle-xs"
                                            v-model="recipeOpen"
                                        />
                                    </label>
                                </div>
                            </div>

                            <ul class="lbm-menu recipe">
                                <li>
                                    <span>
                                        <img
                                            src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                            alt=""
                                            class="h-5 w-5 rounded"
                                        />
                                        3 &times; Item 1
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        <img
                                            src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                            alt=""
                                            class="h-5 w-5 rounded"
                                        />
                                        1 &times; Item 2
                                    </span>
                                    <ul :class="{ hidden: !recipeOpen }">
                                        <li>
                                            <span>
                                                <img
                                                    src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                    alt=""
                                                    class="h-5 w-5 rounded"
                                                />Submenu 1
                                            </span>
                                        </li>
                                        <li>
                                            <span
                                                ><img
                                                    src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                    alt=""
                                                    class="h-5 w-5 rounded"
                                                />Submenu 2</span
                                            >
                                        </li>
                                        <li>
                                            <span
                                                ><img
                                                    src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                    alt=""
                                                    class="h-5 w-5 rounded"
                                                />Parent</span
                                            >
                                            <ul>
                                                <li>
                                                    <span
                                                        ><img
                                                            src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                            alt=""
                                                            class="h-5 w-5 rounded"
                                                        />Submenu 1</span
                                                    >
                                                </li>
                                                <li>
                                                    <span
                                                        ><img
                                                            src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                            alt=""
                                                            class="h-5 w-5 rounded"
                                                        />Submenu 2</span
                                                    >
                                                    <ul>
                                                        <li>
                                                            <span
                                                                ><img
                                                                    src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                                    alt=""
                                                                    class="h-5 w-5 rounded"
                                                                />Submenu 1</span
                                                            >
                                                        </li>
                                                        <li>
                                                            <span
                                                                ><img
                                                                    src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                                    alt=""
                                                                    class="h-5 w-5 rounded"
                                                                />Submenu 2</span
                                                            >
                                                        </li>
                                                        <li>
                                                            <span
                                                                ><img
                                                                    src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                                    alt=""
                                                                    class="h-5 w-5 rounded"
                                                                />Parent</span
                                                            >
                                                            <ul>
                                                                <li>
                                                                    <span
                                                                        ><img
                                                                            src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                                            alt=""
                                                                            class="h-5 w-5 rounded"
                                                                        />Submenu 1</span
                                                                    >
                                                                </li>
                                                                <li>
                                                                    <span
                                                                        ><img
                                                                            src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                                                            alt=""
                                                                            class="h-5 w-5 rounded"
                                                                        />Submenu 2</span
                                                                    >
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span>
                                        <img
                                            src="https://render.guildwars2.com/file/9EDA0D4C957DA89F653E9D27695592B139ECD035/61049.png"
                                            alt=""
                                            class="h-5 w-5 rounded"
                                        />
                                        5 &times; Item 3
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="w-2/5">
                        <div class="p-4 pt-3 border border-gray-500 rounded-box">
                            <h3 class="text-lg">Sources</h3>
                            <ul class="pl-6 mt-2 text-sm">
                                <li><strong>Illustrateur</strong> (375)</li>
                                <li><strong>Nouveau métier</strong> (123)</li>
                                <li><strong>Nom du PNJ</strong> (festival du Nouvel an lunaire)</li>
                            </ul>
                        </div>
                        <div class="pt-3 border border-gray-500 rounded-box mt-4 overflow-hidden">
                            <h3 class="text-lg mx-4 mb-3">Détails du prix</h3>
                            <table class="lbm-table text-xs">
                                <thead>
                                    <tr>
                                        <th>Objet</th>
                                        <th width="1" class="text-center">Qté</th>
                                        <th class="text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                    <tr>
                                        <td>AAA</td>
                                        <td class="text-center">3</td>
                                        <td class="text-end">000</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colspan="2">Total</th>
                                        <th class="text-end">000</th>
                                    </tr>
                                </tfoot>
                            </table>
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

<style scoped>
@import '@/assets/main.scss';

h4.lbm-menu-title {
    @apply p-0 uppercase w-full justify-between flex items-center;
}

summary {
    @apply !flex;
}

ul {
    @apply my-0;
}

.recipe li ul:before {
    @apply bg-gray-500 opacity-100;
}

.lbm-table thead,
.lbm-table tfoot {
    @apply bg-neutral;
}
</style>
