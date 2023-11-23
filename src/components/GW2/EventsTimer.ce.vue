<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import eventsTimerData from '../../data/EventsTimer.events.json';

const WIDTH = 10;
const ONE_MINUTE = 60000;

const el = ref();
const cursorPosition = ref(0);
const interval = ref(null);
const categories = ref([]);

function convertMinutesToText(duration) {
    const date = new Date();
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    date.setUTCHours(hours, minutes, 0, 0);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function pad(d) {
    return d.toString().padStart(2, '0');
}

function updatePosition() {
    const now = new Date();
    const etWidth = el.value.offsetWidth;
    const posX = Math.floor((now.getUTCHours() * 60 + now.getUTCMinutes()) * WIDTH - (etWidth / 2));
    cursorPosition.value = (posX + etWidth / 2) + 'px';
    el.value.scrollLeft = posX;
}

function resetSize() {
    if (interval.value) {
        clearInterval(interval.value);
        interval.value = null;
    }

    updatePosition();
    interval.value = setInterval(updatePosition, ONE_MINUTE);
}

categories.value = eventsTimerData.map(c => {
    c.rows.map(r => {
        let start = 0;
        r.data = [];
        r.pattern.forEach((p, i) => {
            r.data.push({ ...{ 'id': r.uid + '-' + p, 'uid': r.uid + '-' + p + '-' + i }, ...r.events[p], ...{ 'start': start } });
            start += r.events[p].duration;
        });

        r.pattern = [];
        r.events = [];

        return r;
    })
    return c;
});

onMounted(() => {
    updatePosition();
    interval.value = setInterval(updatePosition, ONE_MINUTE);

    window.addEventListener('resize', resetSize);
});

onUnmounted(() => {
    clearInterval(interval.value);
    interval.value = null;
});

</script>

<template>
    <!-- <pre>{{ categories }}</pre> -->
    <div class="lbm-et" ref="el" v-if="categories">
        <div v-for="category in categories" :key="category.uid">
            <div class="lbm-et__category" :style="{ width: WIDTH * 24 * 60 + 'px' }">
                <span class="sticky left-2">{{ category.name }}</span>
            </div>
            <div class="lbm-et__row flex flex-col" v-for="row in category.rows" :key="row.uid">
                <div class="lbm-et__row__name" :style="{ width: WIDTH * 24 * 60 + 'px' }" v-if="row.name">
                    <span class="sticky left-2">{{ row.name }}</span>
                </div>
                <div class="lbm-et__events">
                    <div class="lbm-et__events__event" v-for="e in row.data" :key="e.uid"
                        :style="{ width: e.duration * WIDTH + 'px', background: e.background }">
                        <div v-text="convertMinutesToText(e.start)"></div>
                        <div class="truncate font-bold">{{ e.name }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="lbm-et__cursor" :style="{ '--left': cursorPosition }"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/main.scss';

$scrollbar: .75rem;

* {
    scrollbar-width: $scrollbar;
    scrollbar-color: hsl(var(--p) / var(--tw-bg-opacity)) hsl(var(--n) / var(--tw-bg-opacity));
}

*::-webkit-scrollbar {
    height: $scrollbar;
    width: $scrollbar;
}

*::-webkit-scrollbar-track {
    @apply bg-neutral;
    border-radius: $scrollbar;
}

*::-webkit-scrollbar-thumb {
    @apply bg-primary;
    border-radius: $scrollbar;
}


.lbm-et {
    @apply overflow-x-auto relative pb-2 leading-4 scroll-smooth;


    &__cursor {
        @apply absolute bg-red-500 top-0 bottom-0;
        width: 2px;
        transform: translateX(-50%);
        left: var(--left);
    }

    &__category {
        @apply text-2xl font-bold;
    }

    &__row {
        &__name {
            @apply text-xl font-semibold;
        }
    }

    &__events {
        @apply flex text-black my-1;

        &__event {
            @apply text-sm shrink-0 py-1 px-2 leading-4;
        }
    }

}
</style>