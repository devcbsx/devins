function exportMasterExcel() {
  if (ControlZ.all.length === 0) { setMsg('No hay datos para exportar.', true); return; }
  var sheetData = [["PLACA", "BASE DE DATOS", "VIN", "# SERIE", "INSTALACIÓN"]];
  ControlZ.all.forEach(r => sheetData.push([r.placa, ControlZ.databaseName, r.vin, r.serialNumber, r.desde]));

  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(wb, ws, "Master Switch");
  XLSX.writeFile(wb, 'Master_Switch_' + fmtDate(new Date().toISOString()).replace(/\//g, '-') + '.xlsx');
  setMsg('📊 Master Switch exportado a Excel.');
}
