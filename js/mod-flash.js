function generateFlashReportPrompt() {
  var placa = ($('flash-input-placa').value || '').trim().toUpperCase() || '[XXX-000]';
  var vin = ($('flash-input-vin').value || '').trim().toUpperCase() || '[...]';
  var relato = ($('flash-input-relato').value || '').trim() || '[Relato del cliente]';
  var fullPrompt = `ROL: Analista en telemetría e investigación de siniestros.\nENTRADAS: Placa: ${placa} | VIN: ${vin}\nRELATO: ${relato}`;
  if ($('flash-output-prompt')) $('flash-output-prompt').value = fullPrompt;
  setMsg("Prompt MCP generado.");
}
