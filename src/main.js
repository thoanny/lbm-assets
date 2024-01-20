import './assets/main.scss';
import '/node_modules/tippy.js/dist/tippy.css';

import { defineCustomElement } from 'vue';
import LBM_MainMenu from './components/LBM/MainMenu.ce.vue';
import GW2_WizardVault from './components/GW2/WizardVault.ce.vue';
import GW2_EventsTimer from './components/GW2/EventsTimer.ce.vue';
import GW2_FishingCompanion from './components/GW2/FishingCompanion.ce.vue';
import GW2_ApiItemTooltip from './components/GW2/ApiItemTooltip.ce.vue';

customElements.define('lbm-menu', defineCustomElement(LBM_MainMenu));
customElements.define('gw2-wizard-vault', defineCustomElement(GW2_WizardVault));
customElements.define('gw2-events-timer', defineCustomElement(GW2_EventsTimer));
customElements.define('gw2-fishes', defineCustomElement(GW2_FishingCompanion));
customElements.define('gw2-api-item-tooltip', defineCustomElement(GW2_ApiItemTooltip));
