const express = require('express'),
  axios = require('axios'),
  bodyParser = require('body-parser')
  cookieParser = require("cookie-parser"),
  sessions = require('express-session'),
  fs = require('fs'),
  funcs = require('./mods/funcs.js'),
  config = require('./mods/configs.js'),
  app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
//session middleware
app.use(sessions({
    secret: "reallyfatcat123",
    saveUninitialized:true,
    cookie: { maxAge: 600000 },
    resave: false,
    httpOnly: false
}));
//username and password
var myusername;
var usrLvls;
var mypassword;
function loadauths() {
var auths1 = fs.readFileSync(`${__dirname}/auths.json`, 'utf-8');
var auths = JSON.parse(auths1)
myusername = auths["usr"];
usrLvls = auths["lvls"]
mypassword = auths["psw"];
}
loadauths()
// a variable to save a session
var session;
const socketio = require('socket.io')(3001);
const OneSignal = require('@onesignal/node-onesignal');

//notifications

const client = new OneSignal.DefaultApi(config.oneconfig.config);
var notification = new OneSignal.Notification();
notification.app_id = config.oneconfig.appid;
notification.included_segments = ['Subscribed Users'];
notification.contents = {
	en: "Alloy Server On!"
};
async function noice() {
var {id} = await client.createNotification(notification);
}
noice();
async function notif(text) {
  notification.contents = {
	  en: text
  };
  var {id} = await client.createNotification(notification);
  return {id}
}

//handproxy
async function getdata(link) {
  let response = await axios.get(link);
  return response.data;
}
async function getdatac(link) {
  const response = await axios.get(`https://api.codetabs.com/v1/proxy/?quest=${link}`);
  return response.data;
}

//website events

const matenance = false;
app.use(function(req, res, next){
  if (req.url == '/status') {
    if (req.query.pass = "alloymainserver") {
      next()
    } else {
      res.send("unauthorized")
    }
  } else {
    next()
  }
})
if (matenance) {
  app.use(function(req, res, next){
    res.status(503).sendFile('/public/errors/503.html', {root: __dirname})
  })
}

//monitor

app.use(require('express-status-monitor')(config.sconfig));

//fetch

function pinghttps(weburl){
  try {
    var URL = weburl
    var response = axios.get(URL);
    return 'Pinged!'
  } catch (error) {
    return `Error: ${error}`
  }
}
//required files
const demfilescheck = funcs.reqfiles('getdataready');
console.log('Files:');
var structDatas = [
  { path: '/public/bmlets/inject0r.js', exists: demfilescheck['inject0r']},
  { path: '/public/bmlets/bmlhub.js', exists: demfilescheck['bmlhub']},
  { path: '/public/integration/crx.html', exists: demfilescheck['crx']},
  { path: '/public/integration/fileshare.html', exists: demfilescheck['fileshare']},
];
console.table(structDatas);

//server

app.get('/',(req,res) => {
  if ((req.session.userid == "") || (typeof req.session.userid === 'undefined') || (req.session.userid === null)) {
    res.sendFile('views/index.html',{root:__dirname})
  } else {
    res.write(fs.readFileSync(__dirname + '/public/sites/main.html'));
    var usrlv = myusername.indexOf(req.session.userid);
    var ul = usrLvls[usrlv]
    res.end(`<div style="position:fixed;bottom:0;left:0;background-color:aqua;font-family:Geneva,Tahoma,sans-serif;">User: ${req.session.userid}<br>Rank: ${ul}</div>`)
  }
});
app.post('/login',(req,res) => {
    loadauths()
    if(myusername.includes(req.body.username) && mypassword.includes(req.body.password) && mypassword.indexOf(req.body.password) == myusername.indexOf(req.body.username)){
        session=req.session;
        session.userid=req.body.username;
        res.redirect('/')
    }
    else{
        res.send("Incorrect password");
    }
})
app.get('/images', (req, res) => {
   res.sendFile(`${__dirname}/public/images/${req.query.q}`);
});
app.get('/signup', (req, res) => {
  res.sendFile('/views/signup.html', { root: __dirname })
});
app.post('/signup', (req, res) => {
  var n1 = fs.readFileSync(`${__dirname}/otp.json`, 'utf8');
  var n2 = JSON.parse(n1);
  var otps = n2["codes"]
  if (otps.includes(req.body.otp)) {
    var old = JSON.parse(fs.readFileSync(`${__dirname}/auths.json`))
    old.usr.push(req.body.username);
    old.lvls.push('Standard');
    old.psw.push(req.body.password);
    var newt = JSON.stringify(old)
    fs.writeFileSync(`${__dirname}/auths.json`, newt)
    var index = otps.indexOf(req.body.otp);
    if (index > -1) { // only splice array when item is found
      otps.splice(index, 1); // 2nd parameter means remove one item only
    }
    fs.writeFileSync(`${__dirname}/otp.json`, JSON.stringify(otps))
    res.status(200).redirect('/')
  } else {
    res.send('OTP does not exist')
  }
});
app.use(function(req, res, next){
  console.log(req.session)
  if ((req.session.userid == "") || (typeof req.session.userid === 'undefined') || (req.session.userid === null)) {
    res.status(401).redirect('/')
  } else next()
})
const { browse, browseView } = require("@otoniel19/file-explorer");
const { engine } = require("express-handlebars");
app.use('/files', bodyParser.json());
app.use('/files', bodyParser.urlencoded({ extended: false }));
app.set("views", browseView); // the views
app.set("view engine", "handlebars");
app.engine("handlebars", engine({ defaultLayout: "main" }));
//config
browse.config("./", "../", false, "/files");
//route
app.use("/files", browse.router); //the route has to be the same as the configuration
app.use(require('./mods/routes.js'))
app.get('/about', (req, res) => {
   res.sendFile('/public/sites/about.html', { root: __dirname });
});
app.get('/services', (req, res) => {
  if ((req.session.userid == "") || (typeof req.session.userid === 'undefined') || (req.session.userid === null)) {
    res.status(401).redirect('/')
  } else {
    res.write(fs.readFileSync(__dirname + '/public/sites/services.html'));
    var usris1 = req.session.userid;
    var usrlv2 = myusername.indexOf(usris1);
    var ulad = usrLvls[usrlv2];
     res.end(`<div style="position:fixed;bottom:0;left:0;background-color:aqua;font-family:Geneva,Tahoma,sans-serif;">User: ${req.session.userid}<br><p id="rank1">Rank: ${ulad}</p></div>`)
  }
});
app.get('/proxy', async (req, res, next) => {
    res.set('Content-type', 'text/html');
   if (typeof req.query.q !== 'undefined') {
       if (typeof req.query.go !== 'undefined') {
           var prox = req.query.q;
           var url = req.query.go;
           if (prox == "axios") {
               let func = await getdata(url);
               res.send(func);
           } else if (prox == "codetabs") {
               let func = await getdatac(url);
               res.send(func);
           } else {
               
           }
       } else {
           next()
       }
   } else {
       next()
   }
});
app.get('/download', function (req, res) {
  res.download(`${__dirname}/public/client.html`)
});
app.get('/crx', (req, res) => {
   res.sendFile('/public/integration/crx.html', {root: __dirname}) 
});
app.get('/notify', (req, res) => {
  res.sendFile('/public/sites/notify.html', {root: __dirname})
});
app.post('/newnotif', (req, res) => {
  let dat = req.body.text;
  let dat2 = req.body.psw;
  if (dat2 == "deeznutsass") {
    notif(dat)
    res.redirect('back');
  } else {
    res.end('Invalid Password')
  }
});
app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});
app.get("*", (req, res) => {
  res.status(404).sendFile('/public/errors/404.html', { root: __dirname });
});
app.listen(3000, () => {
    console.log("Alloy Server On")
});