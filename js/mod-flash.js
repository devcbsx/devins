// --- MÓDULO FLASH REPORT (GENERADOR DE PROMPT MCP) ---

function generateFlashReportPrompt() {
  var placa = ($('flash-input-placa').value || '').trim().toUpperCase() || '[XXX-000]';
  var vin = ($('flash-input-vin').value || '').trim().toUpperCase() || '[...]';
  var modelo = ($('flash-input-modelo').value || '').trim() || '[...]';
  var baseGeotab = ($('flash-input-base').value || '').trim() || 'divemotor';
  
  var dateVal = $('flash-date-event').value;
  var timeStart = $('flash-time-start').value || '14:00';
  var timeEnd = $('flash-time-end').value || '15:30';
  
  var ventana = '[dd/mm/aaaa hh:mm–hh:mm]';
  if (dateVal) {
    var parts = dateVal.split('-');
    ventana = parts[2] + '/' + parts[1] + '/' + parts[0] + ' ' + timeStart + '–' + timeEnd;
  }

  var relato = ($('flash-input-relato').value || '').trim() || '[relato del cliente]';
  var fotos = ($('flash-input-fotos').value || '').trim() || '[detalles de fotos]';

  var fullPrompt = `ROL
Analista experto en telemetría e investigación de siniestros viales (Geotab / Divemotor Connect).
Objetivo: validar si hubo colisión en la unidad indicada y entregar un informe HTML de 3 páginas con la estructura y el diseño descritos abajo.

ENTRADAS
- Base MyGeotab: [${baseGeotab}]
- Placa: ${placa} · VIN: ${vin} · Modelo: ${modelo}
- Fecha y ventana (hora local, UTC-5 Lima): ${ventana}
- Descripción del suceso de acuerdo a imágenes y adjuntos: ${relato}
  Detalle de fotografías: ${fotos}`;

  $('flash-output-prompt').value = fullPrompt;
  setMsg("Prompt MCP de Flash Report generado con éxito.");
}
