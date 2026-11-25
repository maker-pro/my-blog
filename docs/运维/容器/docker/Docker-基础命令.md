---
title: "Docker 基础命令"
---

# Docker 基础命令

## 基础知识
 * 一个分层存储的文件，不是一个单一的文件
 * 一个软件环境
 * 一个镜像可以创建N个容器
 * 一种标准化的交付
 * 一个包含 Linux 内核而又精简的 Linux 操作系统


## 容器的命令
 * 创建容器常用的命令选项
![1791618670394.jpg][1]

 * 查看所有的容器
![1791618687400.jpg][2]

```shell
# docker ps [选项]
# -a 查看所有的容器，包含退出的
# -q 列出所有的容器ID
> docker ps -a
```
 * 启动一个已停止的容器
```
# docker start [容器ID]
> docker start 7dd6200f762d
```

* 重启容器
```
# docker restart [容器ID]
```

* 查看当前启动的镜像
```
> docker ps
```

* 停止容器的运行
```
# docker stop [容器ID]
> docker stop 17b6efe522be
```

* 删除容器（删除容器之前必须先停止容器的运行）
```
# docker rm [容器ID]
> docker rm 17b6efe522be
```

* 列出所有容器ID
```
> docker ps -aq
```

* 停止所有容器
```
> docker stop $(docker ps -aq)
```
* 删除所有容器
```
> docker rm $(docker ps -aq)
```
* 在运行的容器中执行命令
```
# docker exec [OPTIONS] CONTAINER COMMAND [ARG...]

# OPTIONS说明:
#    -d :分离模式: 在后台运行
#    -i :即使没有附加也保持STDIN 打开
#    -t :分配一个伪终端

# 实例:
# 1、在容器 web 中以交互模式执行容器内 /root/update_redis.sh 脚本
> docker exec -it web /bin/sh /root/update_redis.sh
# 2、在容器 web 中开启一个交互模式的终端
> docker exec -i -t  web /bin/bash
# 3、也可以通过 容器ID 进入容器， docker exec -it [容器ID] /bin/bash
> docker exec -it 7dd6200f762d /bin/bash
```

## 镜像的命令
* 查看创建的镜像
![1791618711993.jpg][3]

```
> docker images

# 输出
REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
joewng/xiaopi_web   v1        100396cb95e2   25 minutes ago   1.97GB
2233466866/lnmp     latest    54f295aa6702   24 hours ago     2.66GB
hello-world         latest    feb5d9fea6a5   3 months ago     13.3kB
centos              centos7   eeb6ee3f44bd   3 months ago     204MB
centos              latest    5d0da3dc9764   3 months ago     231MB

# 每列的说明
REPOSITORY：表示镜像的仓库源
TAG：镜像的标签（tagname）
IMAGE ID：镜像ID
CREATED：镜像创建时间
SIZE：镜像大小
```

* 查找现有的镜像(网上现在已经有的，非自己创建的) docker search [镜像名称]
```
> docker search centos
# 输出
NAME                              DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
centos                            The official build of CentOS.                   6949      [OK]       
ansible/centos7-ansible           Ansible on Centos7                              135                  [OK]
consol/centos-xfce-vnc            Centos container with "headless" VNC session…   132                  [OK]
jdeathe/centos-ssh                OpenSSH / Supervisor / EPEL/IUS/SCL Repos - …   121                  [OK]
centos/systemd                    systemd enabled base container.                 105                  [OK]

# 每列的说明
NAME: 镜像仓库源的名称
DESCRIPTION: 镜像的描述
OFFICIAL: 是否 docker 官方发布
stars: 类似 Github 里面的 star，表示点赞、喜欢的意思。
AUTOMATED: 自动构建。
```

* 拉取镜像
```
> docker pull centos
```

* 启动镜像（运行容器）
```
> docker run -d -p 80:80 -p 443:443 -p 8888:8888 -p 5000:5000 --name web --privileged=true centos /usr/sbin/init
# centos 这是指用 centos 版本镜像为基础来启动容器, 如果你不指定一个镜像的版本标签，例如你只使用 ubuntu，docker 将默认使用 ubuntu:latest 镜像
# -d -p -name -e
    -P(大 p)	将容器内部使用的网络端口随机映射到我们使用的主机上（主机的端口范围 49000~49900）
    -p			本机端口和容器启动端口映射。 [-p 端口1|端口2]: 端口1 是本机端口，端口2 是docker容器的端口
    [-p hostPort:containerPort]: 映射所有接口地址, 例如 [-p 5000:5000]: 将本地的 5000 端口映射到容器的 5000 端口
    [-p ip:hostPort:containerPort]: 映射指定地址的指定端口, 例如 [-p 127.0.0.1:5000:5000]: 将本地 127.0.0.1 的 5000 端口 映射到容器的 5000 端口
    [-p ip::containerPort]: 映射指定地址的任意端口, 例如 [127.0.0.1::5000]: 将本地 127.0.0.1 任意的端口（本地主机会自动分配一个端口）映射到容器的 5000 端口
    [-p 127.0.0.1:5000:5000/udp]: 还可以使用 udp 标记来指定 udp 端口
    -d			后台运行
    --name		容器名称
    -e			镜像启动参数
```

* 删除镜像
```
# docker rmi [镜像ID]
> docker rmi d633bd4f9d5c
```
* 所有镜像ID
```
> docker images -q
```
* 删除所有镜像
```
> docker rmi $(docker images -q)
```
* 保存一个或者多个镜像到一个 tar 文件
```
> docker save redis -o redis.tar
```
* 加载镜像来自 tar 归档或者标准输入
```
> docker load -i redis.tar 
```
##常用的管理命令
* 列出容器
```
# ls
> docker container ls
# 最新创建的容器
> docker ps -l
```
* 查看一个或者多个容器详细信息
```
# docker inspect [容器ID 或 容器Name]
> docker inspect 4fd3fa6cc02b
```
* 在运行容器中执行命令
```
# docker exec -it [容器ID 或 容器Name] [命令]

# 进入容器执行
> docker exec -it web /bin/bash
# 不进入容器执行
> docker exec web ls
```

* 创建一个来自容器的新镜像
```
# commit
> docker commit web_3 web:v3
```
* 拷贝文件或者文件夹到一个容器
```
# docker cp [文件名] [容器名]:[容器中的路径]
> docker cp original-ks.cfg web_3:/
```
* 获取一个容器日志
```
# docker logs [容器名]
> docker logs web_3
```
* 列出或者指定容器端口映射
```
# docker port [容器名]
> docker port web
```
* 显示一个容器运行的进程
```
# docker top [容器名]
> docker top web
```
* 显示容器资源使用统计
```
# docker stats [容器名] [--no-stream]
> docker stats web
```
* 停止/启动/重启一个或多个容器
```
# docker stop/start/restart [容器名]
> docker stop web    # 关闭
> docker start web   # 启动
> docker restart web # 重启
```
* 删除一个或者多个容器
```
# docker rm [选项] [容器ID]
# 选项:
    # -f 强制删除
    # -a 所有的 (不管有没有退出)
> docker rm 9f5d3ae32262

# 强制删除所有的容器
> docker rm -f $(docker ps -q)
```
* 移除已经停止的容器
```
> docker container prune
```
* 容器数据持久化
 * Docker 提供了 2 种方式将数据从宿主主机挂载到容器中：
  * volumes： Docker管理宿主主机文件系统的一部分(/var/lib/docker/volumes)
  * bind mounts: 将宿主主机上的任意位置的文件或目录挂载到容器中
 * 实例：
  * volumes实例
    * 1、创建数据卷
```
> docker volume create nginx-vol
> docker volume ls
> docker volume inspect nginx-vol
```
    * 2、使用数据卷
```
> docker run -d --name=box --mount src=nginx-vol,dst=/app/box nginx
```
* bind mounts实例（推荐）

  * 1、挂载宿主主机目录到容器
```
> docker run -d --name=box -p 91:80 -v /app/box/:/usr/share/nginx/html nginx
# /app/box/ 是宿主机上的地址
# /usr/share/nginx/html 是容器里面的地址
# 宿主机和容器上面文件是对应的，当修改一边的文件内容，另一边会同时更新
```

* 容器网络
> veth pair: 成对出现的一种虚拟网络设备，数据从一端进，从另一端出。用以解决网络命名空间之间的间隔。
> docker0: 网桥是一个二层网络设备，通过网桥可以将 Linux 支持的不同的端口连接起来，并实现类似交换机那样的多对多的通信。
 * 名词解释：
   ** 1、DNAT：目标网络地址转换
   ** 2、SNAT：源地址转换

 * 外部访问容器
![1791618726894.jpg][4]
```
> iptables -t nat -vnL DOCKER
```
 * 容器访问外部

![1791618733535.jpg][5]
```
> iptables -t nat -vnL POSTROUTING
```

## Dockerfile常用命令
```
FROM: 构建新镜像是基于那个镜像
LABEL: 标签RUN构建镜像时运行的 Shell 命令
COPY: 拷贝文件或目录到镜像中
ADD: 解压压缩包并拷贝
ENV: 设置环境变量
USER: 为RUN、CMD 和 ENTRYPOINT 执行命令指定运行用户
EXPOSE: 声明容器运行的服务端口
WORKDIR: 为RUN、CMD、ENTRYPOINT、COPY 和 ADD设置工作目录
CMD: 运行容器时默认执行，如果有多个 CMD 指令，最后一个生效
```
* 实例：
```
> cd ~
> mkdir Dockerfile
> cd Dockerfile
> vim Dockerfile
# 在 Dockerfile 中添加一下内容，并保存
    FROM centos:7
    RUN yum install epel-release -y && \
        yum install nginx -y
    
    CMD ["nginx", "-g", "daemon off;"]

# 最后创建镜像
> docker build -t nginx:v1 .
```

* docker build 指令
```
# Usage:  docker build [OPTIONS] PATH | URL | - [flags]
# Options
# -t, --tag list 		# 镜像名称
# -f, --file string 	# 指定 Dockerfile 文件位置

# 实例
> docker build -t nginx:v1 . # "." 代表当前目录
> docker build -t nginx:v1 .
> docker build -t nginx:v1 -f /path/Docker /path
> docker build -t nginx:v1 http://www.example.com/Dockerfile
```

* 创建一个Docker网络
```
docker network create networkName
```
* 把容器接入创建的网络里面
```
docker network connect networkName dockerName
```
* 查看Docker网络
```
docker network inspect networkName
```

  [1]: /blog-images/f1952c07b8171c.jpg
  [2]: /blog-images/42b5fd8184936a.jpg
  [3]: /blog-images/1026248df8a496.jpg
  [4]: /blog-images/6d55738cde79ec.jpg
  [5]: /blog-images/dc7bf72c4a7594.jpg
