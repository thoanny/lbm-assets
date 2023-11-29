<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import eventsTimerData from '../../data/EventsTimer.events.json';

const WIDTH = 10;
const ONE_MINUTE = 60000;
const TOAST_TIMEOUT = 3000;

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
const eventModal = ref({
    isActive: false,
    row: {},
    event: {}
});
const eventsCompleted = ref([]);
const toasts = ref({});
const hiddenCategories = ref([]);
const hiddenRows = ref([]);

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

function handleEventModal(row, event) {
    if (event.name && (event.link || event.chatlink)) {
        eventModal.value.isActive = !eventModal.value.isActive;
        eventModal.value.row = row;
        eventModal.value.event = event;
    }
}

function handleEventComplete() {
    const eventId = eventModal.value.event.id;
    const eventName = eventModal.value.event.name;
    const i = eventsCompleted.value.indexOf(eventId);
    const t = uuidv4();

    if (i < 0) {
        eventsCompleted.value.push(eventId);
        toasts.value[t] = `"${eventName}" marqué comme terminé.`;
    } else {
        eventsCompleted.value.splice(i, 1);
        toasts.value[t] = `"${eventName}" marqué comme non terminé.`;
    }
    setTimeout(removeToast, TOAST_TIMEOUT, t);
    localStorage.setItem('lbm-et-events', JSON.stringify(eventsCompleted.value));
}

function isEventCompleted(id) {
    return eventsCompleted.value.indexOf(id) >= 0;
}

function isCategoryHidden(uid) {
    return hiddenCategories.value.indexOf(uid) >= 0;
}

function isRowHidden(uid) {
    return hiddenRows.value.indexOf(uid) >= 0;
}

function initEventsCompleted() {
    const localEventsCompleted = JSON.parse(localStorage.getItem('lbm-et-events'));
    if (localEventsCompleted) {
        eventsCompleted.value = localEventsCompleted;
    }
}

function resetEventsCompleted() {
    eventsCompleted.value = [];
    localStorage.removeItem('lbm-et-events');

    const t = uuidv4();
    toasts.value[t] = 'Suivi des événements réinitialisé.';
    setTimeout(removeToast, TOAST_TIMEOUT, t);
}

function initHiddenCategoriesAndRows() {
    const localHiddenCategories = JSON.parse(localStorage.getItem('lbm-et-hidden-categories'));
    if (localHiddenCategories) {
        hiddenCategories.value = localHiddenCategories;
    }

    const localHiddenRows = JSON.parse(localStorage.getItem('lbm-et-hidden-rows'));
    if (localHiddenRows) {
        hiddenRows.value = localHiddenRows;
    }
}

initSettings();
initEventsCompleted();
initHiddenCategoriesAndRows();

function copyToClipboard(name, content) {
    if (!name || !content) {
        return;
    }

    navigator.clipboard.writeText(`${name} - ${content}`);

    const t = uuidv4();
    toasts.value[t] = `Code de chat copié : "${name}".`;
    setTimeout(removeToast, TOAST_TIMEOUT, t);
}

function removeToast(t) {
    if (typeof toasts.value[t] === 'undefined') {
        return;
    }
    delete toasts.value[t];
}

function toggleHideCategory(uid) {
    const i = hiddenCategories.value.indexOf(uid);

    if (i < 0) {
        hiddenCategories.value.push(uid);
    } else {
        hiddenCategories.value.splice(i, 1);
    }
    localStorage.setItem('lbm-et-hidden-categories', JSON.stringify(hiddenCategories.value));
}

function toggleHideRow(uid) {
    const i = hiddenRows.value.indexOf(uid);

    if (i < 0) {
        hiddenRows.value.push(uid);
    } else {
        hiddenRows.value.splice(i, 1);
    }
    localStorage.setItem('lbm-et-hidden-rows', JSON.stringify(hiddenRows.value));
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
    <!-- <pre>{{ eventsCompleted }}</pre> -->
    <div class="lbm-et" v-if="categories">
        <div class="lbm-et__hscroll" ref="el">
            <div v-for="category in categories" :key="category.uid" v-show="!isCategoryHidden(category.uid)">
                <div class="lbm-et__category" :style="{ width: WIDTH * 24 * 60 + 'px' }" v-if="settings.showCategoryName">
                    <span class="sticky left-2 bangers">{{ category.name }}</span>
                </div>
                <div class="lbm-et__row flex flex-col" v-for="row in category.rows" :key="row.uid"
                    v-show="!isRowHidden(row.uid)">
                    <div class="lbm-et__row__name" :style="{ width: WIDTH * 24 * 60 + 'px' }"
                        v-if="row.name && settings.showRowName">
                        <a :href="row.link" target="_blank"
                            class="sticky left-2 bangers text-white inline-flex gap-1 items-center no-underline"
                            v-if="row.link">
                            {{ row.name }}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
                                class="w-5 h-5" fill="currentColor">
                                <path
                                    d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
                            </svg>
                        </a>
                        <span class="sticky left-2 bangers" v-else>{{ row.name }}</span>
                    </div>
                    <div class="lbm-et__events">
                        <div class="lbm-et__events__event" v-for="e in row.data" :key="e.uid"
                            :style="{ width: e.duration * WIDTH + 'px', background: e.background }"
                            @contextmenu.prevent="handleEventModal(row, e)"
                            @click.prevent="copyToClipboard(e.name, e.chatlink)">
                            <div v-text="convertMinutesToText(e.start)" v-if="settings.showEventHour"></div>
                            <div class="truncate font-bold"
                                :class="{ 'line-through italic opacity-50': isEventCompleted(e.id) }">{{
                                    e.name }}
                            </div>
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
                <label for="modalVisibility" class="lbm-btn lbm-btn-square lbm-btn-sm lbm-btn-primary" @click="false">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="h-5 w-5"
                        fill="currentColor">
                        <path
                            d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                    </svg>
                </label>
                <input type="checkbox" id="modalVisibility" class="lbm-modal-toggle" />
                <div class="lbm-modal">
                    <div class="lbm-modal-box">
                        <h3 class="text-lg font-bold mb-4 flex justify-start iems-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
                                class="h-8 w-8" fill="currentColor">
                                <path
                                    d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                            </svg>
                            Afficher/masquer des catégories et lignes
                        </h3>
                        <ul class="lbm-menu bg-base-200 rounded-box">
                            <li v-for="category in categories" :key="category.uid">
                                <a @click.prevent="toggleHideCategory(category.uid)">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
                                        class="h-4 w-4" fill="currentColor" v-if="isCategoryHidden(category.uid)">
                                        <path
                                            d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
                                        class="h-4 w-4" fill="currentColor" v-else>
                                        <path
                                            d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                    </svg>
                                    {{ category.name || 'Sans titre' }}
                                </a>
                                <ul v-if="!isCategoryHidden(category.uid)">
                                    <li v-for="row in category.rows" :key="row.uid">
                                        <a @click.prevent="toggleHideRow(row.uid)">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960"
                                                width="24" class="h-4 w-4" fill="currentColor" v-if="isRowHidden(row.uid)">
                                                <path
                                                    d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960"
                                                width="24" class="h-4 w-4" fill="currentColor" v-else>
                                                <path
                                                    d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                            </svg>
                                            {{ row.name || 'Sans titre' }}
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <label for="modalVisibility" class="lbm-btn lbm-btn-primary lbm-btn-sm mt-4">Fermer</label>
                    </div>
                    <label class="lbm-modal-backdrop" for="modalVisibility">Close</label>
                </div>
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
                        <div class="mb-3">
                            <label class="cursor-pointer flex items-center justify-start gap-2">
                                <input type="checkbox" class="lbm-toggle lbm-toggle-sm lbm-toggle-success"
                                    v-model="settings.showEventHour" @change="saveSettings" />
                                <span class="lbm-label-text">Afficher l'heure des événements</span>
                            </label>
                        </div>
                        <div>
                            <button class="lbm-btn lbm-btn-sm text-xs" @click.prevent="resetEventsCompleted">Réinitialiser
                                le suivi des événements</button>
                        </div>

                        <label for="modalSettings" class="lbm-btn lbm-btn-primary lbm-btn-sm mt-4">Fermer</label>
                    </div>
                    <label class="lbm-modal-backdrop" for="modalSettings">Close</label>
                </div>
            </div>
        </div>

        <input type="checkbox" id="modalEvent" class="lbm-modal-toggle" v-model="eventModal.isActive" />
        <div class="lbm-modal lbm-modal-bottom sm:lbm-modal-middle">
            <div class="lbm-modal-box">
                <h3 class="text-lg font-bold mb-6 text-center">
                    {{ eventModal.event.name }}
                </h3>
                <h4 class="font-bold italic -mt-5 mb-6 opacity-50 text-center" v-if="eventModal.row.name">
                    {{ eventModal.row.name }}
                </h4>
                <a :href="eventModal.event.link" target="_blank" class="lbm-btn lbm-btn-block mb-2"
                    v-if="eventModal.event.link">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="w-5 h-5"
                        fill="currentColor">
                        <path
                            d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
                    </svg>
                    Plus d'infos sur cet événement
                </a>
                <button class="lbm-btn lbm-btn-block mb-2" v-if="eventModal.event.chatlink"
                    @click.prevent="copyToClipboard(eventModal.event.name, eventModal.event.chatlink)">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="h-5 w-5"
                        fill="currentColor">
                        <path d="M600-160v-80h120v-480H600v-80h200v640H600Zm-440 0v-640h200v80H240v480h120v80H160Z" />
                    </svg>
                    Copier le code de chat GW2
                </button>
                <button class="lbm-btn lbm-btn-block mb-2" @click.prevent="handleEventComplete">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="h-5 w-5"
                        fill="currentColor" v-if="!isEventCompleted(eventModal.event.id)">
                        <path
                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="h-5 w-5"
                        fill="currentColor" v-else>
                        <path
                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q8 0 15 1.5t14 4.5l-74 74H200v560h560v-266l80-80v346q0 33-23.5 56.5T760-120H200Zm261-160L235-506l56-56 170 170 367-367 57 55-424 424Z" />
                    </svg>
                    {{ (isEventCompleted(eventModal.event.id)) ? 'Marquer comme non terminé' : 'Marquer comme terminé' }}
                </button>
                <label for="modalEvent" class="lbm-btn lbm-btn-primary mt-4 lbm-btn-block">Fermer</label>
            </div>
            <label class="lbm-modal-backdrop" for="modalEvent">Close</label>
        </div>
        <div class="lbm-toast" style="z-index:1001" v-if="toasts">
            <div class="lbm-alert lbm-alert-success text-xs py-2 px-3 font-bold gap-1" v-for="toast, t in toasts" :key="t">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-4 w-4" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ toast }}</span>
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