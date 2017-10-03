# yohe
[![npm](https://img.shields.io/npm/dm/yohe.svg?style=flat-square)](https://www.npmjs.com/package/yohe)
[![npm](https://img.shields.io/npm/v/yohe.svg?style=flat-square)](https://github.com/laoqiren/yohe)

一个静态博客生成器，采用[Node.js](https://nodejs.org)开发。

线上demo: [http://luoxia.me/yohe_site/](http://luoxia.me/yohe_site/)

[English doc](https://github.com/laoqiren/yohe/blob/master/en.md)

## 功能

* 简单易用，快速
* 本地预览效果
* 可定制化信息和主题
* 支持标签，分类，archives,分页等
* 评论，统计(开发中)等功能
* 首页可过滤分类文章

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
$ yohe init blog
$ cd blog
```

**创建新文章**
```
$ yohe new cluster
```

**渲染博客文件**
```
$ yohe build
```

**本地预览**
```
$ yohe server
```

## 配置文件
运行`yohe init`后会生成`config.json`,配置说明：
```json
{
    "basic": {
        "title": "My Blog", // 博客标题
        "author": "laoqiren", // 博客作者
        "description": "爱技术，爱生活", // 个性签名
        "root": "" // 博客根目录，当博客网站位于子路径如"http://luoxia.me/yohe_site"时，配置为"/yohe_site"
    },
    "theme": {
        "highlightTheme": "railscasts", // 代码高亮主题，所有可用主题列表参照"https://github.com/isagalaev/highlight.js/tree/master/src/styles"
        "per_page": 6,//每页展示的文章数
        "filter": ["life","随笔"]  // 首页过滤分类文章，比如生活随笔文章不显示在首页列表
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

更丰富的配置正在开发中

## 如何发布
`Yohe`最终渲染结果在`public`目录，可采用多种方式起一个静态文件服务器，将`public`目录发布。

## 如何修改主题
目前`Yohe`的主题功能与`Yohe`耦合，需要修改主题可以对`source/_layout`和`public/assets/`进行开发，重新`yohe build`即可。未来的版本将解耦主题功能。

## 其他技巧
* 关于页面为`source/_about/about.md`
* 指定首页过滤分类文章，可以很方便地实现`blog in blog`

## TODOs


* 主题开发
* archives
* 评论，统计等功能
* 更丰富的配置