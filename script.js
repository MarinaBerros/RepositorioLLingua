// Configuración PDF.js
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

// Configuración base
const config = {
    usuario: 'MarinaBerros',
    repositorio: 'RepositorioLlingua',
    rama: 'main'
};

// Base de datos de documentos
const documentos = [
    {
        nombre: "Xuegu animales espresión oral",
        archivo: "xuegu_animales_expresion_oral.pdf",
        bloque: "bloque1",
        ruta: `https://raw.githubusercontent.com/${config.usuario}/${config.repositorio}/${config.rama}/pdfs/bloque1/xuegu_animales_expresion_oral.pdf`
    },
    {
        nombre: "Madreñes - Comprensión y espresión escrita",
        archivo: "madrenes_comprension_expresion_escrita.pdf",
        bloque: "bloque3",
        ruta: `https://raw.githubusercontent.com/${config.usuario}/${config.repositorio}/${config.rama}/pdfs/bloque3/madrenes_comprension_expresion_escrita.pdf`
    }
];

// Función principal para mostrar documentos
async function mostrarDocumentos(bloque) {
    const contenedor = document.getElementById('contenedor-documentos');
    if (!contenedor) return;

    contenedor.innerHTML = '<p class="cargando">Cargando documentos...</p>';
    
    const docs = documentos.filter(doc => doc.bloque === bloque);
    if (docs.length === 0) {
        contenedor.innerHTML = "<p>No hay documentos disponibles para este bloque.</p>";
        return;
    }

    contenedor.innerHTML = '';
    contenedor.classList.add('document-grid');

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

        try {
            await generarMiniaturaPDF(doc.ruta, `thumb-${doc.archivo.replace('.pdf', '')}`);
        } catch (error) {
            console.error(`Error al generar miniatura: ${error}`);
        }
    }
}

// Generar miniaturas de PDF
async function generarMiniaturaPDF(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.4 });
        
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        container.innerHTML = '';
        container.appendChild(canvas);
        
        await page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
        }).promise;
    } catch (error) {
        container.innerHTML = '<div class="error-thumb">Vista previa no disponible</div>';
        throw error;
    }
}

// Modal para vista rápida
function abrirModalPDF(pdfUrl) {
    const modal = document.createElement('div');
    modal.className = 'pdf-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <iframe src="https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}" 
                    width="100%" height="90%" style="border:none;"></iframe>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => modal.remove();
}

// Buscador
function buscarPDF() {
    const termino = document.getElementById("busqueda").value.toLowerCase().trim();
    const contenedor = document.getElementById("resultados-busqueda");

    if (!contenedor || termino === "") {
        contenedor.innerHTML = "";
        return;
    }

    const resultados = documentos.filter(doc => doc.nombre.toLowerCase().includes(termino));

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

// Mostrar destacados
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

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Determinar qué bloque cargar
    const path = window.location.pathname;
    if (path.includes('bloque1')) mostrarDocumentos('bloque1');
    if (path.includes('bloque2')) mostrarDocumentos('bloque2');
    if (path.includes('bloque3')) mostrarDocumentos('bloque3');
    if (path.includes('bloque4')) mostrarDocumentos('bloque4');
    
    // Buscador
    const buscador = document.getElementById("busqueda");
    if (buscador) buscador.addEventListener("input", buscarPDF);
    
    // Destacados en página principal
    if (document.getElementById('documentos-destacados')) {
        mostrarDestacados();
    }
    
    // Evento para botones de vista rápida
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('ver-btn')) {
            abrirModalPDF(e.target.dataset.pdf);
        }
    });
});