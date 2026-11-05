import { CONFIG } from './config.js';
import { GeotabApiService } from './geotab-api.js';
import { ValidModule } from './modules/valid.js';

let api = null;
let apiService = null;
let all = [];
let selected = {};

const $ = id => document.getElementById(id);

function setMsg(t, err) {
  const m = $('cgps-msg');
  if (m) {
    m.textContent = t || '';
    m.className = 'cgps-msg' + (err ? ' cgps-err' : '');
  }
}

async function loadData() {
  setMsg('Cargando datos...');
  try {
    const res = await apiService.callMulti([
      ['Get', { typeName: 'Device', resultsLimit: 5000 }]
    ]);
    all = res[0] || [];
    setMsg(all.length + ' activos cargados.');
  } catch (err) {
    setMsg('Error al cargar datos: ' + err.message, true);
  }
}

export const ControlZAddIn = function(geotabApi, state) {
  api = geotabApi;
  apiService = new GeotabApiService(api);

  return {
    initialize: function(gApi, state, callback) {
      if (gApi) apiService.setApi(gApi);
      loadData();
      if (typeof callback === 'function') callback();
    },
    focus: function(gApi) { if (gApi) apiService.setApi(gApi); },
    blur: function() {}
  };
};

window.geotab = window.geotab || {};
window.geotab.addin = window.geotab.addin || {};
window.geotab.addin["Control Z"] = ControlZAddIn;
