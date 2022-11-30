var express = require('express'),
    path = require('path');
    wout = express.Router();

var rootis = path.resolve(__dirname, '../')
wout.get('/fs', (req, res) => {
  res.sendFile('/public/integration/fileshare.html', {root: rootis})
});
wout.get('/fse', (req, res) => {
  res.redirect('https://706h8v-3000.csb.app/?ip=any');
});
wout.get('/er/:nu', (req, res) => {
  try {
    var numb = req.url.split("/")[1];
    if (numb == '1') {
      res.sendFile('/crep/1.html', {root: rootis});
  } else if (numb == '2') {
    res.sendFile('/crep/2.html', {root: rootis});
  } else if (numb == '3') {
    res.sendFile('/crep/3.html', {root: rootis});
  } else if (numb == '4') {
    res.sendFile('/crep/4.html', {root: rootis});
  } else if (numb == '5') {
    res.sendFile('/crep/5.html', {root: rootis});
  }} catch(err) {
    console.error(err);
    res.send(err)
  }
});
wout.get('/prox/:which', (req, res) => {
  if (req.params.which == 'utopia') {
    res.status(302).redirect('https://mathsspot.algebrashelper.com/')
  } else if (req.params.which == 'node') {
    res.status(302).redirect('https://iyq9e.sse-0.codesandbox.io/')
  } else if (req.params.which == 'phpprox') {
    res.status(302).redirect('https://www.rateavon.je/error.php')
  } else if (req.params.which == 'holyub') {
    res.status(302).redirect('https://www.fineasiandiningub.com/')
  } else if (req.params.which == 'tacoproxy') {
    res.status(302).redirect('https://gcd88.sse.codesandbox.io/')
  } else if (req.params.which == 'censordodge') {
    res.status(302).redirect('https://www.censordodge.com/')
  } else if (req.params.which == 'nebula') {
    res.status(302).redirect('https://believed-lemon-pillow.glitch.me/');
  } else if (req.params.which == 'hypertabs') {
    res.status(302).redirect('https://uzk8rq-7070.csb.app/');
  } else {
    res.send(`No such proxy with name: ${req.params.which}`)
  }
})
wout.get('/bookmarklets', (req, res, next) => {
    if (typeof req.query.q !== 'undefined') {
        var to = req.query.q;
        if (to == "inject0r") {
            res.sendFile('/public/bmlets/inject0r.js', { root: rootis })
        } else if (to == "bmlhub") {
            res.sendFile('/public/bmlets/bmlhub.js', { root: rootis })
        } else {
            next()
        }
    } else {
        next()
    }
});
module.exports = wout;