import './assets/main.css'

import { defineCustomElement } from 'vue';
import Example from './components/Example.ce.vue';

const ExampleElement = defineCustomElement(Example);
customElements.define('my-example', ExampleElement);