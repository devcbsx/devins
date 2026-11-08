function generateFlashReportPrompt() {
  var placa = ($('flash-input-placa').value || '').trim().toUpperCase() || '[XXX-000]';
  var vin = ($('flash-input-vin').value || '').trim().toUpperCase() || '[...]';
  var relato = ($('flash-input-relato').value || '').trim() || '[Relato del cliente]';

  var fullPrompt = `ROL: Analista experto en telemetría e investigación de siniestros viales.
ENTRADAS: Placa: ${placa} | VIN: ${vin}
DESCRIPCIÓN DE SUCESO: ${relato}`;

  $('flash-output-prompt').value = fullPrompt;
  setMsg("Prompt MCP generado.");
}
