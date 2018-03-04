var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var connect = require('connect');
var session = require('express-session');
var logit = require('./logit-module.js');

// respond to all requests
// order of app.use matters!

// connect and express-session together using two app.use calls
var app = connect();
app.use(session(
  {
    secret: 'cscie31',
    resave: 'true',
    saveUninitialized: 'true'
  }
));

// a custom module as middleware!
app.use(logit);
// call logit only if the path starts with img - useful way to conditionally call modules!
//app.use('/img',logit);

app.use(function (req, res) {
  
  // get the filepath part of the url requested
  const { pathname } = url.parse(req.url);

  // get the actual system filepath for this
  var filepath = path.join(process.cwd(), pathname);

  // extract the filename extension
  var extname = String(path.extname(filepath)).toLowerCase();

  // see if this file exists
  fs.stat(filepath, (err, stat) => {
    if (err) {
      // handle case of file not found
      if (err.code == 'ENOENT') {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found\n");
        return;
      }
      // if an error other than EOENT, handle that here
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Error\n");
      return;
    }
    if (stat.isDirectory()) {
      res.writeHead(200, { "Content-Type": "text/plain" });
      var dir = "";

      fs.readdir(filepath, function (err, items) {
        items.forEach(item => {
          dir += `${item}\n`;
        });
        res.write(dir);
        res.end();
      });
      return;
    }
    // try to read the file from disk
    fs.readFile(filepath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Error\n");
        return;
      }
      // send the data to the browser via the response
      res.writeHead(200, { "Content-Type":'text/html' })
      res.write(data);
      res.end();
    });
  });

  if (req.session.views) {
    req.session.views++;
  }
  else {
    req.session.views = 1;
  }
  console.log("Session ID is %s, number of visits in this session: %s", req.session.id, req.session.views);
});

//create node.js http server and listen on port
http.createServer(app).listen(8080);