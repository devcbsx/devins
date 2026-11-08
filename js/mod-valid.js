// --- MÓDULO VALIDACIÓN DE VARIABLES ---

async function decodeVinsForDevices(vinList) {
  if (!vinList || vinList.length === 0) return {};
  var cleanVins = vinList.map(v => (v || '').trim().toUpperCase()).filter(v => v.length >= 11);
  var uniqueVins = Array.from(new Set(cleanVins)).filter(v => !ControlZ.decodedVinCache[v]);
  if (uniqueVins.length === 0) return ControlZ.decodedVinCache;

  setMsg("Decodificando " + uniqueVins.length + " VINs mediante la API DecodeVins...");

  for (var i = 0; i < uniqueVins.length; i += 50) {
    var chunk = uniqueVins.slice(i, i + 50);
    try {
      var res = await callApi(ControlZ.api, 'DecodeVins', { vins: chunk });
      if (Array.isArray(res)) {
        res.forEach(item => {
          if (item && item.vin) {
            ControlZ.decodedVinCache[item.vin.trim().toUpperCase()] = {
              make: item.make || item.manufacturer || '',
              model: item.model || item.vehicleModel || '',
              year: item.year ? String(item.year) : ''
            };
          }
        });
      }
    } catch (err) { console.warn("Error DecodeVins:", err); }
  }
  return ControlZ.decodedVinCache;
}

async function triggerVinDecodeProcess() {
  var selectedIds = Object.keys(ControlZ.selected).filter(k => ControlZ.selected[k]);
  var targetRows = selectedIds.length > 0 
    ? ControlZ.all.filter(r => selectedIds.includes(r.id))
    : ControlZ.all;

  var vinsToDecode = targetRows.map(r => r.vin).filter(Boolean);
  if (vinsToDecode.length === 0) {
    setMsg("No se encontraron VINs válidos en la selección.", true);
    return;
  }

  await decodeVinsForDevices(vinsToDecode);
  rebuildRows();
  setMsg("✅ Marca, Modelo y Año decodificados para " + vinsToDecode.length + " vehículos.");
}
