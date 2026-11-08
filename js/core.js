// --- GLOBAL NAMESPACE & STATE ---
window.ControlZ = {
  api: null,
  PASS_CORRECTA: "3219878",
  USUARIO_PERMITIDO: "ejecutivo.cuentas13@navisaf.pe",
  REQUIRED_PARAMS: [
    { description: "Enable Gps Altitude Logging", offset: 181, bytes: "CA==" },
    { description: "Disable Accelerometer Record Limit", offset: 65, bytes: "Ag==" },
    { description: "High Res RPM allowed Error = 2 rpm", offset: 168, bytes: "Ag==" },
    { description: "Enable Engine Load", offset: 165, bytes: "BA==" },
    { description: "Enable Engine Retarder Selection And Accel Pedal", offset: 166, bytes: "CQ==" }
  ],
  DEVICE_FIELDS: ['id', 'name', 'licensePlate', 'licenseState', 'vehicleIdentificationNumber', 'serialNumber', 'activeFrom', 'activeTo', 'deviceType', 'groups', 'customProperties', 'customParameters', 'comment', 'make', 'model', 'year'],
  all: [],
  groupsById: {},
  statusById: {},
  selected: {},
  rawDevices: [],
  decodedVinCache: {},
  filteredAllowedGroupsList: [],
  rawSchedules: [],
  templateNamesById: {},
  usersById: {},
  rulesById: {},
  diagById: {},
  currentReportRows: [],
  loadedCatalogItems: [],
  sourceGroupSchedules: [],
  REPORT_LINK_HASH: '#customReportSchedule,id:',
  activeBulkTokens: [],
  activeModule: 'hub',
  activeUnitFilter: 'all',
  activeParamFilter: 'all',
  activeFieldMissingFilter: 'all',
  activeVehicleTypeFilter: 'all',
  activeDateRange: null,
  databaseName: "divemotor",
  currentSelectedReportObj: null,
  fetchedSubGroups: [],
  pendingSaveAction: null
};

// --- UTILITIES ---
function $(id) { return document.getElementById(id); }
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function fmtDate(iso) {
  if (!iso) return '';
  var d = new Date(iso);
  if (isNaN(d.getTime()) || d.getFullYear() > 2040) return '';
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getFullYear());
}
function fmtDateTime(iso) {
  if (!iso) return 'No registrada';
  var d = new Date(iso);
  if (isNaN(d.getTime())) return 'No registrada';
  return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}
function htmlEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }).replace(/'/g, '&#39;'); }
function normalizeStr(str) {
  if (!str) return '';
  return String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();
}

function setMsg(t, err) { 
  var m = $('cgps-msg'); 
  if (m) { 
    m.textContent = t || ''; 
    m.className = 'cgps-msg' + (err ? ' cgps-err' : ''); 
  } 
}

function callApi(apiRef, method, params) { 
  return new Promise(function (ok, fail) { 
    if (!apiRef) { fail(new Error("La referencia API de Geotab no está disponible.")); return; }
    apiRef.call(method, params, ok, fail); 
  }); 
}

function callMulti(apiRef, calls) { 
  return new Promise(function (ok, fail) { 
    if (!apiRef) { fail(new Error("La referencia API de Geotab no está disponible.")); return; }
    apiRef.multiCall(calls, ok, fail); 
  }); 
}

function checkAllowedEnvironment() {
  var isIframe = (window !== window.top);
  var ref = (document.referrer || "").toLowerCase();
  var isGeotab = ref.indexOf("geotab.com") >= 0 || ref.indexOf("mygeotab") >= 0;
  var isCopiloto = ref.indexOf("copiloto.app") >= 0;

  if (!isIframe && !isGeotab && !isCopiloto) {
    document.body.innerHTML = "<div style='display:flex; justify-content:center; align-items:center; height:100vh; background-color:#0f172a; font-family:sans-serif;'><div style='text-align:center; padding:40px; background:#1e293b; border-radius:16px; border:1px solid #334155; color:white;'><h3 style='color:#ef4444; margin:0 0 10px 0;'>Acceso Restringido</h3><p style='color:#94a3b8; font-size:14px; margin:0;'>Este módulo requiere un entorno Geotab autorizado.</p></div></div>";
    throw new Error("Acceso denegado fuera de entorno autorizado.");
  }
}

function setupLoginListeners() {
  var btnLogin = $('testn-btn-login');
  var inputPass = $('testn-pass-input');

  if (btnLogin) {
    btnLogin.onclick = function() {
      var val = inputPass ? inputPass.value : '';
      if (val === ControlZ.PASS_CORRECTA) {
        $('testn-login-overlay').style.display = 'none';
        $('cgps-root').style.display = 'block';
      } else {
        $('testn-login-err').textContent = "Contraseña incorrecta";
      }
    };
  }

  if (inputPass) {
    inputPass.onkeypress = function(e) {
      if (e.key === 'Enter' && btnLogin) btnLogin.click();
    };
  }
}

// --- ADDIN CONSTRUCTOR FOR GEOTAB ---
var addInConstructor = function (geotabApi, state, callback) {
  'use strict';
  ControlZ.api = geotabApi;

  return {
    initialize: function (geotabApi, state, initializeCallback) {
      if (geotabApi) ControlZ.api = geotabApi;
      if (typeof initializeCallback === 'function') initializeCallback();
      checkAllowedEnvironment();
      setupLoginListeners();
      loadData();
    },
    focus: function (geotabApi, state) {
      if (geotabApi) ControlZ.api = geotabApi;
    },
    blur: function (geotabApi, state) {}
  };
};

function loadData() {
  setMsg('Sincronizando activos y DeviceStatusInfo de MyGeotab...');

  var sessionP = new Promise(function (ok) {
    try { 
      if (ControlZ.api && typeof ControlZ.api.getSession === 'function') {
        ControlZ.api.getSession(function (s) { ok(s); }); 
      } else { ok(null); }
    } catch (e) { ok(null); }
  });

  return sessionP.then(function(session) {
    var currentUser = session && (session.userName || session.user);
    if (!currentUser || String(currentUser).toLowerCase() !== ControlZ.USUARIO_PERMITIDO.toLowerCase()) {
      document.body.innerHTML = "<div style='display:flex; justify-content:center; align-items:center; height:100vh; background-color:#0f172a; font-family:sans-serif;'><div style='text-align:center; padding:40px; background:#1e293b; border-radius:16px; border:1px solid #334155; color:white;'><h3 style='color:#ef4444; margin:0 0 10px 0;'>Acceso Denegado</h3><p style='color:#94a3b8; font-size:14px; margin:0;'>Este módulo está restringido exclusivamente para la cuenta autorizada.</p></div></div>";
      throw new Error("Usuario no autorizado.");
    }

    if (session && session.database) ControlZ.databaseName = session.database;

    return callMulti(ControlZ.api, [
      ['Get', { typeName: 'Device', search: {}, resultsLimit: 5000, propertySelector: { fields: ControlZ.DEVICE_FIELDS, isIncluded: true } }],
      ['Get', { typeName: 'Group' }],
      ['Get', { typeName: 'DeviceStatusInfo' }]
    ]).then(function (res) {
      var devices = (res && res[0]) || [];
      var groups = (res && res[1]) || [];
      var statuses = (res && res[2]) || [];

      ControlZ.groupsById = {};
      groups.forEach(function (g) { ControlZ.groupsById[g.id] = g; });

      ControlZ.statusById = {};
      statuses.forEach(function (s) { if (s && s.device) ControlZ.statusById[s.device.id] = s; });

      ControlZ.rawDevices = devices.filter(function (d) {
        if (d.deviceType === 'CustomDevice') return false;
        return true;
      });

      rebuildRows();
      renderList();
      setMsg(ControlZ.all.length + ' activos sincronizados correctamente.');
    });
  }).catch(function (e) {
    setMsg('Error al sincronizar con Geotab: ' + (e && e.message ? e.message : e), true);
  });
}

function rebuildRows() {
  ControlZ.all = ControlZ.rawDevices
    .map(function (d) { return toRow(d); })
    .sort(function (a, b) { return a.placa.localeCompare(b.placa, 'es', { numeric: true }); });
  updateKPIs();
}

function toRow(d) {
  var name = (d.name || '').trim();
  var plate = (d.licensePlate || '').trim();
  var vin = (d.vehicleIdentificationNumber || '').trim().toUpperCase();
  var serial = (d.serialNumber || '').trim();
  
  return {
    id: d.id,
    rawDevice: d,
    nombreActivo: name,
    placa: plate || name,
    vin: vin,
    serialNumber: serial,
    desde: fmtDate(d.activeFrom),
    activeFromRaw: d.activeFrom ? new Date(d.activeFrom) : null,
    grupos: (d.groups || []).map(g => ControlZ.groupsById[g.id]?.name || g.id).join(', '),
    paramCount: 5
  };
}

function renderList() { /* Implementado en mod-valid.js */ }
function updateKPIs() { /* Implementado en mod-valid.js */ }

// Registro del AddIn en window.geotab
window.geotab = window.geotab || {};
window.geotab.addin = window.geotab.addin || {};
(function registerAddIn() {
  var reg = window.geotab.addin;
  var keys = ["Control Z", "control_z", "control_z-index", "ztest-index"];
  keys.forEach(function (k) { reg[k] = addInConstructor; });
})();
