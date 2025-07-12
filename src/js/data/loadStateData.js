// loadStateData.js - Carrega dinamicamente os dados de um estado usando import.meta.glob

const modules = import.meta.glob('./*.js');

export async function loadStateData(stateId) {
    const cleanId = stateId.toLowerCase().replace(/\s+/g, '');
    const path = `./${cleanId}.js`;

    const loader = modules[path];

    if (!loader) {
        console.warn(`⚠️ Nenhum módulo encontrado para o estado: ${stateId}`);
        return null;
    }

    try {
        const module = await loader();
        return module.data || null;
    } catch (error) {
        console.error(`❌ Erro ao carregar dados de ${stateId}:`, error);
        return null;
    }
}
