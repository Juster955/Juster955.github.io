---
title: The Missing Semester
date: 2026-07-12 12:43:23
tags: [笔记, 技术]
categories: [技术探索]
description: 本来是写在语雀里的，但想了想，写进博客吧。
---
**时间经过**：2025.08.09-2025.10.09
***
这里是我自己做的笔记
本来是写在语雀里的，但想了想，写进博客吧。
万一能帮到谁呢。
<small><i>（但其实这只是好听的话罢了</i></small>
<small><i>（终归只是想满足我自己那无处安放的分享欲</i></small>

[这是课程官网](https://missing.csail.mit.edu/)
[这是社区的中文翻译](https://missing-semester-cn.github.io/)
[这是我看的课程视频的翻译](https://www.bilibili.com/video/BV1CkArz1E4o)
下边就都是我从语雀笔记直接复制过来的了

***
（我用的是从[Linux101](https://101.lug.ustc.edu.cn/)那下载的镜像，VMware虚拟机）
（有一些乱码，那是因为我用的zsh的agnoster主题，复制过来就这样了）

# 一、课程概览与Shell入门
## 1.概况
+ `Shell`是在`Terminal`里边那个
+ 最常见的是`Bash`，而`Zsh`与`Bash`兼容
+ Windows有`Batch`和`Powershell`，但本课主要讲的是`Bash`和`Zsh`
+ bash是Bourne Again Shell

## 2.演示
+ `date`
+ `echo`

```bash
[jon@xos:~]$ echo "hello         world"
"hello         world"
[jon@xos:~]$ echo hello           world
hello world
```

+ `man`（manual）
    - 可以直接`/`搜索`EXAMPLES`
+ `cd`（change directory）
+ `which`
+ `ls`（list）
    - `ls -l`详细信息
        * `drwxrwxrwx`
        * 第一位`d`则目录，`-`则普通文件
        * 接下来是三组<owner><group><other>
        * 每一组中`r`可读，`w`可写，`x`可执行，
+ `cat`
+ `sort`，排序，默认按字典序
    - `-n`compare according to string numerical value
+ `uniq`，对于连续出现的重复行会只打印一行
    - `-c`去重并计数
+ `head`，显示前几行，默认十行，`-n3`则前三行
+ `tail`，显示最后几行
+ `grep`搜索文件内容，比如`grep 3 data`会输出文件<data>中含<3>的行
    - （Global Regular Expression Print）
    - `-v`排除正则表达式匹配的内容
    - `-c`输出总数（count）
+ `sed`
+ `find`搜索文件。`-exec`执行，`{}`占位，`\;`结束所执行的命令
    - `-type f`
    - `-name "*.zip"`
    - `-mtime +30`（modified time）
    - `-print0`就不以换行来区分，而是以`\0`来区分（终端看不见`\0`但是二进制编码里是有的）
+ `ctrl c`取消
+ `awk`处理文本但是很复杂也很高级
    - `awk '条件 { 做什么 }'`
    - `-F`指定以什么作为分隔符
+ `wc`（word count）
    - `-l`行数
+ `xargs`
    - `xxxxxxxx  | xargs <command>`可以把前边的`stdin`作为参数传给`command`
    - 比如`find -name "*.sh" | xargs wc -l`。`find`的结果被`|`作为`stdin`又被`xargs`作为参数就成了`wc`的`<file>`
    - `-0`就不以空格来区分，而是以`\0`来区分（终端看不见`\0`但是二进制编码里是有的）
+ `curl`（Client URL），访问指定URL
+ `jq`处理json的
    - `.`是identity
    - `[]`遍历数组
    - `[0]`取第一个
    - `|`管道，左侧过滤器的输出给右侧过滤器的输入
    - 例如`xxxx | jq '.[] | select(.version > 6) | .name'`表示遍历顶层数组，筛选version > 6的，输出name

## 3.一些英文
转义`\`比如说`\n` `\"`是escape啊

含义：让程序不把`\`后边的字符看作特殊字符

<br>

管道符pipe character      `|`

<br>

重定向redirect `>` `<`

<br>

newline为啥是换行啊……

## 4.绝对路径与相对路径
+ `/`根目录
+ `~`家目录，也就是`/home/xxx`
+ `.`当前目录
+ `..`上一级
+ 关于相对路径
    - 运行可执行文件需要`./`
    - 其他情况下，对于当前工作目录下的文件不需要前边加啥
    - 前边加个`/`反而成了根目录

## 5.Tab
自动补全

## 6.关于环境变量PATH
`echo $PATH`

Shell实际上就是获得命令后，去PATH环境变量里寻找相关命令，并运行

## 7.bash编程语言
+ 管道符`|`
    - `command 1 | command 2`command1的结果作为command2的输入
+ `&&`
    - `command1 && command2`command1成功（`&?`为`0`）才执行command2
+ `||`
    - `command1 || command2`command1失败(`&?`不为`0`)才执行command2
+ 重定向
    - `>`
    - `<`
    - `>>`追加而不是覆盖
    - stdin(0), stdout(1), stderr(2)
        * `&>xxx`是把stdout和stderr放进文件<xxx>
            + 这其实是一个语法糖，表示`> xxx 2>&1`
            + 这里012都是指针，`>`就是`1>`，`&`是文件描述符的标记
            + `1> xxx`把指针1指向文件xxx
            + `2>&1`把指针2指向指针1
        * `&>>xxx`则是追加而非覆盖
+ `if`
    - `if command1; then command2; command3; fi`

```bash
if 条件1; then
    命令1
elif 条件2; then
    命令2
elif 条件3; then
    命令3
else
    其他命令
fi
```

+ `while`
    - `while command1; do command2; command3; done `

```bash
while command1; do
    command2
    command3
done
```

+ `for`
    - `for varname in a b c d; do command; done`
    - `for i in $(seq 1 10); do`

```bash
for varname in a b c d; do
    command
done
```

```bash
for i in $(seq 1 10); do
    echo $i
done
```

+ `test`或者说`[]`
    - `[ -f file ]`
    - `[ "$var" = "string" ]`
+ `$?`是上一条命令的返回值，`0`则正常
+ `$1`是第一个参数

## 8.shebang
井号hash+感叹号exclamation mark

shebang——hash bang 

`#!`

例如

`#!/bin/sh`（中间没有空格）

`#!/user/bin/python`

## 9.权限
`r`读`w`写`x`执行

`chmod`更改权限

## 10.glob通配符
+ `*`匹配任意字符（不含`/`，不含`.`隐藏文件
+ `?`匹配单个字符
+ `[abc]`字符合集
+ `[!abc]`否定集合
+ `[a-z]`范围
+ `[[:alpha:]]`POSIX字符集

## 11.引用
`''`强引用，`$` `!`不会起作用

`""`弱引用，`$` `!`会起作用

## 12.习题的一些练习
+ 终于吗。。。

```bash
#使用管道找出你「home 目录」中最常见的 5 种文件扩展名。
#（提示：组合 find 、grep / sed / awk、sort、uniq -c 以及 head）
 ustc@ustclug-linux101  ~  find ~ -type f | grep -o '[^.]*$'| sort | uniq -c | sort -nr | head -n5
   1311 png
    365 md
    355 zsh
    143 zsh-theme
     25 xml

```

+ 好累。。。

```bash
#从 ~/.bash_history（或 ~/.zsh_history）中找出最常使用的 Shell 命令。

#首先观察cat .zsh_history，发现一些规律
# awk，以分号作为分隔符，取第二列及以后的部分
#排序，方便一会去重
#去重并计数
#按出现次数排序
#取最大的十个
 ustc@ustclug-linux101  ~  awk -F';' '{$1="";print}' .zsh_history | sort | uniq -c | sort -nk1,1 | tail -n10
      4  vim test
      4  vim test.sh
      5  cat test
      5  cd ~
      6  man ls
      8  ls
     10 
     10  man awk
     10  man find
     10  man grep
```

```bash
#这个则是不考虑整个命令，而只考虑开头。
#但是这个方法没有算上管道后边的命令
 ustc@ustclug-linux101  ~  awk -F';' '{$1="";print}' .zsh_history | awk -F' ' '{print$1}' | uniq -c | sort -nk1,1 | tail -n10
      5 curl
      5 find
      5 man
      5 mkdir
      6 ls
      6 man
      7 echo
      8 find
     10 grep
     11 awk

```

# 二、命令行环境
## 1.Shell的输入与输出
### 1）输入
+ flag标志
    - 短横线(dash)
    - 一个短横线通常跟单字母
    - 两个短横线通常跟一个单词
    - 一个短横线的单字母可以合并在一起写
    - flag顺序不影响作用
        * `$1` `$2` `$3`访问参数
        * `$@`列表形式访问所有参数
        * `$#`参数个数
        * `$0`程序名称本身
    - `--`可以让后边的东西不再被解析成flag，而是positional argument
        * `touch -- -myfile`可以创建文件`-myfile`，而不是看作`-`开头的flag
    - 例子
        *  `ls -atlh`
+ 环境变量

### 2）输出
+ 返回码return code
    - `$?`获取返回码
+ 命令之间可以用`&&` `||`连接。表示前者成功/失败了才运行后者
    - `# true 是一个总是成功的 shell 程序`
    - `true && echo "This will always print"`
    - `# false 是一个总是失败的 shell 程序`
    - `false || echo "This will always print"`

## 2.stream流
+ 管道符`|`前后的命令不是先后运行的，而是同时平行地运行地、的
+ `-`单独一个短横线表示从stdin读取数据
+ 重定向
    - `xxx > yyy.txt`把`xxx`的`stdout`放进`yyy.txt`
    - `xxx 2> err.txt`把`xxx`的`stderr`放进`err.txt`
    - `xxx  &> yyy.txt`把`xxx`的`stdout`和`stderr`放进`yyy.txt`
    - 比如说想忽略输出，可以`ls nonexistent 2> /dev/null`，这就把`ls nonexistent`的错误放进了`/dev null`，也就是忽略了，没有了

## 3.环境变量
### 1）例子
例如`foo=bar`

但是不能写`foo = bar`，这就变成命令`foo`、参数`=`和`bar`了

### 2）举例
`$HOME`是家目录

`$TZ`是时区

### 3）引号
双引号会展开变量`$`

单引号则不会

### 4）约定
环境变量全大写`HOME` `PATH` `DEBUG`

本地变量全小写

## 4.信号signal
### 1）是什么
是一种软件中断software interrupts

### 2）有什么
+ `Ctrl C` `SIGINT`
+ `ctrl \` `SIGQUIT`
+ `kill -TERM <PID>` `SIGTERM`
+ `Ctrl Z` `SIGTSTP`（Terminal Stop终端版本的SIGSTOP）
    - `fg` `bg`均可使之继续运行
    - `jobs`显示终端内未结束的作业
    - `$!`最近一个放进后台运行的作业
    - 命令末尾加上`&`就是在后台运行，但仍会使用当前shell的`STDOUT`。
        * 可以配合重定向
        * 可以把一个已经在前台运行的程序`ctrl z`再`bg`转到后台
    - `pgrep`搜索进程
        * `-l`显示进程名
        * `-a`显示完整命令行
    - `pkill`杀掉进程
        * `-f`匹配完整命令行
        * `-x`要求完全一致、防止误杀

啊啊啊那咋能这么多呢

```plain
要注意，放到后台的进程依然是当前终端的子进程
所以如果你把终端关掉，它们也会一起死掉（这时还会收到另一个信号 SIGHUP）。 
如果不想这样，可以用 nohup 来运行程序,它本质上是个忽略 SIGHUP 的包装命令；
如果进程已经启动了，也可以使用 disown。 
或者，你也可以像下一节会讲到的那样，直接使用终端复用器（terminal multiplexer）。
  （以上：讲义翻译（中文站）原文）
  （更新：看来我当时真是累蒙了）
```

+ `man signal`
+ `trap`

```bash
#!/usr/bin/env bash
cleanup() {
    echo "Cleaning up temporary files..."
    rm -f /tmp/mytemp.*
}
trap cleanup EXIT  # 当脚本退出时执行清理
trap cleanup SIGINT SIGTERM  # 也可以按 Ctrl-C 或 Kill
```

+ `wait %1`
    - `wait`只会等当前shell子进程的
+ `kill -0`不会真的发送信号，但可以用返回值来体现该进程是否存在

## 5.ssh
### 1）是什么
Secure Shell

### 2）示例
`ssh <用户>@<IP>`

`ssh jjgo@192.168.65.4`

`ssh jjgo@server.mit.edu`

以及

`ssh jjgo@192.168.65.4 ls | wc -l`远程`ls`，本地`wc`

`ssh jjgo@192.168.65.4 'ls | wc -l'`远程`ls` `wc`

### 3）SSH密钥
使用`public key cryptography`

`private key` `public key`

+ `ssh-keygen`
+ 服务器端把公钥复制进`.ssh/authorized_keys`

```bash
cat .ssh/id_ed25519.pub | ssh alice@remote 'cat >> ~/.ssh/authorized_keys'

# 或者更简单一点（如果系统提供了 ssh-copy-id）

ssh-copy-id -i .ssh/id_ed25519 alice@remote
```

### 4）复制文件到远程
+ `scp`

### 5）配置文件
SHH客户端配置文件位于`~/.ssh/config`

### 6）在远程同时运行多个命令`tmux`
连上了ssh最好就先`tmux`

+ `tmux`（terminal multiplexers）
    - 窗格pane，标签页tab
    - 创建窗口`Ctrl B` `C`
    - 切换窗口`Ctrl B` `0`（切换到0号窗口）
    - 分离会话`Ctrl B` `D`（detouch）
    - 重新连接`tmux attach`（logout了也还会在远程保持进程不退出不终止）

具体的

+ Sessions（会话） 
    - 一个 session 是一个独立的工作区，里面可以包含一个或多个 window。
    - `tmux` 会启动一个新的 session。
    - `tmux new -s NAME `会以指定名称启动一个 session。
    - `tmux ls` 用来列出当前所有 session。
    - 在 tmux 里按 `<C-b> d` 可以分离（detach）当前 session。
    - `tmux a`会附着(attach)到最近一个 session，也可以用`-t`指定具体是哪一个。
+ Windows（窗口） 
    - 相当于编辑器或浏览器里的 tab，它们是同一个 session 中视觉上彼此分开的部分。
    - `<C-b> c`创建一个新 window。
    - `<C-d>`关闭window
    - `<C-b> N` 跳到第 N 个 window。注意 window 是有编号的。
    - `<C-b> p` 切换到前一个 window。
    - `<C-b> n` 切换到后一个 window。
    - `<C-b> ,` 重命名当前 window。
    - `<C-b> w` 列出当前所有 window。
+ Panes（窗格） 
    - 类似 vim 的 split，pane 允许你在同一个可视区域里同时放多个 shell。
    - `<C-b> "`水平拆分当前 pane。
    - `<C-b> %` 垂直拆分当前 pane。
    - `<C-b> <direction>` 切换到指定 direction 方向的 pane，这里的 direction 指方向键。
    - `<C-b> z` 切换当前 pane 的缩放状态。
    - `<C-b> [`进入滚动回看模式。之后你可以按 <space> 开始选择，再按 <enter> 复制选中的内容。
    - `<C-b> <space>` 在不同 pane 布局之间轮换。

## 6.自定义Shell配置
可以把`dotfile`放进一个单独的目录，纳入版本控制。再用脚本通过符号链接（symlink）连接到实际位置。比如说上传到GitHub，那换电脑的时候就可以直接拿过来

```bash
mkdir ~/.dotfiles

# 比如说把.zshrc放进来
mv ~/.zshrc ~/.dotfiles/

# 创建符号链接
# 命令格式：ln -s <源文件> <目标链接>
ln -s ~/.dotfiles/.zshrc ~/.zshrc

# 纳入版本控制、上传Github
cd ~/.dotfiles
git init
git add .
git commit -m "备注，想写啥就写点啥"
git remote add origin git@github.com:<用户名>/dotfiles.git #仓库名dotfiles
git push -u origin main
```

```bash
# 好了我换新电脑了

git clone xxxxxx
# 然后再写点脚本来链接吧
```

+ `tldr`
+ `alias`
+ `Ctrl R`反向历史搜索

## 7.与时俱进
我靠真是与时俱进啊

+ `llm`根据自然语言描述得到shell命令
+ `claude`可以看作一层元shell（meta-shell）

## 8.终端模拟器
终端模拟器（terminal emulator）和Shell一样，也可以自定义很多配置

## 9.其他
+ `bash xxx`创建子shell，运行xxx
+ `export`把使变量可以被子shell访问。再`unset`就没了
+ 创建文件`touch xxx`
+ 通配符
    - `*`零个或多个任意字符
    - `?`恰一个字符
    - `{}`把逗号分隔的模式给展开
    - 例子
        * `touch folder/{a,b,c}.py`
+ `source xxx`在当前shell进程中运行xxx而不是新建子进程
+ 脚本直接`./xxx`运行是开了个子进程，而函数再`source`就是当前shell运行了

## 10.一些舍不得删掉的练习
### 1）
> 写两个 bash 函数 marco 和 polo，行为如下：每次执行 marco 时，都要以某种方式保存当前工作目录；之后无论你切到哪个目录，只要执行 polo，它都应该把你 cd 回执行 marco 时所在的目录。为了方便调试，你可以把代码写进 marco.sh，然后通过执行 source marco.sh 把这些定义重新加载到当前 shell。
>

```bash
#macro.sh
!/bin/zsh

macro(){
    now_directory=$(pwd)
}

polo(){
    cd "$now_directory"
}
#另外我拼错了，不是macro，人家说的是marco
```

### 2）
> 假设你有一个很少失败的命令。为了调试它，你需要把它的输出保存下来，但等到一次失败运行可能会很耗时。写一个 bash 脚本，不断运行下面这个脚本直到它失败为止，并把标准输出和标准错误分别保存到文件里，最后把结果打印出来。如果你还能顺便报告它运行了多少次才失败，就加分。
>

```bash
 #!/usr/bin/env bash

 n=$(( RANDOM % 100 ))

 if [[ n -eq 42 ]]; then
    echo "Something went wrong"
    >&2 echo "The error was using magic numbers"
    exit 1
 fi

 echo "Everything went according to plan"
```

我写的

```bash
#!/bin/bash
temp=1
while (./testTarget.sh &> res) ; do
        temp=$(( $temp + 1 ))
done

temp=$(( $temp + 1 ))

cat res
echo $temp

```

倒是能当抽奖了，1%的概率出错（

```bash
ustc@ustclug-linux101  ~  ./test
Something went wrong
The error was using magic numbers
15
 ustc@ustclug-linux101  ~  ./test
Something went wrong
The error was using magic numbers
156
 ustc@ustclug-linux101  ~  ./test
Something went wrong
The error was using magic numbers
60

```

# 三、开发环境与工具
## 0.一些介绍
+ IDE
    - VS Code
    - 更容易上手，有更好的开箱即用的AI集成能力
+ 基于终端的开发工作流
    - tmux Vim Zsh 编程语言特定命令行工具
    - 更轻量，在没有GUI或无法安装软件的情况下可能是唯一选择



## 1.Vim
### 1）Vim是模态编辑器（modal editor）
+ （`Esc` ->）普通模式 Normal Mode
+ （`i` ->）插入模式 Insert Mode
+ （`r` -> ）替换模式Replace Mode
+ 视觉模式Visual Mode
    - （`v` ->）普通视觉模式Plain Visual Mode
    - （`V` ->）视觉行模式Visual Line Mode
    - （`Ctrl v` ->）视觉块模式Visual Block Mode
+ （`:` ->）命令模式Command Mode

### 2）Vim界面本身是一种编程语言

+ 移动movement（名词nouns）
  
    - `h`左
    - `l`右（？这里突然很诡异的变大了，变成二级标题了
    - `j`下（不知道怎么回事，研究了一下也没研究明白
    - `k`上（以后再说吧
    - 
    - `w`下一个单词的开头（word）
    - `b`移动到单词的开头（back/beginning）
    - `e`当前单词的结尾
    - 
    - `0`移动到行首
    - `^`第一个非空白字符
    - `$`行尾
    - 
    - `H`屏幕顶部
    - `M`屏幕中部
    - `L`屏幕底部
    - 
    - `Ctrl d`向下翻半页（down）
    - `Ctrl u`向上翻半页（up）
    - 
    - `gg`文件顶部
    - `G`文件底部
    - 
    - `:123`到123行
    - 
    - `%`找到对应的引号/括号/花括号
    - 
    - `f xxx`找到下一个字符`xxx`出现位置
    - `t xxx`定位到`xxx`字符之前的位置
    - 
    - `/`搜索
    - `?`反向搜索
        * `n`下一项
        * `N`上一项
+ 选择selection
+ 编辑edits（动词verbs）
    - `o`当前行下边创建新行，同时进入插入模式
    - `O`当前行上边创建新行，同时进入插入模式
    - `u`撤销
    - `U`撤销当前一行的操作
    - `d <移动命令>`删除
    - `c <移动命令>`修改
    - `x`删除（等价于`dl`）
    - `s`替换（等价于`cl`）
    - 可视化模式，`d`删除，`c`修改
    - `u`撤销
    - `Ctrl r`重做
    - 剪切似乎就是`dd`删除整行就好了
    - `y`复制（yank）
    - `p`粘贴
    - `~`切换大小写
    - `J`把多行连接起来
+ 计数counts
    - 名词动词加上计数，可以把某个动作执行多次
+ 修饰符modifiers
    - `i`（inner/inside）
    - `a`（around）
        * `ci(`修改圆括号内的内容
        * `da'`删除一个单引号字符串，包括两侧的单引号

<br>

> 讲课的小哥：“I'm going through these fast on purpose, so you're not focused on that.”
>

> 我：一句话一暂停然后疯狂在笔记里打字
>

<br>

+ 其他
    - 替换
        * `:s/xxx/yyy`把当前行第一个`xxx`替换成`yyy`
        * `:s/xxx/yyy/g`替换一整行的所有`xxx`
        * `:#,#s/xxx/yyy/g`替换##之间的若干行的每个匹配串（#是行号）
        * `:%s/xxx/yyy/g`替换整个文件的每个匹配串
        * `:%s/xxx/yyy/gc`替换整个文件的每个匹配串，并且对每个匹配串提示是否替换
    - 状态
        * `Ctrl g`
    - 执行外部命令
        * `:!`可以执行外部命令比如`ls`
        * `:w <filename>`保存到`filename`
        * `v <motion> :w <filename>`在可视模式下选中后保存到`filename`
        * `:r <filename>`在当前文件插入别的文件的内容
            + `:r !ls`可以读取`ls`的输出
    - 附加类命令
        * `a`光标处附加
        * `A`光标所在行行末附加
    - 置换类命令
        * `r`换一个字符
        * `R`换多个字符
    - 复制粘贴
        * 可视模式，`y`复制，`p`粘贴
        * 还可以把`y`当作操作符，比如`yw`复制一个单词
    - 设置
        * `:set xx`设置xx
            + `ic`忽略大小写（Ignore Case）
            + `hls`高亮搜索到的内容（hl search）
            + `is`查找短语时显示部分匹配（incsearch）
            + 加上`no`就关闭比如说`:set noic`
            + （似乎都是临时的设置，退出当前vim窗口就失效了？）
    - 帮助
        * `:help`进入
            + 可以提供正确参数，找到有关主题的帮助
            + `:help w`
            + `:help c_CTRL-D`
            + `:help insert-index`
            + `:help user-manual`
        * `:q`退出
    - 启动脚本
        * `~/.vimrc`
        * `:write`
    - 补全

<br>

vim还有教程啊，这真好

> `vimtutor` 是随 `Vim` 一起安装的教程；如果装了 `Vim`，你应该可以直接在 Shell 里运行 `vimtutor`

还有个小网站

> [Vim Adventures](https://vim-adventures.com/)是一个学习 Vim 的游戏（我没玩明白

## 2.Language Server(LSP)
语法高亮啊，跳转到啊，引用啊，自动导入啊，红色波浪线标记错误啊之类的

> 代码补全，内联文档，跳转到定义，查找引用，导入辅助，代码质量

## 3.AI powered development
+ 自动补全autocomplete
+ 内联对话inline chat
+ 编码代理coding agent

### 1)自动补全
可以用注释来引导AI

可以用文档字符串来引导AI（比如Python函数中"""这个东西"""）

只能在光标之后进行编辑

### 2）内联对话
只会修改选中的部分

<br>

## 其他
+ 函数签名signature of functions

<br>

> They're probabilistic next-token predictors.
>

以及

> Cool.See you tomorrow.
>

# 四、调试与性能分析
> A golden rule in programming is that code does not do what you expect it to do, but what you tell it to do. 
>

以及

> The most effective debugging tool is still careful thought, coupled with judiciously placed print statements
>
> ——Brian Kernighan, Unix for Beginners.
>

<br>

这节课的大部分东西之前完全没听过，没有直观印象

而且一开始听课还睡着了10分钟……

不想再看一遍视频了

讲义也还没有翻译

总而言之就是……这节课很没走心

## 1.调试
### 1）打印调试（Print debugging）
### 2）日志（logging）
+ 结构化日志
+ 非结构化日志

<br>

+ 日志级别
    - 跟踪trace
    - 调试debug
    - 信息info
    - 警告warn
    - 错误errr
    - 严重critical

### 3）调试器（Debugger）
+ 通用调试器（适用于编译后的）
    - GDB（GNU调试器）
        * `gcc`参数`-g`保留调试参数
        * `run`启动程序
        * `continue`直到下一个断点
        * `step`单步执行，进入下一个函数
        * `next`单步执行 跳过下一个函数
        * `quit`退出
        * `break <行号>/<函数名>`设置断点
        * `list`查看附近行代码
    - LLDB（LLVM调试器）
+ 针对特定语言的调试器
    - PDB
    - JDB

### 4）反向调试（reverse debugging）/回访调试（replay debugging）
+ `RR`（record replay）
+ `rr record <./程序>`
+ `rr replay`
+ `rc`倒着运行直到断点
+ `rs`后退一行
+ `rn`向后步进，跳过函数调用
+ `reverse-finish`反向运行直到进入当前函数

（仅Linux）

（需要硬件支持所以虚拟机可能不好用）

（并发程序可能出问题）

### 5）系统调用追踪
+ `strace`

```bash
# Trace all system calls
strace ./my_program

# Trace only file-related calls
strace -e trace=file ./my_program

# Follow child processes (important for programs that start other programs)
strace -f ./my_program

# Trace a running process
strace -p <PID>

# Show timing information
strace -T ./my_program
```

### 6)bpftrace 和 eBPF
### 7)网络调试
+ `tcpdump`
+ `Wireshark`

### 8)内存调试
+ `sanitizers`编译器在运行时检测代码错误的机制
    - `AddressSanitizer (ASan)`
        * `gcc -fsanitize=address -g program.c -o program ./program`
    - `ThreadSanitizer (TSan)`
    - `MemorySanitizer (MSan)`
    - `UndefinedBehaviorSanitizer (UBSan)`
+ `Valgrind`更慢但不需要重新编译

### 9）AI
AI也许并不擅长修正问题

但AI很擅长找到问题

## 2.性能分析
### 1）Timing
+ `time`
    - `real`从头到尾的时间
    - `user`CPU运行用户代码的时间
    - `sys`CPU运行内核代码的时间

### 2)Resource Monitoring
+ General Monitoring
    - `htop` `btop`
+ I/O Operations
    - `iotop`
+ Memory Usage
    - `free`
+ Open Files
    - `lsof`
+ Network Connections
    - `ss`
+ Network Usage
    - `nethogs` `iftop`

### 3)可视化
+ `gnuplot`
+ `matplotlib `
+ `ggplot2`

### 4)CPU性能分析
+ `Tracing profilers `
+ `Sampling profilers `

`perf`

`Valgrind 的 Callgrind`

`Massif`

# 五、版本控制与Git
版本控制系统VCS

+ 软件开发团队协作的标准
+ 个人项目也可以保留快照、分支并行

## 1.数据模型data model
+ 快照snapshot（似乎不是Git官方概念？）
+ 文件和文件夹结构
    - 文件files：数据对象 blob
    - 文件夹folders：树对象 tree

历史记录是snapshot/commit的有向无环图（是不可变的数据结构，仅追加）

+ Object：（SHA-1标识）
    - blob
    - tree
    - commit
+ Reference
    - branch
    - tag
    - HEAD
    - remote
    - 其他

<br>

实际上可以看作指针，不是复制

比如说，删除分支，并不会改变历史。Git不是家谱谱系的数据结构。分支只是一个指针。

<br>

+ 仓库：Object和Reference的集合

## 2.命令
（嗯对我从[讲义](https://missing-semester-cn.github.io/2026/version-control/)复制过来的）

### Basics
- `git help <command>`: get help for a git command
- `git init`: creates a new git repo, with data stored in the .git directory
- `git status`: tells you what’s going on
- `git add <filename>`: adds files to staging area
- `git commit`: creates a new commit
    - Write good commit messages!
    - Even more reasons to write good commit messages!
- `git log`: shows a flattened log of history
- `git log --all --graph --decorate`: visualizes history as a DAG
- `git diff <filename>`: show changes you made relative to the staging area
- `git diff <revision> <filename`>: shows differences in a file between snapshots
- `git checkout <revision>`: updates HEAD (and current branch if checking out a branch)
### Branching and merging
- `git branch`: shows branches
- `git branch <name>`: creates a branch
- `git switch <name>`: switches to a branch
- `git checkout -b <name>`: creates a branch and switches to it
    - same as `git branch <name>; git switch <name>`
- `git merge <revision>`: merges into current branch
- `git mergetool`: use a fancy tool to help resolve merge conflicts
- `git rebase`: rebase set of patches onto a new base
### Remotes
- `git remote`: list remotes
- `git remote add <name> <url>`: add a remote
- `git push <remote> <local branch>:<remote branch>`: send objects to remote, and update remote reference
-` git branch --set-upstream-to=<remote>/<remote branch>`: set up correspondence between local and remote branch
- `git fetch`: retrieve objects/references from a remote
- `git pull: same as git fetch; git merge
- `git clone`: download repository from remote
### Undo
- `git commit --amend`: edit a commit’s contents/message
- `git reset <file>`: unstage a file
- `git restore`: discard changes
### Advanced Git
- `git config`: Git is highly customizable
- `git clone --depth=1`: shallow clone, without entire version history
- `git add -p`: interactive staging
- `git rebase -i`: interactive rebasing
- `git blame`: show who last edited which line
- `git stash`: temporarily remove modifications to working directory
- `git bisect`: binary search history (e.g. for regressions)
- `git revert`: create a new commit that reverses the effect of an earlier commit
- `git worktree`: check out multiple branches at the same time
- `.gitignore`: specify intentionally untracked files to ignore

还有神秘小游戏  
这个我之前看见过，真挺好的

[learn git branch](https://learngitbranching.js.org/)

+ 从Git历史中去除敏感信息，这有一个[Github的文档](https://help.github.com/articles/removing-sensitive-data-from-a-repository/)



# 六、代码打包与分发
+ artifact制品

## 1.依赖dependence
+ 每个语言、每个环境的情况都不一样
+ 依赖冲突dependency conflicts
+ 依赖低于dependency hell
+ 环境隔离
+ 例如python
    - `pyproject.toml`（推荐）
        * 或`requirements.txt` `setup.py`
    - `typer`
    - `uv`（推荐）
        * 或`pip`+`venv`
    - `wheel`
+ 一些限制
    - 操作系统
    - CPU架构
    - CUDA
+ 更新日志change logs
+ 版本号
    - 语义化版本Semantic Versioning
        * 主版本，次版本，修订版本
            + 主版本major：不保证任何兼容性
            + 次版本minor：升级，但是能全部兼容
            + 修订版本patch：只改变文档/只修复了bug
+ 版本要求
    - 库：越宽泛越好
    - 面向用户：锁定所有依赖版本
+ 打包整个计算机：虚拟机Virtual machine
+ 应用层实现隔离，操作系统核心组件服用：容器Containerization
    - 目前最流行的是`Docker`
        * `docker run`
            + `-it`
        * `docker image ls`
        * `docker file`
        * `docker build`
            + `-t`
        * `docker pull`
        * `docker push`
        * 
        * `Docker Hub`
        * 记得优化镜像大小
        * `Docker Compose`
        * `systemd`
    - `Kubernetes`

built and distributed

# 七、智能体编程
+ 一个有用的心智模型是把它当作管理一个实习生：实习生做那些繁琐的工作，但需要你的指导，偶尔也会做错事需要纠正。
+ LLM 可以被看作是对给定提示字符串（输入）的补全字符串（输出）概率分布进行建模。

## 1.应用场景
+ 实现新功能
    - 测试驱动开发
+ 修复错误
+ 重构代码
+ 代码审查
+ 理解代码
+ 作为Shell使用
+ 氛围编程

## 2.高级一些的
+ 可复用提示词
+ 并行代理
    - git worktrees
+ MCP（Model Context Protocol）
+ 上下文管理
    - 清空上下文窗口
    - 回退对话
    - 压缩（Compaction）
    - llms.txt
    - AGENTS.md
    - Skills
    - 子代理Subagents

## 3.注意
+ 请审查 AI 输出的正确性和安全性。
+ 有时验证代码可能比自己写更困难；对于关键代码，请考虑手动编写。
+ AI 可能会钻牛角尖并试图误导你；注意调试死循环。
+ 不要把 AI 当拐杖，警惕过度依赖或理解浮于表面。
+ 仍有大量编程任务是 AI 目前无法完成的。计算思维依然有价值。

## 4.推荐软件
这里老师推荐了

+ IDE的各种扩展
+ Anthropic的Claude Code
+ OpenAI的Codex
+ 开源的opencode

# 八、代码之外
老师一说，这节课不用展示任何代码，只是聊聊

我就知道，这门课不白看

真就是“计算机教育中缺失的一课”

## 1.沟通
两类沟通方式：单项沟通与双向沟通

+ 单向沟通：撰写内容、其他人阅读。没有即时互动，而是在未来。**「做了什么」不重要，「为什么」才重要**
    - 代码注释
        * 解释功能（最没用的，代码就在眼前，读代码就好了
        * 标注出需要完成的任务 `//TODO:`
        * 引用，餐卡奥资料
        * “why not......”为什么没有采用某种直截了当的方式
        * 调试的一些教训与经验
        * 常数、魔数当然需要说明
        * 如果正确性依赖于一个看似无关紧要的实现细节，务必点出来
    - 自述文件`README`
        * 做什么用的，What does this thing do
        * 为什么要关注，Why should I care
        * 如何使用，How do I use it
        * 怎么安装，How do I install it
    - 贡献文档`contributing`
        * 提交错误报告的流程
        * 如果提交拉取申请
        * 如何进行测试
        * 我们使用的规范
    - 提交信息（commit message
        * 只描述变更内容本身（最没用的，代码就在眼前，读代码就好了
        * `Git blame`
        * 是什么问题导致了这次提交，为什么要提交
        * 你考虑过哪些代替方案，为什么不那样做
        * 这个改动有哪些潜在风险（比如优化，因为零代价的优化通常是不存在的
        * 你做了哪些主观选择，比如运行变快会导致构建变慢之类的
        * 越复杂的修改需要越多的提交信息
        * 自己一个人的项目也不应该写`"修改了foo"` `"add blah"`
        * LLM可以帮大忙，但直接问它会写的太冗长了
            + 用LLM修改完代码后让它写提交信息，这样有上下文
            + 把代码差异以及一些说明甚至本课讲义发给LLM
        * 不应该`git add .`
            + 语义上独立的改动应该分别提交
            + `git add -p`
        * 这样`git bisect`才有可能发挥作用
    - 警惕矫枉过正，尊重读者时间，不能长篇大论
        * 尤其是用LLM写的时候
+ 双向沟通：协作
    - 贡献代码
        * 用户与维护者的数量往往不止一个数量级。因此要描述清楚、多花心思。一方面是尊重维护者的时间，一方面也是避免自己的拉去申请被直接拒绝
    - 撰写真正的错误报告
        * 足够的背景信息，以便能够浮现
            + 操作系统，配置文件，版本号
        * 期望结果与实际结果的区别
        * 提供复现错误的步骤（可能是错误报告中最重要的部分
        * 你已经尝试过哪些方法
            + 向他们表明：你也做出了一些努力
        * 确保能提供一个最小化复现示例，尽可能剔除掉无关部分（比如代码片段
        * 先搜索是否有已有的错误报告，避免重复
            + “me too”“plus one”是噪音，让其他人更难找到与自己类似的问题，维护者也更头疼于筛选出有用的信息，还会骚扰订阅该错误报告的用户
            + 唯一有用的做法是（比如说GitHub的Issue）点个赞
            + “我找到了另一种复现方法”极具价值
        * 安全漏洞不要公开发布，而是先私下联系维护者。许多项目或许有SECURITY.md
    - 对开源项目的维护者多一份体谅。他们都在做着超负荷的工作
    - 提交拉取请求（不只是提问，而是提交自己的代码）
        * 阅读贡献指南
        * 查看项目许可证（在商业公司中工作时更应注意
        * 确保Git提交的规范性（至关重要
        * 被拒绝了，可以fork，然后自己独立维护这个版本（成本较高，是最后的手段，需要有非常充分的理由 
        * 哦现在有huge amount of AI的垃圾提交
            + 但其实LLM可以起很大的作用
            + 但你必须全程参与其中
            + 理解为什么，清楚什么方式
    - 审查：
        * 初级开发者提交拉去请求，高级开发者审查并指出问题（X
        * 异步讨论代码，像是头脑风暴
        * 针对的是代码而不是人，不要带有审视与贬低
        * 大学中的小组作业就可以进行审查
            + 找出对方错误
            + 学习对方代码
        * 提出可操作的建议
            + “不要使用全局变量”（X
            + “能否请你把全局变量换成局部变量，这样我们可以进行并发测试”
        * 提问比直接提要求更好
            + “你应该处理空值情况”（X
            + “如果这里传入空值会怎样”
            + 不要每次审查都带着不好的情绪离开
        * 解释清楚为什么你认为这里不好，因为对方可能不知道或者不具备相关背景
        * 减少重复
            + 不要在同一件事的多个地方进行多次重复评论
        * 标注哪里是阻塞性的，哪里是建议性的，让对方分好轻重缓急
        * 对于特别巧妙的地方：指出来，留个评论
            + 想想结对编程，一个人和你面对面协作
            + review时为什么不这样做呢
        * AI审查
            + 倾向于“零上下文”，只看变更

## 2.教学互助
+ 学会更好的提问
    - 说明你的理解，阐述你已经知道的地方，“这些是我已经知道的”
    - 可以先问“是否”的一般疑问句，然后再问开放性的问题
    - 问题问的具体一些
    - 明确指出自己不懂的领域
    - 不要接受不完整的回答。不要因为不好意思就“好的谢谢”，要继续追问直到弄懂/对方不耐烦（
    - 提问前要先思考先查资料，做最基本的功课，google/问LLM
    - 向LLM提问也要像问AI一样
    - 在Stack Overflow提问也一样

## 3.AI礼仪
+ 关于AI使用的社会与职业规范，我们仍未形成固定的共识
+ 无关羞耻感与学术诚信，只是为了工程进度，也要坦诚说明“我使用了AI”“我没有完全理解每一行代码”
    - “前端部分由AI编写，我负责后端部分”
    - “测试代码是AI写的”
+ 公司/项目往往有明确规定，甚至例如“xxx部分不可以使用AI”（比如敏感数据
+ 过度依赖AI与LLM，你学到的会很少。动手实践才能学到更多
    - 使用AI应该是有意识的取舍，节省时间还是有所学习
    - 有些经验教训只有亲手实践才能知道
+ 考试/面试之类的场景，使用AI的越来越多了
    - 备受争议
    - 请务必了解你所处的环境的预期与要求
        * 那没说呢？最佳判断是主动询问与坦诚相待

## 4.练习
这是我第一次去看大型项目的源代码
我去随便看了几眼[curl](https://github.com/curl/curl)的源代码，真的有很多注释都是说为什么这样、不要怎样，而很少有代码在说这里是在做什么。倒是有很多函数声明，比如返回值是啥之类的
这真的和我想的不太一样
大一这一年以来，我都以为注释是用来说明这段代码做什么、减少心智负担的
原来并不完全是这样
这门课真的很有必要


我也去Github看了几眼
那个PR啊
有的人不知道叽里咕噜说啥呢，被拒绝了
有的打招呼开头，还说发现啥了、怎么做的，维护者会合并并感谢
唉
真是这样啊
社区的完善需要你我每一个人

# 九、代码质量
## 1.格式化
+ `Prettier`
+ `Black`
+ `gofmt`
+ IDE
    - `EditorConfig`

## 2.Lint（静态分析
+ `Ruff`
+ `semgrep`

## 3.测试
+ 单元测试（针对单个函数
+ 集成测试（针对模块或服务之间交互
+ 功能测试（针对端到端场景
+ 测试驱动开发
+ 回归测试（发现bug时。这样未来功能再次损坏就能捕获到
+ 基于性质的测试
    - `Hypothesis`
+ 模拟mock（依赖数据库/Web API等场景下
<br>

+ 代码覆盖率
    - `Codecov`

## 4.Pre-commit钩子
## 5.持续集成CI（Continuous Integration）
+ GitHub Actions
+ 测试矩阵
+ `pyproject.toml` `.github/workflows/` `DEVELOPMENT.md`等
+ 持续部署

## 6.命令运行器
+ `just`
+ `npm`的`package.json`中的`scripts`部分
+ `Hatch`的`pyproject.toml`中`tool.hatch.envs.*.scripts`部分

## 7.正则表达式"regex"
+ `ag`
+ `go test`

[regex101](https://regex101.com/)

注意各个地方的正则表达式的方言不同之处

+ 捕获组与引用
+ 局限性

# 十、Q&A
> Cool.
>
> Thank you.
>
> And see you all in, hopefully, less than maybe six years.
>
> We'll see.
>

# 零、碎碎念
开始看这门课之前我就知道，这门课肯定会学到很多新工具，会很有新鲜感，学起来会很爽😋
事实证明，学起来确实是很爽（虽然有的地方很有难度、心态有点崩，比如刚开始讲shell和各种命令

<br>

感觉这门课很多东西都很细啊
甚至我感觉我这个笔记都可以在工作的时候直接拿来当速查手册了哈哈

<br>

感觉这门课看下来收获最大的还是一些思想啊
具体内容肯定会忘的
不过那些思想可是真的会在脑子里待很久很久
比如说现用现查（`man` `--help`之类的），比如说不惧怕命令行（一开始我还担心命令行会不会有什么记忆上、心智上的负担来着）

<br>

有时候真觉得很喜欢这门课
讲课的是三位博士（好像吧
而且正好是刚出了2026版本的。而我就是在2026看的
整体给我一种很新很年轻的感觉

<br>

上课的小哥也说了，不必为记住而担心，讲义里有很多链接帮助记忆，重点是掌握core idea

<br>

有的时候真的好累
突然间要养成好多习惯
`ssh`之后要`tmux`
`vim`有那么多键位
刚才我去跟AI诉苦，它说
> 这些工具每一样都比你想象中更常用，但你现在可能还没到“频繁需要它们”的阶段。这门课只是提前把工具塞到你手里，告诉你“有这个，以后用得上”，但你不能指望靠听一遍就能熟练使用它们。

> “很多工具要等到你真的卡住的时候才会觉得“幸好学了””

大概吧。
万一真是很有价值的投资呢。

<br>

回头看看
这门课讲的真多啊

<br>

感觉越往后看越轻松呢
是我的错觉吗
还是真的后边内容少了
还是因为看到后边我的心浮躁了（
还是因为要放假了，我想赶在放暑假之前看完（
还是因为陌生的就跳过、熟悉的也跳过，就过得快了（

<br>

第八节是“代码之外”
真的学到了很多
很多事情和我自己想的并不一样……
这门课真的很有必要

<br>

哦我真的在写博客的时候，有意识地好好写了几句commit message
这门课真有用啊
我也是真的有收获

<br>

感觉我无论看什么课都越看越浮躁呢
看到最后就只想着看完了
比如最后一两节课的练习都做得明显没有一开始认真了

<br>

语雀怎么说有10497个字啊
我写了这么多吗
这么恐怖
😰

<br>

Your know what？
我刚看完，我就把前边都忘了
不过浏览了一下我自己写的笔记，似乎是还是有点记忆的
不过我也不会期望这记忆停留多久了
我只希望，会有一些思想之类的东西停留在我脑子，那就足够了
<br>

AI大人又要发言了

> 我的看法是： 你把一门很值得的课完整地过了一遍，并且留下了这份笔记。它不完美，也没有全部记住，但它的价值恰恰在于“你走过了一遍”，并且把其中你真正在乎的部分留在了记忆里。随着时间推移，你会发现那些“思想”会慢慢沉淀下来，成为你解决问题时的直觉。😄

