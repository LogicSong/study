<!--
 * @Author: songyipeng
 * @Date: 2022-08-19 09:29:58
-->

### 端口及进程相关命令

1. 查看端口的使用情况，或者说被谁占用：`netstat -anp | grep 8080`
2. 查看端口被哪个进程占用：`lsof -i :8080`
3. 根据进程号杀死进程：`kill -9 端口号`

### 接口测试命令

1. linux 发送 post 请求 json 参数测试接口:

```
curl -d 'info={"name":"tom","age":"32"}' http://123.12.12.12/rest/article/ood/updateStatus
```

2. 无参数调用接口:

```
wget http://123.12.12.12/rest/article/ood/updateStatus
```

3. SSH 到另一台服务器：`ssh appadmin/@123.12.12.12`

### 查看本机系统信息

1. 查看/etc/os-release文件中的信息，如`cat /etc/release`或`less /etc/release`等

### 安装程序

`yum install git`
`yum info git`