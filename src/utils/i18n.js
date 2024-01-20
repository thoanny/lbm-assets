export default function i18n(id, arr) {
    if (typeof arr[id] === 'undefined' || arr[id].length === 0) {
        return `__${id}__`;
    }
    return arr[id];
}