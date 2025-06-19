// Verificar carga de PDF.js
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
            ruta: "/RepositorioLLingua/pdfs/bloque1/madrenes_comprension_expresion_escrita.pdff"
        }
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