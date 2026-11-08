// --- MÓDULO REPORTES POR CLIENTE ---

async function createAndSubmitReport() {
  var sourceSchedId = $('create-rep-source-schedule').value;
  var repName = $('create-rep-name').value.trim();
  var statusDiv = $('create-rep-status');

  if (!sourceSchedId || !repName) {
    statusDiv.style.color = "#ef4444";
    statusDiv.textContent = "Seleccione reporte origen e ingrese el nombre destino.";
    return;
  }

  statusDiv.style.color = "#0284c7";
  statusDiv.textContent = "Registrando reporte en Geotab...";

  try {
    var newSchedule = {
      name: repName,
      destination: "NormalReport",
      frequency: "Daily",
      period: "Today",
      isActive: true,
      template: { id: "b114D" },
      groups: []
    };

    var createdResult = await callApi(ControlZ.api, 'Add', {
      typeName: 'CustomReportSchedule',
      entity: newSchedule
    });

    statusDiv.style.color = "#10b981";
    statusDiv.textContent = "✅ ¡Reporte creado con éxito! (ID: " + (createdResult.id || createdResult) + ")";
  } catch (err) {
    statusDiv.style.color = "#ef4444";
    statusDiv.textContent = "Error al crear reporte: " + (err.message || err);
  }
}
