<template>
    <div class="bg-base-300 p-2 rounded-xl border border-base-100 flex gap-2 select-none">
        <button
            class="lbm-btn lbm-btn-sm lbm-btn-square self-start no-animation"
            :class="{
                'lbm-btn-success': checked && !auto,
                'lbm-btn-info': checked && auto,
                'lbm-btn-neutral': !checked && !auto,
            }"
            @click="
                () => {
                    auto || $emit('toggle-task', task.id);
                }
            "
        >
            <IconSquareCheck class="shrink-0 size-5" v-if="checked" />
            <template v-else>
                <IconSquareAsterisk class="text-base-content shrink-0 size-5" v-if="auto" />
                <IconSquare class="shrink-0 size-5" v-else />
            </template>
        </button>
        <div class="flex flex-col flex-1">
            <div
                class="font-semibold min-h-8 flex items-center"
                :class="{ 'line-through italic': checked }"
            >
                {{ task.title || task.name || task.id }}
            </div>
            <div
                v-if="task.description && !checked"
                class="text-sm task-description"
                v-html="markdown.render(task.description)"
            ></div>
        </div>
        <div class="flex justify-end gap-2">
            <button
                class="lbm-btn lbm-btn-sm lbm-btn-neutral lbm-btn-square"
                v-if="task.waypoint"
                @click="
                    $emit(
                        'copy-to-clipboard',
                        `${task.title || task.name || task.id} - ${task.waypoint}`,
                    )
                "
            >
                <IconMapPin class="size-5" />
            </button>
            <a
                :href="task.link"
                target="_blank"
                class="lbm-btn lbm-btn-sm lbm-btn-neutral lbm-btn-square"
                v-if="task.link"
            >
                <IconBook2 class="size-5" />
            </a>
            <button class="lbm-btn lbm-btn-sm lbm-btn-neutral lbm-btn-square">
                <IconEyeOff class="size-5" />
            </button>
        </div>
    </div>
    <!-- <pre>{{ task }}</pre> -->
</template>

<style lang="scss" scoped>
@use '../../assets/main.scss';

.task-description :deep(p) {
    margin: 0;
}
</style>

<script setup>
import { markdown } from '@/services/markdown';

defineProps(['task', 'auto', 'checked']);
defineEmits(['toggle-task', 'copy-to-clipboard']);

import IconSquare from '@/components/icons/IconSquare.vue';
import IconSquareCheck from '@/components/icons/IconSquareCheck.vue';
import IconSquareAsterisk from '@/components/icons/IconSquareAsterisk.vue';
import IconEyeOff from '@/components/icons/IconEyeOff.vue';
import IconMapPin from '@/components/icons/IconMapPin.vue';
import IconBook2 from '@/components/icons/IconBook2.vue';
</script>
