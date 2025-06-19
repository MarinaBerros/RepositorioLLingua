// Verificar carga de PDF.js
function loadPDFJS() {
    return new Promise((resolve, reject) => {
        if (typeof window['pdfjs-dist/build/pdf'] !== 'undefined') {
            resolve(window['pdfjs-dist/build/pdf']);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
        
        script.onload = () => {
            if (typeof window['pdfjs-dist/build/pdf'] === 'undefined') {
                reject(new Error('PDF.js no se cargó correctamente'));
                return;
            }
            resolve(window['pdfjs-dist/build/pdf']);
        };
        
        script.onerror = () => {
            reject(new Error('Error al cargar PDF.js'));
        };
        
        document.head.appendChild(script);
    });
}

// Función principal
async function initPDFViewer() {
    let pdfjsLib;
    
    try {
        pdfjsLib = await loadPDFJS();
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    } catch (error) {
        console.error('Error inicializando PDF.js:', error);
        document.getElementById('contenedor-documentos').innerHTML = 
            '<p class="error">Error al cargar el visor de PDF. Por favor recarga la página.</p>';
        return;
    }

    // Documentos disponibles
    const documentos = [
        {
            nombre: "Xuegu animales espresión oral",
            archivo: "xuegu_animales_expresion_oral.pdf",
            bloque: "bloque1",
            ruta: "pdfs/bloque1/xuegu_animales_expresion_oral.pdf"
        },
        {
            nombre: "Madreñes - Comprensión y espresión escrita",
            archivo: "madrenes_comprension_expresion_escrita.pdf",
            bloque: "bloque3",
            ruta: "pdfs/bloque3/madrenes_comprension_expresion_escrita.pdf"
        }
    ];

    async function mostrarMiniaturas(bloque) {
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

            try {
                // Añadir timestamp para evitar caché
                const pdfUrl = doc.ruta + '?t=' + new Date().getTime();
                const pdf = await pdfjsLib.getDocument({
                    url: pdfUrl,
                    disableAutoFetch: true,
                    disableStream: true
                }).promise;
                
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
                    thumbContainer.innerHTML = `
                        <div class="error-preview">
                            <span class="error-text">Vista previa no disponible</span>
                            <a href="${doc.ruta}" class="btn-descargar-alt" target="_blank">Descargar</a>
                        </div>
                    `;
                }
            }
        }
    }

    // Inicialización
    document.addEventListener('DOMContentLoaded', function() {
        const path = window.location.pathname;
        let bloqueActual = '';
        
        if (path.includes('bloque1')) bloqueActual = 'bloque1';
        else if (path.includes('bloque2')) bloqueActual = 'bloque2';
        else if (path.includes('bloque3')) bloqueActual = 'bloque3';
        else if (path.includes('bloque4')) bloqueActual = 'bloque4';
        
        if (bloqueActual) {
            mostrarMiniaturas(bloqueActual);
        }
    });
}

// Iniciar todo
initPDFViewer();