// --- MÓDULO CERTI GPS ---

function generateLegalText() {
  var selList = ControlZ.all.filter(function(r) { return ControlZ.selected[r.id]; });
  if (selList.length === 0) {
    setMsg("Seleccione al menos un activo para generar el texto legal.", true);
    return;
  }

  var firstRow = selList[0];
  var razonEmpresa = firstRow.razon || 'PESCO RENTAL PERU SAC';
  var rucEmpresa = firstRow.ruc || '20453537537';

  var txt = "CERTIFICADO GPS - " + razonEmpresa + "\n\n";
  txt += "Buen dia Area Legal,\n\n";
  txt += "Se solicita tu apoyo en la realización del certificado solicitado por el cliente. Considere que debe describir como beneficiaria al cliente DIVEIMPORT. Adjunto información de la(s) unidad(es):\n\n";
  txt += "DATOS DE LA EMPRESA\n\n";
  txt += "NOMBRE:  " + razonEmpresa + "\n";
  txt += "RUC:     " + rucEmpresa + "\n\n";
  txt += "Quedo atento a sus comentarios.";

  $('cgps-legal-text').value = txt;
  $('sec-certi-combined-box').style.display = 'grid';
  setMsg("Texto legal generado para " + selList.length + " vehículo(s).");
}

function downloadWordDoc() {
  var selList = ControlZ.all.filter(function(r) { return ControlZ.selected[r.id]; });
  if (selList.length === 0) {
    setMsg("Seleccione al menos un activo para generar el Word.", true);
    return;
  }

  var firstRow = selList[0];
  var razonEmpresa = firstRow.razon || 'PESCO RENTAL PERU SAC';
  var fechaStr = fmtDate(new Date().toISOString()).replace(/\//g, '-');

  var docContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
  docContent += '<head><meta charset="utf-8"><style>';
  docContent += 'body { font-family: Arial, sans-serif; font-size: 11pt; }';
  docContent += '.title { font-weight: bold; font-size: 12pt; text-align: center; margin-bottom: 12px; }';
  docContent += 'table { border-collapse: collapse; width: 100%; margin: 0 auto; }';
  docContent += 'th, td { border: 1px solid #000000; padding: 6px 8px; text-align: center; font-size: 10.5pt; }';
  docContent += 'th { font-weight: bold; background-color: #ffffff; }';
  docContent += '</style></head><body>';
  docContent += '<div class="title">ANEXO N°01</div>';
  docContent += '<table><thead><tr><th>Nº</th><th>Placa</th><th>VIN</th><th>ACTIVO DESDE</th></tr></thead><tbody>';

  selList.forEach(function(r, index) {
    docContent += '<tr>';
    docContent += '<td>' + (index + 1) + '</td>';
    docContent += '<td>' + htmlEsc(r.placa) + '</td>';
    docContent += '<td>' + htmlEsc(r.vin) + '</td>';
    docContent += '<td>' + htmlEsc(r.desde) + '</td>';
    docContent += '</tr>';
  });

  docContent += '</tbody></table></body></html>';

  var blob = new Blob(['\ufeff' + docContent], { type: 'application/msword' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'CERTIFICADO GPS - ' + razonEmpresa + ' - ' + fechaStr + '.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  setMsg("📄 Word (ANEXO N°01) generado con éxito.");
}
