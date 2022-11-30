const fs = require('fs')
const path = require('path')
var rootis = path.resolve(__dirname, '../')
exports.reqfiles = function(todo) {
    var filearr = {};
    filearr['main'] = fs.existsSync(rootis + '/public/sites/main.html');
    filearr['notify'] = fs.existsSync(rootis + '/public/sites/relify.html');
    filearr['services'] = fs.existsSync(rootis + '/public/sites/services.html');
    filearr['about'] = fs.existsSync(rootis + '/public/sites/about.html');
    filearr['crx'] = fs.existsSync(rootis + '/public/integration/crx.html');
    filearr['inject0r'] = fs.existsSync(rootis + '/public/bmlets/inject0r.js');
    filearr['bmlhub'] = fs.existsSync(rootis + '/public/bmlets/bmlhub.js');
    filearr['fileshare'] = fs.existsSync(rootis + '/public/integration/fileshare.html');
    if (todo == 'check') {
      if (filearr['main'] && filearr['notify'] && filearr['services'] && filearr['about'] && filearr['crx']) {
        return true
      } else {
        return false;
      }
    } else if (todo == 'getdataready') return filearr;
}