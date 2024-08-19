<script setup>
defineProps(['recipes', 'quantity', 'open']);
</script>

<template>
    <template v-for="recipe in recipes">
        <li v-for="ingredient in recipe.ingredients">
            <span>
                <img :src="ingredient.item.icon" alt="" class="h-5 w-5 rounded" />
                {{
                    quantity && quantity > ingredient.quantity
                        ? `${ingredient.quantity} (${ingredient.quantity * quantity})`
                        : ingredient.quantity
                }}
                &times; {{ ingredient.item.name }}
            </span>
            <ul v-if="ingredient.item.recipes.length > 0" v-show="open">
                <RecipeNested
                    :recipes="ingredient.item.recipes"
                    :quantity="ingredient.quantity * quantity"
                    :open="open"
                />
            </ul>
        </li>
        <li v-for="ingredient in recipe.guildIngredients">
            <span>
                <img :src="ingredient.icon" alt="" class="h-5 w-5 rounded" />
                {{
                    quantity && quantity > ingredient.count
                        ? `${ingredient.count} (${ingredient.count * quantity})`
                        : ingredient.count
                }}
                &times; {{ ingredient.name }}
            </span>
        </li>
    </template>
</template>
