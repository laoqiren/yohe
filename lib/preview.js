const express = require('express');
const staticServe = require('serve-static');
const path = require('path');
const utils = require('./utils');

module.exports = function(dir){
    dir = dir || '.';

    let config = utils.loadConfig(dir);

    const app = express();
    
    
    app.use('/',staticServe(path.resolve(dir,'public')));
    
    app.listen(config.server.port,()=>{
        console.log(`the local blog server has been listened at port ${config.server.port}`)
    })
}