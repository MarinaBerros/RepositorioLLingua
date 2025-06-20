// script.js - Versión organizada y corregida

/*********************
 * CONFIGURACIÓN INICIAL
 *********************/
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado');
    
    // 1. Inicializar buscador
    initBuscador();
    
    // 2. Verificar PDF.js
    initPDFViewer();
    
    // 3. Cargar documentos del bloque actual
    cargarBloqueActual();
});

/*********************
 * VARIABLES GLOBALES
 *********************/
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
    // Añade más documentos aquí
];

/*********************
 * FUNCIONES DEL BUSCADOR
 *********************/
function initBuscador() {
    const buscador = document.querySelector('.buscador');
    
    if (buscador) {
        buscador.addEventListener('input', function() {
            this.style.backgroundColor = this.value ? '#fff8e1' : 'white';
        });
    }
    
    const inputBusqueda = document.getElementById('input-busqueda');
    const btnBuscar = document.getElementById('btn-buscar');
    const sugerenciasBox = document.getElementById('sugerencias');

    if (inputBusqueda && btnBuscar && sugerenciasBox) {
        inputBusqueda.addEventListener('input', function() {
            manejarInputBusqueda(this.value.trim(), sugerenciasBox);
        });

        btnBuscar.addEventListener('click', function() {
            buscarYMostrarResultados(inputBusqueda.value.trim());
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.buscador-avanzado')) {
                sugerenciasBox.style.display = 'none';
            }
        });
    }
}

function manejarInputBusqueda(termino, sugerenciasBox) {
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
    }
}

function buscarDocumentos(termino) {
    termino = termino.toLowerCase();
    return documentos.filter(doc => 
        doc.nombre.toLowerCase().includes(termino) || 
        doc.bloque.toLowerCase().includes(termino)
    );
}

function buscarYMostrarResultados(termino) {
    mostrarResultados(buscarDocumentos(termino));
}

/*********************
 * FUNCIONES DE PDF
 *********************/
function initPDFViewer() {
    // Verificar carga de PDF.js
    if (typeof window['pdfjs-dist/build/pdf'] === 'undefined') {
        console.error('PDF.js no se cargó correctamente');
        cargarPDFJSManejadamente();
    } else {
        console.log('PDF.js ya está cargado');
    }
}

function cargarPDFJSManejadamente() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
    script.onload = function() {
        console.log('PDF.js cargado manualmente');
        window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    };
    document.head.appendChild(script);
}

function verPDF(ruta) {
    window.open(ruta, '_blank');
}

/*********************
 * FUNCIONES DE VISUALIZACIÓN
 *********************/
function cargarBloqueActual() {
    const path = window.location.pathname;
    let bloqueActual = '';
    
    if (path.includes('bloque1')) bloqueActual = 'bloque1';
    if (path.includes('bloque2')) bloqueActual = 'bloque2';
    if (path.includes('bloque3')) bloqueActual = 'bloque3';
    if (path.includes('bloque4')) bloqueActual = 'bloque4';
    
    if (bloqueActual) {
        console.log(`Cargando documentos del bloque: ${bloqueActual}`);
        mostrarDocumentosBloque(bloqueActual);
    }
}

function mostrarDocumentosBloque(bloque) {
    const contenedor = document.getElementById('contenedor-documentos');
    if (!contenedor) return;

    const docs = documentos.filter(doc => doc.bloque === bloque);
    
    if (docs.length === 0) {
        contenedor.innerHTML = '<p class="aviso">No hay documentos en este bloque</p>';
        return;
    }

    contenedor.innerHTML = docs.map(doc => `
        <div class="doc-card">
            <div class="doc-info">
                <h3>${doc.nombre}</h3>
                <button class="ver-btn" onclick="verPDF('${doc.ruta}')">Ver PDF</button>
                <a href="${doc.ruta}" download class="btn-descargar">Descargar</a>
            </div>
        </div>
    `).join('');
}

function mostrarResultados(resultados) {
    const contenedor = document.getElementById('resultados-busqueda');
    if (!contenedor) return;

    if (resultados.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-no-resultados">No se encontraron documentos</p>';
        return;
    }

    contenedor.innerHTML = resultados.map(doc => `
        <div class="item-lista">
            <span class="item-texto">${doc.nombre}</span>
            <div class="botones-mini">
                <button class="btn-ver-mini" onclick="verPDF('${doc.ruta}')">Ver</button>
                <a href="${doc.ruta}" download class="btn-descargar-mini">Descargar</a>
            </div>
        </div>
    `).join('');
}