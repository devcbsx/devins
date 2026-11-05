import { CONFIG } from '../config.js';

export class ValidModule {
  constructor(apiService, getActiveRowsFn, getSelectedFn, setMsgFn, resetFiltersFn, reloadFn) {
    this.api = apiService;
    this.getActiveRows = getActiveRowsFn;
    this.getSelected = getSelectedFn;
    this.setMsg = setMsgFn;
    this.resetFilters = resetFiltersFn;
    this.reload = reloadFn;
  }

  async injectRequiredParameters() {
    const selected = this.getSelected();
    const activeRows = this.getActiveRows();
    const selectedIds = Object.keys(selected).filter(k => selected[k]);

    this.setMsg("Inyectando 5 parámetros...");
    const calls = [];

    selectedIds.forEach(id => {
      const row = activeRows.find(r => r.id === id);
      if (!row || !row.rawDevice) return;
      const device = row.rawDevice;
      const currentParams = Array.isArray(device.customParameters) ? device.customParameters.slice() : [];

      CONFIG.REQUIRED_PARAMS.forEach(req => {
        const idx = currentParams.findIndex(cp => Number(cp.offset) === req.offset);
        if (idx < 0) {
          currentParams.push({ offset: req.offset, bytes: req.bytes, isEnabled: true });
        } else {
          currentParams[idx].bytes = req.bytes;
          currentParams[idx].isEnabled = true;
        }
      });

      device.customParameters = currentParams;
      calls.push(['Set', { typeName: 'Device', entity: device }]);
    });

    try {
      await this.api.callMulti(calls);
      this.resetFilters();
      this.setMsg("✅ Parámetros inyectados correctamente.");
      setTimeout(() => this.reload(), 1200);
    } catch (err) {
      this.setMsg("Error inyectando parámetros: " + err.message, true);
    }
  }
}
