<script setup>
import menu from '@/lbm-menu.json'

</script>

<template>
    <nav role='navigation' class="menu">
        <label for="menu">Menu
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                    clip-rule="evenodd" />
            </svg>
        </label>
        <input type="checkbox" id="menu">
        <ul>
            <li>
                <a href="" id="logo">
                    <img src="https://gaming.lebusmagique.fr/genshin-impact-timeline/logo-192.png" alt="">
                </a>
            </li>
            <li v-for="m, i in menu" :class="{ 'menu-hasdropdown': m.childs?.length }">
                <label :for="'menu-' + i" v-if="m.childs?.length">
                    <img :src="m.icon" v-if="m.icon" alt="">
                    {{ m.title }}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd" />
                    </svg>
                </label>
                <a :href="m.url" v-else>
                    <img :src="m.icon" v-if="m.icon" alt="">
                    {{ m.title }}
                </a>
                <input type="checkbox" :id="'menu-' + i" v-if="m.childs?.length">
                <ul class="menu-dropdown" v-if="m.childs?.length">
                    <li v-for="s0, j in m.childs" :class="{ 'menu-hasdropdown menu-hasflyout': s0.childs?.length }">
                        <label :for="'submenu-' + j" v-if="s0.childs?.length">
                            <span>
                                <img :src="s0.icon" v-if="s0.icon" alt="">
                                {{ s0.title }}
                            </span>
                            <span v-if="s0.extensions" :class="'ext-' + s0.extensions.join('-')"></span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                    clip-rule="evenodd" />
                            </svg>
                        </label>
                        <a v-else :href="s0.url">
                            <span>
                                <img :src="s0.icon" v-if="s0.icon" alt="">
                                {{ s0.title }}
                            </span>
                            <span v-if="s0.extensions" :class="'ext-' + s0.extensions.join('-')"></span>
                        </a>
                        <input type="checkbox" :id="'submenu-' + j" v-if="s0.childs?.length">
                        <ul class="menu-dropdown" v-if="s0.childs?.length">
                            <li v-for="s1 in s0.childs">
                                <a :href="s1.url">
                                    <span>
                                        <img :src="s1.icon" v-if="s1.icon" alt="">
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
    </nav>
</template>

<style>
.menu {
    background: #035e8d;
    font-family: 'Open Sans';
    font-size: 14px;
    font-weight: 400;
}

.menu>ul {
    display: flex;
    align-items: center;
}

.menu ul {
    margin: 0;
    padding: 0;
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
    gap: .5rem;
    padding: .75rem 0 .75rem .75rem;
    height: 100%;
}

.menu a>span,
.menu label>span {
    display: flex;
    align-items: center;
    gap: .5rem;
}

.menu ul ul a,
.menu ul ul label {
    padding: .5rem .75rem .5rem .5rem;
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

.menu #logo img {
    width: 3rem;
    height: 3rem;
}

.menu svg {
    width: 1.25rem;
    height: 1.25rem;
}

.menu ul ul svg {
    transform: rotate(-90deg);
}

.menu-dropdown,
.menu input[type=checkbox] {
    display: none;
}

.menu label:hover {
    cursor: pointer;
}

/* narrow styles */
@media screen and (max-width: 1024px) {

    .menu>ul,
    .menu-righticon {
        display: none;
    }

    input[type=checkbox]:checked+ul {
        display: block;
        /* -webkit-animation: grow 0.5s ease-in-out; */
        /* animation: grow 0.5s ease-in-out; */
    }
}

/* large styles */
@media screen and (min-width: 1025px) {

    .menu>label,
    input[type=checkbox] {
        display: none;
    }

    .menu a,
    .menu label {
        /* padding: .5rem .75rem; */
    }

    .menu>ul>li {
        display: inline-block;
    }

    .menu-hasdropdown {
        position: relative;
    }

    /* .menu-hasdropdown label:after {
        content: '';
    } */

    .menu-hasdropdown:hover>ul {
        display: block;
        /* -webkit-animation: grow 0.5s ease-in-out; */
        /* animation: grow 0.5s ease-in-out; */
    }

    .menu-hasdropdown>ul {
        position: absolute;
        top: 100%;
        left: 0;
        background: #035e8d;
    }

    .menu-hasflyout>ul {
        left: 100%;
        top: 0;
    }

    .menu-hasflyout .menu-downicon {
        display: none;
    }
}

/* look and feel only, not needed for core menu*/
@-webkit-keyframes grow {
    0% {
        display: none;
        opacity: 0;
    }

    50% {
        display: block;
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

@keyframes grow {
    0% {
        display: none;
        opacity: 0;
    }

    50% {
        display: block;
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

html {
    font-size: 100%;
}

body {
    font-family: "Roboto" sans-serif;
    line-height: 1.5;
}

.menu-dropdown a {
    /* padding: 15px 20px; */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* narrow  */
@media screen and (max-width: 1024px) {
    .menu>label {
        background: black;
        display: block;
        padding: 15px 20px;
        text-align: right;
    }

    .menu a,
    .menu label {
        padding: 15px 20px;
    }

    .menu-dropdown a {
        background: #024d74;
    }

    .menu-hasflyout>ul a {
        background: #023d5b;
    }
}

@media screen and (min-width: 1025px) {
    .menu {
        /* max-width: 1024px; */
        /* margin: 0 auto; */
    }
}
</style>