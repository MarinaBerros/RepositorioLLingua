// Configuración base
const config = {
  usuario: 'MarinaBerros',
  repositorio: 'RepositorioLlingua',
  rama: 'main'
};
// Configura PDF.js (esto debe estar AL INICIO del archivo)
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
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

async function mostrarDocumentos(bloque) {
  // 1. Asegurarnos de que PDF.js está cargado
  if (typeof pdfjsLib === 'undefined') {
    console.error('PDF.js no está cargado correctamente');
    return;
  }

  // 2. Esperar a que el DOM esté completamente listo
  await new Promise(resolve => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve);
  });

  // 3. Buscar el contenedor con mayor seguridad
  const contenedor = document.getElementById('contenedor-documentos');
  if (!contenedor) {
    console.error('No se encontró el elemento con ID "contenedor-documentos"');
    return;
  }

  // 4. Limpiar y preparar el contenedor
  contenedor.innerHTML = '<p class="cargando">Cargando documentos...</p>';
  contenedor.classList.add('document-grid');

  try {
    // 5. Filtrar documentos
    const docs = documentos.filter(doc => doc.bloque === bloque);
    
    if (docs.length === 0) {
      contenedor.innerHTML = "<p>No hay documentos disponibles para este bloque.</p>";
      return;
    }

    // 6. Crear las tarjetas
    for (const doc of docs) {
      const card = document.createElement('div');
      card.className = 'doc-card';
      card.innerHTML = `
        <div class="doc-thumbnail" id="thumb-${doc.archivo.replace('.pdf', '')}">
          <div class="placeholder">Cargando vista previa...</div>
        </div>
        <div class="doc-info">
          <h3 class="doc-title">${doc.nombre}</h3>
          <div class="doc-actions">
            <a href="${doc.ruta}" target="_blank" class="btn btn-primary">Descargar</a>
            <button class="btn btn-secondary ver-btn" data-pdf="${doc.ruta}">Vista rápida</button>
          </div>
        </div>
      `;
      contenedor.appendChild(card);

      // 7. Generar miniatura (con manejo de errores)
      try {
        await generarMiniaturaPDF(doc.ruta, `thumb-${doc.archivo.replace('.pdf', '')}`);
      } catch (error) {
        console.error(`Error al generar miniatura para ${doc.nombre}:`, error);
        const thumbContainer = document.getElementById(`thumb-${doc.archivo.replace('.pdf', '')}`);
        if (thumbContainer) {
          thumbContainer.innerHTML = '<div class="error-thumb">Vista previa no disponible</div>';
        }
      }
    }
  } catch (error) {
    console.error('Error al mostrar documentos:', error);
    contenedor.innerHTML = '<p class="error">Error al cargar los documentos. Por favor intenta nuevamente.</p>';
  }
}

// Función para generar miniaturas
async function generarMiniaturaPDF(url, containerId) {
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    document.getElementById(containerId).appendChild(canvas);
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
  } catch (error) {
    console.error("Error al generar miniatura:", error);
    document.getElementById(containerId).innerHTML = '<div class="thumbnail-error">📄 Vista previa no disponible</div>';
  }
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

// Añade al final de tu script.js
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('ver-btn')) {
    const pdfUrl = e.target.getAttribute('data-pdf');
    abrirModalPDF(pdfUrl);
  }
});

function abrirModalPDF(pdfUrl) {
  const modal = document.createElement('div');
  modal.className = 'pdf-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <iframe 
        src="https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}" 
        width="100%" 
        height="90%"
        style="border: none;">
      </iframe>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.querySelector('.close-modal').onclick = function() {
    modal.remove();
  };
}