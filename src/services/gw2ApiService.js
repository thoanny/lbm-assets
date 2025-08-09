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
    getGuildUpgrades() {
        return api.get('/guild/upgrades', { params: { ids: 'all' } });
    }
    getGuildUpgradesByIds(ids) {
        const $ids = ids.join(',');
        return api.get('/guild/upgrades', { params: { ids: $ids } });
    }
    getRecipeById(recipe_id) {
        return api.get(`/recipes`, { params: { id: recipe_id, v: '2025-08-04' } });
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
    getMapChests() {
        return api.get('/mapchests', { params: { ids: 'all' } });
    }
    getUserMapChests(token) {
        return api.get('/account/mapchests', { params: { access_token: token } });
    }
    getWorldBosses() {
        return api.get('/worldbosses', { params: { ids: 'all' } });
    }
    getUserWorldBosses(token) {
        return api.get('/account/worldbosses', { params: { access_token: token } });
    }
    getDungeons() {
        return api.get('/dungeons', { params: { ids: 'all' } });
    }
    getUserDungeons(token) {
        return api.get('/account/dungeons', { params: { access_token: token } });
    }
    getDailyCrafting() {
        return api.get('/dailycrafting', { params: { ids: 'all' } });
    }
    getUserDailyCrafting(token) {
        return api.get('/account/dailycrafting', { params: { access_token: token } });
    }
    getAchievementsGroupById(group_id) {
        if (!group_id) {
            return {};
        }
        return api.get(`/achievements/groups/${group_id}`, { params: { lang: 'fr' } });
    }
    getAchievementsCategoriesByIds(ids) {
        const version = '2025-08-07';
        const $ids = ids.join(',');
        return api.get(`/achievements/categories`, {
            params: { ids: $ids, v: version, lang: 'fr' },
        });
    }
    getAchievementsByIds(ids) {
        if (ids.length <= 0) {
            return [];
        }
        const $ids = ids.join(',');
        return api.get(`/achievements`, {
            params: { ids: $ids, lang: 'fr' },
        });
    }
    getUserAchievements(token) {
        return api.get('/account/achievements', { params: { access_token: token } });
    }
}

export default new Gw2ApiService();
