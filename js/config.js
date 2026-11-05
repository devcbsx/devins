export const CONFIG = {
  SECURITY: {
    DEFAULT_PASS: "3219878",
    ALLOWED_USER: "ejecutivo.cuentas13@navisaf.pe",
    ALLOWED_DOMAINS: ["geotab.com", "mygeotab", "copiloto.app"]
  },
  
  REQUIRED_PARAMS: [
    { description: "Enable Gps Altitude Logging", offset: 181, bytes: "CA==" },
    { description: "Disable Accelerometer Record Limit", offset: 65, bytes: "Ag==" },
    { description: "High Res RPM allowed Error = 2 rpm", offset: 168, bytes: "Ag==" },
    { description: "Enable Engine Load", offset: 165, bytes: "BA==" },
    { description: "Enable Engine Retarder Selection And Accel Pedal", offset: 166, bytes: "CQ==" }
  ],

  DEVICE_FIELDS: [
    'id', 'name', 'licensePlate', 'licenseState', 'vehicleIdentificationNumber', 
    'serialNumber', 'activeFrom', 'activeTo', 'deviceType', 'groups', 
    'customProperties', 'customParameters', 'comment', 'make', 'model', 'year'
  ],

  DEFAULT_DATABASE: "divemotor"
};
