// --- MÓDULO AUDITORÍA DE GRUPOS ---

async function createNewClientGroup() {
  var clientName = $('audit-new-client-name').value.trim();
  var vehicleType = $('audit-new-client-vehicle-type').value.trim();
  var statusDiv = $('audit-create-status');

  if (!clientName || !vehicleType) {
    statusDiv.style.color = "#ef4444";
    statusDiv.textContent = "⚠️ Complete Razón Social y Tipo de Vehículo.";
    return;
  }

  var divemotorGroupName = vehicleType + "_" + clientName;
  statusDiv.style.color = "#0284c7";
  statusDiv.textContent = "Creando cliente en árbol Geotab...";

  try {
    var calls = [
      ['Add', { typeName: 'Group', entity: { name: clientName, parent: { id: 'b278A' } } }],
      ['Add', { typeName: 'Group', entity: { name: divemotorGroupName, parent: { id: 'b27A8' } } }]
    ];
    await callMulti(ControlZ.api, calls);
    statusDiv.style.color = "#10b981";
    statusDiv.textContent = "✅ Creado: '" + clientName + "' y '" + divemotorGroupName + "'";
  } catch (err) {
    statusDiv.style.color = "#ef4444";
    statusDiv.textContent = "Error al crear cliente: " + (err.message || err);
  }
}
