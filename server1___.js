const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const serveStatic = require('serve-static');
const path = require('path');
const app = express();

// proxy middleware options
const proxy_options = {
  target: 'http://192.168.132.5:7072', // target host
  changeOrigin: true, // needed for virtual hosted sites
  pathRewrite: {
    '^/psb': '', // rewrite path
  }
};

app.use('/api', serveStatic(path.join(__dirname, '/dist') ) );
app.use('/psb/api', createProxyMiddleware('/psb/api',proxy_options) );


app.get(/.*/, function(req,res){
   res.sendFile(path.join(__dirname, '/dist/index.html'))
});

const port = process.env.PORT || 8882;
app.listen(port);

console.log(`new app is listening on port: ${port}`);
