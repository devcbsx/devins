// --- MÓDULO MASTER SWITCH ---

function exportMasterExcel() {
  var rowsToExport = ControlZ.all;
  if (rowsToExport.length === 0) {
    setMsg('No hay datos para exportar.', true);
    return;
  }

  var sheetData = [["PLACA", "BASE DE DATOS", "VIN", "# SERIE", "INSTALACIÓN"]];
  rowsToExport.forEach(function(r) {
    sheetData.push([r.placa, ControlZ.databaseName, r.vin, r.serialNumber, r.desde]);
  });

  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 20 }, { wch: 16 }];

  var fileName = 'Master_Switch_Divemotor_' + fmtDate(new Date().toISOString()).replace(/\//g, '-') + '.xlsx';
  XLSX.utils.book_append_sheet(wb, ws, "Master Switch");
  XLSX.writeFile(wb, fileName);
  setMsg('📊 Master Switch exportado (' + rowsToExport.length + ' registros).');
}
