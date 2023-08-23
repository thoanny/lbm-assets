<script setup>

</script>

<template>
    <nav role='navigation' class="menu">
        <label for="menu">Menu <i class="fa fa-bars"></i></label>
        <input type="checkbox" id="menu">
        <ul>
            <li class="menu-hasdropdown">
                <label for="about">
                    <img src="https://www.lebusmagique.fr/medias/images/157354.png" alt="">
                    LBM
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd" />
                    </svg>
                </label>
                <input type="checkbox" id="about">
                <ul class="menu-dropdown">
                    <li><a href="">
                            <img src="https://www.lebusmagique.fr/medias/images/ic.ne-coeur-plein.png" alt="">
                            Les activités
                        </a></li>
                    <li><a href="">
                            <img src="https://www.lebusmagique.fr/medias/images/041633-yellow-comment-bubbles-icon-transport-travel-transportation-school-bus2.png"
                                alt="">
                            Nous rejoindre ?
                        </a></li>
                    <li><a href="">
                            <img src="https://www.lebusmagique.fr/medias/images/commandantrouge.png" alt="">
                            L'équipe Staff LBM</a></li>
                    <li><a href="">Rejoindre le staff</a></li>
                    <li><a href="">Rangs, purge et règles</a></li>
                    <li><a href="">History</a></li>
                    <li><a href="">History</a></li>
                    <li><a href="">History</a></li>
                    <li><a href="">History</a></li>
                    <li><a href="">History</a></li>
                    <li><a href="">History</a></li>
                    <li><a href="">History</a></li>
                    <li><a href="">Mission</a></li>
                    <li class="menu-hasdropdown menu-hasflyout">
                        <label for="services">
                            Services
                        </label>
                        <input type="checkbox" id="services">
                        <ul class="menu-dropdown">
                            <li><a href="">Service 1</a></li>
                            <li><a href="">Service 2</a></li>
                            <li><a href="">Service 3</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li><a href="#">Succès</a></li>
            <li><a href="#">Outils</a></li>
            <li><a href="#">Guides</a></li>
            <li><a href="#">Expéditions</a></li>
            <li><a href="#">HoT</a></li>
            <li><a href="#">PoF</a></li>
            <li><a href="#">EoD</a></li>
            <li><a href="#">SotO</a></li>
        </ul>
        <ul>
            <li>

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
    gap: .5rem;
    padding: .75rem .75rem;
    height: 100%;
}

.menu img {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
    object-position: center;
}

.menu svg {
    width: 1.25rem;
    height: 1.25rem;
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
        -webkit-animation: grow 0.5s ease-in-out;
        animation: grow 0.5s ease-in-out;
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

    .menu-hasdropdown label:after {
        content: '';
    }

    .menu-hasdropdown:hover>ul {
        display: block;
        -webkit-animation: grow 0.5s ease-in-out;
        animation: grow 0.5s ease-in-out;
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