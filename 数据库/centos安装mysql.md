<!--
 * @Author: songyipeng
 * @Date: 2022-06-23 16:48:25
-->

# CentOs 安装 Mysql

## 版本

- centos: 8.2（腾讯云-轻量应用服务器）
- mysql: 5.7

## 步骤

### 下载并安装 MySQL 官方的 Yum Repository

```shell
[root@localhost ~]# wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
```

使用上面的命令就直接下载了安装用的 Yum Repository，大概 25KB 的样子，然后就可以直接 yum 安装了。

```shell
[root@localhost ~]# yum -y install mysql57-community-release-el7-10.noarch.rpm
```

### 安装 MySQL 服务器

```shell
[root@localhost ~]# yum -y install mysql-community-server
```

此处碰到报错：All matches were filtered out by modular filtering for argument: mysql-community-server
解决方法：先执行 `yum module disable mysql` 再执行 `yum -y install mysql-community-server`

再次碰到报错：Mysql 安装失败-GPG 验证不通过
解决方法：在 yum install 版本后面加上 --nogpgcheck，即可绕过 GPG 验证成功安装。
`yum -y install mysql-community-server --nogpgcheck`

### mysql 数据库设置

#### 启动数据库：

`[root@localhost ~]# systemctl start mysqld.service`

#### 查看 MySQL 运行状态:

`[root@localhost ~]# systemctl status mysqld.service`

#### 此时 MySQL 已经开始正常运行，不过要想进入 MySQL 还得先找出此时 root 用户的密码，通过如下命令可以在日志文件中找出密码：

`[root@localhost ~]# grep "password" /var/log/mysqld.log`

#### 进入数据库：

`[root@localhost ~]# mysql -uroot -p`
输入初始密码，此时不能做任何事情，因为 MySQL 默认必须修改密码之后才能操作数据库：
`mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'new password';`
其中‘new password’替换成你要设置的密码，注意:密码设置必须要大小写字母数字和特殊符号（,/';:等）,不然不能配置成功

### 开启 mysql 的远程访问

执行以下命令开启远程访问限制（注意：下面命令开启的 IP 是 192.168.0.1，如要开启所有的，用%代替 IP）

```sql
mysql> grant all privileges on *.* to 'root'@'%' identified by 'password' with grant option;
```

刷新权限：`mysql> flush privileges;`
退出数据库：`mysql> exit;`

### 为 firewalld 添加开放端口

添加 mysql 端口 3306

```shell
[root@localhost ~]# firewall-cmd --zone=public --add-port=3306/tcp --permanent
```

通过控制台操作：控制台-->防火墙-->添加规则

> 参考链接 http://events.jianshu.io/p/65527f186bd7
