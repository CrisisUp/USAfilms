import { initMapInteractions } from './map-interactions.js';
import { initSearch } from './search.js';
import { displayStateDetails } from './display.js';
import { resetStateHighlights } from './map-interactions.js';
import { loadStateData } from './data/loadStateData.js';

document.addEventListener('DOMContentLoaded', async () => {
    const mapContainer = document.getElementById('map-container');
    const mapLoadingMessage = document.getElementById('map-loading-message');
    let usaMap = null;

    try {
        const response = await fetch('/usa-map.svg');
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        const svgText = await response.text();
        mapContainer.innerHTML = svgText;
        mapLoadingMessage.style.display = 'none';

        usaMap = document.getElementById('usa-map');
        if (!usaMap) {
            throw new Error("Elemento SVG com ID 'usa-map' não encontrado.");
        }

        initMapInteractions(usaMap, {}, async (stateId) => {
            const data = await loadStateData(stateId);
            displayStateDetails(stateId, data);
        });

        initSearch(usaMap);

    } catch (error) {
        console.error('Erro na inicialização ou carregamento do mapa:', error);
        mapLoadingMessage.textContent = 'Ocorreu um erro ao carregar o mapa. Por favor, tente novamente mais tarde.';
        mapLoadingMessage.style.color = 'red';
    }
});
