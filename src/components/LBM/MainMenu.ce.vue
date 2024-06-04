<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import menu from '@/data/lbm-menu.json';

const showMenu = ref(false);
const menuOpen = ref(null);
const submenuOpen = ref(null);
const menuEl = ref();

const onClickOutsideMenu = (event) => {
  // console.log(event.composedPath().includes(menuEl.value));
  if (!event.composedPath().includes(menuEl.value) && menuOpen.value !== null) {
    console.log('onClickOutsideMenu');
    // menuOpen.value = null;
    // submenuOpen.value = null;
  }
};

onMounted(() => {
  window.addEventListener('click', onClickOutsideMenu);
});
onBeforeUnmount(() => {
  window.removeEventListener('click', onClickOutsideMenu);
});
</script>

<template>
  <nav role="navigation" class="menu">
    <ul class="bg-black bg-opacity-50 py-2 flex justify-end gap-2 px-4 social-networks">
      <li>
        <a href="#!">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path
              d="M391.2 103.5H352.5v109.7h38.6zM285 103H246.4V212.8H285zM120.8 0 24.3 91.4V420.6H140.1V512l96.5-91.4h77.3L487.7 256V0zM449.1 237.8l-77.2 73.1H294.6l-67.6 64v-64H140.1V36.6H449.1z"
            />
          </svg>
        </a>
      </li>
      <li>
        <a href="#!">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path
              d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"
            />
          </svg>
        </a>
      </li>
      <li>
        <a href="#!">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
            <path
              d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
            />
          </svg>
        </a>
      </li>
      <li>
        <a href="#!">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor">
            <path
              d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
            />
          </svg>
        </a>
      </li>
      <li>
        <a href="#!">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor">
            <path
              d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"
            />
          </svg>
        </a>
      </li>
      <li>
        <a href="#!">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
            <path
              d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
            />
          </svg>
        </a>
      </li>
      <li>
        <a href="#!">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
            <path
              d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
            />
          </svg>
        </a>
      </li>
    </ul>
    <ul class="bg-red-500 px-4" ref="menuEl">
      <li class="mr-4">
        <a href="#!" id="logo" class="-my-4 relative z-20">
          <img
            src="https://gaming.lebusmagique.fr/genshin-impact-timeline/logo-192.png"
            class="!w-20 !h-20 rounded"
            alt=""
          />
        </a>
      </li>
      <li class="flex lg:hidden" :class="{ active: showMenu }">
        <a href="#!" @click.prevent="showMenu = !showMenu" class="!pr-3 !h-12">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clip-rule="evenodd"
              />
            </svg>
            Menu
          </span>
        </a>
      </li>
      <li
        v-for="(m, i) in menu"
        :class="{ 'menu-hasdropdown hidden lg:block': m.childs?.length, active: menuOpen === i }"
        :key="i"
      >
        <a href="#!" v-if="m.childs?.length" @click.prevent="menuOpen = menuOpen === i ? null : i">
          <img :src="m.icon" v-if="m.icon" alt="" />
          {{ m.title }}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
        <a :href="m.url" v-else>
          <img :src="m.icon" v-if="m.icon" alt="" />
          {{ m.title }}
        </a>
        <ul class="menu-dropdown" v-if="m.childs?.length" :class="{ active: menuOpen == i }">
          <li
            v-for="(s0, j) in m.childs"
            :class="{
              'menu-hasdropdown menu-hasflyout': s0.childs?.length,
              active: submenuOpen === j,
            }"
            :key="j"
          >
            <a
              href="#!"
              v-if="s0.childs?.length"
              @click.prevent="submenuOpen = submenuOpen === j ? null : j"
            >
              <span>
                <img :src="s0.icon" v-if="s0.icon" alt="" />
                {{ s0.title }}
              </span>
              <span v-if="s0.extensions" :class="'ext-' + s0.extensions.join('-')"></span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
            <a v-else :href="s0.url">
              <span>
                <img :src="s0.icon" v-if="s0.icon" alt="" />
                {{ s0.title }}
              </span>
              <span v-if="s0.extensions" :class="'ext-' + s0.extensions.join('-')"></span>
            </a>
            <ul
              class="menu-dropdown"
              v-if="s0.childs?.length"
              :class="{ active: submenuOpen == j }"
            >
              <li v-for="s1 in s0.childs" :key="s1">
                <a :href="s1.url">
                  <span>
                    <img :src="s1.icon" v-if="s1.icon" alt="" />
                    {{ s1.title }}
                  </span>
                  <span v-if="s1.extensions" :class="'ext-' + s1.extensions.join('-')"></span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li class="flex-1"></li>
      <li class="menu-hasdropdown menu-hasdropdown-right" :class="{ active: menuOpen == 9999998 }">
        <a
          href="#!"
          class="!pr-3 !h-12 w-12 !justify-center"
          @click.prevent="menuOpen = menuOpen === 9999998 ? null : 9999998"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 search-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </a>
        <ul class="menu-dropdown" :class="{ active: menuOpen == 9999998 }">
          <li class="py-2 px-3 no-hover">
            <div class="lbm-join">
              <div>
                <div>
                  <input
                    class="lbm-input lbm-input-bordered lbm-join-item"
                    placeholder="Chercher sur le site"
                  />
                </div>
              </div>
              <button class="lbm-btn lbm-join-item no-animation">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 search-icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </li>
      <li
        class="menu-hasdropdown menu-hasdropdown-right h-12"
        :class="{ active: menuOpen == 9999999 }"
      >
        <a
          href="#!"
          class="!pr-3"
          @click.prevent="menuOpen = menuOpen === 9999999 ? null : 9999999"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path fill="#fff" d="M10 4H22V28H10z"></path>
            <path d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#092050"></path>
            <path
              d="M25,4h6V28h-6c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
              transform="rotate(180 26 16)"
              fill="#be2a2c"
            ></path>
            <path
              d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
              opacity=".15"
            ></path>
            <path
              d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
              fill="#fff"
              opacity=".2"
            ></path>
          </svg>
        </a>
        <ul class="menu-dropdown" :class="{ active: menuOpen == 9999999 }">
          <li>
            <a href="#!">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                class="flag-icon"
              >
                <path fill="#fff" d="M10 4H22V28H10z"></path>
                <path
                  d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
                  fill="#092050"
                ></path>
                <path
                  d="M25,4h6V28h-6c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
                  transform="rotate(180 26 16)"
                  fill="#be2a2c"
                ></path>
                <path
                  d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
                  opacity=".15"
                ></path>
                <path
                  d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
                  fill="#fff"
                  opacity=".2"
                ></path>
              </svg>
              <span>Français</span>
            </a>
          </li>
          <li>
            <a href="#!">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  class="flag-icon"
                >
                  <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect>
                  <path
                    d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z"
                    fill="#fff"
                  ></path>
                  <path
                    d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z"
                    fill="#b92932"
                  ></path>
                  <path
                    d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z"
                    fill="#b92932"
                  ></path>
                  <path
                    d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z"
                    fill="#fff"
                  ></path>
                  <rect x="13" y="4" width="6" height="24" fill="#fff"></rect>
                  <rect x="1" y="13" width="30" height="6" fill="#fff"></rect>
                  <rect x="14" y="4" width="4" height="24" fill="#b92932"></rect>
                  <rect
                    x="14"
                    y="1"
                    width="4"
                    height="30"
                    transform="translate(32) rotate(90)"
                    fill="#b92932"
                  ></rect>
                  <path
                    d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z"
                    fill="#b92932"
                  ></path>
                  <path
                    d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z"
                    fill="#b92932"
                  ></path>
                  <path
                    d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
                    opacity=".15"
                  ></path>
                  <path
                    d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
                    fill="#fff"
                    opacity=".2"
                  ></path>
                </svg>
                <span>English</span>
              </span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
    <div class="menu-responsive" v-show="showMenu">
      <ul class="sm:ml-28 !pt-4 !px-0 sm:!p-0 sm:max-w-sm bg-green-500 !absolute w-full z-10">
        <li
          v-for="(m, i) in menu"
          :class="{ 'menu-hasdropdown block lg:hidden': m.childs?.length, active: menuOpen === i }"
          :key="i"
        >
          <a
            href="#!"
            v-if="m.childs?.length"
            @click.prevent="menuOpen = menuOpen === i ? null : i"
          >
            <img :src="m.icon" v-if="m.icon" alt="" />
            {{ m.title }}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <a :href="m.url" v-else>
            <img :src="m.icon" v-if="m.icon" alt="" />
            {{ m.title }}
          </a>

          <ul class="menu-dropdown" v-if="m.childs?.length" :class="{ active: menuOpen == i }">
            <li
              v-for="(s0, j) in m.childs"
              :class="{
                'menu-hasdropdown menu-hasflyout': s0.childs?.length,
                active: submenuOpen === j,
              }"
              :key="j"
            >
              <a
                href="#!"
                v-if="s0.childs?.length"
                @click.prevent="submenuOpen = submenuOpen === j ? null : j"
              >
                <span>
                  <img :src="s0.icon" v-if="s0.icon" alt="" />
                  {{ s0.title }}
                </span>
                <span v-if="s0.extensions" :class="'ext-' + s0.extensions.join('-')"></span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a v-else :href="s0.url">
                <span>
                  <img :src="s0.icon" v-if="s0.icon" alt="" />
                  {{ s0.title }}
                </span>
                <span v-if="s0.extensions" :class="'ext-' + s0.extensions.join('-')"></span>
              </a>
              <ul
                class="menu-dropdown"
                v-if="s0.childs?.length"
                :class="{ active: submenuOpen == j }"
              >
                <li v-for="s1 in s0.childs" :key="s1">
                  <a :href="s1.url">
                    <span>
                      <img :src="s1.icon" v-if="s1.icon" alt="" />
                      {{ s1.title }}
                    </span>
                    <span v-if="s1.extensions" :class="'ext-' + s1.extensions.join('-')"></span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style>
@import '../../assets/main.scss';

.menu > ul {
  display: flex;
  align-items: center;
}

.menu ul {
  @apply my-0 relative;
  list-style: none;
}

.menu,
.menu a,
.menu label {
  color: #e2e2e2;
  text-decoration: none;
}

.menu a,
.menu label {
  display: flex;
  white-space: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 0 0.75rem 0.75rem;
  height: 100%;
}

.menu a > span,
.menu label > span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu ul ul a,
.menu ul ul label {
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
}

.menu ul ul {
  padding: 0;
  margin: 0;
  display: none;
}

.menu img {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
  object-position: center;
}

.menu #logo {
  padding: 0;
}

.menu svg {
  width: 1.25rem;
  height: 1.25rem;
}

.menu ul ul svg:not(.search-icon):not(.flag-icon) {
  transform: rotate(-90deg);
}

.menu-dropdown,
.menu input[type='checkbox'] {
  display: none;
}

.menu label:hover {
  cursor: pointer;
}

.menu ul.social-networks a {
  @apply w-6 h-6 bg-red-500 p-0 flex items-center justify-center rounded-full;
}

.menu ul.social-networks a svg {
  @apply w-3 h-3;
}

.menu-dropdown a {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-dropdown.active {
  display: block;
}

.menu-hasdropdown > ul {
  position: absolute;
  /* top: 0; */
  left: 0;
  background: #035e8d;
}

.menu-responsive > ul {
  max-height: calc(100dvh - 8rem);
  overflow: auto;
}

.menu-responsive .menu-hasdropdown > ul {
  position: relative;
}

.menu-hasdropdown-right > ul {
  left: initial;
  right: 0;
}

.menu-hasflyout > ul {
  left: 100%;
  top: 0;
}

.menu-responsive .menu-hasflyout > ul {
  left: 0;
}

.menu li {
  position: relative;
}

.active {
  background: green;
}

.menu li:hover:not(.active):not(.no-hover) {
  background: gray;
}
</style>
