<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps(['id', 'display']);

const recipe = ref({});
const items = ref([]);
const itemsIds = ref([]);

const loadRecipe = async () => {
    await fetch(`https://api.guildwars2.com/v2/recipes/${props.id}`)
        .then((res) => res.json())
        .then(async (data) => {
            recipe.value = data;
            itemsIds.value.push(data.output_item_id);
            itemsIds.value = itemsIds.value.concat(data.ingredients.map((i) => i.item_id));
        })
        .then(async () => {
            items.value = await fetch(
                `https://api.guildwars2.com/v2/items?ids=${itemsIds.value.join(',')}&lang=fr`,
            ).then((res) => res.json());
        });
};

const getItemById = (id) => {
    return items.value.find((item) => item.id === id);
};

onMounted(() => {
    loadRecipe();
});
</script>

<template>
    <template v-if="display === 'list'">
        <template v-if="recipe && items.length > 0">
            <span :class="[`text-gw2-rarity-${getItemById(recipe.output_item_id).rarity}`]">
                <img
                    :src="getItemById(recipe.output_item_id).icon"
                    alt=""
                    class="h-6 w-6 align-bottom rounded border-2"
                    :class="[`border-gw2-rarity-${getItemById(recipe.output_item_id).rarity}`]"
                />&nbsp;{{ getItemById(recipe.output_item_id).name }}
            </span>
            {{ recipe.output_item_count > 1 ? `&times;&nbsp;${recipe.output_item_count}` : '' }}
            :
            <ul class="my-1">
                <li v-for="(ingredient, i) in recipe.ingredients" class="mb-1">
                    {{ ingredient.count }}&nbsp;&times;
                    <span :class="[`text-gw2-rarity-${getItemById(ingredient.item_id).rarity}`]">
                        <img
                            :src="getItemById(ingredient.item_id).icon"
                            alt=""
                            class="border-2 w-6 h-6 rounded align-bottom"
                            :class="[`border-gw2-rarity-${getItemById(ingredient.item_id).rarity}`]"
                        />&nbsp;{{ getItemById(ingredient.item_id).name }}
                    </span>
                </li>
            </ul>
        </template>
    </template>
    <template v-else-if="display === 'inline'">
        <template v-if="recipe && items.length > 0">
            <span :class="[`text-gw2-rarity-${getItemById(recipe.output_item_id).rarity}`]">
                <img
                    :src="getItemById(recipe.output_item_id).icon"
                    alt=""
                    class="h-6 w-6 align-bottom rounded border-2"
                    :class="[`border-gw2-rarity-${getItemById(recipe.output_item_id).rarity}`]"
                />&nbsp;{{ getItemById(recipe.output_item_id).name }}
            </span>
            {{ recipe.output_item_count > 1 ? `&times;&nbsp;${recipe.output_item_count}` : '' }}
            (<template v-for="(ingredient, i) in recipe.ingredients">
                {{ ingredient.count }}&nbsp;&times;
                <span :class="[`text-gw2-rarity-${getItemById(ingredient.item_id).rarity}`]">
                    <img
                        :src="getItemById(ingredient.item_id).icon"
                        alt=""
                        class="border-2 w-6 h-6 rounded align-bottom"
                        :class="[`border-gw2-rarity-${getItemById(ingredient.item_id).rarity}`]"
                    />&nbsp;{{ getItemById(ingredient.item_id).name }} </span
                ><template v-if="i < recipe.ingredients.length - 1">, </template></template
            >)
        </template>
    </template>
    <template v-else>
        <div class="lbm-app" v-if="recipe && items.length > 0">
            <div class="lbm-app__header">
                <div class="lbm-app__brand">
                    <img
                        :src="getItemById(recipe.output_item_id).icon"
                        alt=""
                        class="lbm-app__logo bg-red-500 border-3 rounded-lg"
                        :class="[`border-gw2-rarity-${getItemById(recipe.output_item_id).rarity}`]"
                    />
                    <div class="lbm-app__title">
                        <span
                            :class="[
                                `text-gw2-rarity-${getItemById(recipe.output_item_id).rarity}`,
                            ]"
                            >{{ getItemById(recipe.output_item_id).name }}
                            <span class="text-white" v-if="recipe.output_item_count > 1">
                                &times;&nbsp;{{ recipe.output_item_count }}
                            </span></span
                        >
                        <div class="lbm-app__subtitle">
                            {{ recipe.disciplines.join(`(${recipe.min_rating}), `) }} ({{
                                recipe.min_rating
                            }})
                        </div>
                    </div>
                </div>
                <div class="lbm-app__sidebar"></div>
            </div>
            <div class="lbm-app__main flex flex-col gap-2">
                <div class="flex items-center gap-2" v-for="ingredient in recipe.ingredients">
                    {{ ingredient.count }}&nbsp;&times;
                    <img
                        :src="getItemById(ingredient.item_id).icon"
                        alt=""
                        class="border-2 w-6 h-6 rounded"
                        :class="[`border-gw2-rarity-${getItemById(ingredient.item_id).rarity}`]"
                    />
                    <span :class="[`text-gw2-rarity-${getItemById(ingredient.item_id).rarity}`]">{{
                        getItemById(ingredient.item_id).name
                    }}</span>
                </div>
            </div>
            <div class="lbm-app__footer">
                <lbm-app-footer></lbm-app-footer>
            </div>
        </div>
    </template>
</template>

<style scoped>
@import '@/assets/main.scss';
</style>
