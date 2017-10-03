# yohe
[![npm](https://img.shields.io/npm/dm/yohe.svg?style=flat-square)](https://www.npmjs.com/package/yohe)
[![npm](https://img.shields.io/npm/v/yohe.svg?style=flat-square)](https://github.com/laoqiren/yohe)

just a static blog generator, powered by [Node.js](https://nodejs.org)

online demo: [http://luoxia.me/yohe_site/](http://luoxia.me/yohe_site/)

[中文文档](https://github.com/laoqiren/yohe/blob/master/README.md)

## Features

* simple and fast static blog generator.
* local server to preview the blog.
* Customizable information and theme.
* suppoert tags,categories,pages,archives,custom pages,etc.
* discuss,analysis,etc.
## Installation
```
$ npm install yohe -g
```

## Quick Start

### Get help
```
$ yohe --help
```

### Setup your blog
```
$ yohe init blog
$ cd blog
```

## Create a new post
```
$ yohe new cluster
```

## Generate static files
```
$ yohe build
```

## Preview the blog
```
$ yohe server
```

## TODOs

* themes development
* archives
* discuss,analysis,etc
* complex config