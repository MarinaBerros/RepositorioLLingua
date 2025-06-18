// Base de datos de documentos con URLs absolutas
const documentos = [
    {
        nombre: "Xuegu animales espresión oral",
        archivo: "XUEGU_ANIMALES_ESPERSION_ORAL.pdf",
        bloque: "bloque1",
        // Usa la URL completa de GitHub o ruta relativa correcta
        ruta: "https://raw.githubusercontent.com/tuusuario/turepo/main/pdfs/bloque1/XUEGU_ANIMALES_ESPERSION_ORAL.pdf"
    },
    {
        nombre: "Madreñes - Comprensión y espresión escrita",
        archivo: "Madrenes_Comprension_espresion_escrita.pdf",
        bloque: "bloque3",
        ruta: "https://raw.githubusercontent.com/tuusuario/turepo/main/pdfs/bloque3/Madrenes_Comprension_espresion_escrita.pdf"
    }
];

// Función unificada (usa el mismo nombre en todos lados)
function cargarBloque(bloque) {
    const contenedor = document.getElementById('contenedor-documentos') || 
                      document.getElementById('pdfs-bloque');
    if (!contenedor) return;

    const docs = documentos.filter(doc => doc.bloque === bloque);
    
    contenedor.innerHTML = docs.map(doc => `
        <div class="documento">
            <div class="documento-info">
                <h3>${doc.nombre}</h3>
            </div>
            <div class="documento-acciones">
                <a href="${doc.ruta}" target="_blank" class="btn-ver">Ver PDF</a>
                <a href="${doc.ruta}" download="${doc.archivo}" class="btn-descargar">Descargar</a>
            </div>
        </div>
    `).join('');
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('bloque1')) cargarBloque('bloque1');
    if (window.location.pathname.includes('bloque3')) cargarBloque('bloque3');
});

// Llamada inicial al cargar la página (para bloques)
if (document.getElementById('contenedor-documentos')) {
    const bloqueActual = window.location.pathname.includes('bloque1') ? 'bloque1' : 
                       window.location.pathname.includes('bloque3') ? 'bloque3' : null;
    if (bloqueActual) {
        cargarDocumentosBloque(bloqueActual);
    }
}