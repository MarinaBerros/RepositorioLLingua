// Configuración base - ¡REEMPLAZA ESTOS VALORES!
const config = {
  usuario: 'MarinaBerros',      // Tu nombre de usuario de GitHub
  repositorio: 'RepositorioLlingua',    // Nombre exacto del repositorio
  rama: 'main'                     // Rama donde están los PDFs (main o gh-pages)
};

// Generador de URLs para GitHub Raw
function generarURL(bloque, archivo) {
  return `https://raw.githubusercontent.com/${config.usuario}/${config.repositorio}/${config.rama}/pdfs/${bloque}/${archivo}`;
}

// Base de datos de documentos
const documentos = [
  {
    nombre: "Xuegu animales espresión oral",
    archivo: "XUEGU_ANIMALES_ESPERSION_ORAL.pdf",
    bloque: "bloque1",
    ruta: generarURL('bloque1', 'XUEGU_ANIMALES_ESPERSION_ORAL.pdf')
  },
  {
    nombre: "Madreñes - Comprensión y espresión escrita",
    archivo: "Madrenes_Comprension_espresion_escrita.pdf",
    bloque: "bloque3",
    ruta: generarURL('bloque3', 'Madrenes_Comprension_espresion_escrita.pdf')
  }
];

// Función para mostrar documentos
function mostrarDocumentos(bloque) {
  const contenedor = document.getElementById('contenedor-documentos');
  if (!contenedor) return;

  const docs = documentos.filter(doc => doc.bloque === bloque);
  
  contenedor.innerHTML = docs.map(doc => `
    <div class="documento">
      <div class="doc-icon">📄</div>
      <div class="doc-info">
        <h3>${doc.nombre}</h3>
        <div class="doc-acciones">
          <a href="${doc.ruta}" target="_blank" class="btn ver-btn">Ver</a>
          <a href="${doc.ruta}" download="${doc.archivo}" class="btn descargar-btn">Descargar</a>
        </div>
      </div>
    </div>
  `).join('');
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
  // Cargar documentos según la página
  if (window.location.pathname.includes('bloque1')) mostrarDocumentos('bloque1');
  if (window.location.pathname.includes('bloque3')) mostrarDocumentos('bloque3');

  // Activar búsqueda en tiempo real
  const buscador = document.getElementById('busqueda');
  if (buscador) {
    buscador.addEventListener('input', buscarPDF);
  }
});

function buscarPDF() {
  const termino = document.getElementById("busqueda").value.toLowerCase();
  const resultados = documentos.filter(doc =>
    doc.nombre.toLowerCase().includes(termino) ||
    doc.bloque.toLowerCase().includes(termino)
  );

  const contenedor = document.getElementById("resultados-busqueda");
  if (!contenedor) return;

  if (termino === "") {
    contenedor.innerHTML = ""; // vacía si no hay término
    return;
  }

  if (resultados.length === 0) {
    contenedor.innerHTML = "<p>Nun s'atoparon documentos que coincidan cola gueta.</p>";
    return;
  }

  contenedor.innerHTML = resultados.map(doc => `
    <div class="documento">
      <div class="doc-icon">📄</div>
      <div class="doc-info">
        <h3>${doc.nombre}</h3>
        <div class="doc-acciones">
          <a href="${doc.ruta}" target="_blank" class="btn ver-btn">Ver</a>
          <a href="${doc.ruta}" download="${doc.archivo}" class="btn descargar-btn">Descargar</a>
        </div>
      </div>
    </div>
  `).join('');
}
