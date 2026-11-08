async function createNewUserAutomated() {
  var email = ($('usr-input-email').value || '').trim();
  var group = $('usr-select-group').value;
  if (!email || !group) { setMsg("Complete todos los campos requeridos.", true); return; }
  try {
    var res = await callApi(ControlZ.api, 'Add', {
      typeName: 'User',
      entity: { name: email, companyGroups: [{ id: group }], securityGroups: [{ id: "GroupSecurityClientAdminId" }] }
    });
    setMsg("✅ Usuario creado exitosamente.");
  } catch (err) { setMsg("Error al crear usuario: " + err.message, true); }
}
