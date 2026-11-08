function renderHeaderValid() {
  var head = $('cgps-table-head');
  if (!head) return;
  head.innerHTML = `
    <tr>
      <th style="width: 40px; text-align: center;"></th>
      <th style="min-width: 160px;">Nombre del Activo</th>
      <th style="min-width: 110px;">Placa</th>
      <th style="min-width: 110px;">Activado Desde</th>
      <th style="min-width: 165px;">VIN</th>
      <th style="min-width: 130px;">Parámetros (5)</th>
      <th style="min-width: 220px;">Grupos</th>
      <th style="min-width: 130px;">Estado / Prov.</th>
      <th style="min-width: 110px;">RUC</th>
      <th style="min-width: 220px;">Razón Social</th>
      <th style="min-width: 100px;">Anualidad</th>
      <th style="min-width: 140px;">Tipo Vehículo</th>
      <th style="min-width: 110px;">Marca</th>
      <th style="min-width: 120px;">Modelo</th>
      <th style="min-width: 80px; text-align: center;">Año</th>
    </tr>
  `;
}

function renderListValid() {
  var tbody = $('cgps-listbody');
  if (!tbody) return;
  renderHeaderValid();

  var html = '';
  ControlZ.all.forEach(function (r) {
    var isSel = !!ControlZ.selected[r.id];
    var badgeClass = r.paramCount === 5 ? 'badge-full' : (r.paramCount === 0 ? 'badge-empty' : 'badge-partial');

    html += '<tr>' +
      '<td style="text-align:center;"><input type="checkbox" data-id="' + htmlEsc(r.id) + '"' + (isSel ? ' checked' : '') + '></td>' +
      '<td><b style="color:#0f172a;">' + htmlEsc(r.nombreActivo || '-') + '</b></td>' +
      '<td><span style="font-weight:700; color:#0284c7;">' + htmlEsc(r.placa || '-') + '</span></td>' +
      '<td>' + htmlEsc(r.desde || '-') + '</td>' +
      '<td style="font-family:\'JetBrains Mono\', monospace; font-size:11px;">' + htmlEsc(r.vin || '-') + '</td>' +
      '<td><span class="badge-param ' + badgeClass + '">' + r.paramCount + '/5 OK</span></td>' +
      '<td style="white-space:normal; min-width:200px;">' + htmlEsc(r.grupos || 'Sin Grupo') + '</td>' +
      '<td>' + htmlEsc(r.estadoProvincia || 'Sin Estado') + '</td>' +
      '<td>' + htmlEsc(r.ruc || 'Sin RUC') + '</td>' +
      '<td style="white-space:normal; min-width:200px;"><b>' + htmlEsc(r.razon || 'Sin Razón Social') + '</b></td>' +
      '<td>' + htmlEsc(r.anualidad || '-') + '</td>' +
      '<td>' + htmlEsc(r.tipoVehiculo || 'Sin Tipo') + '</td>' +
      '<td>' + htmlEsc(r.marca || '-') + '</td>' +
      '<td>' + htmlEsc(r.modelo || '-') + '</td>' +
      '<td style="text-align:center;">' + htmlEsc(r.anio || '-') + '</td>' +
      '</tr>';
  });

  tbody.innerHTML = html || '<tr><td colspan="15" style="text-align:center; padding: 24px;">Sin resultados.</td></tr>';
}
