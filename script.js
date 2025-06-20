 // script.js - Versión corregida
// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Tu código del buscador aquí
    const buscador = document.querySelector('.buscador');
    const inputBusqueda = document.getElementById('input-busqueda');
    
    if (buscador) {
        buscador.addEventListener('input', function() {
            this.style.backgroundColor = this.value ? '#fff8e1' : 'white';
        });
    }
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', function() {
            // Lógica de búsqueda aquí
        });
    }
}); // Verificar carga de PDF.js
if (typeof window['pdfjs-dist/build/pdf'] === 'undefined') {
    console.error('PDF.js no se cargó correctamente');
    // Cargar manualmente si falla
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
    script.onload = initPDFViewer;
    document.head.appendChild(script);
} else {
    initPDFViewer();
}

const documentos = [
    {
        nombre: "Xuegu animales espresión oral",
        archivo: "xuegu_animales_expresion_oral.pdf",
        bloque: "bloque1",
        ruta: "/RepositorioLLingua/pdfs/bloque1/xuegu_animales_expresion_oral.pdf"
    },
    {
        nombre: "Madreñes - Comprensión y espresión escrita",
        archivo: "madrenes_comprension_expresion_escrita.pdf",
        bloque: "bloque3",
        ruta: "/RepositorioLLingua/pdfs/bloque3/madrenes_comprension_expresion_escrita.pdf"
    }
];


function verPDF(ruta) {
    // Abre el PDF en una nueva pestaña con el visor nativo
    window.open(ruta, '_blank');
}

function initPDFViewer() {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    // Documentos disponibles (versión simplificada)
    const documentos = [
        {
            nombre: "Xuegu animales espresión oral",
            archivo: "xuegu_animales_expresion_oral.pdf",
            bloque: "bloque1",
            ruta: "/RepositorioLLingua/pdfs/bloque1/xuegu_animales_expresion_oral.pdf"
        },
        {
            nombre: "Madreñes - Comprensión y espresión escrita",
            archivo: "madrenes_comprension_expresion_escrita.pdf",
            bloque: "bloque3",
            ruta: "/RepositorioLLingua/pdfs/bloque3/madrenes_comprension_expresion_escrita.pdf"
          },

    ];

    // Función principal mejorada
    async function mostrarMiniaturas(bloque) {
        console.log(`Mostrando documentos para bloque: ${bloque}`);
        const contenedor = document.getElementById('contenedor-documentos');
        
        if (!contenedor) {
            console.error('Contenedor no encontrado');
            return;
        }

        contenedor.innerHTML = '<p class="cargando">Cargando documentos...</p>';
        
        const docs = documentos.filter(doc => doc.bloque === bloque);
        if (docs.length === 0) {
            contenedor.innerHTML = '<p class="aviso">No hay documentos en este bloque</p>';
            return;
        }

        contenedor.innerHTML = '';
        
        for (const doc of docs) {
            const card = document.createElement('div');
            card.className = 'doc-card';
            
            // Vista previa del PDF
            const previewDiv = document.createElement('div');
            previewDiv.className = 'doc-preview';
            previewDiv.innerHTML = `
                <div class="doc-thumbnail" id="thumb-${doc.archivo.replace('.pdf', '')}">
                    <span class="loading-text">Generando vista previa...</span>
                </div>
                <div class="doc-info">
                    <h3>${doc.nombre}</h3>
                    <button class="ver-btn" onclick="verPDF('${doc.ruta}')">Ver en navegador</button>
                    <a href="${doc.ruta}" class="btn-descargar" target="_blank">Descargar PDF</a>
                   
                </div>
            `;
            
            card.appendChild(previewDiv);
            contenedor.appendChild(card);

            // Intento de generar miniatura
            try {
                const pdf = await pdfjsLib.getDocument(doc.ruta).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.35 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                const thumbContainer = document.getElementById(`thumb-${doc.archivo.replace('.pdf', '')}`);
                thumbContainer.innerHTML = '';
                thumbContainer.appendChild(canvas);
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                console.log(`Miniatura generada para: ${doc.nombre}`);
            } catch (error) {
                console.error(`Error al generar miniatura para ${doc.nombre}:`, error);
                const thumbContainer = document.getElementById(`thumb-${doc.archivo.replace('.pdf', '')}`);
                if (thumbContainer) {
                    thumbContainer.innerHTML = '<span class="error-text">Vista previa no disponible</span>';
                }
            }
        }
    }

    // Inicialización automática mejorada
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM completamente cargado');
        
        // Determinar bloque actual
        const path = window.location.pathname;
        let bloqueActual = '';
        
        if (path.includes('bloque1')) bloqueActual = 'bloque1';
        if (path.includes('bloque2')) bloqueActual = 'bloque2';
        if (path.includes('bloque3')) bloqueActual = 'bloque3';
        if (path.includes('bloque4')) bloqueActual = 'bloque4';
        
        if (bloqueActual) {
            console.log(`Inicializando bloque: ${bloqueActual}`);
            mostrarMiniaturas(bloqueActual);
        } else {
            console.log('Página principal detectada');
            // Inicializar buscador o destacados si es necesario
        }
        
        // Verificar que todo funciona
        console.log('Documentos disponibles:', documentos);
        console.log('PDF.js cargado correctamente:', typeof pdfjsLib !== 'undefined');
    });
}

// Función de búsqueda principal
function buscarDocumentos(termino) {
  termino = termino.toLowerCase();
  return documentos.filter(doc => 
    doc.nombre.toLowerCase().includes(termino) || 
    doc.bloque.toLowerCase().includes(termino)
  );
}

// Mostrar resultados
function mostrarResultados(resultados) {
  const contenedor = document.getElementById('resultados-busqueda');
  contenedor.innerHTML = '';

  if (resultados.length === 0) {
    contenedor.innerHTML = '<p class="aviso">No se encontraron documentos</p>';
    return;
  }

  resultados.forEach(doc => {
    const item = document.createElement('div');
    item.className = 'item-lista';
    item.innerHTML = `
      <span class="item-texto">${doc.nombre}</span>
      <div class="botones-mini">
        <button class="btn-ver-mini" onclick="verPDF('${doc.ruta}')">Ver</button>
        <a href="${doc.ruta}" download class="btn-descargar-mini">Descargar</a>
      </div>
    `;
    contenedor.appendChild(item);
  });
}

// Eventos del buscador
document.addEventListener('DOMContentLoaded', function() {
  const inputBusqueda = document.getElementById('input-busqueda');
  const btnBuscar = document.getElementById('btn-buscar');
  const sugerenciasBox = document.getElementById('sugerencias');

  // Buscar al escribir
  inputBusqueda.addEventListener('input', function() {
    const termino = this.value.trim();
    sugerenciasBox.innerHTML = '';

    if (termino.length < 2) {
      sugerenciasBox.style.display = 'none';
      return;
    }

    const sugerencias = buscarDocumentos(termino).slice(0, 5);
    
    if (sugerencias.length > 0) {
      sugerencias.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'sugerencia-item';
        item.textContent = doc.nombre;
        item.addEventListener('click', () => {
          inputBusqueda.value = doc.nombre;
          mostrarResultados([doc]);
          sugerenciasBox.style.display = 'none';
        });
        sugerenciasBox.appendChild(item);
      });
      sugerenciasBox.style.display = 'block';
    } else {
      sugerenciasBox.style.display = 'none';
    }
  });

  // Buscar al hacer clic
  btnBuscar.addEventListener('click', function() {
    const termino = inputBusqueda.value.trim();
    mostrarResultados(buscarDocumentos(termino));
  });

  // Cerrar sugerencias al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.buscador-avanzado')) {
      sugerenciasBox.style.display = 'none';
    }
  });
});

// Función para mostrar resultados en formato lista
function mostrarResultados(resultados) {
    const contenedor = document.getElementById('resultados-busqueda');
    contenedor.innerHTML = '';

    if (resultados.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-no-resultados">No se encontraron documentos</p>';
        return;
    }

    resultados.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'item-lista';
        item.innerHTML = `
            <span class="item-texto">${doc.nombre}</span>
            <div class="botones-mini">
                <button class="btn-ver-mini" onclick="window.open('${doc.ruta}', '_blank')">Ver</button>
                <a href="${doc.ruta}" download class="btn-descargar-mini">Descargar</a>
            </div>
        `;
        contenedor.appendChild(item);
    });
}