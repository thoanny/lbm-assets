import './assets/main.css'

import { defineCustomElement } from 'vue';
// import Example from './components/Example.ce.vue';
import LBM_Menu from './components/LBM/Menu.ce.vue';
import GW2_WizardVault from './components/GW2/WizardVault.ce.vue';

// const ExampleElement = defineCustomElement(Example);
// customElements.define('my-example', ExampleElement);

customElements.define('lbm-menu', defineCustomElement(LBM_Menu));
customElements.define('gw2-wizard-vault', defineCustomElement(GW2_WizardVault));