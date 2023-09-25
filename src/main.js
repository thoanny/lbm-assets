import './assets/main.scss'
import '/node_modules/tippy.js/dist/tippy.css';

import { defineCustomElement } from 'vue';
import LBM_Menu from './components/LBM/Menu.ce.vue';
import GW2_WizardVault from './components/GW2/WizardVault.ce.vue';
import GW2_EventsTimer from './components/GW2/EventsTimer.ce.vue';

customElements.define('lbm-menu', defineCustomElement(LBM_Menu));
customElements.define('gw2-wizard-vault', defineCustomElement(GW2_WizardVault));
customElements.define('gw2-events-timer', defineCustomElement(GW2_EventsTimer));