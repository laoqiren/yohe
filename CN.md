# yohe
[![npm](https://img.shields.io/npm/dm/yohe.svg?style=flat-square)](https://www.npmjs.com/package/yohe)
[![npm](https://img.shields.io/npm/v/yohe.svg?style=flat-square)](https://github.com/laoqiren/yohe)
[![npm](https://img.shields.io/npm/l/yohe.svg?style=flat-square)](https://github.com/laoqiren/yohe)

一个静态博客生成器，采用[Node.js](https://nodejs.org)开发。Yohe = 哟呵，一个会让你发出”哟呵，不错哦“感叹的静态博客生成器。

线上demo: [http://luoxia.me/yohe_site/](http://luoxia.me/yohe_site/)

[English doc](https://github.com/laoqiren/yohe/blob/master/README.md)

## 功能

* 简单易用，快速
* 本地预览效果
* 可定制化信息和主题
* 新建自定义页面，可定制化导航菜单
* 支持标签，分类，archives,分页等基础设施
* 支持通过Github评论(gitment支持)
* 首页可过滤指定分类文章

## 安装
```
$ npm install yohe -g
```

## 快速开始

**获取帮助**
```
$ yohe --help
```

**初始化博客**
```
$ yohe init myblog
$ cd myblog
```
该命令会初始化博客目录，包括初始化主题，文章，自定义页面等目录，以及加载默认配置文件

**创建新文章**
```
$ yohe new <postName>
```
该命令在`source/_posts/`下新建`<postName>.md`文件，在这里写作

**渲染博客文件**
```
$ yohe build
```
该命令会渲染博客到`public`目录

**本地预览**
```
$ yohe server
```
该命令会在本地起一个静态文件服务器，端口，子路径等信息可通过`config.json`配置

**新增自定义页面**
```
$ yohe page <pageName>
```
该命令会在`source/_extra`下生成`<pageName>.md`文件,默认布局为`about`页面布局

## 配置文件
运行`yohe init`后会生成`config.json`,配置说明：
```js
{
    "basic": {
        "title": "My Blog", // 博客标题
        "author": "laoqiren", // 博客作者
        "description": "爱技术，爱生活", // 个性签名
        "root": "" // 博客根目录，当博客网站位于子路径如"http://luoxia.me/yohe_site"时，配置为"/yohe_site"
    },
    "theme": {
        "themeName": "default",  // 主题名字
        "highlightTheme": "railscasts", // 代码高亮主题，所有可用主题列表参照"https://github.com/isagalaev/highlight.js/tree/master/src/styles"
        "per_page": 6,//每页展示的文章数
        "filter": ["life","随笔"],  // 首页过滤分类文章，比如生活随笔文章不显示在首页列表
        "navPages": [     // 自定义导航菜单的页面标题和链接
            {
                "title": "标签",
                "url": "/tags"
            },
            {
                "title": "关于",
                "url": "/about"
            },
            {
                "title": "生活随笔",
                "url": "/categories/life/"
            }
        ],
        "reward": {  // 打赏功能配置
            "enabled": true,
            "imgName": "alipay.jpg",  // 二维码图片名称
            "words": "打赏"   // 打赏说明
        }
    },
    "server": {
        "port": 3000 //本地预览服务器端口
    },
    "gitment": {   // gitment评论功能相关配置，gitment使用教程参照”https://github.com/imsun/gitment“
        "owner": "",
        "repo": "",
        "oauth": {
            "client_id": "",
            "client_secret": ""
        }
    }
}
```
更丰富的配置正在开发中。

## 文章格式规范
参照下面的例子:
```
---
title: Cluster模块
date: 2016-11-27
tags: [负载均衡,集群,多进程]
layout: post
comment: true
categories: Nodejs
---
```
其中`layout`默认为`post`,`comment`默认为`true`

## 如何发布
`Yohe`最终渲染结果在`public`目录，可采用多种方式起一个静态文件服务器，将`public`目录发布。

## 如何开发主题

### layouts:
```
├── about.html    // 关于页面布局（必须）
├── index.html    // 首页布局（必须）
├── list.html     // 特定分类和标签文章列表布局（必须）
├── post.html     // 文章详情页布局（可更名）
└── tags.html     // 标签云布局（必须）
└── ...           // 自定义的布局
```
### 暴露的模板变量:
**基本变量:**

变量名  | 内容
------------- | -------------
config | 配置对象，参考`config.json`
tags | 标签数组，对每个标签项:`tag.name`,`tag.posts`(Array),`tag.url`
categories  | 分类数组，对每个分类项目: `category.name`, `category.posts`,`category.url`
archives | 归档数组，对每个归档项: `archive.name`,`archive.arrOfDate`,`archive.posts`,`archive.url`

**特定变量:**

页面 | 特定变量
------------- | -------------
post.html  | `post`: `post.title`, `post.date`, `post.categories`, `post.tags`,  `post.content`
list.html | `title`(具体分类名，标签名，归档日期),`posts`(过滤后的文章数组),`pageNumber`(分页数),`sumpages`(总页数), `flag`("tags" or "categories" or archives"其中一个)
### assets:
静态资源文件放在`assets`目录下


## 其他技巧
* 要设置更改logo,替换`assets/images/logo.png`为你自己的logo图片，但名称依旧为`logo.png`
* 关于页面为`source/_about/about.md`
* 指定首页过滤分类文章，可以很方便地实现`blog in blog`
* 文档名和分类名中的空格用`-`代替

## TODOs


* 默认主题完善
* archives
* 统计等功能
* 更丰富的配置

## LICENSE

MIT.