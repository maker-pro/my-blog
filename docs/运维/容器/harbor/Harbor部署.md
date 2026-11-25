---
title: "Harbor部署"
---

# Harbor部署

* 环境配置
 * 服务器硬件配置
   * 最低要求：CPU 2核 / 内存4G / 硬盘40GB
   * 推荐：CPU 4核 / 内存 8G / 硬盘160GB
 * 软件
   * Docker CE 17.06版本+
   * Docker Compose 1.18版本+

* 下载安装
 * 下载Harbor(harbor-offline-installer-v2.4.1.tgz )地址 ![Harbor【Git】](/blog-images/7be8811c79f189.png)，下载 Docker Compose(docker-compose-linux-x86_64) 地址 [Docker Compose【Git】](https://github.com/docker/compose/releases)
 * 部署 Harbor HTTP
```
docker-compose常用的命令
docker-compose up -d: 启动所有的容器
docker-compose ps: 查看启动的容器
docker-compose stop: 关闭所有的容器
```

```
# 上传 docker compose 并移动到 /usr/bin/目录下, 并添加执行权限, 最后就可以使用 docker-compose 命令了
> mv docker-compose-linux-x86_64 /usr/bin/docker-compose
> chmod +x /usr/bin/docker-compose

# 安装 harbor
> tar zxvf harbor-offline-installer-v2.4.1.tgz
> cd harbor
# 拷贝配置文件并编辑
> cp harbor.yml.tmpl harbor.yml
> vim harbor.yml
# 编辑 harbor.yml
    hostname: 192.168.31.155 # 这里是自己的域名 或者 Ip地址

    # http related config
    http:
  		# port for http, default is 80. If https enabled, this port will redirect to https port
  		port: 80

    # https related config
    # 因为我现在不用https访问, 就把https配置注释
    # https:
  		# https port for harbor, default is 443
  		# port: 443
  		# The path of cert and key files for nginx
  		# certificate: /your/certificate/path
  		# private_key: /your/private/key/path
# 编辑 harbor.yml 结束保存

# 保存完成后在harbor文件夹中执行
> ./prepare
> ./install.sh

# 执行 docker-compose ps 可以查看 harbor 启动的容器
> docker-compose ps
```

 * 安装成功测试

```
username: admin
password: Harbor12345
```

   * 1、登录
![1791628432602.jpg](/blog-images/73dc348c836701.jpg)
   * 2、主页
![1791628440717.jpg](/blog-images/f4c3920047636a.jpg)


## Harbor基本使用
 * 给本地的镜像打标签，远程的地址可以在 Harbor 控制台获取
![1791628447826.jpg](/blog-images/e49b0bc59cb76e.jpg)

```
> docker tag web:v3 192.168.31.155/library/web:v3 # 执行完用docker images就可以看到了192.168.31.155/library/web这个镜像了
> docker push 192.168.31.155/library/web:v3 # 把本地镜像推到 Harbor 上面
```
* 在本地配置可信任（编辑daemon.json文件完成，必须重启docker）

```
# 此时推送192.168.31.155/library/web:v3镜像会报443错误, docker push 192.168.31.155/library/web:v3
# 解决

> vim /etc/docker/daemon.json
# 编辑 /etc/docker/daemon.json
    {
        "registry-mirrors": ["https://mirrors.ustc.edu.cn"],
        "insecure-registries": ["192.168.31.155"] # 192.168.31.155 是自己配置的 harbor 服务器地址, 可以配置多个
    }
# 编辑 /etc/docker/daemon.json 结束

# 编辑完 /etc/docker/daemon.json 必须重启docker
> systemctl restart docker

# 查看配置信息，可以在Insecure Registries:中看到配置的 ip:192.168.31.155 
> docker info
```
* 登录harbor

![1791628600118.jpg](/blog-images/64515f385a5ad4.jpg)
```
> docker login 192.168.31.155
# 输入用户名、密码
# Username: admin
# Password: Harbor12345
```
* 4、推送本地镜像到 harbor
```
> docker push 192.168.31.155/library/web:v3
```
推送成功就可以在 Harbor 控制台看到推送的项目
![1791628713817.jpg](/blog-images/dbba2a1fa6f759.jpg)
![1791628456690.jpg](/blog-images/1d971d62609223.jpg)
