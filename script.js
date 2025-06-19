// Configuración base - ¡REEMPLAZA ESTOS VALORES!
const config = {
  usuario: 'MarinaBerros',
  repositorio: 'RepositorioLlingua',
  rama: 'main'
};

// Generador de URLs para GitHub con /raw/
function generarURL(bloque, archivo) {
  return `https://github.com/${config.usuario}/${config.repositorio}/raw/${config.rama}/pdfs/${bloque}/${archivo}`;
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
          <a href="${doc.ruta}" target="_blank" class="btn descargar-btn">Ver / Descargar</a>
        </div>
      </div>
    </div>
  `).join('');
}

// Buscador
function buscarPDF() {
  const termino = document.getElementById("busqueda").value.toLowerCase().trim();
  const contenedor = document.getElementById("resultados-busqueda");

  if (!contenedor || termino === "") {
    contenedor.innerHTML = "";
    return;
  }

  const resultados = documentos.filter(doc =>
    doc.nombre.toLowerCase().startsWith(termino)
  );

  if (resultados.length === 0) {
    contenedor.innerHTML = "<p style='padding:1rem;'>Nun s’atoparon documentos.</p>";
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

// Activar buscador en tiempo real
document.addEventListener('DOMContentLoaded', function () {
  const buscador = document.getElementById("busqueda");
  if (buscador) {
    buscador.addEventListener("input", buscarPDF);
  }
});
