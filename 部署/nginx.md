

# 安装

```
yum install nginx
```

查看安装在哪个目录
```
cd /
find -name nginx
```

启动nginx
```
systemctl start nginx
```

查看配置文件
```
ps aux | grep nginx
```
可以看到在程序安装在/usr/sbin/nginx

查看配置文件位置
```
nginx -t
```
可以看到位于/etc/nginx/nginx.conf


# 开启SSL

## 申请证书：阿里云ssl证书申请后上传至云服务器（免费版3个月）或者使用openssl生成
## 配置nginx

server {
    listen  443 ssl;
    server_name     _;
    ssl_certificate "/root/ssl.crt";
    ssl_certificate_key "/root/ssl.key";
    location /api {
        proxy_connect_timeout       300; # 上传文件
        proxy_send_timeout          300;
        proxy_read_timeout          300;
        send_timeout                300;
        pass_proxy  http://localhost:3001/
    }
}

## 重启
`nginx -s reload`