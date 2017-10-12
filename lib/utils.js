const fs = require('fs');
const path = require('path');
const hljs = require('highlight.js');
const rd = require('rd');
const fse = require('fs-extra');
const chunk =require("lodash/chunk");
const md = require('markdown-it')({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class=${lang}><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
          } catch (__) {}
        }
    
        return `<pre class=${lang}><code>${md.utils.escapeHtml(str)}</code></pre>`;
      }
});

const swig = require('swig');
swig.setDefaults({cache: false});

// 解析markdown内容
function parseSourceContent(data){
    var split = '---\n';
    var i = data.indexOf(split);
    var info = {};
    if (i !== -1) {
      var j = data.indexOf(split, i + split.length);
      if (j !== -1) {
        var str = data.slice(i + split.length, j).trim();
        data = data.slice(j + split.length);
        str.split('\n').forEach(function (line) {
          var i = line.indexOf(':');
          if (i !== -1) {
            var name = line.slice(0, i).trim();
            var value = line.slice(i + 1).trim();
            info[name] = value;
          }
        });
      }
    }
    info.source = data;
    info.layout = info.layout || 'post';
    info.content = md.render(info.source || '');
    
    // 处理 <!--more-->
    let moreFlag = data.indexOf('<!--more-->');
    info.headContent = moreFlag !== -1?md.render(data.slice(0,moreFlag)):info.content;

    info.dateInfo = info.date.split('-');
    return info;
}

// 渲染swig模板内容到html
function renderFile(file,data){
    return swig.render(fs.readFileSync(file).toString(),{
        filename: file,
        autoescape: false,
        locals: data
    })
}

// 加载配置文件
function loadConfig(dir){
    let content = fs.readFileSync(path.resolve(dir,'config.json')).toString();
    let data = JSON.parse(content);
    return data;
}

// 去除扩展名
function stripExtName(name){
    let i = 0 - path.extname(name).length;
    if(i === 0) i = name.length;
    return name.slice(0,i);
}

// 渲染页面
function renderPage(dir,sourceDir,outputDir,pageName,themeDir,extraDatas){
     let source = fs.readFileSync(sourceDir).toString();
     let content = parseSourceContent(source);
     let layout = path.resolve(themeDir,'layout',content.layout + '.html');
     let html = renderFile(layout,{
         content,
         config: extraDatas.config,
         categories: extraDatas.categories
     });
     fse.outputFileSync(path.resolve(outputDir,pageName,'index.html'),html);
}



exports.parseSourceContent = parseSourceContent;

exports.renderFile = renderFile;

exports.loadConfig = loadConfig;

exports.stripExtName = stripExtName;

exports.renderPage = renderPage;