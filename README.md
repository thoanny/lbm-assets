# Assets du Bus Magique

Outils et ressources pour le site du Bus Magique.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Intégrer au site du Bus Magique

Sur e-monsie, dans "Options de référencement" puis "Balises méta supplémentaires", importer le script `<script type="module" src="https://lbm-assets.vercel.app/index.js"></script>`
 (ne pas oublier l'atribut type=module !) et dans le code de la page, utiliser les balises CustomElements.

## CustomElements

### LBM Menu

```html
<lbm-menu></lbm-menu>
```

*Work in progress*

### GW2 Wizard Vault

```html
<gw2-wizard-vault></gw2-wizard-vault>
```

Application de la chambre forte du sorcier en 3 onglets (objectifs, récompenses et héritage). L'API GW2 n'est pas encore à jour, donc tout est statique/manuel pour le moment.

### GW2 Timers

```html
<gw2-events-timer></gw2-events-timer>
```

Nouvelle version des timers des événements et worl boss de Guild Wars 2.

*Work in progress*