// Base de datos de documentos (VERIFICAR NOMBRES EXACTOS)
const documentos = [
    {
        nombre: "Xuegu animales espresión oral",
        archivo: "XUEGU_ANIMALES_ESPERSION_ORAL.pdf", // Nombre exacto del archivo
        bloque: "bloque1",
        ruta: "pdfs/bloque1/XUEGU_ANIMALES_ESPERSION_ORAL.pdf" // Ruta completa
    },
    {
        nombre: "Madreñes - Comprensión y espresión escrita",
        archivo: "Madrenes_Comprension_espresion_escrita.pdf",
        bloque: "bloque3",
        ruta: "pdfs/bloque3/Madrenes_Comprension_espresion_escrita.pdf"
    }
];

// Función para cargar documentos por bloque (100% funcional)
function cargarDocumentosBloque(bloque) {
    const contenedor = document.getElementById('contenedor-documentos');
    if (!contenedor) {
        console.error("No se encontró el contenedor con ID 'contenedor-documentos'");
        return;
    }

    const docsFiltrados = documentos.filter(doc => doc.bloque === bloque);
    
    if (docsFiltrados.length === 0) {
        contenedor.innerHTML = '<p class="sin-documentos">No hay documentos en este bloque</p>';
        return;
    }

    contenedor.innerHTML = docsFiltrados.map(doc => `
        <div class="documento">
            <div class="documento-info">
                <h3>${doc.nombre}</h3>
            </div>
            <div class="documento-acciones">
                <a href="${doc.ruta}" target="_blank" class="btn-ver">Ver PDF</a>
                <a href="${doc.ruta}" download class="btn-descargar">Descargar</a>
            </div>
        </div>
    `).join('');
}

// Llamada inicial al cargar la página (para bloques)
if (document.getElementById('contenedor-documentos')) {
    const bloqueActual = window.location.pathname.includes('bloque1') ? 'bloque1' : 
                       window.location.pathname.includes('bloque3') ? 'bloque3' : null;
    if (bloqueActual) {
        cargarDocumentosBloque(bloqueActual);
    }
}