import './assets/main.scss';
import '/node_modules/tippy.js/dist/tippy.css';

import { defineCustomElement } from 'vue';
import { createPinia, setActivePinia } from 'pinia';

import LBM_MainMenu from './components/LBM/MainMenu.ce.vue';
import LBM_TicketRequest from './components/LBM/TicketRequest.ce.vue';
import GW2_WizardVault from './components/GW2/WizardVault.ce.vue';
import GW2_EventsTimer from './components/GW2/EventsTimer.ce.vue';
import GW2_FishingCompanion from './components/GW2/FishingCompanion.ce.vue';
import GW2_ApiItemTooltip from './components/GW2/ApiItemTooltip.ce.vue';
import LoremIpsum from './components/LoremIpsum.ce.vue';
import GW2_CharactersExploration from './components/GW2/CharactersExploration.ce.vue';
import LBM_AppFooter from './components/LBM/AppFooter.ce.vue';
import GW2_GuildHallHomesteadDecorations from './components/GW2/GuildHallHomesteadDecorations.ce.vue';
import GW2_Homestead from './components/GW2/Homestead.ce.vue';
import GW2_ApiItemRecipe from './components/GW2/ApiItemRecipe.ce.vue';
import GW2_UserAuth from './components/GW2/UserAuth.ce.vue';
import ResponsiveBreakpoints from './components/ResponsiveBreakpoints.ce.vue';
import GW2_SuperAdventureBox from './components/GW2/SuperAdventureBox.ce.vue';
import LBM_PagesList from './components/LBM/PagesList.ce.vue';
import GW2_Tasks from './components/GW2/Tasks.ce.vue';
import GW2_VoeSpecializations from './components/GW2/VoeSpecializations.ce.vue';

setActivePinia(createPinia());

customElements.define('lbm-menu', defineCustomElement(LBM_MainMenu));
customElements.define('lbm-ticket-request', defineCustomElement(LBM_TicketRequest));
customElements.define('gw2-wizard-vault', defineCustomElement(GW2_WizardVault));
customElements.define('gw2-events-timer', defineCustomElement(GW2_EventsTimer));
customElements.define('gw2-fishes', defineCustomElement(GW2_FishingCompanion));
customElements.define('gw2-api-item-tooltip', defineCustomElement(GW2_ApiItemTooltip));
customElements.define('lorem-ipsum', defineCustomElement(LoremIpsum));
customElements.define('gw2-characters-exploration', defineCustomElement(GW2_CharactersExploration));
customElements.define('lbm-app-footer', defineCustomElement(LBM_AppFooter));
customElements.define(
    'gw2-guild-hall-homestead-decorations',
    defineCustomElement(GW2_GuildHallHomesteadDecorations),
);
customElements.define('gw2-homestead', defineCustomElement(GW2_Homestead));
customElements.define('gw2-recipe', defineCustomElement(GW2_ApiItemRecipe));
customElements.define('responsive-breakpoints', defineCustomElement(ResponsiveBreakpoints));
customElements.define('gw2-user-auth', defineCustomElement(GW2_UserAuth));
customElements.define('gw2-sab', defineCustomElement(GW2_SuperAdventureBox));
customElements.define('lbm-pages-list', defineCustomElement(LBM_PagesList));
customElements.define('gw2-tasks', defineCustomElement(GW2_Tasks));
customElements.define('gw2-voe-specs', defineCustomElement(GW2_VoeSpecializations));
