// --- MÓDULO ACTIVACIONES DE UNIDADES ---

function processActivationsText() {
  var raw = ($('act-input-text').value || '').trim();
  var badge = $('act-detected-badge');
  if (!raw) {
    setMsg("Ingrese texto de solicitud a procesar.", true);
    return;
  }

  var upper = raw.toUpperCase();
  var isImmediate = upper.indexOf("ACT INMEDIATA") >= 0 || upper.indexOf("ACTIVACIÓN INMEDIATA") >= 0;

  var out = "Buen día estimados,\n\n";
  if (!isImmediate) {
    if (badge) {
      badge.textContent = "NO REQUIERE ACTIVACIÓN INMEDIATA";
      badge.className = "badge-param badge-partial";
      badge.style.display = "inline-block";
    }
    out += "Dado que no indica activación inmediata se envía lo solicitado:\n\nBD: DIVEMOTOR\nGRUPO: Unidades sin asignar\n\nSaludos cordiales,";
  } else {
    if (badge) {
      badge.textContent = "ACTIVACIÓN INMEDIATA DETECTADA";
      badge.className = "badge-param badge-full";
      badge.style.display = "inline-block";
    }
    out += "Al ser activación inmediata considerar los siguientes grupos:\n\nBD: DIVEMOTOR\n\nSaludos cordiales,";
  }

  $('act-output-text').value = out;
  setMsg("Formato procesado correctamente.");
}
