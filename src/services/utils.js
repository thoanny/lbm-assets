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

export function chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
    );
}

export function copyToClipboard(content) {
    if (!content) return;
    navigator.clipboard.writeText(content);
}

export function formatIntToGold(amount) {
    const copper = amount % 100;
    const silver = Math.floor((amount % 10000) / 100);
    const gold = Math.floor(amount / 10000);

    if (gold > 0) {
        return `<span class="currency"><span class="gold">${gold}</span><span class="silver">${pad(silver)}</span><span class="copper">${pad(copper)}</span>`;
    } else if (silver > 0) {
        return `<span class="currency"><span class="silver">${pad(silver)}</span><span class="copper">${pad(copper)}</span>`;
    }

    return `<span class="currency"><span class="copper">${copper}</span></span>`;
}
