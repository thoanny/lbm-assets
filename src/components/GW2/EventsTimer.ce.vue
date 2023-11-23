<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import eventsTimerData from '../../data/EventsTimer.events.json';

const WIDTH = 10;
const ONE_MINUTE = 60000;

const el = ref();
const cursorPosition = ref(0);
const interval = ref(null);
const categories = ref([]);
const settings = ref({
    showCategoryName: true,
    showRowName: true,
    showEventHour: true,
    isCentered: true,
});
const currentTime = ref('00:00');

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
    currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    if (settings.value.isCentered) {
        el.value.scrollLeft = posX;
    }
}

function resetSize() {
    if (interval.value) {
        clearInterval(interval.value);
        interval.value = null;
    }

    updatePosition();
    interval.value = setInterval(updatePosition, ONE_MINUTE);
}

function isCenteredToggle() {
    settings.value.isCentered = !settings.value.isCentered;
    if (settings.value.isCentered) {
        updatePosition();
    }
}

function initSettings() {
    const localSettings = JSON.parse(localStorage.getItem('lbm-et-settings'));
    if (localSettings) {
        settings.value = {
            showCategoryName: (localSettings.showCategoryName) ? true : false,
            showRowName: (localSettings.showRowName) ? true : false,
            showEventHour: (localSettings.showEventHour) ? true : false,
            isCentered: (localSettings.isCentered) ? true : false,
        }
    }
}

function saveSettings() {
    localStorage.setItem('lbm-et-settings', JSON.stringify(settings.value));
}

initSettings();

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

    el.value.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        el.value.scrollLeft += evt.deltaY * WIDTH / 2;
        settings.value.isCentered = false;
    });
});

onUnmounted(() => {
    clearInterval(interval.value);
    interval.value = null;
});

</script>

<template>
    <!-- <pre>{{ categories }}</pre> -->
    <div class="lbm-et" v-if="categories">
        <div class="lbm-et__hscroll" ref="el">
            <div v-for="category in categories" :key="category.uid">
                <div class="lbm-et__category" :style="{ width: WIDTH * 24 * 60 + 'px' }" v-if="settings.showCategoryName">
                    <span class="sticky left-2 bangers">{{ category.name }}</span>
                </div>
                <div class="lbm-et__row flex flex-col" v-for="row in category.rows" :key="row.uid">
                    <div class="lbm-et__row__name" :style="{ width: WIDTH * 24 * 60 + 'px' }"
                        v-if="row.name && settings.showRowName">
                        <span class="sticky left-2 bangers">{{ row.name }}</span>
                    </div>
                    <div class="lbm-et__events">
                        <div class="lbm-et__events__event" v-for="e in row.data" :key="e.uid"
                            :style="{ width: e.duration * WIDTH + 'px', background: e.background }">
                            <div v-text="convertMinutesToText(e.start)" v-if="settings.showEventHour"></div>
                            <div class="truncate font-bold">{{ e.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lbm-et__cursor" :style="{ 'left': cursorPosition }">
                <span class="py-1 px-2 mt-2 text-xs inline-block"
                    style="transform: translateX(calc(-50% + 1px));background:red;" v-text="currentTime"></span>
            </div>
        </div>
        <div class="lbm-et__toolbar absolute top-0 right-0">
            <div class="flex gap-1 bg-neutral rounded-bl-xl p-1">
                <button class="lbm-btn lbm-btn-sm lbm-btn-primary text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="h-5 w-5"
                        fill="currentColor">
                        <path
                            d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                    </svg>
                    Agents du Pacte
                </button>
                <button class="lbm-btn lbm-btn-square lbm-btn-sm" :class="{ 'lbm-btn-success': settings.isCentered }"
                    @click="isCenteredToggle">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="h-5 w-5"
                        fill="currentColor">
                        <path d="M440-80v-800h80v800h-80Zm160-200v-400h120v400H600Zm-360 0v-400h120v400H240Z" />
                    </svg>
                </button>
                <label for="modalSettings" class="lbm-btn lbm-btn-square lbm-btn-sm lbm-btn-primary" @click="openSettings">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="h-5 w-5"
                        fill="currentColor">
                        <path
                            d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
                    </svg>
                </label>
                <input type="checkbox" id="modalSettings" class="lbm-modal-toggle" />
                <div class="lbm-modal">
                    <div class="lbm-modal-box">
                        <h3 class="text-lg font-bold mb-4 flex justify-start iems-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
                                class="h-8 w-8" fill="currentColor">
                                <path
                                    d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
                            </svg>
                            Paramètres
                        </h3>
                        <div class="mb-2">
                            <label class="cursor-pointer flex items-center justify-start gap-2">
                                <input type="checkbox" class="lbm-toggle lbm-toggle-sm lbm-toggle-success"
                                    v-model="settings.showCategoryName" @change="saveSettings" />
                                <span class="lbm-label-text">Afficher le nom des catégories</span>
                            </label>
                        </div>
                        <div class="mb-2">
                            <label class="cursor-pointer flex items-center justify-start gap-2">
                                <input type="checkbox" class="lbm-toggle lbm-toggle-sm lbm-toggle-success"
                                    v-model="settings.showRowName" @change="saveSettings" />
                                <span class="lbm-label-text">Afficher le nom des lignes</span>
                            </label>
                        </div>
                        <div class="mb-2">
                            <label class="cursor-pointer flex items-center justify-start gap-2">
                                <input type="checkbox" class="lbm-toggle lbm-toggle-sm lbm-toggle-success"
                                    v-model="settings.showEventHour" @change="saveSettings" />
                                <span class="lbm-label-text">Afficher l'heure des événements</span>
                            </label>
                        </div>
                        <label for="modalSettings" class="lbm-btn lbm-btn-primary lbm-btn-sm mt-4">Fermer</label>
                    </div>
                    <label class="lbm-modal-backdrop" for="modalSettings">Close</label>
                </div>
            </div>
        </div>
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
    @apply relative pb-2 leading-4;

    &__hscroll {
        @apply overflow-x-auto scroll-smooth relative pt-10;
    }

    &__cursor {
        @apply absolute top-0 bottom-0;
        width: 2px;
        transform: translateX(-50%);
        background: red;
    }

    &__toolbar {}

    &__category {
        @apply text-xl;
    }

    &__row {
        &__name {
            @apply text-lg;
        }
    }

    &__events {
        @apply flex text-black my-1;

        &__event {
            @apply text-xs shrink-0 py-1 px-2 leading-4;
        }
    }

}
</style>