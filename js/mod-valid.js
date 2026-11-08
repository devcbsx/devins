// ============================================================================
// MÓDULO 2: VALIDACIÓN DE VARIABLES (js/mod-valid.js)
// ============================================================================

/**
 * Renderiza el encabezado de la tabla especificando anchos adaptativos
 */
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

/**
 * Renderiza la lista de filas permitiendo desplazar de izquierda a derecha 
 * mostrando la información completa de cada columna.
 */
function renderListValid() {
  var tbody = $('cgps-listbody');
  if (!tbody) return;

  renderHeaderValid();
  var html = '';

  ControlZ.all.forEach(function (r) {
    if (!isRowMatchingFiltersValid(r)) return;

    var isSel = !!ControlZ.selected[r.id];
    var badgeClass = r.paramCount === 5 ? 'badge-full' : (r.paramCount === 0 ? 'badge-empty' : 'badge-partial');
    var badgeLabel = r.paramCount + '/5 ' + (r.paramCount === 5 ? 'OK' : 'Incompleto');

    html += '<tr>' +
      '<td style="text-align:center;"><input type="checkbox" data-id="' + htmlEsc(r.id) + '"' + (isSel ? ' checked' : '') + '></td>' +
      '<td><b style="color:#0f172a;">' + htmlEsc(r.nombreActivo || '-') + '</b></td>' +
      '<td><span style="font-weight:700; color:#0284c7;">' + htmlEsc(r.placa || '-') + '</span></td>' +
      '<td>' + htmlEsc(r.desde || '-') + '</td>' +
      '<td style="font-family:\'JetBrains Mono\', monospace; font-size:11px;">' + htmlEsc(r.vin || '-') + '</td>' +
      '<td><span class="badge-param ' + badgeClass + '" title="Posee ' + r.paramCount + ' de 5 parámetros">' + badgeLabel + '</span></td>' +
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

  tbody.innerHTML = html || '<tr><td colspan="15" style="text-align:center; padding: 32px; color: #64748b;">No se encontraron activos coincidentes con los filtros aplicados.</td></tr>';

  updateKPIsValid();
  highlightKpiCardsValid();
}

/**
 * Valida si un registro cumple con los filtros activos del módulo
 */
function isRowMatchingFiltersValid(r) {
  if (r.isExcluded) return false;

  var hasSn = !!r.serialNumber && r.serialNumber.trim().length > 0;
  var hasVin = !!r.vin && r.vin.trim().length > 0;

  if (ControlZ.activeUnitFilter === 'snVin' && (!hasSn || !hasVin)) return false;
  if (ControlZ.activeUnitFilter === 'noVin' && hasVin) return false;
  if (ControlZ.activeUnitFilter === 'noSn' && hasSn) return false;
  if (ControlZ.activeUnitFilter === 'selected' && !ControlZ.selected[r.id]) return false;

  if (ControlZ.activeParamFilter === 'full' && r.paramCount !== 5) return false;
  if (ControlZ.activeParamFilter === 'less5' && r.paramCount === 5) return false;

  var emptyVal = function(v) { 
    return !v || v.trim() === '' || v.trim() === '-' || v.trim() === 'Sin Estado' || v.trim() === 'Sin RUC' || v.trim() === 'Sin Razón Social'; 
  };

  if (ControlZ.activeFieldMissingFilter === 'noanualidad' && !emptyVal(r.anualidad)) return false;
  if (ControlZ.activeFieldMissingFilter === 'noestado' && !emptyVal(r.estadoProvincia)) return false;
  if (ControlZ.activeFieldMissingFilter === 'noruc' && !emptyVal(r.ruc)) return false;
  if (ControlZ.activeFieldMissingFilter === 'norazon' && !emptyVal(r.razon)) return false;

  var tv = normalizeStr(r.tipoVehiculo);
  if (ControlZ.activeVehicleTypeFilter === 'remolcadores' && tv.indexOf('remolcador') < 0 && tv.indexOf('tractor') < 0) return false;
  if (ControlZ.activeVehicleTypeFilter === 'volquetes' && tv.indexOf('volquete') < 0) return false;
  if (ControlZ.activeVehicleTypeFilter === 'sintipo' && tv && tv !== 'sin tipo' && tv !== 'sin tipo vehiculo') return false;
  if (ControlZ.activeVehicleTypeFilter === 'otrostipos' && (!tv || tv === 'sin tipo' || tv === 'sin tipo vehiculo' || tv.indexOf('remolcador') >= 0 || tv.indexOf('tractor') >= 0 || tv.indexOf('volquete') >= 0)) return false;

  if (ControlZ.activeBulkTokens && ControlZ.activeBulkTokens.length > 0) {
    var nom = r._nom, p = r._p, v = r._v, s = r._s;
    var matchBulk = ControlZ.activeBulkTokens.some(function (token) {
      return nom === token || p === token || v === token || s === token || (token.length >= 3 && (nom.indexOf(token) >= 0 || p.indexOf(token) >= 0 || v.indexOf(token) >= 0 || s.indexOf(token) >= 0));
    });
    if (!matchBulk) return false;
  }

  var fieldSel = $('cgps-filter-field') ? $('cgps-filter-field').value : 'all';
  var q = $('cgps-filter') ? $('cgps-filter').value.trim().toLowerCase() : '';
  
  if (q) {
    if (fieldSel === 'all') {
      if (r._hay.indexOf(q) < 0) return false;
    } else {
      var valTarget = String(r[fieldSel] || '').toLowerCase();
      if (valTarget.indexOf(q) < 0) return false;
    }
  }

  return true;
}

/**
 * Recalcula los indicadores KPI superiores
 */
function updateKPIsValid() {
  var rowsToCount = ControlZ.all.filter(r => !r.isExcluded);
  var selCount = Object.keys(ControlZ.selected).filter(k => ControlZ.selected[k]).length;

  var countSnVin = 0, countNoVin = 0, countNoSn = 0;
  var countFull = 0, countLess5 = 0;
  var cNoAnualidad = 0, cNoEstado = 0, cNoRuc = 0, cNoRazon = 0;
  var cRemolcadores = 0, cVolquetes = 0, cSinTipo = 0, cOtrosTipos = 0;

  rowsToCount.forEach(function(r) {
    var hasSn = !!r.serialNumber && r.serialNumber.trim().length > 0;
    var hasVin = !!r.vin && r.vin.trim().length > 0;

    if (hasSn && hasVin) countSnVin++;
    if (!hasVin) countNoVin++;
    if (!hasSn) countNoSn++;

    if (r.paramCount === 5) countFull++; else countLess5++;

    if (!r.anualidad || r.anualidad.trim() === '' || r.anualidad.trim() === '-') cNoAnualidad++;
    if (!r.estadoProvincia || r.estadoProvincia.trim() === '' || r.estadoProvincia.trim() === 'Sin Estado') cNoEstado++;
    if (!r.ruc || r.ruc.trim() === '' || r.ruc.trim() === 'Sin RUC') cNoRuc++;
    if (!r.razon || r.razon.trim() === '' || r.razon.trim() === 'Sin Razón Social') cNoRazon++;

    var tv = normalizeStr(r.tipoVehiculo);
    if (!tv || tv === 'sin tipo' || tv === 'sin tipo vehiculo') {
      cSinTipo++;
    } else if (tv.indexOf('remolcador') >= 0 || tv.indexOf('tractor') >= 0) {
      cRemolcadores++;
    } else if (tv.indexOf('volquete') >= 0) {
      cVolquetes++;
    } else {
      cOtrosTipos++;
    }
  });

  if ($('kpi-sn-vin')) $('kpi-sn-vin').textContent = countSnVin;
  if ($('kpi-no-vin')) $('kpi-no-vin').textContent = countNoVin;
  if ($('kpi-no-sn')) $('kpi-no-sn').textContent = countNoSn;
  if ($('kpi-val-2')) $('kpi-val-2').textContent = selCount;

  if ($('kpi-val-4')) $('kpi-val-4').textContent = countFull;
  if ($('kpi-val-less5')) $('kpi-val-less5').textContent = countLess5;

  if ($('kpi-val-noanualidad')) $('kpi-val-noanualidad').textContent = cNoAnualidad;
  if ($('kpi-val-noestado')) $('kpi-val-noestado').textContent = cNoEstado;
  if ($('kpi-val-noruc')) $('kpi-val-noruc').textContent = cNoRuc;
  if ($('kpi-val-norazon')) $('kpi-val-norazon').textContent = cNoRazon;

  if ($('kpi-val-remolcadores')) $('kpi-val-remolcadores').textContent = cRemolcadores;
  if ($('kpi-val-volquetes')) $('kpi-val-volquetes').textContent = cVolquetes;
  if ($('kpi-val-sintipo')) $('kpi-val-sintipo').textContent = cSinTipo;
  if ($('kpi-val-otrostipos')) $('kpi-val-otrostipos').textContent = cOtrosTipos;
}

/**
 * Resalta la tarjeta de KPI seleccionada
 */
function highlightKpiCardsValid() {
  [
    'kpi-card-sn-vin', 'kpi-card-novin', 'kpi-card-nosn', 'kpi-card-2', 'kpi-card-4', 
    'kpi-card-less5', 'kpi-card-noanualidad', 'kpi-card-noestado', 'kpi-card-noruc', 'kpi-card-norazon',
    'kpi-card-type-remolcadores', 'kpi-card-type-volquetes', 'kpi-card-type-sintipo', 'kpi-card-type-otrostipos'
  ].forEach(function(id) {
    if ($(id)) $(id).classList.remove('kpi-active');
  });

  if (ControlZ.activeUnitFilter === 'snVin' && $('kpi-card-sn-vin')) $('kpi-card-sn-vin').classList.add('kpi-active');
  if (ControlZ.activeUnitFilter === 'noVin' && $('kpi-card-novin')) $('kpi-card-novin').classList.add('kpi-active');
  if (ControlZ.activeUnitFilter === 'noSn' && $('kpi-card-nosn')) $('kpi-card-nosn').classList.add('kpi-active');
  if (ControlZ.activeUnitFilter === 'selected' && $('kpi-card-2')) $('kpi-card-2').classList.add('kpi-active');

  if (ControlZ.activeParamFilter === 'full' && $('kpi-card-4')) $('kpi-card-4').classList.add('kpi-active');
  if (ControlZ.activeParamFilter === 'less5' && $('kpi-card-less5')) $('kpi-card-less5').classList.add('kpi-active');

  if (ControlZ.activeFieldMissingFilter === 'noanualidad' && $('kpi-card-noanualidad')) $('kpi-card-noanualidad').classList.add('kpi-active');
  if (ControlZ.activeFieldMissingFilter === 'noestado' && $('kpi-card-noestado')) $('kpi-card-noestado').classList.add('kpi-active');
  if (ControlZ.activeFieldMissingFilter === 'noruc' && $('kpi-card-noruc')) $('kpi-card-noruc').classList.add('kpi-active');
  if (ControlZ.activeFieldMissingFilter === 'norazon' && $('kpi-card-norazon')) $('kpi-card-norazon').classList.add('kpi-active');
}

/**
 * Decodifica VINs masivamente usando la API DecodeVins de Geotab
 */
async function decodeVinsForDevices(vinList) {
  if (!vinList || vinList.length === 0) return {};
  var cleanVins = vinList.map(v => (v || '').trim().toUpperCase()).filter(v => v.length >= 11);
  var uniqueVins = Array.from(new Set(cleanVins)).filter(v => !ControlZ.decodedVinCache[v]);

  if (uniqueVins.length === 0) return ControlZ.decodedVinCache;

  setMsg("Decodificando " + uniqueVins.length + " VINs mediante la API DecodeVins...");

  for (var i = 0; i < uniqueVins.length; i += 50) {
    var chunk = uniqueVins.slice(i, i + 50);
    try {
      var res = await callApi(ControlZ.api, 'DecodeVins', { vins: chunk });
      if (Array.isArray(res)) {
        res.forEach(item => {
          if (item && item.vin) {
            ControlZ.decodedVinCache[item.vin.trim().toUpperCase()] = {
              make: item.make || item.manufacturer || '',
              model: item.model || item.vehicleModel || '',
              year: item.year ? String(item.year) : ''
            };
          }
        });
      }
    } catch (err) { 
      console.warn("Error DecodeVins:", err); 
    }
  }
  return ControlZ.decodedVinCache;
}

/**
 * Gatilla el proceso de decodificación de VINs para la selección actual
 */
async function triggerVinDecodeProcess() {
  var selectedIds = Object.keys(ControlZ.selected).filter(k => ControlZ.selected[k]);
  var targetRows = selectedIds.length > 0 
    ? ControlZ.all.filter(r => selectedIds.includes(r.id))
    : ControlZ.all.filter(r => isRowMatchingFiltersValid(r));

  var vinsToDecode = targetRows.map(r => r.vin).filter(Boolean);
  if (vinsToDecode.length === 0) {
    setMsg("No se encontraron VINs válidos en la selección.", true);
    return;
  }

  setMsg("Iniciando decodificación de " + vinsToDecode.length + " VINs...");
  await decodeVinsForDevices(vinsToDecode);
  rebuildRows();
  renderListValid();
  setMsg("✅ Se actualizaron Marca, Modelo y Año para " + vinsToDecode.length + " vehículos.");
}

/**
 * Asigna funciones a los botones del módulo al cargar
 */
function initValidModuleEvents() {
  if ($('cgps-btn-decode-vin')) {
    $('cgps-btn-decode-vin').addEventListener('click', function(e) {
      e.preventDefault();
      triggerVinDecodeProcess();
    });
  }
}

// Vincula las funciones de renderizado local al objeto global
window.renderList = renderListValid;
window.updateKPIs = updateKPIsValid;

// Inicializa eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initValidModuleEvents);
