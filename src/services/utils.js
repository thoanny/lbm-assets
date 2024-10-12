export function getCleanedCurrentUrl() {
    const { origin, pathname } = window.location;
    return [origin, pathname].join('');
}

export function i18n(id, arr) {
    if (typeof arr[id] === 'undefined' || arr[id].length === 0) {
        return `__${id}__`;
    }
    return arr[id];
}

export function objectSort(arr, propertyName, order = 'ascending') {
    const sortedArr = arr.sort((a, b) => {
        if (a[propertyName] < b[propertyName]) {
            return -1;
        }
        if (a[propertyName] > b[propertyName]) {
            return 1;
        }
        return 0;
    });

    if (order === 'descending') {
        return sortedArr.reverse();
    }

    return sortedArr;
}

export function pad(number) {
    return number.toString().padStart(2, '0');
}
