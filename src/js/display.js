// display.js - Lógica de exibição de detalhes

// Importa a função de escapeHTML
import { escapeHTML } from './utils.js';

/**
 * Exibe os detalhes de filmes e séries para um estado específico.
 * @param {string} stateId - O ID do estado.
 * @param {object} data - Os dados do estado (filmes, séries, etc).
 */
export function displayStateDetails(stateId, data) {
    const mediaList = document.getElementById('media-list');
    const selectedStateTitle = document.getElementById('selected-state-title');

    // Remove a classe 'show' para reiniciar a animação
    document.getElementById('details-container').classList.remove('show');

    mediaList.innerHTML = ''; // Limpa a lista anterior

    if (data && data.media && data.media.length > 0) {
        selectedStateTitle.textContent = `${escapeHTML(data.name || stateId)}: Filmes e Séries`;

        data.media.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('media-item');

            let itemContent = `
                <div class="media-header">
                    <strong>${escapeHTML(item.type || 'Mídia Desconhecida')}:</strong> ${escapeHTML(item.title || 'Título Desconhecido')}
                </div>
                <div class="media-body">
            `;

            // Validação e adição da capa
            const defaultCover = "https://via.placeholder.com/80x120?text=Sem+Capa"; // Placeholder para capas ausentes/inválidas
            const coverUrl = (item.cover && typeof item.cover === 'string') ? escapeHTML(item.cover) : defaultCover;
            itemContent += `<img src="${coverUrl}" alt="Capa de ${escapeHTML(item.title) || 'Filme/Série'}" class="media-cover" loading="lazy">`;

            itemContent += `
                    <p class="media-description">${escapeHTML(item.description || 'Descrição não disponível.')}</p>
                    <div class="media-info">
            `;

            // Adiciona a nota se houver
            if (item.rating && typeof item.rating === 'string') {
                itemContent += `<span class="media-rating">Nota: ${escapeHTML(item.rating)}</span>`;
            }

            // Adiciona o link do IMDb se houver
            if (item.imdbLink && typeof item.imdbLink === 'string' && item.imdbLink.startsWith('http')) {
                itemContent += `<a href="${escapeHTML(item.imdbLink)}" target="_blank" class="imdb-link">Ver no IMDb</a>`;
            }

            itemContent += `
                    </div>
                </div>
            `;

            li.innerHTML = itemContent;
            mediaList.appendChild(li);
        });

    } else {
        // Mensagem amigável para estados sem dados
        selectedStateTitle.textContent = `${escapeHTML(data?.name || stateId)}: Informações em breve!`;
        mediaList.innerHTML = '<li class="media-item">Ainda estamos explorando as obras que mostram a beleza e a cultura deste lugar. Volte em breve para novidades!</li>';
    }

    // Adiciona a classe 'show' após um pequeno delay para ativar a animação
    setTimeout(() => {
        document.getElementById('details-container').classList.add('show');
    }, 50);
}
