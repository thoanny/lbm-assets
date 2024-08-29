<template>
    <div class="my-4">
        <button class="sm:hidden">XS</button>
        <button class="hidden sm:block md:hidden">SM</button>
        <button class="hidden md:block lg:hidden">MD</button>
        <button class="hidden lg:block xl:hidden">LG</button>
        <button class="hidden xl:block 2xl:hidden">XL</button>
        <button class="hidden 2xl:block 3xl:hidden">2XL</button>
        <button class="hidden 3xl:block">3XL+</button>
    </div>
</template>

<style lang="scss" scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

button {
    @apply lbm-btn lbm-btn-block lbm-btn-sm lbm-btn-secondary;
}
</style>
