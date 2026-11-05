export class GeotabApiService {
  constructor(geotabApi) {
    this.api = geotabApi;
  }

  setApi(geotabApi) {
    this.api = geotabApi;
  }

  callApi(method, params) {
    return new Promise((resolve, reject) => {
      if (!this.api) return reject(new Error("API no inicializada"));
      this.api.call(method, params, resolve, reject);
    });
  }

  callMulti(calls) {
    return new Promise((resolve, reject) => {
      if (!this.api) return reject(new Error("API no inicializada"));
      this.api.multiCall(calls, resolve, reject);
    });
  }

  async getSession() {
    return new Promise((resolve) => {
      try {
        if (this.api && typeof this.api.getSession === 'function') {
          this.api.getSession((session) => resolve(session));
        } else {
          resolve(null);
        }
      } catch (e) {
        resolve(null);
      }
    });
  }

  async decodeVinsChunked(vins, cacheRef, progressCb) {
    const cleanVins = vins.map(v => (v || '').trim().toUpperCase()).filter(v => v.length >= 11 && !cacheRef[v]);
    const uniqueVins = Array.from(new Set(cleanVins));
    if (uniqueVins.length === 0) return cacheRef;

    const CHUNK_SIZE = 50;
    for (let i = 0; i < uniqueVins.length; i += CHUNK_SIZE) {
      const chunk = uniqueVins.slice(i, i + CHUNK_SIZE);
      if (progressCb) progressCb(i + chunk.length, uniqueVins.length);
      try {
        const res = await this.callApi('DecodeVins', { vins: chunk });
        if (Array.isArray(res)) {
          res.forEach(item => {
            if (item && item.vin) {
              cacheRef[item.vin.trim().toUpperCase()] = {
                make: item.make || '', model: item.model || '', year: item.year ? String(item.year) : ''
              };
            }
          });
        }
      } catch (err) {
        console.warn("Error DecodeVins chunk:", err);
      }
    }
    return cacheRef;
  }
}
