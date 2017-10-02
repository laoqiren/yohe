const fse = require('fs-extra');
const path = require('path');
const moment = require('moment');

module.exports = function(dir){
    dir = dir || '.';

    let tplDir = path.resolve(__dirname,'..','tpl');
    fse.copySync(tplDir,path.resolve(dir));

    newPost(dir);
}


function newPost(dir){
    const data = ['---',
    'title: hello World',
    'date: ' + moment().format('YYYY-MM-DD'),
    'tags: ' + '[blog,helloworld]',
    'categories: ' + 'welcome',
    '---',
    ''].join('\n');

    let file = path.resolve(dir,'source','_posts','hello.md');
    fse.outputFileSync(file,data);

    console.log("Now, initial blog has been created, you can create a new post by typing 'yohe new <postName>' ")
}