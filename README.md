# yohe
[![npm](https://img.shields.io/npm/dm/yohe.svg?style=flat-square)](https://www.npmjs.com/package/yohe)
[![npm](https://img.shields.io/npm/v/yohe.svg?style=flat-square)](https://github.com/laoqiren/yohe)

a static blog generator, powered by [Node.js](https://nodejs.org). Yohe means that you will say "Wow, so cute" after you tried it.

online demo: [http://luoxia.me/yohe_site/](http://luoxia.me/yohe_site/)

[中文文档](https://github.com/laoqiren/yohe/blob/master/CN.md)

## Features

* simple and fast static blog generator.
* local server to preview the blog.
* Customizable information and themes.
* create new custom pages, CuSTomizable navigation menu.
* tags,categories,pages,archives,etc.
* github comment(powered by gitment).
* filter specially categories to not be shown on the posts list

## Installation
```
$ npm install yohe -g
```

## Quick Start

**Get help**
```
$ yohe --help
```

**Setup your blog**
```
$ yohe init myblog
$ cd myblog
```
the command will init the blog dir, include initial theme,posts,custom pages dir,and initial config fle.

**Create a new post**
```
$ yohe new <postName>
```
the command will create `<postName>.md` file in `source/_posts`,edit it to start writting.

**Generate static files**
```
$ yohe build
```
the command will generate your blog to dir `public`

**Preview the blog**
```
$ yohe server
```
the command will start a local static server to serve the `public` files. The port and subdir information can be edited at `config.json`.

**new custom pages**
```
$ yohe page <pageName>
```
the command will create `<pageName>.md` file in `source/_extra` dir, the initial layout of the new page is `about`.

## config.json
```js
{
    "basic": {
        "title": "My Blog", // the title of your blog
        "author": "laoqiren", // the author of the blog
        "description": "爱技术，爱生活",
        "root": "" // the root of the site ，e.g. set root to be "/yohe_site" if your blog is at "http://luoxia.me/yohe_site"
    },
    "theme": {
        "themeName": "default",  // name of the theme.
        "highlightTheme": "railscasts", // code highlight syle, all available styles refer to "https://github.com/isagalaev/highlight.js/tree/master/src/styles"
        "per_page": 6,// number of posts per page
        "filter": ["life","随笔"],  // filter some special categories to not be shown
        "navPages": [     // custom pages
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
        "reward": {  // config about reward
            "enabled": true,
            "imgName": "alipay.jpg",  // reward QR Code images e.g. alipay.jpg
            "words": "打赏"   // custom reward words
        }
    },
    "server": {
        "port": 3000 // the port of local static server
    },
    "gitment": {   // gitment config, refer to ”https://github.com/imsun/gitment“
        "owner": "",
        "repo": "",
        "oauth": {
            "client_id": "",
            "client_secret": ""
        }
    }
}
```

## post pattern
follow the example below:
```
---
title: Cluster
date: 2016-11-27
tags: [Cluster,process]
layout: post
comment: true
categories: Nodejs
---
```
**tips:** initial `layout` is `post`, and initial `comment` is `true`.

## How to publish
`Yohe` will generate your blog to dir `public`, you can use different ways to serve `public` dir.

## How to develop themes

**layouts:**
```
├── about.html    // layout of about page(required)
├── index.html    // layout of index page(required)
├── list.html     // posts list page of specially categories&tags(required)
├── post.html     // layout of post's detail page(Can rename)
└── tags.html     // layout of tags cloud(required)
└── ...           // custom layouts
```

**assets:**
the static resources like `.js`,`.css` should be in dir `assets`

## Other tips
* To setup your own logo, replace `assets/images/logo.png` with your own(name should also be `logo.png`)
* About page is `source/_about/about.md`
* To implement `blog in blog`, filter some special categories
* To avoid errors, replace space with `-` of post name and category name.
## TODOs

* beautify default theme
* archives,analysis,etc
* complex config

## LICENSE

MIT.
