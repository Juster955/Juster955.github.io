---
title: CI/CD+图片加载+评论系统
date: 2026-07-13 20:09:27
tags: [博客, 技术, 好玩, Hexo, GitHub-Pages]
categories: [技术探索]
description: 对这个博客站点的一点更新迭代
---
**时间经过**：2026.07.13-2026.07.14
***

## 1.CI/CD
之前[看了The Missing Semester](https://juster955.github.io/2026/07/12/The-Missing-Semester/)，突然想要动手试试CI/CD，但是又没有值得捣鼓的项目啊
哦，我有一个博客啊。那为什么不试试呢

一开始我问了一下AI，AI给出了回答
我突然想到，要不我也试试不用AI，只看看官方文档
可是我看了一下GitHub的Actions和Pages文档，好长啊……看了两篇，又没太明白……
于是我又跑回AI那里去了
我把文档和我的记录发给它
等待着它贴心地把一切整理好发给我

唉

我现在的情况是：
- 本地只有`main`分支
- 远程GitHub仓库有`main`和`gh-pages`分支
- `GitHub Pages`部署的源`source`是`Deploy from a branch`选择`gh-pages`分支
- 每次手动`hexo d`将静态文件推送到远程的gh-pages分支

而我接下来的目标是
- 本地保持`main`分支（不变，与之前一样）
- 远程GitHub仓库有`main`和`gh-pages`分支（不变，与之前一样）
- `GitHub Pages`部署的源`source`是`Deploy from a branch`选择`gh-pages`分支（不变，与之前一样）
- 每次本地main推送到远程main后，触发GitHub Actions自动将静态文件推送到远程的gh-pages

> P.S.
> 另外我有一个Dependabot机器人负责检查并自动合并安全性更新，这个与本次CI/CD相关博客更新迭代无关

> P.P.S.
> 我这个方案是改动最小的方案，即GitHub Actions只负责生成静态文件并推送到gh-pages分支
> 而GitHub官方更推荐一些的方案是：`GitHub Pages`部署的源`source`选择`GitHub Actions`，然后由GitHub Actions直接部署，不经过分支

如果`我说明白了 && 你听明白了`
那么接下来似乎就该是我展示我的做法的环节了

创建`.github/workflows/deploy.yml`
```yaml
name: Deploy Hexo Blog

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source code
        uses: actions/checkout@v4
        with:
          submodules: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Generate static files
        run: |
          npx hexo clean
          npx hexo generate

      - name: Deploy to gh-pages branch
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          publish_branch: gh-pages
```

没了
嗯对没了
好简单哦


## 2.图片加载

问题：我发现图片加载真的很慢。一方面是文章里的插图，一方面是Hexo主题`Butterfly`的首页图和顶部图。之前我都是把图片先在线上网站压缩到100KB左右，确实好一些了。但其实效果不是很理想。所以想要再优化一下，让图片加载不要那么慢。

解决：
- 简单上网搜了一圈，发现最常见的解决方法是CDN，使用JsDelivr
- 问AI，

## 3.评论系统
没啥原因，就是觉得有了评论会好玩一些哈哈
不过另外也在网上看到了别人说的一句话，似乎也很有道理
> 有了评论系统，博客就不再是单向输出的网站，而变成了一个社区

问了一下AI，说是推荐Giscus
上网查了一下，似乎也有很多人用的是Giscus
我还找到了[一篇参考教程](https://jachinzhang1.github.io/2025/02/04/hexo%E5%8D%9A%E5%AE%A2%E6%B7%BB%E5%8A%A0%E8%AF%84%E8%AE%BA%E7%B3%BB%E7%BB%9F/)
以及AI还查到了[这个](https://blog.csdn.net/m0_74795952/article/details/146429135)和[这个](https://aylmer-wang.github.io/2025/04/16/add-comment/)

wow，GitHub仓库开启Discussion还会飘彩带啊，可爱捏【图片】

具体做法：
### 1）准备工作
- 选择一个放GitHub Discussions的仓库，可以是博客所在仓库，也可以是单开一个仓库。要求公开且打开了Discussions功能
- 那如何打开该仓库的Discussions功能呢：进入该仓库`Settings`，在`General`的`Features`区域勾选`Discussions`并点击`Set up discussions`发布第一篇Discussion，内容无所谓，有就行。
- 安装Giscus App：访问[https://github.com/apps/giscus](https://github.com/apps/giscus)点击`Install`，选择`Only select repositories`，选择刚刚作为放GitHub Discussions的仓库
### 2）生成配置代码
- 进入[Giscus官网](https://giscus.app/zh-CN)，填入刚刚用来放GitHub Discussinos的仓库
- 进行个性化设置，比如“页面-discussion映射关系”（我选择的是`title`），“Discussion分类”(我选择的是`Announcements`)，“特性”（我选了“启用主帖子上的反应”、“将评论框放在评论上方”和“懒加载评论”）
- 注意到最后有一段自动生成的`<script>`标签，复制下来，一会要用到
### 3）博客的配置
- 打开博客的配置文件（我的是`_config.butterfly.yml`）
- 进行配置（我的配置内容如下）
```yaml
# 评论系统
comments:
  use: giscus
  text: true
  lazyload: true

# Giscus 配置
# https://giscus.app/zh-CN
giscus:
  repo: Juster955/Juster955.github.io
  repo_id: <写你从Giscus官网复制过来的id> 
  category: Announcements
  category_id: <写你从Giscus官网复制过来的id>
  mapping: title 
  theme:
    light: light
    dark: dark

```