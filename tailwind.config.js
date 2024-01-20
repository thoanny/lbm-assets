/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        gw2: {
          rarity: {
            Junk: '#bbb',
            Basic: '#fff',
            Fine: '#5291f0',
            Masterwork: '#32b112',
            Rare: '#f0d022',
            Exotic: '#fa0',
            Ascended: '#f48',
            Legendary: '#93f'
          },
          'wizard-vault-objective': {
            wvw: '#ccaa00',
            pvp: '#cc5252',
            pve: '#44cc00'
          }
        }
      }
    }
  },
  safelist: [
    'text-gw2-rarity-Junk',
    'text-gw2-rarity-Basic',
    'text-gw2-rarity-Fine',
    'text-gw2-rarity-Masterwork',
    'text-gw2-rarity-Rare',
    'text-gw2-rarity-Exotic',
    'text-gw2-rarity-Ascended',
    'text-gw2-rarity-Legendary',
    'text-gw2-wizard-vault-objective-zvz',
    'text-gw2-wizard-vault-objective-pvp',
    'text-gw2-wizard-vault-objective-pve',
    'bg-gw2-rarity-Junk',
    'bg-gw2-rarity-Basic',
    'bg-gw2-rarity-Fine',
    'bg-gw2-rarity-Masterwork',
    'bg-gw2-rarity-Rare',
    'bg-gw2-rarity-Exotic',
    'bg-gw2-rarity-Ascended',
    'bg-gw2-rarity-Legendary',
    'bg-gw2-wizard-vault-objective-wvw',
    'bg-gw2-wizard-vault-objective-pvp',
    'bg-gw2-wizard-vault-objective-pve',
    'border-gw2-rarity-Junk',
    'border-gw2-rarity-Basic',
    'border-gw2-rarity-Fine',
    'border-gw2-rarity-Masterwork',
    'border-gw2-rarity-Rare',
    'border-gw2-rarity-Exotic',
    'border-gw2-rarity-Ascended',
    'border-gw2-rarity-Legendary',
    'border-gw2-wizard-vault-objective-wvw',
    'border-gw2-wizard-vault-objective-pvp',
    'border-gw2-wizard-vault-objective-pve'
  ],
  plugins: [daisyui],
  daisyui: {
    themes: ['dark'],
    base: false,
    prefix: 'lbm-'
  }
}
