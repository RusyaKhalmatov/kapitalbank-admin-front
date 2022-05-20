const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');

// Create express server
const app = express();
const port = process.env.PORT || 8882;

// Add using static files from local dir
app.use('/', express.static(path.join(__dirname, './dist/')));

// Send index.html for GET to any path
app.get(/.*/, function(request, response){
  response.sendFile(path.join(__dirname, './dist/index.html'))
});

// Add  proxy options for '/proxyReport/' path
const reportApiUrl = 'http://192.168.132.5:7072';
const reportProxyOptions = {
  target: reportApiUrl,
  changeOrigin: true,
  logLevel: 'debug',
  pathRewrite: { '^/psb': '/'  },
};
app.use('/psb', createProxyMiddleware(reportProxyOptions));

app.listen(port);
console.log(`app is listening on port: ${port}`);


