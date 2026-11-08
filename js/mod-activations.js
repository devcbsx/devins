function processActivationsText() {
  var raw = ($('act-input-text').value || '').trim();
  if (!raw) { setMsg("Ingrese el texto a procesar.", true); return; }

  var isImmediate = raw.toUpperCase().indexOf("ACT INMEDIATA") >= 0;
  var out = "Buen día estimados,\n\n" + (isImmediate 
    ? "Al ser una activación inmediata considerar los siguientes grupos:\n\nBD: DIVEMOTOR\n\n"
    : "Dado que no es activación inmediata se envía lo solicitado:\n\nBD: DIVEMOTOR\nGRUPO: Unidades sin asignar\n\n") + "Saludos cordiales,";

  $('act-output-text').value = out;
  setMsg("Formatos procesados correctamente.");
}
