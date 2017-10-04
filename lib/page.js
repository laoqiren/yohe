const fse = require('fs-extra');
const path = require('path');
const moment = require('moment');

module.exports = function(name){
    const data = ['---',
    `title: ${name}`,
    'date: ' + moment().format('YYYY-MM-DD'),
    'layout: about',
    'comment: true',
    '---',
    ''].join('\n');

    let file = path.resolve('source','_extra',`${name}.md`);
    fse.outputFileSync(file,data);

    console.log(`create new page ${name} sucessfully! Go to edit file /source/_extra/${name}.md`)
}