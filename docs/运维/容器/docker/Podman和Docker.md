---
title: "Podman和Docker"
---

# Podman和Docker

## 1.参考
* a.[InfoQ-docker 与 podman 的故事：一个方兴未艾，一个异军突起](https://xie.infoq.cn/article/a7254c5d64fcb3be8d6822415)
* b.[博客园-Docker 与 Podman 容器管理的比较](https://www.cnblogs.com/ittranslator/p/14076241.html)
* c.[简书-docker vs podman](https://www.jianshu.com/p/d80aa43ccf94)

## 2.Podman
Podman（Pod Manager）是一个由 RedHat 公司推出的容器管理工具，它的定位就是 docker 的替代品，在使用上与 docker 的体验类似。podman 源于 CRI-O 项目，可以直接访问 OCI 的实现（如 runC），流程比 docker 要短。

## 3.Podman和Docker区别
![1791631058672.jpg](/blog-images/a5a6035f288c85.jpg)
Dockers 在实现 CRI 的时候，它需要一个守护进程，其次需要以 root 运行，因此这也带来了安全隐患，Docker 利用一个守护进程（该守护进程是一个持久的后台进程）来处理主机上所有容器的管理职责。Docker 依赖于客户端/服务端（C/S）架构，守护进程扮演着服务端的角色，而客户端通过命令行界面（CLI）进行通信。
Podman 不需要守护程序，也不需要 root 用户运行，因此它必须在 Linux OS 上运行，Podman 可以 root 模式运行，也可以用 非 root 模式运行。从逻辑架构上，Podman 比 docker 更加合理。在 docker 的运行体系中，需要多个 daemon 才能调用到 OCI 的实现 RunC。
Docker 使用本机 Windows 守护进程就可以很好地运行 Windows 或基于 Linux 的镜像。Podman 需要 Windows Subsystem for Linux 版本2（WSL2）才能正常运行。 因此，管理员们必须有2020年5月以后的 Windows 10 更新才能开始使用 Podman，因为这是第一个将 WSL2 作为更新的一部分的发行版。
* a.安全
Docker 与 Podman 之间的一个重大区别涉及到安全问题。 Docker 守护进程需要 root 权限，这在向用户提供 root 权限时带来了安全挑战。 这也意味着配置不当的 Docker 容器可以无限制地访问主机文件系统。管理员可以通过遵循一些基本的最佳实践来防止这种情况发生，比如仅使用来自受信任的供应商提供的容器镜像，但这种可能性仍然存在。
但是，管理员们使用 Podman 可以以非特权用户启动容器。这就使得 Podman 在锁定环境场景中具有了超越 Docker 的优势。 话虽如此，管理员们将无法以非特权用户身份在主机系统上执行任何需要 root 权限的命令。这包括映射主机上低于 1024 的任何特权端口号，以及默认的 HTTP 端口号 80。
此外，Docker 和 Podman 都使用 CLI 作为主要管理界面。但是，Docker 使用 REST API 终端与守护进程进行通信，且较旧的版本使用绑定到本机 IP 地址的 TCP socket 通信。这为跨站伪造利用提供了一个潜在的攻击面。Docker 在 0.5.2 版本中通过引入 UNIX socket 解决了这个漏洞（管理员可以使用传统的 UNIX 权限进行控制，以限制访问）。考虑到 Podman 不依赖守护进程，因此不易受到此类攻击的影响。
* b.容器编排
在容器编排方面，Kubernetes 已经成为占据主导地位的参与者。VMware 已采用 Kubernetes 作为 VM 以及连接到运行中的容器的所有其他设备的主要管理平台。 Kubernetes 使用术语 pod 来定义共享某些资源的容器集合。Podman 通过实现 pod 命令，将多个容器作为一个实体进行管理，从而支持相同的概念。
同样，Docker 为容器编排提供了多个选项。Docker Swarm 是 Docker 维护的用于管理集群的本地工具。Docker 还与 Kubernetes 集成得很好，这是大多数开发团队的主流选择。 对于 Windows 部署，管理员可以选择在安装过程中启用 Kubernetes，从而可以从管理员的台式机或笔记本电脑直接访问 Kubernetes 命令。
更进一步来说，管理员可以围绕持续集成和持续部署（CI/CD）模型构建他们的应用程序，在该模型中，开发和测试工作可以基于一些简单的配置文件在任何地方进行。当管理员准备将发布推送到生产环境时，只需执行几个额外的步骤即可更改部署目标。
Podman 和 Docker 都符合 OCI 镜像标准，但仅就安全特性而言，Podman 是值得一试的。Podman 还提供了本地命令来支持 pod 的构建和测试，从而着眼于部署到一个运行 Kubernetes 的生产系统中。
## 4.名词解释
* a.OCI
OCI (Open Container Initiative)，是一个轻量级，开放的治理结构（项目）。在 Linux 基金会的支持下成立，致力于围绕容器格式和运行时创建开放的行业标准。
OCI 项目由 Docker、CoreOS 和容器行业中的其它领导者在 2015 年 6 月的时候启动，OCI 的技术委员会成员包括 Red Hat、Microsoft、Docker、Cruise、IBM、Google、Red Hat 和 SUSE 等。
* b.CRI
CRI（Container Runtime Interface）是 Kubernetes v1.5 引入的容器运行时接口，它将 Kubelet 与容器运行时解耦，将原来完全面向 Pod 级别的内部接口拆分成面向 Sandbox 和 Container 的 gRPC 接口，并将镜像管理和容器管理分离到不同的服务。
