// display.js - Lógica de exibição de detalhes

import { escapeHTML } from './utils.js';


// NOVA FUNÇÃO PARA LER O CONTEÚDO DO CARD
function readMediaItem(item) {
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;

        // Formata a nota para ser lida corretamente
        let formattedRating = '';
        if (item.rating) {
            // Substitui o ponto por vírgula e adiciona "nota" antes
            formattedRating = `Nota: ${item.rating.replace('.', ' vírgula ').replace('/10', ' de dez')}.`;
            // Ou, se preferir apenas substituir o ponto por vírgula:
            // formattedRating = `Nota: ${item.rating.replace('.', ',')}.`;
            // Ou, se quiser que ele diga "sete ponto cinco":
            // formattedRating = `Nota: ${item.rating.replace('.', ' ponto ')}.`;
        }

        const textToRead = `
            ${item.type === 'Filme' ? 'Filme' : 'Série'}: ${item.title}.
            Descrição: ${item.description}.
            ${formattedRating} 
        `;

        // Se já estiver falando, pare a fala atual
        if (synth.speaking) {
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(textToRead);

        // Opcional: Configurar idioma (voz em português do Brasil)
        utterance.lang = 'pt-BR';

        // Opcional: Ajustar taxa de fala e tom
        // utterance.rate = 1; // 0.1 a 10 (padrão é 1)
        // utterance.pitch = 1; // 0 a 2 (padrão é 1)

        synth.speak(utterance);
    } else {
        console.warn('API de Síntese de Fala não suportada neste navegador.');
        alert('Seu navegador não suporta leitura de texto.');
    }
}


/**
 * Exibe os detalhes de filmes e séries para um estado específico.
 * @param {string} stateId - O ID do estado.
 * @param {object} data - Os dados do estado (filmes, séries, etc).
 */
export function displayStateDetails(stateId, data) {
    const mediaList = document.getElementById('media-list');
    const selectedStateTitle = document.getElementById('selected-state-title');
    const detailsContainer = document.getElementById('details-container');

    detailsContainer.classList.remove('show'); // Remove para reiniciar animação

    mediaList.innerHTML = ''; // Limpa a lista anterior

    if (data && data.media && data.media.length > 0) {
        selectedStateTitle.textContent = `${escapeHTML(data.name || stateId)}: Filmes e Séries`;

        data.media.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('media-item');

            // Adicionando classe para a borda do li
            if (item.type === 'Filme') {
                li.classList.add('type-movie-border');
            } else if (item.type === 'Série') {
                li.classList.add('type-series-border');
            }

            // --- Criação do Header ---
            const mediaHeader = document.createElement('div');
            mediaHeader.classList.add('media-header');

            const typeSpan = document.createElement('strong');
            typeSpan.textContent = `${escapeHTML(item.type || 'Mídia Desconhecida')}:`;
            if (item.type === 'Filme') {
                typeSpan.classList.add('type-movie');
            } else if (item.type === 'Série') {
                typeSpan.classList.add('type-series');
            }
            mediaHeader.appendChild(typeSpan);

            const titleSpan = document.createElement('span');
            titleSpan.textContent = ` ${escapeHTML(item.title || 'Título Desconhecido')}`;
            mediaHeader.appendChild(titleSpan);

            // *** NOVO: BOTÃO DE LEITURA ***
            const readButton = document.createElement('button');
            readButton.classList.add('read-aloud-button');
            readButton.innerHTML = '🔊'; // Ícone de som, você pode usar um SVG ou Font Awesome
            readButton.setAttribute('aria-label', `Ler sobre ${escapeHTML(item.title)}`);
            readButton.addEventListener('click', () => {
                readMediaItem(item); // Chama a função de leitura
            });
            mediaHeader.appendChild(readButton);
            // ***************************

            li.appendChild(mediaHeader);

            // --- Criação do Body ---
            const mediaBody = document.createElement('div');
            mediaBody.classList.add('media-body');

            const defaultCover = "https://via.placeholder.com/80x120?text=Sem+Capa";
            const coverUrl = (item.cover && typeof item.cover === 'string') ? escapeHTML(item.cover) : defaultCover;
            const coverImg = document.createElement('img');
            coverImg.src = coverUrl;
            coverImg.alt = `Capa de ${escapeHTML(item.title) || 'Filme/Série'}`;
            coverImg.classList.add('media-cover');
            coverImg.loading = 'lazy';
            mediaBody.appendChild(coverImg);

            const descriptionP = document.createElement('p');
            descriptionP.classList.add('media-description');
            descriptionP.textContent = escapeHTML(item.description || 'Descrição não disponível.');
            mediaBody.appendChild(descriptionP);

            const mediaInfoDiv = document.createElement('div');
            mediaInfoDiv.classList.add('media-info');

            if (item.rating && typeof item.rating === 'string') {
                const ratingSpan = document.createElement('span');
                ratingSpan.classList.add('media-rating');
                ratingSpan.textContent = `Nota: ${escapeHTML(item.rating)}`;
                mediaInfoDiv.appendChild(ratingSpan);
            }

            if (item.imdbLink && typeof item.imdbLink === 'string' && item.imdbLink.startsWith('http')) {
                const imdbLinkA = document.createElement('a');
                imdbLinkA.href = escapeHTML(item.imdbLink);
                imdbLinkA.target = '_blank';
                imdbLinkA.classList.add('imdb-link');
                imdbLinkA.textContent = 'Ver no IMDb';
                mediaInfoDiv.appendChild(imdbLinkA);
            }

            mediaBody.appendChild(mediaInfoDiv);
            li.appendChild(mediaBody);

            mediaList.appendChild(li);
        });

    } else {
        selectedStateTitle.textContent = `${escapeHTML(data?.name || stateId)}: Informações em breve!`;
        mediaList.innerHTML = '<li class="media-item">Ainda estamos explorando as obras que mostram a beleza e a cultura deste lugar. Volte em breve para novidades!</li>';
    }

    setTimeout(() => {
        detailsContainer.classList.add('show');
    }, 50);
}

