# docker学习笔记

## 基本概念

1. 镜像。Docker可以把应用程序及其依赖打包到镜像中，镜像是以二进制文件的形式存在，通过镜像文件可以生成Docker容器，类似面向对象中的类和实例的关系，镜像就是容器的模板。
2. 容器。容器也是一个文件，最终运行的就是一个个的Docker容器（由镜像生成），需要注意，容器运行停止后并不会删除该容器文件，它依然存在于硬盘中。

## 安装

1. 删除旧版本（如果有）`sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine`
2. 安装依赖包 `sudo yum install -y yum-utils device-mapper-persistent-data lvm2`
3. 添加 Docker 官方仓库 `sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo`
4. 安装 Docker 引擎 `sudo yum install -y docker-ce`
5. 启动 Docker 服务并设置开机自启 
```sh
sudo systemctl start docker
sudo systemctl enable docker
```
6. 验证 Docker 是否成功安装 `docker --version`


## 镜像和容器的基本操作

```bash
# 列出本机的所有 image 文件。
$ docker image ls

# 删除 image 文件
$ docker image rm [imageName]

# 从仓库中拉取镜像，
$ docker image pull library/hello-world
# Docker 官方提供的 image 文件，都放在library组里面，所以它的是默认组，可以省略。
$ docker image pull hello-world

# 从 image 文件，生成一个正在运行的容器实例，可以省略container
$ docker container run hello-world

# 有些容器不会自动退出，比如下面，-it参数是指shell映射
$ docker run -d -it ubuntu bash # -d表示守护进程方式启动

# 必须使用docker container kill 命令手动终止
$ docker kill [containID]

# 列出本机正在运行的容器
$ docker container ls
# 列出本机所有容器，包括终止运行的容器
$ docker container ls --all
# 终止运行的容器文件，依然会占据硬盘空间，可以使用命令删除。
$ docker container rm [containerID]
# 重复使用容器
$ docker container start [containerID]
# 查看容器里面 Shell 的标准输出，如果docker run命令运行容器的时候，没有使用-it参数，就要用这个命令查看输出。
$ docker container logs [containerID]
# docker container exec命令用于进入一个正在运行的 docker 容器。如果docker run命令运行容器的时候，没有使用-it参数，就要用这个命令进入容器。一旦进入了容器，就可以在容器的 Shell 执行命令了。
$ docker container exec -it [containerID] /bin/bash

# 查看容器状态
$ docker ps -a

# 目录挂载
$ docker run -d -v /host/path:/container/path image_name # 在启动时使用-v 主机目录:容器内目录 进行挂载
$ docker run -d -v /host/path1:/container/path1 image_name -v /host/path2:/container/path2 # 可以同时挂载多个
```

## 使用Dockerfile文件制作docker镜像

### Dockerfile文件示例

```docker
FROM node:8.4 # 该 image 文件继承官方的 node image，冒号表示标签，这里标签是8.4，即8.4版本的 node。
COPY . /app # 将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录。
WORKDIR /app # 指定接下来的工作路径为/app。
RUN ["npm", "install"] # 在/app目录下，运行npm install命令安装依赖。注意，安装后所有的依赖，都将打包进入 image 文件。
EXPOSE 3000/tcp # 将容器 3000 端口暴露出来， 允许外部连接这个端口。
```

### 创建image文件

有了 Dockerfile 文件以后，就可以使用docker image build命令创建 image 文件了。

```bash
# -t参数用来指定 image 文件的名字，后面还可以用冒号指定标签。如果不指定，默认的标签就是latest。最后的那个点表示 Dockerfile 文件所在的路径
$ docker image build -t koa-demo .
# 或者
$ docker image build -t koa-demo:0.0.1 .
```

### 生成容器

```bash
$ docker container run -p 8000:3000 -it koa-demo /bin/bash
# 或者
$ docker container run -p 8000:3000 -it koa-demo:0.0.1 /bin/bash

# -p参数：容器的 3000 端口映射到本机的 8000 端口。
# -it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。
# koa-demo:0.0.1：image 文件的名字（如果有标签，还需要提供标签，默认是 latest 标签）。
# /bin/bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 Shell。
```

### CMD命令

上一节的例子里面，容器启动以后，需要手动输入命令node demos/01.js。我们可以把这个命令写在 Dockerfile 里面，这样容器启动以后，这个命令就已经执行了，不用再手动输入了。

```bash
FROM node:8.4
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3000
CMD node demos/01.js
```
上面的 Dockerfile 里面，多了最后一行CMD node demos/01.js，它表示容器启动后自动执行node demos/01.js。

RUN命令与CMD命令的区别: 简单说，RUN命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件；CMD命令则是在容器启动后执行。另外，一个 Dockerfile 可以包含多个RUN命令，但是只能有一个CMD命令。
注意，指定了CMD命令以后，docker container run命令就不能附加命令了（比如前面的/bin/bash），否则它会覆盖CMD命令。现在，启动容器可以使用下面的命令。

```bash
$ docker container run --rm -p 8000:3000 -it koa-demo:0.0.1
```


## 发布image文件

容器运行成功后，就确认了 image 文件的有效性。这时，我们就可以考虑把 image 文件分享到网上，让其他人使用。

首先，去 hub.docker.com 或 cloud.docker.com 注册一个账户。然后，用下面的命令登录。

```bash
$ docker login
```

接着，为本地的 image 标注用户名和版本。

```bash
$ docker image tag [imageName] [username]/[repository]:[tag]
# 实例
$ docker image tag koa-demos:0.0.1 ruanyf/koa-demos:0.0.1
```

也可以不标注用户名，重新构建一下 image 文件。
```bash
$ docker image build -t [username]/[repository]:[tag] .
```

最后，发布 image 文件。

```bash
$ docker image push [username]/[repository]:[tag]
```


## docker compose

### 安装

#### 下载二进制文件
https://github.com/docker/compose/releases

#### 移动到/usr/local/bin/目录下，并重命名为docker-compose

#### 设置可执行权限

```bash
chmod +x /usr/local/bin/docker-compose
```

#### 验证
```bash
docker-compose --version
```

### 应用

#### 配置文件
以下是一个单机版的kafka的配置文件，其中kafka依赖于zookeeper

`zk-single-kafka-single.yml`
```yml
version: '2.1'

services:
  zoo1:
    image: zookeeper:3.4.9
    hostname: zoo1
    ports:
      - "2181:2181"
    environment:
      ZOO_MY_ID: 1
      ZOO_PORT: 2181
      ZOO_SERVERS: server.1=zoo1:2888:3888
    volumes:
      - ./zk-single-kafka-single/zoo1/data:/data
      - ./zk-single-kafka-single/zoo1/datalog:/datalog

  kafka1:
    image: confluentinc/cp-kafka:5.3.1
    hostname: kafka1
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_LISTENERS: LISTENER_DOCKER_INTERNAL://kafka1:19092,LISTENER_DOCKER_EXTERNAL://${DOCKER_HOST_IP:-127.0.0.1}:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: LISTENER_DOCKER_INTERNAL:PLAINTEXT,LISTENER_DOCKER_EXTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: LISTENER_DOCKER_INTERNAL
      KAFKA_ZOOKEEPER_CONNECT: "zoo1:2181"
      KAFKA_BROKER_ID: 1
      KAFKA_LOG4J_LOGGERS: "kafka.controller=INFO,kafka.producer.async.DefaultEventHandler=INFO,state.change.logger=INFO"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

    volumes:
      - ./zk-single-kafka-single/kafka1/data:/var/lib/kafka/data
    depends_on:
      - zoo1

```

#### 运行
`docker-compose -f zk-single-kafka-single.yml up` //完成环境搭建(会自动下载并运行一个 zookeeper 和 kafka )

#### 停止
`docker-compose -f zk-single-kafka-single.yml down`



## docker镜像无法拉取

配置mirrors

在/etc/docker目录下的daemon.json文件新增以下内容(没有该文件则新建)

```json
{
    "registry-mirrors": [
        "https://do.nark.eu.org",
        "https://dc.j8.work",
        "https://docker.m.daocloud.io",
        "https://dockerproxy.com",
        "https://docker.mirrors.ustc.edu.cn",
        "https://docker.nju.edu.cn",
        "https://6k0ibwjk.mirror.aliyuncs.com"
    ]
}
```