const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware');


const app = express()

app.use('/', serveStatic(path.join(__dirname, '/dist')))
app.use('/api', createProxyMiddleware('/api', {
   target: 'http://192.168.132.5:7072', // target host
   changeOrigin: true, // needed for virtual hosted sites
   logLevel: 'debug',
   // secure: false,
   onProxyRes: proxyRes => {
      console.log("onProxyRes event", proxyRes);
      // var key = 'www-authenticate';
      // proxyRes.headers[key] = proxyRes.headers[key] && proxyRes.headers[key].split(',');
   },
   pathRewrite: {
    '^/psb': '', // rewrite path
   }
}) )

app.get(/.*/, function(req,res){
   res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 8882
app.listen(port)
console.log(`app is listening on port: ${port}`)
