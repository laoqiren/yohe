const fse = require('fs-extra');
const path = require('path');
const moment = require('moment');

module.exports = function(name){
    const data = ['---',
    `title: ${name}`,
    'date: ' + moment().format('YYYY-MM-DD'),
    'layout: post',
    'comment: true',
    'tags: ' + '[blog]',
    'categories: ' + 'code',
    '---',
    ''].join('\n');

    let file = path.resolve('source','_posts',`${name}.md`);
    fse.outputFileSync(file,data);

    console.log(`create new post ${name} sucessfully!`)
}