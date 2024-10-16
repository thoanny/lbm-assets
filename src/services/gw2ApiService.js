import axios from 'axios';
import { useUserStore } from '@/stores/user';

const API_URL = 'https://api.guildwars2.com/v2';

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
}

export default new Gw2ApiService();
