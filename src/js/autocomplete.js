// src/js/autocomplete.js

import { allStateNames } from './data/stateNames.js'; // Ajuste o caminho se stateNames.js estiver em outro lugar

export function initAutocomplete() {
    const dataList = document.getElementById('state-suggestions');
    if (!dataList) {
        console.error("Elemento <datalist> com ID 'state-suggestions' não encontrado.");
        return;
    }

    allStateNames.forEach(stateName => {
        const option = document.createElement('option');
        option.value = stateName;
        dataList.appendChild(option);
    });
}