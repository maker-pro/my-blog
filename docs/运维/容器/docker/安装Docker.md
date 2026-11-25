---
title: "安装Docker"
---

# 安装Docker

* 参考：
 * [Docker 教程](https://www.runoob.com/docker/docker-tutorial.html)
 * [博客园 cnhkzyy [docker安装的环境要求]](https://www.cnblogs.com/my_captain/p/12759973.html)
 * [csdn 逆袭的小学生 [docker入门(利用docker部署web应用)]](https://blog.csdn.net/q610376681/article/details/90483576?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522164059675116780366598636%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=164059675116780366598636&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-90483576.pc_search_all_es&utm_term=docker&spm=1018.2226.3001.4187)
 * [csdn yuan_cheerleaders [Docker安装详细步骤（CentOS环境）]](https://blog.csdn.net/yuan_cheerleaders/article/details/51480077)

## Docker安装环境的要求
* 操作系统: 推荐使用Ubuntu、Debian和RHEL（Centos、Fedora等），在Windows和OS X中也可以使用，但要安装Docker Toolbox工具
* 内核: 推荐3.8及以上的内核(CentOS时内核必不小于3.10), 虽然只是要求内核>=2.6, 但是虽然一些老版本的也能运行, 但运行结果会有很大的不同, 内核必须支持并开启cgroup和命名空间namespace功能
* 驱动: 内核必须支持一种合适的存储驱动，例如：Device Mapper、AUFS、vfs、btrfs、ZFS，默认存储驱动通常是Device Mapper或AUFS
* 架构: 必须是64位CPU架构的计算机(x86_64和amd64), Docker目前不支持32位CPU

* Centos安装
 * Docker 要求 CentOS 系统的内核版本高于 3.10,查看本页面的前提条件来验证你的CentOS 版本是否支持 Docker 。
  * 通过 uname -r 命令查看你当前的内核版本


 * 如果安装过请先卸载
 
```
yum remove docker \
           docker-client \
           docker-client-latest \
           docker-common \
           docker-latest \
           docker-latest-logrotate \
           docker-logrotate \
           docker-engine
```

 * 安装依赖设置yum仓库

```
# 安装依赖
yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

# 设置仓库
# 1、官方仓库(国内访问比较慢)
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
# 2、国内源, 速度更快, 推荐
yum-config-manager \
    --add-repo \
    https://mirrors.ustc.edu.cn/docker-ce/linux/centos/docker-ce.repo
# 3、阿里云仓库
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 4、清华大学仓库
yum-config-manager \
    --add-repo \
    https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/docker-ce.repo
```

  * Docker 镜像加速
国内从 DockerHub 拉取镜像有时会遇到困难，此时可以配置镜像加速器。Docker 官方和国内很多云服务商都提供了国内加速器服务，例如:
    * 科大镜像：https://docker.mirrors.ustc.edu.cn
    * 网易：https://hub-mirror.c.163.com
    * 七牛云加速器：https://reg-mirror.qiniu.com

编辑 `/etc/docker/daemon.json`， 如果没有这个文件就创建，在文件内部写入下面内容，编辑保存后记得重启 Docker `systemctl restart docker`

```
{
	"registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
```

  * 安装 Docker Engine-Community
  
```
yum install docker-ce docker-ce-cli containerd.io
```

  * Docker 启动、关闭

```
# 启动
systemctl start docker
# 开启启动
systemctl enable docker

# 查看版本
docker version
# 测试是否安装成功(输出：Unable to find image 'hello-world:latest' locally... 代表安装成功)
docker run hello-world
```


  * 卸载 docker
  
```
# 删除安装包
yum remove docker-ce
# 删除镜像、容器、配置文件等内容
rm -rf /var/lib/docker
```
