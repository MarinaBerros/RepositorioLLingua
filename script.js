// Configuración base
const config = {
  repoNombre: 'RepositorioLLingua', // CAMBIAR por tu nombre de repositorio exacto
  rama: 'main' // o 'gh-pages' según tu configuración
};

// Base de datos de documentos
const documentos = [
  {
    nombre: "Xuegu animales espresión oral",
    archivo: "XUEGU_ANIMALES_ESPERSION_ORAL.pdf",
    bloque: "bloque1",
    ruta: `https://github.com/tu-usuario/${config.repoNombre}/raw/${config.rama}/pdfs/bloque1/XUEGU_ANIMALES_ESPERSION_ORAL.pdf`
  },
  {
    nombre: "Madreñes - Comprensión y espresión escrita",
    archivo: "Madrenes_Comprension_espresion_escrita.pdf",
    bloque: "bloque3",
    ruta: `https://github.com/tu-usuario/${config.repoNombre}/raw/${config.rama}/pdfs/bloque3/Madrenes_Comprension_espresion_escrita.pdf`
  }
];

// Función mejorada para cargar documentos
function cargarDocumentos(bloque) {
  const contenedor = document.getElementById('contenedor-documentos');
  if (!contenedor) return;

  const docs = documentos.filter(doc => doc.bloque === bloque);
  
  if (docs.length === 0) {
    contenedor.innerHTML = '<p class="sin-docs">No hay documentos en este bloque</p>';
    return;
  }

  contenedor.innerHTML = docs.map(doc => `
    <div class="doc-card">
      <div class="doc-header">
        <svg class="doc-icon" viewBox="0 0 384 512"><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"/></svg>
        <h3>${doc.nombre}</h3>
      </div>
      <div class="doc-actions">
        <a href="${doc.ruta}" target="_blank" class="btn view-btn">
          <svg viewBox="0 0 576 512" width="14"><path d="M573 241C518 136 411 64 288 64S58 136 3 241a32 32 0 0 0 0 30c55 105 162 177 285 177s230-72 285-177a32 32 0 0 0 0-30zM288 400a144 144 0 1 1 0-288 144 144 0 0 1 0 288zm0-240a95 95 0 1 0 0 190 95 95 0 0 0 0-190z"/></svg>
          Ver
        </a>
        <a href="${doc.ruta}" download="${doc.archivo}" class="btn download-btn">
          <svg viewBox="0 0 512 512" width="14"><path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.8 7.8-20.5 7.8-28.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"/></svg>
          Descargar
        </a>
      </div>
    </div>
  `).join('');
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
  // Para páginas de bloques
  if (window.location.pathname.includes('bloque1')) cargarDocumentos('bloque1');
  if (window.location.pathname.includes('bloque3')) cargarDocumentos('bloque3');
  
  // Para página principal
  if (document.getElementById('documentos-destacados')) {
    document.getElementById('documentos-destacados').innerHTML = `
      <div class="doc-card">
        <h3>Documentos destacados</h3>
        ${documentos.map(doc => `
          <p><a href="${doc.ruta}" target="_blank">${doc.nombre}</a></p>
        `).join('')}
      </div>
    `;
  }
});