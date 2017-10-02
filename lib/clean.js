const fse = require('fs-extra');

module.exports = function(){
    fse.removeSync('source');
    fse.removeSync('public');
    fse.removeSync('config.json');
    console.log('clean the dir successfully!');
}