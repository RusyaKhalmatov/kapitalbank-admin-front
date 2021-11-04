const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')

const app = express()

app.use(cors())

app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.use('^/psb/api', createProxyMiddleware({
   target: 'http://192.168.132.5:7072', 
   changeOrigin: true, 
   logLevel: 'debug',
   pathRewrite: {
    '^/psb': ''
   }
}) )

app.get(/.*/, function(req,res){
   res.sendFile(path.join(__dirname, '/dist/index.html'))
})

const port = process.env.PORT || 8882
app.listen(port)
console.log(`app is listening on port: ${port}`)
