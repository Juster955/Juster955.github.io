---
title: dotfile配置
date: 2026-10-30 22:41:02
tags: [技术]
categories: [技术探索]
description: 我的第一篇教程向文章
---
**时间经过**: 2026.10
***

上学期的学期末，我在[The Missing Semester](https://juster955.github.io/2026/07/12/The-Missing-Semester/)看见了有关dotfile的事情，知道了大概是什么

这两天偶然间在QQ群看见了热心群友发的阿里云的大学生300元优惠券（感谢群友分享），于是我就想试试捣鼓一下云服务器。在这个过程中，我就想起了dotfile这件事

那为什么不写篇博客呢？

（这好像是我第一次写教程向的文章）

***

# dotfile是什么
dotfile就是一系列以`.`开头的文件，一般是配置文件，比如`.zshrc` `.vimrc`之类的。

# 为什么要做dotfile的配置
例如新建一个自己的个人云服务器的时候，我们发现换了一个崭新的环境，我们便有可能会苦恼于如何开荒，直至变成我们熟悉的开发环境。

对于我自己来说，是在捣鼓云服务器的时候，发现默认的shell不是自己熟悉的`zsh`以及`oh my zsh`了，觉得很不习惯，于是便想起了dotfile这件事。

如果做了dotfile的相关配置，我们就可以很方便的将一个新环境变成我们习惯的样子。

# 怎么做dotfile的配置
大体来说就是，在自己主力设备下新建`dotfiles`文件夹，把自己关心的一些配置文件移动到这里，再软链接回原位置。然后在`dotfiles`文件夹下新建git仓库，并推送到GitHub等平台。日后遇到新环境，直接`git clone`并借助自己写的脚本`install.sh`完成链接操作就好了

所以`dotfiles`文件夹中一般会包括，使用说明，自己的配置文件，一些必要的脚本，等等。

下面以我自己配置的过程为例，描述一下这个过程。

## 0.一点小插曲
一开始我合计着，是不是比如换了新的电脑，把旧的主力机的东西挪过去，也要用到dotfiles。所以我还考虑到了`.gitconfig`和`.ssh/config`。

但既然都换新电脑了，大概就没dotfiles那么简单了，比如我主力机是windows，如果换了个新电脑，还是不如自己手动一个个去官网下载，而不是搞一些极客但对于我来说过于复杂的自动化流程。

另外我想把`.gitconfig`和`.ssh/config`也放进dotfiles的话，还涉及到用户名、邮箱、IP之类的隐私，一并推送到GitHub也不行。

于是我又仔细想了想，不行。dotfiles只适合`.zshrc` `.vimrc`之类的操作上的配置，只适合个人云服务器之类的非主力、要经常开发操作的环境。

<br>

后来我又真的很想配置好Git用`vim`，这样就需要把`.gitconfig`也一并管理。问了AI后了解到，`.gitconfig`可以把用户名和邮箱等隐私信息写进`[include]`，然后本地再写一个`.gitconfig.local`

## 1.新建`dotfiles`文件夹
建议的位置是`~/dotfiles`。

而文件夹里边放什么呢？上网看了几篇别人的博客，比如这个[https://luolei.org/dotfiles-tutorial](https://luolei.org/dotfiles-tutorial)和这个[https://zhuanlan.zhihu.com/p/2016444351375509200](https://zhuanlan.zhihu.com/p/2016444351375509200)

于是我新建了`dotfiles`文件夹如下结构

```text
.
├── README.md                     something like introduction
├── git
│   └── .gitconfig                from ~/.gitconfig
├── install.sh
└── terminal
    └── .zshrc                    from ~/.zshrc
```

因为我也是第一次弄，所以就不弄的太复杂了，简单一点。日后有需求了也可以再改一改。

## 2.把一些配置文件挪过来
一般就是`mv`再`ln`

当然考虑到`mv`的危险性，也可以`cp`再`rm` `ln`

<br>

对于我自己，一开始就先考虑到了`~/.zshrc`

命令如下

`mv .zshrc ~/dotfiles/terminal`

`ln -s ~/dotfiles/terminal/.zshrc ~/.zshrc`

> 如果你的`.gitconfig`有东西的话，应该如下操作：非隐私部分移动到`~/dotfiles/git/.gitconfig`，而隐私部分写入`~/.gitconfig.local`。然后在`~/dotfiles/git/.gitconfig`中写入`[include]`部分。详见文末我在GitHub上的dotfiles仓库，其中有我的`git/.gitconfig`源码，供参考。

> 为了不出现任何问题，请读一下我的`install.sh`的相关内容，然后依据自身情况，自行做出相应更改。

## 3.写`README.md`和`install.sh`
### 1）`install.sh`
我的脚本如下，仅供参考

```bash
#!/bin/bash

# Because I'm not familiar with the grammer of <.sh> files, I use AI (actually DeepSeek) to help me to write this script.

# Exit immediately if any command fails
set -e

# Get the absolute path of the dotfiles directory
DOTFILES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "======================================"
echo "    Dotfiles Setup for Cloud Server"
echo "======================================"

# Safe link function (backs up existing files)
safe_link() {
    local src="$1"
    local dest="$2"

    if [ -e "$dest" ] && [ ! -L "$dest" ]; then
        echo "Warning: Backing up existing $dest to ${dest}.bak"
        mv "$dest" "${dest}.bak"
    fi

    ln -sf "$src" "$dest"
    echo "Linked: $dest -> $src"
}

# ======================================
# 1. Hostname Customization (Interactive)
# ======================================
if [ -f "$HOME/.zshrc.local" ]; then
    echo "~/.zshrc.local already exists, skipping hostname customization."
else
    read -p "Do you want to customize the prompt hostname? (y/N): " DO_CUSTOM
    if [[ "$DO_CUSTOM" =~ ^[Yy]$ ]]; then
        read -p "Enter the hostname you want to display: " CUSTOM_HOST

        if [ -z "$CUSTOM_HOST" ]; then
            echo "Empty hostname, skipping customization."
        else
            cat > "$HOME/.zshrc.local" <<EOF
prompt_context() {
  if [[ "\$USER" != "root" ]]; then
    prompt_segment black default "%(!.%{%F{yellow}%}.)\$USER@$CUSTOM_HOST"
  fi
}
EOF
            echo "Prompt hostname customized to: $CUSTOM_HOST"
        fi
    else
        echo "Skipping prompt hostname customization."
    fi
fi

# ======================================
# 2. Install Base Software
# ======================================
echo "======================================"
echo "Updating package lists..."
sudo apt update

echo "Installing packages..."
sudo apt install -y zsh neofetch tree build-essential gdb p7zip-full curl git wget

# ======================================
# 3. Install Oh My Zsh (Silent mode)
# ======================================
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    echo "Installing Oh My Zsh (Gitee mirror)..."
    git clone --depth=1 https://gitee.com/mirrors/oh-my-zsh.git "$HOME/.oh-my-zsh"
fi

# ======================================
# 4. Install Zsh Plugins (Gitee Mirror)
# ======================================
ZSH_CUSTOM=${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}
if [ ! -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ]; then
    echo "Installing zsh-autosuggestions..."
    git clone https://gitee.com/zsh-users/zsh-autosuggestions "$ZSH_CUSTOM/plugins/zsh-autosuggestions"
fi
if [ ! -d "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" ]; then
    echo "Installing zsh-syntax-highlighting..."
    git clone https://gitee.com/zsh-users/zsh-syntax-highlighting.git "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting"
fi

# ======================================
# 5. Deploy .zshrc
# ======================================
echo "======================================"
echo "Deploying configurations..."

safe_link "$DOTFILES_DIR/terminal/.zshrc" "$HOME/.zshrc"

# ======================================
# 6. Deploy .gitconfig
# ======================================
echo "======================================"
echo "Deploying .gitconfig..."

# Grab identity the machine already has (e.g. hand-written ~/.gitconfig).
# Use --file so include is NOT expanded: we want the raw file, not our template.
EXISTING_NAME=""
EXISTING_EMAIL=""
if [ -f "$HOME/.gitconfig" ]; then
    EXISTING_NAME="$(git config --file "$HOME/.gitconfig" user.name 2>/dev/null || true)"
    EXISTING_EMAIL="$(git config --file "$HOME/.gitconfig" user.email 2>/dev/null || true)"
fi

safe_link "$DOTFILES_DIR/git/.gitconfig" "$HOME/.gitconfig"

if [ -f "$HOME/.gitconfig.local" ]; then
    echo "~/.gitconfig.local already exists, skipping."
else
    echo "No ~/.gitconfig.local found, creating one."

    if [ -n "$EXISTING_NAME" ]; then
        read -p "Git user name [$EXISTING_NAME]: " GIT_NAME
        GIT_NAME="${GIT_NAME:-$EXISTING_NAME}"
    else
        while [ -z "$GIT_NAME" ]; do
            read -p "Git user name: " GIT_NAME
        done
    fi

    if [ -n "$EXISTING_EMAIL" ]; then
        read -p "Git email [$EXISTING_EMAIL]: " GIT_EMAIL
        GIT_EMAIL="${GIT_EMAIL:-$EXISTING_EMAIL}"
    else
        while [ -z "$GIT_EMAIL" ]; do
            read -p "Git email: " GIT_EMAIL
        done
    fi

    cat > "$HOME/.gitconfig.local" <<EOF
[user]
        name = $GIT_NAME
        email = $GIT_EMAIL
EOF

    echo "Created ~/.gitconfig.local:"
    cat "$HOME/.gitconfig.local"
    echo "Note: this file is NOT tracked by git."
fi

# ======================================
# 7. Change default shell to zsh
# ======================================
ZSH_BIN="$(command -v zsh || true)"
CURRENT_LOGIN_SHELL="$(getent passwd "$USER" | cut -d: -f7)"

if [ -z "$ZSH_BIN" ]; then
    echo "zsh not found, skipping default shell change."
elif [ "$CURRENT_LOGIN_SHELL" = "$ZSH_BIN" ]; then
    echo "Default shell is already zsh, skipping."
else
    echo "Changing default shell to zsh..."
    echo "You will be asked for your password."
    echo "chsh must authenticate via PAM before it can modify your entry in /etc/passwd,"
    echo "even though you are only changing your own login shell."
    if ! chsh -s "$ZSH_BIN"; then
        echo "Warning: chsh failed. You can change the shell manually later with:"
        echo "    chsh -s $ZSH_BIN"
    fi
fi

echo "======================================"
echo "Setup Complete! Please run: source ~/.zshrc"
echo "======================================"
```

### 2）`README.md`
我的说明如下，仅供参考

````text
Because I'm afraid of somgthing wrong about the encoding-ways such as UTF-8 and GBK, I decide to write my `README.md` in English. Though it is some of tough for me, it's still a little fun and valuable.

It's the first time for me to write `README.md` in English, haha

# My dotfiles

## Description of files here
```text
.
├── README.md                     something like introduction
├── git
│   └── .gitconfig                from ~/.gitconfig
├── install.sh
└── terminal
    └── .zshrc                    from ~/.zshrc
```

## Introduction to the file `install.sh`

> Because I'm not familiar with the grammer of <.sh> files, I use AI (actually DeepSeek) to help me to write this script.

(When the script is trying to execute commend `ln`, if there have been a file in the destination, the script will rename it as `{originalName}.bak`. And the script will always execute the commend `ln` with the flag of `-sf`.)
(The script is written mainly for the scene that I am trying to use a new cloud server.)

- The script will ask the users whether to use a customised hostname in the prompt. (Won't change the real hostname.) Because I don't like the default hostname of the cloud machine which I get from the cloud company
- The script will `sudo apt update` and then `sudo apt install -y zsh neofetch tree build-essential gdb p7zip-full curl git wget`, because I think they are necessary for me.
- The script will install `Oh My Zsh` from Gitee, because I like it. (Gitee for the problem of network fluctuation. At first I tried GitHub, but it failed in my Alibaba Cloud Server)
- The script will install zsh plugins `zsh-autosuggestions` and `zsh-syntax-highlighting` from Gitee, because I suppose they are necessary for me. (Gitee for the problem of network fluctuation, maybe. I also forget the reason why I chose Gitee at first.) (update: Yes, it's necessary for my machine)
- The script will ask about your name and email and write them into the file `~/.gitconfig.local`, which won't be tracked by dotfiles, if the script don't find the existed name and email in the machine. And then the script will link the file `~/.gitconfig`, whilch will include `~/.gitconfig.local`.
- The script will link the file `~/.zshrc`
- The script will try to change the default shell to zsh, which may need you to type your password

## How to use it

### A new machine
```bash
cd
    # I like to put the director <dotfiles> in home.
```
```bash
git clone https://github.com/Juster955/dotfiles.git
    # Maybe need to write your name and e-mail address for the first time.
```
```
./dotfiles/install.sh
    # execute the <install.sh>
```

### Change something in my main PC
- if change the content of dotfiles：
  - `vim` to change the file in `~/dotfiles`
- if download new softwares:
  - change the `install.sh`
- if add new dotfiles
  - `mv` to the director of `~/dotfiles`
  - `ln` to the original place
  - change the deploy part in the tail of `install.sh`
  - `git commit` and `push`
> remember to check if there are private contents before `git add`

### Update dotfiles in new machines
`git pull origin main`
`cd`
`./dotfiles/install.sh`
````

## 4.用`git`管理仓库
记得写`.gitignore`。
这是AI建议的相关部分，和我自己后填上去的一行

````text
# 绝对不要上传任何私钥！
*.pem
*.key
id_*

.gitconfig.local
````

<br>

去GitHub新建一个dotfiles仓库

`git init`

`git remote add origin <你的GitHub仓库链接>`

`git branch -M main`（可选）

`git add .`

`git commit`

`git push origin main`

## 5.长期使用
### 1）新机器
```bash
cd
    # 我喜欢把dotfiles文件夹放在家目录
git clone https://github.com/Juster955/dotfiles.git
    # 新机器的话，也许这里需要输入git的用户名和邮箱
./dotfiles/install.sh
    # 执行安装脚本
```

### 2）主力机上改配置
+ 如果是改写配置文件：
    - 去`~/dotfiles`文件夹下`vim`改写
+ 如果是下载了新软件
    - 微改一下`install.sh`
+ 如果是要新增由dotfiles管理的配置文件
    - `mv`到dotfiles文件夹
    - `ln`到原位置
    - 修改`install.sh`最后的部署配置部分与`README.md`的相关部分
    - 本地git提交与推送。

> 记得`git add`之前一定要先看看有没有隐私内容
>

### 3）新机器上更新配置
`cd ~/dotfiles`

`git pull origin main`

`cd`

`./dotfiles/install.sh`

<br>

> 另外我自己的仓库在这里
> [https://github.com/Juster955/dotfiles](https://github.com/Juster955/dotfiles)