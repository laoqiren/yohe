const path = require('path');
const fse = require('fs-extra');
const rd = require('rd');
const fs = require('fs');
const moment = require('moment');
const utils = require('./utils');
const chunk =require("lodash/chunk");


// 渲染标签和分类页及其文章列表
function renderTagsCates(dir,outputDir,tpl,datas,config,categories){
    let layoutDir = path.resolve(dir,'themes',config.theme.themeName,'layout');
    if(tpl === 'tags'){
        let htmlList = utils.renderFile(path.resolve(layoutDir,tpl+'.html'),{
            datas,
            config,
            categories
        });
    
        let fileList = path.resolve(outputDir,tpl,'index.html');
        fse.outputFileSync(fileList,htmlList);
    }
    for(let d in datas){
        let item = datas[d];
        
        let html = utils.renderFile(path.resolve(layoutDir,'list.html'),{
            title: item.name,
            list: item.posts.sort((a,b)=>b.timeStamp - a.timeStamp),
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
    let themeDir = path.resolve(dir,'themes',config.theme.themeName);

    let list = [];
    let tags = {};
    let categories = {};
    
    // 渲染文章
    rd.eachFileFilterSync(sourceDir,(f,s)=>{
        let source = fs.readFileSync(f).toString();
        let post = utils.parseSourceContent(source);

        post.timeStamp = new Date(post.date);
        
        let dateStr = post.dateInfo.join('/');

        post.url = `${config.basic.root}/${dateStr}/${utils.stripExtName(f.slice(sourceDir.length + 1))}/index.html`;

        // 过滤指定分类文章
        if(config.theme.filter.indexOf(post.categories) === -1){
            list.push(post);
        }

        // 解析文章标签
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

        // 解析文章分类
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

        // 渲染每一篇文章内容
        let layout = path.resolve(themeDir,'layout',post.layout + '.html');
        let html = utils.renderFile(layout,{
            config,
            post,
            tags,
            categories
        });

        fse.outputFileSync(path.resolve(outputDir,post.dateInfo[0],post.dateInfo[1],post.dateInfo[2],utils.stripExtName(f.slice(sourceDir.length + 1)),'index.html'),html);
    });

    // 渲染文章列表
    list.sort((a,b)=>b.timeStamp - a.timeStamp);

    let pages = chunk(list,config.theme.per_page);

    let sumPages = pages.length;

    pages.forEach((page,i)=>{
        let htmlIndex = utils.renderFile(path.resolve(themeDir,'layout','index.html'),{
            config,
            categories,
            tags,
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
    utils.renderPage(dir,path.resolve(dir,'source','_about','about.md'),outputDir,'about',themeDir,{
        config,
        categories
    })

    //渲染用户自定义页
    let extraDir = path.resolve(dir,'source','_extra');
    rd.eachFileFilterSync(extraDir,(f,s)=>{
        let extraFile = f.slice(extraDir.length + 1);
        utils.renderPage(dir,f,outputDir,utils.stripExtName(extraFile),themeDir,{
            config,
            categories
        })
    })

    // 复制主题中的assets文件夹到public
    fse.copySync(path.resolve(themeDir,'assets'),path.resolve(outputDir,'assets'));

    console.log('build successfully! Now type [yohe server] to preview your blog ')
}