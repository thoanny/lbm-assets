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
        return api.get('/home/cats?ids=all');
    }
    getNodes() {
        return api.get('/home/nodes?ids=all');
    }
    getGlyphs() {
        return api.get('/homestead/glyphs?ids=all');
    }
    getCategories() {
        return api.get('/homestead/decorations/categories?ids=all');
    }
    getDecorations() {
        return api.get('/homestead/decorations');
    }
    getDecorationsByIds(ids) {
        const $ids = ids.join(',');
        return api.get(`/homestead/decorations?ids=${$ids}`);
    }
    getUserCats(token) {
        return api.get(`/account/home/cats?access_token=${token}`);
    }
    getUserNodes(token) {
        return api.get(`/account/home/nodes?access_token=${token}`);
    }
    getUserGlyphs(token) {
        return api.get(`/account/homestead/glyphs?access_token=${token}`);
    }
    getUserDecorations(token) {
        return api.get(`/account/homestead/decorations?access_token=${token}`);
    }
}

export default new Gw2ApiService();
