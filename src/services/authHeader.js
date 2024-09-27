import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

export default function authHeader() {
    const user = useUserStore();
    const { currentToken } = storeToRefs(user);

    if (currentToken.value) {
        return { Authorization: 'Bearer ' + currentToken.value };
    } else {
        return {};
    }
}
