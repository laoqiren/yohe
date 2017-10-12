const path = require('path');
const fse = require('fs-extra');
const rd = require('rd');
const fs = require('fs');
const moment = require('moment');
const utils = require('./utils');
const chunk =require("lodash/chunk");

// 分页渲染
function splitPages(list,perPage,tpl,pageName,layout,outputDir,datas,isIndex=false){
    let pages = chunk(list,perPage);
    let sumPages = pages.length;
    let outputBase = isIndex?path.resolve(outputDir):path.resolve(outputDir,tpl,pageName);

    pages.forEach((page,i)=>{
        let templateVariables = Object.assign({},datas,{
            title: pageName,
            posts: page,
            pageNumber: i,
            sumPages,
            flag: tpl
        });

        let html = utils.renderFile(layout,templateVariables);
    
        if(i===0) { //首页
            fse.outputFileSync(path.resolve(outputBase,'index.html'),html);
        }

        let file = path.resolve(outputBase,'page',i.toString(),'index.html');
        fse.outputFileSync(file,html);
    });
}

// 渲染标签和分类页及其文章列表
function renderTagsCates(dir,outputDir,tpl,datas){
    let layoutDir = path.resolve(dir,'themes',datas.config.theme.themeName,'layout');
    let templateVariables = Object.assign({},datas);

    // 渲染标签云
    if(tpl === 'tags'){
        let htmlList = utils.renderFile(path.resolve(layoutDir,tpl+'.html'),templateVariables);
    
        let fileList = path.resolve(outputDir,tpl,'index.html');
        fse.outputFileSync(fileList,htmlList);
    }

    // 渲染各个标签和分类下的文章列表
    for(let d in datas[tpl]){
        let item = datas[tpl][d];
        let list = item.posts.sort((a,b)=>b.timeStamp - a.timeStamp);
        // 分页渲染
        splitPages(list,datas.config.theme.per_page,tpl,item.name,path.resolve(layoutDir,'list.html'),outputDir,datas);
    }
}

module.exports = function(dir,options){
    dir = dir || '.';
    let outputDir = path.resolve(dir,options.output || 'public');
    let sourceDir = path.resolve(dir,'source','_posts');
    let config = require(path.resolve(dir,'config.json'));
    let themeDir = path.resolve(dir,'themes',config.theme.themeName);
    let list = [];
    let tags = {};
    let categories = {};
    let archives = {};
    let archivesList = [];
    
    // 渲染文章
    rd.eachFileFilterSync(sourceDir,(f,s)=>{
        let source = fs.readFileSync(f).toString();
        let post = utils.parseSourceContent(source);

        post.timeStamp = post.dateMoment.toDate();
        
        let dateArr = post.dateArr;
        let dateStr = [dateArr[0],dateArr[1],dateArr[2]].join('/');

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

        // 解析 archives
        let archiveTag = dateArr[0] + '_' + dateArr[1]
        if(archiveTag in archives) {
            archives[archiveTag].posts.push(post);
        } else {
            archives[archiveTag] = {
                name: archiveTag,
                posts: [post]
                
            }
            archivesList.push({
                arrOfDate: dateArr,
                archiveTag,
                url: `${config.basic.root}/archives/${archiveTag}/index.html`
            });
        }
        
        // 渲染每一篇文章内容
        let layout = path.resolve(themeDir,'layout',post.layout + '.html');
        let html = utils.renderFile(layout,{
            config,
            post
        });

        fse.outputFileSync(path.resolve(outputDir,post.dateArr[0],post.dateArr[1],post.dateArr[2],utils.stripExtName(f.slice(sourceDir.length + 1)),'index.html'),html);
    });

    // archives排序
    archivesList = archivesList.sort((a,b)=>{
        let ma = moment(a.archiveTag,'YYYY_MM');
        let mb = moment(b.archiveTag,'YYYY_MM');
        if(ma.isAfter(mb)) {
            return -1;
        }
        return 1;
    });
    
    let basedTemplateVariables = {
        tags,
        categories,
        config,
        archives,
        archivesList
    }

    // 渲染文章列表
    list.sort((a,b)=>b.timeStamp - a.timeStamp);

    splitPages(list,config.theme.per_page,'index','index',path.resolve(themeDir,'layout','index.html'),outputDir,basedTemplateVariables,true);
    

    // 渲染tags页
    renderTagsCates(dir,outputDir,'tags',basedTemplateVariables);

    // 渲染categories页
    renderTagsCates(dir,outputDir,'categories',basedTemplateVariables);

    // 渲染archives页
    renderTagsCates(dir,outputDir,'archives',basedTemplateVariables);
    
    // 渲染 About
    utils.renderPage(dir,path.resolve(dir,'source','_about','about.md'),outputDir,'about',themeDir,basedTemplateVariables)

    //渲染用户自定义页
    let extraDir = path.resolve(dir,'source','_extra');
    rd.eachFileFilterSync(extraDir,(f,s)=>{
        let extraFile = f.slice(extraDir.length + 1);
        utils.renderPage(dir,f,outputDir,utils.stripExtName(extraFile),themeDir,basedTemplateVariables)
    })

    // 复制主题中的assets文件夹到public
    fse.copySync(path.resolve(themeDir,'assets'),path.resolve(outputDir,'assets'));

    console.log('build successfully! Now type [yohe server] to preview your blog ')
}