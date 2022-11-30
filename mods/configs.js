exports.sconfig = { title: 'Alloy Status', theme: 'default.css', path: '/status', socketPath: '/socket.io',
spans: [{
  interval: 1,            // Every secon
  retention: 60           // Keep 60 datapoints in memory
}, {
  interval: 5,            // Every 5 seconds
  retention: 60
}, {
  interval: 15,           // Every 15 seconds
  retention: 60
}], chartVisibility: {
  cpu: true,
  mem: true,
  load: true,
  eventLoop: true,
  heap: true,
  responseTime: true,
  rps: true,
  statusCodes: true
}, healthChecks: [{
  protocol: 'http',
  host: 'localhost',
  path: '/crx',
  port: '3000'
}, {
  protocol: 'http',
  host: 'localhost',
  path: '/',
  port: '3000'
}, {
  protocol: 'http',
  host: 'localhost',
  path: '/services',
  port: '3000'
}, {
  protocol: 'http',
  host: 'localhost',
  path: '/about',
  port: '3000'
}],ignoreStartsWith: ['/images']}
exports.oneconfig = {}
exports.oneconfig.appid = '30e00d47-2413-487e-99fe-6b7175e7f9bc';
const OneSignal = require('@onesignal/node-onesignal');
exports.oneconfig.keyprovider = {
    getToken() {
        return process.env.rest;
    }
};
let backupop = {
    getToken() {
        return process.env.rest;
    }
};
exports.oneconfig.config = OneSignal.createConfiguration({
    authMethods: {
        app_key: {
        	tokenProvider: backupop
        }
    }
});