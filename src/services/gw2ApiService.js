import axios from 'axios';
import { useUserStore } from '@/stores/user';

const API_URL = 'https://api.guildwars2.com/v2';
const LOCALE = 'fr';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            useUserStore().refresh();
            return api(originalRequest);
        }
        useUserStore().logout();
        return Promise.reject(error);
    },
);

class Gw2ApiService {
    getCats() {
        return api.get('/home/cats', { params: { ids: 'all' } });
    }
    getNodes() {
        return api.get('/home/nodes', { params: { ids: 'all' } });
    }
    getGlyphs() {
        return api.get('/homestead/glyphs', { params: { ids: 'all' } });
    }
    getCategories() {
        return api.get('/homestead/decorations/categories', { params: { ids: 'all' } });
    }
    getDecorations() {
        return api.get('/homestead/decorations');
    }
    getDecorationsByIds(ids) {
        const $ids = ids.join(',');
        return api.get('/homestead/decorations', { params: { ids: $ids } });
    }
    getUserCats(token) {
        return api.get('/account/home/cats', { params: { access_token: token } });
    }
    getUserNodes(token) {
        return api.get('/account/home/nodes', { params: { access_token: token } });
    }
    getUserGlyphs(token) {
        return api.get('/account/homestead/glyphs', { params: { access_token: token } });
    }
    getUserDecorations(token) {
        return api.get('/account/homestead/decorations', { params: { access_token: token } });
    }
    getWizardsVaultListing() {
        return api.get('/wizardsvault/listings', { params: { ids: 'all' } });
    }
    getItemsByIds(ids) {
        const $ids = ids.join(',');
        return api.get('/items', { params: { ids: $ids, lang: LOCALE } });
    }
    getUserWizardVaultListing(token) {
        return api.get('/account/wizardsvault/listings', {
            params: { access_token: token },
        });
    }
    getUserWizardVaultDaily(token) {
        return api.get('/account/wizardsvault/daily', {
            params: {
                access_token: token,
                v: new Date().toISOString(),
            },
        });
    }
    getUserWizardVaultWeekly(token) {
        return api.get('/account/wizardsvault/weekly', {
            params: {
                access_token: token,
                v: new Date().toISOString(),
            },
        });
    }
    getUserWizardVaultSpecial(token) {
        return api.get('/account/wizardsvault/special', {
            params: {
                access_token: token,
                v: new Date().toISOString(),
            },
        });
    }
    getUser(token) {
        return api.get('/account', { params: { access_token: token } });
    }
    getCommercePrices(ids) {
        const $ids = ids.join(',');
        return api.get('/commerce/prices', { params: { ids: $ids } });
    }
    getCharacters(token) {
        return api.get('/characters', { params: { access_token: token } });
    }
    getCharacterByNameSuperAdventureBox(token, name) {
        return api.get(`/characters/${name}/sab`, {
            params: { access_token: token },
            character: name,
        });
    }
}

export default new Gw2ApiService();
