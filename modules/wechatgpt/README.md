# wechat-ChatGPT
最近chatGPT异常火爆，想到将其接入到个人微信是件比较有趣的事，所以有了这个项目。项目基于[openwechat](https://github.com/eatmoreapple/openwechat)
开发
###目前实现了以下功能
 + 群聊@回复
 + 私聊回复
 + 自动通过回复
 
# 注册openai
chatGPT注册可以参考[这里](https://mp.weixin.qq.com/s/GfBn1BW02PJSw7gDHJcLlw)

# 安装使用
所以大致需要准备的东西是:

1、CentOS 7操作系统的服务器一台

2、gpt账号的apikey一个

一. CentOS安装GoLang环境
因为是go语言项目，所以需要安装go环境。

1、下载文件
```shell
wget https://golang.google.cn/dl/go1.17.linux-amd64.tar.gz
```

2、解压文件
```shell
tar -zxf go1.17.linux-amd64.tar.gz -C /home/local
```

3、配置环境变量，vim指令编辑（不熟悉vim的话可以直接去修改文件）
```shell
vim /etc/profile
```

4、在/etc/profile文件末尾添加以下配置，按ESC键，输入 :wq保存并退出编辑
```shell
#golang config
export GOROOT=/home/local/go 
export GOPATH=/home/gopath
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
```

5、创建 /home/gopath文件夹
```shell
mkdir /home/gopath
```

6、使变量配置生效，并查看golang的版本
```shell
source /etc/profile
go version
```

7、设置代理环境变量，再拉取golang.org的时候就不需要墙了
```shell
go env -w GOPROXY=https://goproxy.cn,direct
```

8、查看go环境
```shell
go env
```

9、切换到hello目录，创建一个hello.go
```shell
cd /home/hello
vim hello.go
```

10、复制粘贴helloworld代码，按ESC键，输入 :wq保存并退出编辑
```shell
package main  
import "fmt"  
func main() {  
    fmt.Printf("Hello, world!\n")  
}
```

11、运行代码
```shell
go run hello.go
```
如果能够成功打印，就说明golang环境没问题了。

二.ChatGPT注册及使用验证信息API key

1、ChatGPT注册参看[这里](https://mp.weixin.qq.com/s/GfBn1BW02PJSw7gDHJcLlw)

2、API Key获取
在浏览器中输入 https://beta.openai.com/docs/quickstart/getting-started ，点击“Create API Key”。

填写你的 API Key 名称，然后点击“Create”。

复制你的 API Key，你就可以使用 OpenAI 的 API 了。

三. wechat-ChatGPT拉取和部署
1、拉取wechat-ChatGPT并且进入目录然后拉取依赖包
```shell
git clone git@github.com:zhongjyuan/wechat-ChatGPT.git
cd wechat-ChatGPT
go mod tidy
```

2、复制配置文件
```shell
cp config.dev.json config.json
```

3、修改api_key: 打开/home/wechat-CPT目录下的config.json文件，然后把里面的api_key改成自己的，也可以用vim编辑修改

4、运行
```shell
go run main.go
```
程序运行之后，会在控制台显示一个链接，你可以直接点击那个链接，在浏览器中打开，会出现一个二维码，用微信扫码登录即可。

然后你就可以让别人给你发消息试试，如果能自动回复说明没问题了，在群聊里的话得@才行，如果有问题那就看一下终端里的日志输出。

四. 打包和运行可执行程序
1、进入目录
```shell
cd /home/wechat-ChatGPT
```

2、打包可执行程序
```shell
go build main.go
```

3、目录下生成一个main文件，我们让它后台执行，并且把日志输出到当前目录下的console.log文件中
```shell
nohup ./main > console.log 2>&1 &
```
4、打开/home/wechat-ChatGPT目录下的console.log文件，找到里面的链接然后在浏览器中打开，微信扫码登录

五. 停止程序
1、查找当前运行的进程：
```shell
ps ax
```
2、会找到一个./main的进程，然后看一下前面的进程PID，杀死它：
```shell
sudo kill 进程id
```
