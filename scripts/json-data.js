const fs = require('node:fs');

const args = process.argv;
const type = args[2];

if (type === undefined) {
    throw new Error('Please provide export type');
}

const endpoints = {
    'homestead-cats': {
        path: './src/data/gw2-homestead-cats.json',
        url: 'https://lebusmagique.org/gw2/homestead/cats/',
    },
    'homestead-nodes': {
        path: './src/data/gw2-homestead-nodes.json',
        url: 'https://lebusmagique.org/gw2/homestead/nodes/',
    },
    'wizard-vault-objectives': {
        path: './src/data/gw2-wizard-vault-objectives.json',
        url: 'https://lebusmagique.org/gw2/wizard-vault/objectives/',
    },
    // 'gw2api-guild-upgrades': {
    //     path: './src/data/gw2api-guild-upgrades.json',
    //     url: 'https://api.guildwars2.com/v2/guild/upgrades?ids=all&lang=fr',
    // },
    'guild-decorations': {
        path: './src/data/gw2-guild-decorations.json',
        url: 'https://lebusmagique.org/gw2/guild/decorations/',
    },
    fishes: {
        path: './src/data/gw2-fishes.json',
        url: 'https://lebusmagique.org/gw2/fishing/fishes/',
    },
    'gw2api-specializations': {
        path: './src/data/gw2api-specializations.json',
        url: 'https://api.guildwars2.com/v2/specializations?ids=all&lang=fr',
    },
};

if (!endpoints[type] && type !== 'all') {
    throw new Error('Provided wrong export type');
}

if (type === 'all') {
    Object.keys(endpoints).forEach((endpoint) => {
        const { url, path } = endpoints[endpoint];
        saveOnlineJsonToLocal(url, path);
    });
    return;
}

const { url, path } = endpoints[type];
saveOnlineJsonToLocal(url, path);

async function saveOnlineJsonToLocal(url, path) {
    if (!url || !path) {
        throw new Error('No Url or Path provided');
    }
    try {
        const response = await fetch(url);
        const content = await response.json();
        fs.writeFile(path, JSON.stringify(content), (err) => {
            if (err) {
                throw new Error(err);
            }
        });
    } catch (err) {
        console.error(err);
    }
}
