// --- MÓDULO NUEVO USUARIO AUTOMÁTICO ---

async function createNewUserAutomated() {
  var email = ($('usr-input-email').value || '').trim();
  var firstName = ($('usr-input-firstname').value || '').trim();
  var lastName = ($('usr-input-lastname').value || '').trim();
  var selectedGroupId = $('usr-select-group').value;
  var statusDiv = $('usr-status-msg');

  if (!email || !selectedGroupId) {
    statusDiv.style.color = "#ef4444";
    statusDiv.textContent = "Debe completar el correo y seleccionar un grupo.";
    return;
  }

  statusDiv.style.color = "#0284c7";
  statusDiv.textContent = "Creando usuario '" + email + "' en Geotab...";

  try {
    var newUser = {
      name: email,
      firstName: firstName,
      lastName: lastName,
      companyGroups: [{ id: selectedGroupId }],
      securityGroups: [{ id: "GroupSecurityClientAdminId" }],
      activeFrom: new Date().toISOString(),
      activeTo: "2050-01-01T00:00:00.000Z"
    };

    var res = await callApi(ControlZ.api, 'Add', { typeName: 'User', entity: newUser });
    statusDiv.style.color = "#10b981";
    statusDiv.textContent = "✅ Usuario '" + email + "' creado correctamente (ID: " + (res.id || res) + ")";
  } catch (err) {
    statusDiv.style.color = "#ef4444";
    statusDiv.textContent = "Error al crear usuario: " + (err.message || err);
  }
}
