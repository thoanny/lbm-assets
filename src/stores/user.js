import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
    const accounts = ref(null);
    const currentToken = ref(null);
    const accountName = ref(null);
    const isLoading = ref(false);
    const accountId = ref(null);
    const apiKey = ref(null);
    const isLoggedIn = ref(false);

    const encodeDataToURL = (data) => {
        return Object.keys(data)
            .map((value) => `${value}=${encodeURIComponent(data[value])}`)
            .join('&');
    };

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    const login = () => {
        const clientId = '25e9f7dc-c845-40ac-92c6-aed3da1f4930';
        const state = uuidv4();

        localStorage.setItem('gw2-auth-state', state);

        const params = {
            response_type: 'code',
            client_id: clientId,
            state: state,
            scope: 'gw2:account gw2:progression gw2:unlocks',
            redirect_uri: window?.location.href.split('?')[0],
            prompt: 'consent',
        };

        // console.log(`https://gw2auth.com/oauth2/authorize?${encodeDataToURL(params)}`, params);
        return (window.location.href = `https://gw2auth.com/oauth2/authorize?${encodeDataToURL(params)}`);
    };

    const refresh = async () => {
        if (isLoggedIn.value !== 'gw2-auth' || !localStorage.getItem('gw2-auth-refresh')) return;

        isLoading.value = true;

        await axios
            .post('https://api.lebusmagique.fr/api/gw2/auth', {
                code: localStorage.getItem('gw2-auth-refresh'),
                redirect: window?.location.href.split('?')[0],
                refresh: true,
            })
            .then((res) => {
                const { data } = res;
                localStorage.setItem('gw2-auth-token', data.access_token);
                localStorage.setItem('gw2-auth-refresh', data.refresh_token);
                loadLocalToken();
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                isLoading.value = false;
            });
    };

    const logout = () => {
        accounts.value = null;
        currentToken.value = null;
        accountName.value = null;
        accountId.value = null;
        apiKey.value = null;
        isLoggedIn.value = false;

        localStorage.removeItem('gw2-auth-refresh');
        localStorage.removeItem('gw2-auth-state');
        localStorage.removeItem('gw2-auth-token');
        localStorage.removeItem('gw2-auth-id');
        localStorage.removeItem('gw2-api-key');
        localStorage.removeItem('gw2-account-name');
    };

    const initLogin = async () => {
        var url = new URL(window.location.href);
        var state = url.searchParams.get('state');
        var code = url.searchParams.get('code');

        if (state && code) {
            isLoading.value = true;

            if (state !== localStorage.getItem('gw2-auth-state')) {
                isLoading.value = false;
                logout();
                window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
                return;
            }

            await axios
                .post('https://api.lebusmagique.fr/api/gw2/auth', {
                    code: code,
                    redirect: window?.location.href.split('?')[0],
                })
                .then((res) => {
                    const { data } = res;
                    localStorage.setItem('gw2-auth-token', data.access_token);
                    localStorage.setItem('gw2-auth-refresh', data.refresh_token);
                    loadLocalToken();
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    isLoading.value = false;
                    window.history.replaceState(
                        {},
                        document.title,
                        window.location.href.split('?')[0],
                    );
                });
        } else {
            loadLocalToken();
        }
    };

    const loadLocalToken = () => {
        const localToken = localStorage.getItem('gw2-auth-token');

        if (!localToken) {
            const localKey = localStorage.getItem('gw2-api-key');
            const localName = localStorage.getItem('gw2-account-name');

            if (localKey && localName) {
                isLoggedIn.value = 'api-key';
                currentToken.value = localKey;
                apiKey.value = localKey;
                accountName.value = localName;
            }

            return;
        }

        const jwt = parseJwt(localToken);

        accounts.value = jwt['gw2:tokens'];

        const localAuthId = localStorage.getItem('gw2-auth-id');

        if (!localAuthId) {
            const defaultAccountId = Object.keys(jwt['gw2:tokens'])[0];
            localStorage.setItem('gw2-auth-id', defaultAccountId);
            accountId.value = defaultAccountId;
        } else {
            accountId.value = localAuthId;
        }

        isLoggedIn.value = 'gw2-auth';
        currentToken.value = accounts.value[accountId.value]?.token;
        accountName.value = accounts.value[accountId.value]?.name;
    };

    initLogin();

    const handleAccountId = () => {
        localStorage.setItem('gw2-auth-id', accountId.value);
        currentToken.value = accounts.value[accountId.value]?.token;
        accountName.value = accounts.value[accountId.value]?.name;
    };

    const handleApiKey = async () => {
        isLoading.value = true;

        await axios
            .get(`https://api.guildwars2.com/v2/account`, {
                params: { access_token: apiKey.value },
            })
            .then((res) => {
                const { data } = res;
                isLoading.value = false;
                isLoggedIn.value = 'api-key';
                currentToken.value = apiKey.value;
                accountName.value = data.name;
                localStorage.setItem('gw2-api-key', apiKey.value);
                localStorage.setItem('gw2-account-name', data.name);
            });
    };

    return {
        login,
        refresh,
        logout,
        accounts,
        currentToken,
        accountName,
        accountId,
        isLoading,
        handleAccountId,
        apiKey,
        handleApiKey,
        isLoggedIn,
    };
});
