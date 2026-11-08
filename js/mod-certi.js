function generateLegalText() {
  var selList = ControlZ.all.filter(r => ControlZ.selected[r.id]);
  if (selList.length === 0) { setMsg("Seleccione al menos un activo.", true); return; }
  var firstRow = selList[0];
  var txt = "CERTIFICADO GPS - " + (firstRow.razon || 'PESCO RENTAL PERU SAC') + "\n\n" +
            "Buen día Área Legal,\n\nSe solicita apoyo en la realización del certificado para DIVEIMPORT.\n\n" +
            "DATOS DE LA EMPRESA\nNOMBRE: " + (firstRow.razon || 'PESCO RENTAL PERU SAC') + "\nRUC: " + (firstRow.ruc || '20453537537') + "\n\nQuedo atento.";
  if ($('cgps-legal-text')) $('cgps-legal-text').value = txt;
  if ($('sec-certi-combined-box')) $('sec-certi-combined-box').style.display = 'grid';
  setMsg("Texto legal generado.");
}

function downloadWordDoc() {
  var selList = ControlZ.all.filter(r => ControlZ.selected[r.id]);
  if (selList.length === 0) { setMsg("Seleccione un activo para generar el Word.", true); return; }
  var docContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #000; padding: 6px; text-align: center; }</style></head><body>' +
    '<h3 style="text-align:center;">ANEXO N°01</h3><table><thead><tr><th>Nº</th><th>Placa</th><th>VIN</th><th>ACTIVO DESDE</th></tr></thead><tbody>';
  selList.forEach((r, i) => { docContent += `<tr><td>${i + 1}</td><td>${htmlEsc(r.placa)}</td><td>${htmlEsc(r.vin)}</td><td>${htmlEsc(r.desde)}</td></tr>`; });
  docContent += '</tbody></table></body></html>';
  var blob = new Blob(['\ufeff' + docContent], { type: 'application/msword' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = 'CERTIFICADO_GPS.doc'; a.click(); URL.revokeObjectURL(url);
  setMsg("📄 Word (ANEXO N°01) generado con éxito.");
}
