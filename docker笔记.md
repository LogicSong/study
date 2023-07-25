# docker学习笔记

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
$ docker run -it ubuntu bash

# 必须使用docker container kill 命令手动终止
$ docker kill [containID]

# 列出本机正在运行的容器
$ docker container ls
# 列出本机所有容器，包括终止运行的容器
$ docker container ls --all
# 终止运行的容器文件，依然会占据硬盘空间，可以使用命令删除。
$ docker container rm [containerID]

```

## 使用Dockerfile文件制作docker镜像

