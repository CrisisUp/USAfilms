// utils.js - Funções utilitárias

/**
 * Escapa caracteres HTML para segurança (previne XSS básico).
 * @param {string} str - A string a ser escapada.
 * @returns {string} A string com caracteres HTML escapados.
 */
export function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}