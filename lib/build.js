const path = require('path');
const fse = require('fs-extra');
const rd = require('rd');
const fs = require('fs');
const moment = require('moment');
const utils = require('./utils');
const chunk =require("lodash/chunk");


// 渲染标签和分类页及其文章列表
function renderTagsCates(dir,outputDir,tpl,datas,config,categories){
    if(tpl === 'tags'){
        let htmlList = utils.renderFile(path.resolve(dir,'source','_layout',tpl+'.html'),{
            datas,
            config,
            categories
        });
    
        let fileList = path.resolve(outputDir,tpl,'index.html');
        fse.outputFileSync(fileList,htmlList);
    }
    for(let d in datas){
        let item = datas[d];
        
        let html = utils.renderFile(path.resolve(dir,'source','_layout','list.html'),{
            title: item.name,
            list: item.posts,
            config,
            categories,
            flag: tpl
        })
        let file = path.resolve(outputDir,tpl,item.name,'index.html');
        fse.outputFileSync(file,html);
    }
}

module.exports = function(dir,options){
    dir = dir || '.';
    let outputDir = path.resolve(dir,options.output || 'public');
    let sourceDir = path.resolve(dir,'source','_posts');
    let config = utils.loadConfig(dir);

    let list = [];
    let tags = {};
    let categories = {};
    
    // 渲染所有文章
    rd.eachFileFilterSync(sourceDir,(f,s)=>{
        let source = fs.readFileSync(f).toString();
        let post = utils.parseSourceContent(source);

        let layout = path.resolve(dir,'source','_layout',post.layout + '.html');
        let html = utils.renderFile(layout,{
            config,
            post
        });

        fse.outputFileSync(path.resolve(outputDir,post.dateInfo[0],post.dateInfo[1],post.dateInfo[2],utils.stripExtName(f.slice(sourceDir.length + 1)),'index.html'),html);

        post.timeStamp = new Date(post.date);
        
        let dateStr = post.dateInfo.join('/');

        post.url = `${config.basic.root}/${dateStr}/${utils.stripExtName(f.slice(sourceDir.length + 1))}/index.html`;
        list.push(post);

        let postTags = post.tags.slice(1,post.tags.length-1).split(',');
        postTags.forEach(tag=>{
            if(tag in tags){
                tags[tag].posts.push(post);
            } else {
                tags[tag] = {
                    name: tag,
                    posts: [post],
                    url: `${config.basic.root}/tags/${tag}/index.html`
                }
            }
        });

        let postCategories = post.categories;
        if(postCategories in categories){
            categories[postCategories].posts.push(post);
        } else {
            categories[postCategories] = {
                name: postCategories,
                posts: [post],
                url: `${config.basic.root}/categories/${postCategories}/index.html`
            }
        }
    });

    // 渲染文章列表
    list.sort((a,b)=>b.timeStamp - a.timeStamp);

    let pages = chunk(list,config.theme.per_page);

    let sumPages = pages.length;

    pages.forEach((page,i)=>{
        let htmlIndex = utils.renderFile(path.resolve(dir,'source','_layout','index.html'),{
            config,
            categories,
            posts: page,
            pageNumber: i,
            sumPages
        });
    
        if(i===0) { //首页
            fse.outputFileSync(path.resolve(outputDir,'index.html'),htmlIndex);
        }

        let fileIndex = path.resolve(outputDir,'page',i.toString(),'index.html');
        fse.outputFileSync(fileIndex,htmlIndex);
    })
    

    // 渲染tags页
    renderTagsCates(dir,outputDir,'tags',tags,config,categories);

    // 渲染categories页
    renderTagsCates(dir,outputDir,'categories',categories,config,categories);
    
    // 渲染 About
    utils.renderPage(dir,path.resolve(dir,'source','_about','about.md'),outputDir,'about',{
        config,
        categories
    })

    console.log('build successfully! Now type [yohe preview] to preview your blog ')
}