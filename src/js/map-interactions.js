// map-interactions.js - Lógica de interação do mapa SVG

let usaMapInstance = null;
let currentSelectedState = null;
const originalParents = new Map();

/**
 * Reseta os estilos de destaque dos estados e os retorna às suas posições originais no DOM.
 * @param {NodeListOf<SVGPathElement>|HTMLCollectionOf<SVGPathElement>} statesList
 */
export function resetStateHighlights(statesList) {
    const statesToReset = Array.from(statesList || (usaMapInstance ? usaMapInstance.querySelectorAll('.state') : []));

    statesToReset.forEach(statePath => {
        statePath.style.outline = '';
        statePath.style.strokeWidth = '';
        statePath.style.stroke = '';

        if (originalParents.has(statePath)) {
            const { parent, nextSibling } = originalParents.get(statePath);
            if (parent && parent.contains(statePath)) {
                if (nextSibling && parent.contains(nextSibling)) {
                    parent.insertBefore(statePath, nextSibling);
                } else {
                    parent.appendChild(statePath);
                }
            }
            originalParents.delete(statePath);
        }
    });
}

/**
 * Inicializa os event listeners para as interações do mapa (hover, click, teclado).
 * @param {SVGElement} mapElement - O elemento SVG do mapa.
 * @param {object} stateData - Dados (pode ser usado para aria-labels).
 * @param {function} displayDetailsFunction - Função async para exibir detalhes do estado.
 */
export function initMapInteractions(mapElement, stateData, displayDetailsFunction) {
    usaMapInstance = mapElement;

    const states = usaMapInstance.querySelectorAll('.state');

    states.forEach(statePath => {
        statePath.setAttribute('tabindex', '0');
        statePath.setAttribute('aria-label', `Clique para ver filmes e séries de ${stateData[statePath.id]?.name || statePath.id}`);

        statePath.addEventListener('mouseenter', () => {
            if (!originalParents.has(statePath)) {
                originalParents.set(statePath, {
                    parent: statePath.parentNode,
                    nextSibling: statePath.nextSibling
                });
            }
            statePath.parentNode.appendChild(statePath);
        });

        statePath.addEventListener('mouseleave', () => {
            if (statePath !== currentSelectedState) {
                if (originalParents.has(statePath)) {
                    const { parent, nextSibling } = originalParents.get(statePath);
                    if (parent && parent.contains(statePath)) {
                        if (nextSibling && parent.contains(nextSibling)) {
                            parent.insertBefore(statePath, nextSibling);
                        } else {
                            parent.appendChild(statePath);
                        }
                    }
                    originalParents.delete(statePath);
                }
            }
        });

        statePath.addEventListener('click', async () => {
            resetStateHighlights(states);

            const stateId = statePath.id;

            if (!originalParents.has(statePath)) {
                originalParents.set(statePath, {
                    parent: statePath.parentNode,
                    nextSibling: statePath.nextSibling
                });
            }
            statePath.parentNode.appendChild(statePath);

            if (currentSelectedState && currentSelectedState !== statePath) {
                if (originalParents.has(currentSelectedState)) {
                    const { parent, nextSibling } = originalParents.get(currentSelectedState);
                    if (parent && parent.contains(currentSelectedState)) {
                        if (nextSibling && parent.contains(nextSibling)) {
                            parent.insertBefore(currentSelectedState, nextSibling);
                        } else {
                            parent.appendChild(currentSelectedState);
                        }
                    }
                    originalParents.delete(currentSelectedState);
                }
                currentSelectedState.classList.remove('selected');
            }

            statePath.classList.add('selected');
            currentSelectedState = statePath;

            await displayDetailsFunction(stateId);

            document.getElementById('details-container').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });

        statePath.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                // Criar e despachar um evento click manualmente
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                statePath.dispatchEvent(clickEvent);
            }
        });
    });
}

/**
 * Obtém o estado atualmente selecionado.
 * @returns {SVGPathElement | null}
 */
export function getCurrentSelectedState() {
    return currentSelectedState;
}

/**
 * Define o estado atualmente selecionado.
 * @param {SVGPathElement | null} stateElement
 */
export function setCurrentSelectedState(stateElement) {
    currentSelectedState = stateElement;
}
