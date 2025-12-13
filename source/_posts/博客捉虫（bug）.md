---
title: 博客捉虫（bug）
date: 2025-12-13 14:53:56
tags: [我, 启蒙, hexo, github_pages]
categories: [技术探索]
---
**时间经过**: 2025.12.10-2025.12.12
***
一天我心血来潮，想给我博客在github库的页面，加一个README.md
谁成想，一捣鼓就出问题，而且越捣鼓问题越多（倒
<!-- more -->
我在hexo文件夹根目录新建了一个文件，重命名为`README.md`，写了几句话，照常`hexo d`，发现github库的页面并没有显示我新写的`readme`
为啥呢？
我在AI的帮助下，输入了`git status`。
原来是整个`hexo`文件夹已经`git init`初始化了一个本地仓库，但还没做过`git commit`。一直以来`hexo d`部署的都是hexo自动构建并推送的`public/网站文件`，而博客源代码并没有推送到仓库。
于是接下来我就在AI的帮助下，开始尝试`git commit`和`git push`

但这时候，问题又出现了
我的远程仓库是空的，没有分支，需要创建一个。
我尝试着把本地的`master`改名为`main`，接着尝试创建分支。
但这时候git又提示我，说远程已经有了`main`分支
又为啥呢？
AI说，可能是我一开始创建仓库时勾选了“使用README初始化仓库”，这会在远程main分支自动生成一个初始提交。

于是我尝试着强制推送`git push -u origin main --force`
然后AI说我博客源码与github pages自动构建服务混在一起了。
我便尝试着关闭对`main`的pages构建，把生成的静态网站文件推送到`gh-pages`分支，配置github pages源为`gh-pages`分支

另外这里我发现了那个小机器人`Dependabot`，有一个`pull request`，我又在AI的解释下选择了`merge`。这是我第一次合并别人的拉取请求。

现在基本上一切正常
但其实只是看起来正常

我希望能保持本地和github同步，于是又问AI该如何拉取
在`git status`的时候，我又发现，我在本地修改了一些配置，所以git会提示我提交修改还是丢弃。
弄了一堆东西后，我又尝试拉取。

就在我以为一切顺利的时候，我发现，我的博客404了
我打开github仓库的`action`，赫然发现一个红叉❌
我看不懂啊，我又把信息复制给AI。
原来是themes/next主题的问题。它是一个git子模块，但是配置不完整
与此同时，在我尝试`hexo d`的时候，又发现，版本也出问题了。我之前`npm install`更新依赖了，strip-ansi包升级了，导致和一些模块的冲突。
在我尝试降级后，发现存在嵌套依赖。我又尝试卸载了什么东西、安装了什么东西。依旧有问题，没有改变hexo内部的依赖版本。

当时是23:30。我原本打算写完readme后，23:30就美美睡觉。但现在则是看到希望之后，赫然出现了两个棘手的错误。一个我完全不曾了解过的子模块的错误，一个我再熟悉不过的版本错误。

于是我死心了。
我打算把一切推倒重来。github的库删了重建，写好的博客.md文件复制一份，然后从头再来。
另外把dependabot的版本更新关掉，留着它的安全更新。
顺便还能学学git的相关工作流程
（其实也能看出来，以上我出问题的主要原因是对git不熟悉

还有就是，我让deepseek帮我写了一个完整的流程
> **P.S.** 在这之前，你应该已经：
> - 知道命令行是什么
> - 知道markdown是什么
> - 知道文件的后缀是什么
> - 有一个github账号
> - 已配置好本地Git到GitHub的SSH或HTTPS认证
> - 了解Git的基本操作（如 `clone`, `add`, `commit`, `push`）

流程如下
# 博客部署流程
## **第一阶段：备份与准备**

1. **备份核心数据**（如果不是第一次写博客的话）：
    - **文章**：复制原博客 `source/_posts` 文件夹。
    - **资源**：复制 `source/images` 等自定义文件。
    - **个人备忘录**：复制你的 `.txt` 备忘录文件夹（如果有给自己看的备忘录的话）。
    - **配置**：记录原 `_config.yml` 中修改过的设置（标题、作者等）。
2. **清理云端（关键）**（如果想新建一个Github库的话）：
    - 登录GitHub，进入旧仓库 **Settings**，在底部 **“Danger Zone”** 彻底删除仓库。
    - 立即**新建一个空仓库**，创建时**不勾选** `Initialize this repository with...` 的任何选项。
    - 一个建议的仓库名是<你的用户名>.github.io

## **第二阶段：净化本地环境**

   **卸载并重新安装Node.js**：
    - 从系统卸载旧的Node.js（如果安装过的话）。
    - 安装 **nvm** (Node Version Manager)。
    - 使用 nvm 安装新的 Node.js (如 LTS 版本)。
    
    ```bash
    nvm install --lts
    # 或在 Windows 的 nvm 中执行：nvm install lts
    nvm use <你安装的版本号，例如 24.12.0>
    ```
    

## **第三阶段：本地重建项目**

1. **初始化新博客**：
    
    ```bash
    npx hexo init Hexo_Blog   # Hexo_Blog是文件夹的名字
    cd Hexo_Blog              # 可以换成自己喜欢的名字
    
    # 安装项目依赖
    npm install
    
    # 初始化 Git 仓库并进行基础配置
    git init
    git config user.email "你的GitHub邮箱"    #双引号内改为你的邮箱
    git config user.name "你的GitHub用户名"   #双引号内改为你的用户名
    ```
    
2. **恢复内容与配置**：
    - 将备份的 `source/_posts` 和图片资源，复制到新项目的 `source/` 对应目录。
    - 将你的**个人备忘录文件夹**，复制到新的博客根目录（与 `_config.yml` 同级）。
    - 安装原来的主题（例如 `next`）：
    
    ```bash
    npm install hexo-theme-next
    ```
    
    - 编辑新 `_config.yml`，填入备份的个性化设置（`title`, `author`，`theme: next` 等，`deploy` 部分先留空）。
    - （另外主题next的_config中，scheme也可以选一个自己喜欢的。可以在后期`第四阶段、3.本地预览与检查`中本地预览的时候顺便改一改。我使用的是Gemini）
3. **配置隐私**（如果有给自己看的备忘录的话）：
    - 在项目根目录创建或编辑 `.gitignore` 文件，确保包含以下核心规则：
    
    ```
    # --- 你的个人文件（请修改下方名称）---
    你的备忘录/        # 请确保这是你的文件夹名，例如“博客相关备忘录/”
    *.txt             # 可选：额外忽略所有txt文件（这个是AI给出的建议。我自己倒是没有这么做。）
    
    # --- Hexo生成文件与缓存 ---
    public/
    .deploy_git/
    db.json
    *.log
    
    # --- 项目依赖 ---
    node_modules/
    
    # --- 系统文件 ---
    .DS_Store
    Thumbs.db
    ```
    
    - **验证**：执行 `git status --ignored`，你的备忘录文件夹应显示为被忽略。
4. **配置Dependabot（仅安全更新）**：
    - 在项目根目录寻找或创建 `.github/dependabot.yml`，内容如下：
    
    ```yaml
    version: 2
    updates:
      - package-ecosystem: "npm"
        directory: "/"
        schedule:
          interval: "weekly"
        open-pull-requests-limit: 0
        groups:
          security-updates:
            applies-to: "security-updates"
            update-types: ["security"]
    ```
    

## **第四阶段：连接GitHub并部署**

1. **安装部署插件**：
    hexo-deployer-git 插件将自动创建并管理`gh-pages`分支。
    
    ```bash
    npm install hexo-deployer-git --save
    ```
    
2. **配置部署信息并连接远程仓库**(这里我用的是SSH)：
    - 在 `_config.yml` 末尾添加：
    
    ```yaml
    deploy:
      type: git
      repo: git@github.com:你的用户名/你的仓库名.git
      branch: gh-pages
    ```
    
    - 在终端执行，连接github远程仓库：
    
    ```bash
    git remote add origin git@github.com:你的用户名/你的仓库名.git
    ```
    
3. **本地预览与最终检查**：
    - 为了后续方便使用hexo命令，这里我安装了hexo-cli
    
    ```bash
    # 1. 首先确保你正在使用正确的 Node.js 版本
    node --version
    # 2. 全局安装 hexo 命令行工具
    npm install -g hexo-cli
    # 3. 验证安装
    hexo version
    ```
    
    - **生成并预览**：在部署前，务必在本地检查博客是否正常。
    
    ```bash
    hexo clean
    hexo g
    hexo s
    # 在浏览器中访问 http://localhost:4000 确认一切正常
    ```
    
    - 如果git bash默认的是master的话，可以考虑将其改名为main
    
    ```bash
    # 将当前本地的 master 分支重命名为 main
    git branch -M main
    ```
    
    - **提交源码**：
    
    ```bash
    git add .
    git commit -m "初始提交：全新开始，包含个人笔记忽略配置"  #这里的双引号中是一些备注。自行发挥即可
    git branch -M main
    git push -u origin main
    ```
    
    - **部署网站**：
    
    ```bash
    hexo clean && hexo g && hexo d
    ```
    
4. **启用GitHub Pages**
    - 前往仓库 **Settings -> Pages**。
    - 在 **Build and deployment -> Branch** 处，选择 `gh-pages` 分支，根目录 `/(root)`，保存。

> 完成：等待约2分钟，访问 https://你的用户名.github.io/仓库名 查看全新博客。如果有备忘录文件夹的话，它将仅存在于本地。
>

***
另外我还让deepseek帮我整理了一下工作流程
> P.S.
> 这里有一些相关的配置，比如说Front-matter中是否需要categories是需要手动配置的，图片的路径也是事先配置好的，等等。这些配置在`.config`中都有。遇到困难时，读者自查不难（
> 就是说，上网随便搜一搜就能搜到了，加油

流程如下
# 工作流程
## 第零步：同步与准备 (每次开始前的习惯)
在博客根目录 (例如`Hexo_Blog`) 打开git bash：

```bash
git pull origin main    # 拉取远程最新代码，保持同步
```

如果`git pull`后提示`package.json`有更新，请运行`npm install`。



## 第一步：创建新文章
```bash
hexo new "你的文章标题"    # 文件创建在：`source/_posts/你的文章标题.md`
```



## 第二步：编辑文章
编辑 Front-matter (文件头部的元数据)：
```yaml
---
title: xxxxx                           #冒号后面一定要有空格
date: xxxxxx
tags: [xxx， xxx, xxx]
categories: [xxx, xxx, xxx]
---
```



## 第三步：本地预览与调试
```bash
hexo clean && hexo g && hexo s
```
访问`http://localhost:4000`，仔细检查文章格式、图片、链接等是否正确。



## 第四步：部署网站 (发布到线上)
```
hexo clean && hexo g && hexo d
```
此命令将生成的静态网站推送到 GitHub 仓库的`gh-pages`分支，GitHub Pages 会自动更新你的公开网站。



## 第五步：备份源码 (重要)
将你的文章源文件备份到 GitHub 的`main`分支。
```
git add .
git commit -m "发布新文章：xxxxx"      # 这里的双引号内，依旧是备注
git push origin main
```


## PS.

1.图片?

(确保图片已放在文章同名资源夹或 source/images/):

(1)Markdown 语法：
```markdown
[图片描述](图片文件名.jpg)
```

(2)HTML 语法 (支持灯箱等高级效果)：
```html
<a href="图片名.jpg" data-fancybox="gallery" data-caption="图片描述">
  <img src="图片名.jpg" width="50%" alt="图片描述">
</a>
```

2.链接?
```markdown
[链接描述](https://example.com)
```