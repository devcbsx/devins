async function createNewClientGroup() {
  var clientName = $('audit-new-client-name').value.trim();
  var vehicleType = $('audit-new-client-vehicle-type').value.trim();
  if (!clientName || !vehicleType) { setMsg("⚠️ Complete los campos obligatorios.", true); return; }

  try {
    await callMulti(ControlZ.api, [
      ['Add', { typeName: 'Group', entity: { name: clientName, parent: { id: 'b278A' } } }],
      ['Add', { typeName: 'Group', entity: { name: vehicleType + "_" + clientName, parent: { id: 'b27A8' } } }]
    ]);
    setMsg("✅ Cliente y tipo de vehículo creados en el árbol de Geotab.");
  } catch (err) { setMsg("Error al crear grupo: " + err.message, true); }
}
