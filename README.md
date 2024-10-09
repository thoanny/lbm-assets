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
(ne pas oublier l'atribut type=module !) et `<link rel="stylesheet" href="https://lbm-assets.vercel.app/index.css">` puis dans le code de la page, utiliser les balises CustomElements.

## CustomElements

### LBM Menu

Pour afficher le menu :

```html
<lbm-menu></lbm-menu>
```

**Attributs**

| Attribut | Description                                             | Exemple         |
| -------- | ------------------------------------------------------- | --------------- |
| color    | Changer la couleur principale du menu, code hexadécimal | color="#ff00ff" |

**Sprites**

Les images pour le sprite se trouvent dans : `src\sprites`. Le taille doit être de 24&times;24px.

**Éditeur de menu**

Pour utiliser l'éditeur du menu, il faut ajouter dans la page :

```html
<div id="lbm-menu-editor"></div>
```

### GW2 Wizard Vault

```html
<gw2-wizard-vault></gw2-wizard-vault>
```

Application de la chambre forte du sorcier en 3 onglets (objectifs, récompenses et héritage).

### GW2 Timers (Work in progress)

```html
<gw2-events-timer></gw2-events-timer>
```

Nouvelle version des timers des événements et worl boss de Guild Wars 2.

### Demande de ticket (Work in progress)

```html
<lbm-ticket-request></lbm-ticket-request>
```

### Compagnon de pêche

```html
<gw2-fishes></gw2-fishes>
```

### Recettes

Afficher une recette sous la forme d'un bloc :

```html
<gw2-recipe id="7283"></gw2-recipe>
```

Afficher une recette sous la forme d'une ligne :

```html
<gw2-recipe id="7283" display="inline"></gw2-recipe>
```

Afficher une recette sous la forme d'une liste :

```html
<gw2-recipe id="7283" display="list"></gw2-recipe>
```

### Décorations du pavillon

Afficher l'outil de décorations du pavillon.

⚠️ **L'URL de la page doit être ajoutée à GW2Auth !**

```html
<gw2-homestead></gw2-homestead>
```
