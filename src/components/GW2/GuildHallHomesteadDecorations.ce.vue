<script setup>
// Icons : https://remixicon.com
import { onMounted, ref, computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { pad } from '@/services/utils';
import RecipeNested from '@/components/GW2/RecipeNested.vue';

const LBMApp = ref();

const recipeOpen = ref(true);

const DOMAIN = 'https://api.lebusmagique.fr';
// const DOMAIN = 'http://localhost:8000';
const API = `${DOMAIN}/api/gw2`;
const UPLOADS = `${DOMAIN}/uploads/api/gw2/decorations/`;

const markdown = new MarkdownIt();

const allCategories = ref([]);
const currentDecoration = ref(null);
const currentQuantity = ref(1);
const total = ref([]);
const totalPrice = ref(0);
const totalDecorations = ref(0);
const searchValue = ref('');
const searchType = ref('');

const loadingCategories = ref(false);
const loadingDecoration = ref(false);

const getCategories = async () => {
    loadingCategories.value = true;
    const res = await fetch(`${API}/decorations`);
    return await res.json();
};

const loadCategories = async () => {
    allCategories.value = await getCategories();
    // updateCategories();
    loadingCategories.value = false;
    const sum = allCategories.value.map((c) => c.decorations.length);
    totalDecorations.value = sum.reduce((a, b) => a + b, 0);
};

const loadDecoration = async (id) => {
    LBMApp.value.scrollIntoView({ behaviour: 'smooth' });
    loadingDecoration.value = true;
    total.value = [];
    currentQuantity.value = 1;
    currentDecoration.value = null;
    await fetch(`${API}/decorations/${id}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            currentDecoration.value = data;
            loadingDecoration.value = false;
            getTotal(data.item.recipes, 1);
            loadGuildDecorations();
            loadPrices();
        });
};

const loadGuildDecorations = async () => {
    const upgradeIds = currentDecoration.value.item.recipes.map((r) =>
        r.guildIngredients.map((gi) => gi.upgrade_id),
    );

    if (upgradeIds.length > 0) {
        await fetch(`https://api.guildwars2.com/v2/guild/upgrades?ids=${upgradeIds.join(',')}`)
            .then((res) => res.json())
            .then((data) => {
                data.forEach((u) => {
                    const idx = currentDecoration.value.item.recipes[0].guildIngredients.findIndex(
                        (gi) => gi.upgrade_id === u.id,
                    );
                    if (idx >= 0) {
                        currentDecoration.value.item.recipes[0].guildIngredients[idx] = {
                            ...currentDecoration.value.item.recipes[0].guildIngredients[idx],
                            name: u.name,
                            icon: u.icon,
                        };
                    }
                });
            });
    }
};

const getTotal = (recipes, quantity = 1) => {
    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            if (ingredient.item.recipes.length === 0) {
                const idx = total.value.findIndex((t) => t.uid === ingredient.item.uid);
                if (idx >= 0) {
                    total.value[idx].quantity += ingredient.quantity * quantity;
                } else {
                    total.value.push({
                        uid: ingredient.item.uid,
                        name: ingredient.item.name,
                        icon: ingredient.item.icon,
                        quantity: ingredient.quantity * quantity,
                    });
                }
            } else {
                getTotal(ingredient.item.recipes, ingredient.quantity * quantity);
            }
        });
    });
};

const loadPrices = async () => {
    const ids = total.value.map((t) => t.uid);
    totalPrice.value = 0;
    await fetch(`http://api.guildwars2.com/v2/commerce/prices?ids=${ids.join(',')}`)
        .then((res) => res.json())
        .then((data) => {
            data.forEach((price) => {
                const idx = total.value.findIndex((item) => item.uid === price.id);
                if (idx >= 0) {
                    total.value[idx].price = price.sells.unit_price;
                }
            });
            total.value.forEach((item) => {
                if (item.price) {
                    totalPrice.value += item.price * item.quantity;
                }
            });
        });
};

const formatPrice = (amount) => {
    const copper = amount % 100;
    const silver = Math.floor((amount % 10000) / 100);
    const gold = Math.floor(amount / 10000);

    if (gold > 0) {
        return `<span class="currency"><span class="gold">${gold}</span><span class="silver">${pad(silver)}</span><span class="copper">${pad(copper)}</span>`;
    } else if (silver > 0) {
        return `<span class="currency"><span class="silver">${pad(silver)}</span><span class="copper">${pad(copper)}</span>`;
    }

    return `<span class="currency"><span class="copper">${copper}</span></span>`;
};

const thumbnailModal = ref();

onMounted(() => {
    loadCategories();
});

const categories = computed(() => {
    const s = searchValue.value
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();

    return allCategories.value.map((category) => {
        return {
            ...category,
            decorations: category.decorations.filter((decoration) => {
                if (searchType.value && searchValue.value) {
                    return (
                        searchType.value === decoration.type &&
                        decoration.item.name
                            .normalize('NFD')
                            .replace(/\p{Diacritic}/gu, '')
                            .toLowerCase()
                            .indexOf(s) >= 0
                    );
                } else if (searchType.value) {
                    return searchType.value === decoration.type;
                } else if (searchValue.value) {
                    return (
                        decoration.item.name
                            .normalize('NFD')
                            .replace(/\p{Diacritic}/gu, '')
                            .toLowerCase()
                            .indexOf(s) >= 0
                    );
                }
                return true;
            }),
        };
    });
});
</script>

<template>
    <div class="lbm-app" ref="LBMApp">
        <div class="lbm-app__header">
            <div class="lbm-app__brand">
                <img src="" alt="" class="lbm-app__logo bg-primary" v-if="false" />
                <div class="lbm-app__title">
                    Décorations de guilde
                    <div class="lbm-app__subtitle">
                        <!-- {{ totalDecorations ? `${totalDecorations} décorations` : '...' }} -->
                        Version α (alpha)
                    </div>
                </div>
            </div>
            <div class="lbm-app__sidebar">
                <button class="lbm-btn lbm-btn-primary lbm-btn-square" v-if="false">
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
                <button class="lbm-btn lbm-btn-primary" v-if="false">
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
            <div class="flex gap-2 items-center" v-if="loadingCategories">
                <span class="lbm-loading lbm-loading-spinner"></span>
                Chargement en cours...
            </div>
            <div class="w-full max-w-xs bg-base-200 rounded-box p-2 sticky top-4" v-else>
                <div class="flex flex-col gap-2 mb-2">
                    <select
                        class="lbm-select lbm-select-bordered lbm-select-sm w-full"
                        v-model="searchType"
                        v-if="false"
                    >
                        <option value="">Toutes les décorations</option>
                        <option value="guildhall">Hall de guilde</option>
                        <option value="homestead">Pavillon</option>
                    </select>
                    <input
                        type="text"
                        class="lbm-input lbm-input-bordered lbm-input-sm w-full"
                        placeholder="Chercher une décoration"
                        v-model="searchValue"
                    />
                </div>

                <div
                    class="overflow-y-auto lbm-scrollbar min-h-96 pr-2"
                    style="max-height: calc(100dvh - 15rem)"
                >
                    <ul class="lbm-menu w-full p-0">
                        <li
                            v-for="category in categories"
                            :key="category.id"
                            v-show="category.decorations.length > 0"
                        >
                            <details>
                                <summary>
                                    <h4 class="lbm-menu-title">
                                        {{ category.name }}
                                        <span
                                            class="lbm-badge lbm-badge-sm lbm-badge-primary"
                                            v-if="category.decorations.length > 0"
                                        >
                                            {{ category.decorations.length }}
                                        </span>
                                    </h4>
                                </summary>
                                <ul>
                                    <li v-for="decoration in category.decorations">
                                        <a
                                            @click.prevent="loadDecoration(decoration.id)"
                                            :class="{
                                                'active lbm-active':
                                                    currentDecoration?.id === decoration.id,
                                            }"
                                        >
                                            <img
                                                :src="decoration.item.icon"
                                                alt=""
                                                class="h-5 w-5 rounded"
                                            />
                                            <span class="truncate">{{ decoration.item.name }}</span>
                                        </a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex-1">
                <div class="flex gap-2 items-center" v-if="loadingDecoration">
                    <span class="lbm-loading lbm-loading-spinner"></span>
                    Chargement en cours...
                </div>
                <div class="flex items-start gap-4" v-else-if="currentDecoration">
                    <div class="w-3/5">
                        <!-- <pre>{{ currentDecoration }}</pre> -->
                        <div class="">
                            <div class="flex gap-4 items-center relative z-20">
                                <img
                                    :src="currentDecoration.item.icon"
                                    alt=""
                                    class="w-16 h-16 bg-red-500 rounded border-2"
                                    :class="[`border-gw2-rarity-${currentDecoration.item.rarity}`]"
                                />
                                <div class="flex flex-col">
                                    <h2 class="text-xl font-semibold text-white">
                                        {{ currentDecoration.item.name }}
                                    </h2>
                                </div>
                            </div>
                            <div
                                class="mt-2 tip"
                                v-if="currentDecoration.item.obteningTip"
                                v-html="markdown.render(currentDecoration.item.obteningTip)"
                            ></div>
                        </div>

                        <div class="mt-4" v-if="currentDecoration.item.recipes.length > 0">
                            <div
                                class="flex justify-between items-center bg-neutral rounded-lg px-4 py-1"
                            >
                                <h3 class="text-lg pl-2">Recette</h3>
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
                                <RecipeNested
                                    :recipes="currentDecoration.item.recipes"
                                    :open="recipeOpen"
                                    :quantity="currentQuantity"
                                />
                            </ul>
                        </div>
                    </div>
                    <div class="w-2/5">
                        <div
                            class="aspect-video w-full rounded-lg overflow-hidden"
                            v-if="currentDecoration.thumbnail"
                        >
                            <img
                                :src="UPLOADS + currentDecoration.thumbnail"
                                class="w-full h-full object-cover cursor-pointer"
                                alt=""
                                @click="thumbnailModal.showModal()"
                            />

                            <dialog ref="thumbnailModal" class="lbm-modal">
                                <div class="lbm-modal-box max-w-4xl p-0">
                                    <form method="dialog">
                                        <button
                                            class="lbm-btn lbm-btn-sm lbm-btn-circle absolute right-2 top-2"
                                        >
                                            ✕
                                        </button>
                                    </form>
                                    <img
                                        :src="UPLOADS + currentDecoration.thumbnail"
                                        class="w-full h-full block"
                                        alt=""
                                    />
                                </div>
                                <form method="dialog" class="lbm-modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>
                        </div>

                        <div
                            :class="{ 'mt-4': currentDecoration.thumbnail }"
                            v-if="total.length > 0"
                        >
                            <h3 class="text-lg mb-2">
                                Quantité à fabriquer&nbsp;: {{ currentQuantity }}
                            </h3>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                v-model="currentQuantity"
                                class="lbm-range lbm-range-sm lbm-range-primary"
                            />
                        </div>
                        <div class="mt-4" v-if="total.length > 0">
                            <h3 class="text-lg mb-2">Liste de course</h3>
                            <table class="lbm-table text-xs border border-neutral rounded-none">
                                <thead>
                                    <tr>
                                        <th>Objet</th>
                                        <th width="1" class="text-center">Qté</th>
                                        <th class="text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in total">
                                        <td class="py-1">
                                            <span class="flex gap-2 items-center">
                                                <img :src="item.icon" alt="" class="h-5 w-5" />
                                                {{ item.name }}
                                            </span>
                                        </td>
                                        <td class="text-center py-1">
                                            {{ item.quantity * currentQuantity }}
                                        </td>
                                        <td
                                            class="text-end py-1"
                                            v-html="
                                                item.price
                                                    ? formatPrice(
                                                          item.price *
                                                              item.quantity *
                                                              currentQuantity,
                                                      )
                                                    : '&mdash;'
                                            "
                                        ></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colspan="2">Total</th>
                                        <th
                                            class="text-end text-white"
                                            v-html="formatPrice(totalPrice * currentQuantity)"
                                        ></th>
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

<style lang="scss" scoped>
@import '@/assets/main.scss';

h4.lbm-menu-title {
    @apply p-0 uppercase w-full justify-between flex items-center;
}

summary {
    @apply flex !important;
}

ul {
    @apply my-0;
}

.recipe :deep(li ul:before) {
    @apply bg-gray-500 opacity-100;
}

.recipe :deep(li) {
    @apply list-none;
}

.recipe :deep(li img) {
    @apply w-5 h-5 rounded;
}

.lbm-table thead,
.lbm-table tfoot {
    @apply bg-neutral;
}

:deep(.currency) {
    @apply inline-flex gap-1 items-center;

    .gold,
    .silver,
    .copper {
        @apply flex gap-1 items-center;

        &:after {
            @apply w-2 h-2 rounded-full block;
            content: '';
        }
    }

    .gold:after {
        @apply bg-yellow-400;
    }

    .silver:after {
        @apply bg-gray-400;
    }

    .copper:after {
        @apply bg-orange-400;
    }
}

.tip :deep(p) {
    margin-bottom: 0;
}
</style>
