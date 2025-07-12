// split-data.mjs
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Caminhos
const dataPath = path.join(__dirname, 'src', 'js', 'data.js');
const outputDir = path.join(__dirname, 'src', 'js', 'data');

// Verifica se o arquivo data.js existe
console.log('🧪 Verificando se src/js/data.js existe...');

try {
  await fs.access(dataPath);
  console.log('✅ Encontrado:', dataPath);

  // Importa dinamicamente o módulo
  const dataURL = pathToFileURL(dataPath).href;
  const { stateData } = await import(dataURL);

  if (!stateData || typeof stateData !== 'object') {
    throw new Error('❌ stateData não é um objeto válido.');
  }

  // Garante que o diretório de saída existe
  await fs.mkdir(outputDir, { recursive: true });

  // Cria um arquivo por estado
  const promises = Object.entries(stateData).map(async ([state, info]) => {
    const filePath = path.join(outputDir, `${state.toLowerCase()}.js`);
    const content = `export const data = ${JSON.stringify(info, null, 2)};\n`;
    await fs.writeFile(filePath, content);
    console.log(`📁 Gerado: ${filePath}`);
  });

  await Promise.all(promises);
  console.log(`✅ Todos os arquivos salvos em ${outputDir}`);

  // ❓ Quer deletar o original?
  const deleteOriginal = true;
  if (deleteOriginal) {
    await fs.unlink(dataPath);
    console.log('🗑️  data.js original foi removido.');
  }

} catch (err) {
  console.error('❌ Erro:', err.message);
}
