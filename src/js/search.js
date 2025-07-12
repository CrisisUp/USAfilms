import { escapeHTML } from './utils.js';
import { resetStateHighlights, getCurrentSelectedState } from './map-interactions.js';
import { displayStateDetails } from './display.js';
import { loadStateData } from './data/loadStateData.js';

let usaMapInstance = null;

export function initSearch(mapElement) {
    usaMapInstance = mapElement;
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
}

async function performSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = escapeHTML(searchInput.value.toLowerCase().trim());

    const states = Array.from(usaMapInstance.querySelectorAll('.state'));
    resetStateHighlights(states);

    if (!searchTerm) {
        document.getElementById('selected-state-title').textContent = `Clique em um estado para ver os filmes e séries!`;
        document.getElementById('media-list').innerHTML = '';
        return;
    }

    // Carrega todos os dados dos estados em paralelo
    const loadPromises = states.map(state => loadStateData(state.id).catch(() => null));
    const allData = await Promise.all(loadPromises);

    let foundAny = false;

    for (let i = 0; i < states.length; i++) {
        const statePath = states[i];
        const data = allData[i];

        if (!data) continue;

        const stateNameLower = data.name.toLowerCase();
        let stateMatchesSearch = false;

        if (stateNameLower.includes(searchTerm)) {
            stateMatchesSearch = true;
        }

        if (!stateMatchesSearch && data.media && Array.isArray(data.media)) {
            for (const mediaItem of data.media) {
                if (mediaItem && mediaItem.title && mediaItem.description && mediaItem.type) {
                    if (
                        mediaItem.title.toLowerCase().includes(searchTerm) ||
                        mediaItem.description.toLowerCase().includes(searchTerm) ||
                        mediaItem.type.toLowerCase().includes(searchTerm)
                    ) {
                        stateMatchesSearch = true;
                        break;
                    }
                }
            }
        }

        if (stateMatchesSearch) {
            statePath.style.outline = '3px solid #ffcc00';
            statePath.style.strokeWidth = '2px';
            statePath.style.stroke = '#ffcc00';
            foundAny = true;

            if (stateNameLower === searchTerm || statePath.id.toLowerCase() === searchTerm) {
                const currentSelectedState = getCurrentSelectedState();
                if (currentSelectedState) {
                    currentSelectedState.classList.remove('selected');
                }
                statePath.classList.add('selected');
                await displayStateDetails(statePath.id, data);
                document.getElementById('details-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }
    }

    if (foundAny) {
        document.getElementById('selected-state-title').textContent = `Resultados da busca por "${searchTerm}"`;
        document.getElementById('media-list').innerHTML = '<li class="media-item">Estados destacados no mapa correspondem à sua busca.</li>';
    } else {
        document.getElementById('selected-state-title').textContent = `Nenhum resultado encontrado para "${searchTerm}".`;
        document.getElementById('media-list').innerHTML = '<li class="media-item">Tente uma busca diferente.</li>';
    }
}
