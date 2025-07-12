// loadStateData.js - Carrega dinamicamente os dados de um estado

export async function loadStateData(stateId) {
    try {
        const cleanId = stateId.toLowerCase().replace(/\s+/g, '');
        // @vite-ignore
        const module = await import(/* @vite-ignore */ `./${cleanId}.js`);
        return module.data;
    } catch (error) {
        console.warn(`Dados não encontrados para o estado: ${stateId}`, error);
        return null;
    }
}
