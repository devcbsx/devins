async function createAndSubmitReport() {
  var repName = $('create-rep-name').value.trim();
  if (!repName) { setMsg("Ingrese un nombre válido.", true); return; }

  try {
    var res = await callApi(ControlZ.api, 'Add', {
      typeName: 'CustomReportSchedule',
      entity: { name: repName, destination: "NormalReport", frequency: "Daily", isActive: true, template: { id: "b114D" } }
    });
    setMsg("✅ Reporte creado correctamente (ID: " + (res.id || res) + ")");
  } catch (err) { setMsg("Error al crear reporte: " + err.message, true); }
}
