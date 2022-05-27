const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');

// Create express server
const server = express();
const port = process.env.PORT || 8882;

// Add using static files from local dir
server.use('/', express.static(path.join(__dirname, '../dist/')));

// Send index.html for GET to any path
server.get(/.*/, function(request, response){
  response.sendFile(path.join(__dirname, '../dist/index.html'))
});

// Add  proxy options for '/proxyReport/' path
const reportApiUrl = 'http://192.168.132.5:7072';
const reportProxyOptions = {
  target: reportApiUrl,
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: { '^/proxyReport': ''  },
};
server.use('/proxyReport', createProxyMiddleware(reportProxyOptions));

server.listen(port);
console.log(`app is listening on port: ${port}`);


