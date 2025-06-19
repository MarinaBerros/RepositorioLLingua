// Configuración base
const config = {
  usuario: 'MarinaBerros',
  repositorio: 'RepositorioLlingua',
  rama: 'main'
};

// Función para generar URLs confiables
function generarURL(bloque, archivo) {
  return `https://raw.githubusercontent.com/${config.usuario}/${config.repositorio}/${config.rama}/pdfs/${bloque}/${encodeURIComponent(archivo)}`;
}

// Base de datos de documentos (nombres normalizados)
const documentos = [
  {
    nombre: "Xuegu animales espresión oral",
    archivo: "xuegu_animales_expresion_oral.pdf",
    bloque: "bloque1",
    ruta: generarURL('bloque1', 'xuegu_animales_expresion_oral.pdf')
  },
  {
    nombre: "Madreñes - Comprensión y espresión escrita",
    archivo: "madrenes_comprension_expresion_escrita.pdf",
    bloque: "bloque3",
    ruta: generarURL('bloque3', 'madrenes_comprension_expresion_escrita.pdf')
  }
];

// Mostrar documentos por bloque
function mostrarDocumentos(bloque) {
  const contenedor = document.getElementById('contenedor-documentos');
  if (!contenedor) return;

  const docs = documentos.filter(doc => doc.bloque === bloque);
  
  if (docs.length === 0) {
    contenedor.innerHTML = "<p>No hay documentos disponibles para este bloque.</p>";
    return;
  }

  contenedor.innerHTML = docs.map(doc => `
    <div class="documento">
      <div class="doc-icon">📄</div>
      <div class="doc-info">
        <h3>${doc.nombre}</h3>
        <div class="doc-acciones">
          <a href="${doc.ruta}" target="_blank" class="btn descargar-btn">Descargar</a>
          <button onclick="mostrarPDF('${doc.ruta}')" class="btn ver-btn">Ver en página</button>
        </div>
        <div id="visor-${doc.archivo.replace('.pdf', '')}" class="pdf-viewer-container"></div>
      </div>
    </div>
  `).join('');
}

function mostrarPDF(pdfUrl) {
  // Crear contenedor del visor
  const viewerContainer = document.createElement('div');
  viewerContainer.className = 'pdf-viewer-modal';
  viewerContainer.innerHTML = `
    <div class="pdf-viewer-content">
      <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
      <iframe 
        src="https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}" 
        width="100%" 
        height="90%"
        style="border: none;">
      </iframe>
    </div>
  `;
  
  document.body.appendChild(viewerContainer);
}

// Mostrar documentos destacados en la página principal
function mostrarDestacados() {
  const contenedor = document.getElementById('documentos-destacados');
  if (!contenedor) return;
  
  contenedor.innerHTML = documentos.map(doc => `
    <div class="documento">
      <div class="doc-icon">📄</div>
      <div class="doc-info">
        <h3>${doc.nombre}</h3>
        <div class="doc-acciones">
          <a href="bloques/${doc.bloque}.html" class="btn ver-btn">Ver bloque</a>
          <a href="${doc.ruta}" target="_blank" class="btn descargar-btn">Descargar</a>
        </div>
      </div>
    </div>
  `).join('');
}

// Buscador de documentos
function buscarPDF() {
  const termino = document.getElementById("busqueda").value.toLowerCase().trim();
  const contenedor = document.getElementById("resultados-busqueda");

  if (!contenedor || termino === "") {
    contenedor.innerHTML = "";
    return;
  }

  const resultados = documentos.filter(doc =>
    doc.nombre.toLowerCase().includes(termino)
  );

  if (resultados.length === 0) {
    contenedor.innerHTML = "<p style='padding:1rem;'>Nun s'atoparon documentos.</p>";
    return;
  }

  contenedor.innerHTML = resultados.map(doc => `
    <div class="documento">
      <div class="doc-icon">📄</div>
      <div class="doc-info">
        <h3>${doc.nombre}</h3>
        <div class="doc-acciones">
          <a href="${doc.ruta}" target="_blank" class="btn descargar-btn">Ver / Descargar</a>
        </div>
      </div>
    </div>
  `).join('');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  // Activar buscador
  const buscador = document.getElementById("busqueda");
  if (buscador) {
    buscador.addEventListener("input", buscarPDF);
  }
  
  // Mostrar destacados si estamos en la página principal
  if (document.getElementById('documentos-destacados')) {
    mostrarDestacados();
  }
});