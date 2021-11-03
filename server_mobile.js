const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const app = express()
app.use('/', serveStatic(path.join(__dirname, '/dist_mobile')))


app.get(/.*/, function(req,res){
   res.sendFile(path.join(__dirname, '/dist_mobile/index.html'))
})

const port = process.env.PORT || 8892
app.listen(port)
console.log(`app is listening on port: ${port}`)
