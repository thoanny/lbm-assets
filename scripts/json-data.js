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
