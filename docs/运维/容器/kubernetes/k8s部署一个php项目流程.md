---
title: "k8s部署一个php项目流程"
---

# k8s部署一个php项目流程

> 项目说明，测试项目是商城网站
> 使用 php + html搭建

## 1、在项目中创建 `Dockerfile` 文件
![39dc6016-45f9-40ba-818b-9d53e924770a.png](/blog-images/8caec549588aca.png)

Dockerfile 文件内容如下:

```

# 选择基础镜像 php:8.3-apache
FROM php:8.3-apache

# 安装 PHP 数据库扩展
RUN docker-php-ext-install pdo pdo_mysql

# 设置 Apache 网站根目录
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# 修改 Apache 虚拟主机配置
RUN sed -ri -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/sites-available/*.conf \
    && sed -ri -e "s!/var/www/!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 复制商城代码到镜像, COPY 受 .dockerignore 影响
COPY . /var/www/html/

# 修改商城文件所有者, 官方 PHP Apache 镜像通常使用 www-data 作为 Apache/PHP 工作进程的运行用户。
RUN chown -R www-data:www-data /var/www/html

# 声明容器端口, 用于声明镜像预期监听的端口
EXPOSE 80

# 设置容器健康检查
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD php -r "exit(@file_get_contents('http://127.0.0.1/ping.php') ? 0 : 1);"


```

* 参数说明
	* FROM：用于指定构建当前镜像所基于的父镜像
	* EXPOSE 80
	EXPOSE 用于声明镜像预期监听的端口。这里表示你的 PHP + Apache 网站预计通过容器的 TCP 80 端口提供 HTTP 服务。
	* HEALTHCHECK：设置容器健康检查
	完整结构：

```
HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --retries=3 \
  CMD php -r "exit(@file_get_contents('http://127.0.0.1/ping.php') ? 0 : 1);"
```

> --interval=30s: 表示健康检查的默认执行间隔为 30 秒。
> --timeout=5s: 表示单次健康检查最多允许执行 5 秒。如果命令超过这个时间仍未完成，该次检查会被视为失败。
> --retries=3: 表示连续失败达到 3 次后，Docker 会将容器的健康状态标记为 unhealthy。

## 2、构建 Docker 镜像

```
docker build -t store-demo:v1.0.0 .
```

## 3、将镜像上传到 Harbor

> 我已经搭建好了Harbor平台 ，并在平台上创建了 store_demo 项目
![48e5d1b7-52f4-4bbd-9167-032ca6c4f7fc.png](/blog-images/97e595e7e06178.png)

* 1、命令行登录 Harbor

```
docker login harbor.example.com
```

> 输入 Harbor 用户名和密码。登录成功后，Docker 通常会将认证信息保存到本机的 Docker 配置中。

* 2、给镜像打标签

```
docker tag store-demo:v1.0.0 harbor.example.com/store-demo/store-demo:v1.0.0
```

* 推送镜像到 Harbor

```
docker push harbor.example.com/store-demo/store-demo:v1.0.0
```

## 4、在 Kubernetes 中创建 Deployment

* **store_demo_deployment.yaml**
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: store-demo
spec:
  replicas: 3
  selector:
    matchLabels:
      app: store-demo
  template:
    metadata:
      labels:
        app: store-demo
    spec:
      containers:
      - name: php
        image: harbor.example.com/store-demo/store-demo:v1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80

        env:
        - name: DB_HOST
          value: mysql-service
    
        - name: DB_PORT
          value: "3306"
    
        - name: DB_DATABASE
          value: store
    
        - name: DB_USERNAME
          value: root
    
        - name: DB_PASSWORD
          value: "123456"
```

### 创建 mysql-service
* **mysql-secret.yaml**

```
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
type: Opaque
stringData:
  MYSQL_ROOT_PASSWORD: "123456"
```

* **mysql-statefulset.yaml**

```
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql-statefulset
spec:
  serviceName: mysql-service
  replicas: 1
  selector:
    matchLabels:
      app: mysql-statefulset
  template:
    metadata:
      labels:
        app: mysql-statefulset

    spec:
      containers:
      - name: mysql-sts
        image: mysql:8.0
        
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: MYSQL_ROOT_PASSWORD

        ports:
        - name: mysql-sts
          containerPort: 3306

        volumeMounts:
        - name: mysql-data
          mountPath: /var/lib/mysql

  volumeClaimTemplates:
  - metadata:
      name: mysql-data
    spec:
      accessModes:
      - ReadWriteOnce
      resources:
        requests:
          storage: 10Gi
```

* **mysql-service.yaml**

```
apiVersion: v1
kind: Service
metadata:
  name: mysql-service
spec:
  clusterIP: None
  selector:
    app: mysql-statefulset
  ports:
  - name: mysql-deployment
    port: 3306
    targetPort: 3306
```

| 配置项                    | 含义                | 面试要点                          |
| ---------------------- | ----------------- | ----------------------------- |
| `apiVersion: apps/v1`  | Deployment API 版本 | Deployment 属于 apps API 组      |
| `kind: Deployment`     | 创建 Deployment     | 声明期望状态                        |
| `replicas: 3`          | 期望运行 3 个 Pod      | 副本数由控制器持续维护                   |
| `selector.matchLabels` | 匹配要管理的 Pod        | 必须与模板标签匹配                     |
| `template`             | Pod 模板            | Deployment 根据模板创建 Pod         |
| `image`                | 要运行的镜像            | 必须能被节点拉取                      |
| `containerPort: 80`    | 声明容器端口            | 本身不负责对外暴露                     |

镜像拉取策略怎么选？

| 策略             | 含义                |
| -------------- | ----------------- |
| `IfNotPresent` | 节点本地没有镜像时才拉取      |
| `Always`       | 每次启动容器时都尝试解析并拉取镜像 |
| `Never`        | 只使用本地镜像，不主动拉取     |


## 5、在 Kubernetes 中创建 Service
> Deployment 负责管理 Pod，但 Pod 的 IP 可能发生变化。
> Service 为一组符合标签选择条件的 Pod 提供稳定的访问入口，并将请求转发给可用后端。

* **store_demo_service.yaml**
```
apiVersion: v1
kind: Service
metadata:
  name: store-demo-service
spec:
  type: NodePort
  selector:
    # Service 的选择器，必须匹配 Deployment 中 Pod 模板的标签
    app: store-demo
  ports:
  - port: 80
    targetPort: 80
    nodePort: 31193
```

* Service 中的三个端口有什么区别？

	* nodePort: 31193
集群节点对外提供的端口。用户可以访问节点 IP 的这个端口。

	* port: 80
Service 自己提供的服务端口，集群内其他服务可以通过它访问。

	* targetPort: 80
Service 将请求转发到 Pod 中容器监听的端口。

访问链路：

```
浏览器
  |
  | http://节点IP:31193
  v
K8s NodePort
  |
  v
html-service:80
  |
  v
Pod IP:80
  |
  v
Apache 返回 index.html
```

* 其他对外暴露方式

| 方式             | 典型场景       | 特点                                      |
| -------------- | ---------- | --------------------------------------- |
| `ClusterIP`    | 集群内部访问     | 默认类型，不能直接作为普通外部入口                       |
| `NodePort`     | 学习、测试、简单环境 | 通过节点 IP 和端口访问                           |
| `LoadBalancer` | 云环境        | 需要云负载均衡集成或相应实现                          |
| `Ingress`      | 正式 Web 网站  | 可使用域名、路径路由和 HTTPS，需要 Ingress Controller |

如果是企业正式网站，常见架构是 Ingress Controller 接收外部 HTTP/HTTPS 请求，再根据域名或路径转发到 Service，最终到达 Pod。

## 6、部署到 Kubernetes 集群

先检查yaml文件语法和配置
```
kubectl apply --dry-run=client -f store_demo_deployment.yaml
kubectl apply --dry-run=client -f store_demo_service.yaml
```
需要注意：客户端 dry-run 可以做部分本地校验，但不等于集群中的镜像、权限、网络和运行环境都正常

检查服务端校验

```
kubectl apply --dry-run=server -f store_demo_deployment.yaml
kubectl apply --dry-run=server -f store_demo_service.yaml
```

* --dry-run 的两种模式
	* --dry-run=client（客户端模式）
	只在本地客户端验证语法、API 结构以及对象定义是否正确，不会向 Kubernetes API Server 发送任何请求
	* --dry-run=server（服务端模式）
	将请求发送到 API Server，由服务端进行完整的准入控制（Admission Control）、校验、默认值填充（Defaulting）以及 Schema 检查，但不会真正将变更写入 etcd 或保存到集群中。

如果语法和配置没问题，就执行下面的命令：
```
kubectl apply -f store_demo_deployment.yaml
kubectl apply -f store_demo_service.yaml
```

## 7、检查部署结果

```
kubectl get deployments
kubectl get pods -o wide
kubectl get services
```
查看 Deployment 的详细状态：
```
kubectl describe deployment store-demo
```

查看 Pod 事件和状态：
```
kubectl describe pod store-demo
```

查看应用日志：

```
# 如果 Pod 中有多个容器，需要使用 -c 指定容器名称。
kubectl logs store-demo
```

## 8、从浏览器访问 HTML 页面
假使你的k8s某个节点ip是 192.168.31.10
你用浏览器访问 http://192.168.31.10:31193 就能访问这个store网站
> 理论上访问 Kubernetes 集群中任意一个 Node（节点）的 IP 加上对应的 NodePort，都可以把流量发到这个 Service 上。Kubernetes 会通过内部的路由机制，把请求转发到后端实际运行的 Pod

> 但是实际生产建议：
	• 虽然访问任意节点都可以，但在生产环境中，通常不会让客户端直接裸连某一台机器的 NodePort。
	• 常见做法是在所有 Node 前面放一个负载均衡器（LoadBalancer），或者使用 Ingress，把外部流量均匀分发到各个节点的 NodePort 上，避免单台机器故障导致访问失效。

## 部署过程中最常见的故障及排查命令
| 现象                    | 常见原因                    | 排查方法                               |
| --------------------- | ----------------------- | ---------------------------------- |
| `ImagePullBackOff`    | 镜像不存在、仓库认证失败、网络或证书异常    | 检查镜像地址、Secret、Pod 事件               |
| `CrashLoopBackOff`    | 容器反复退出、启动命令或应用异常        | 查看日志、容器退出状态                        |
| Pod 一直 `Pending`      | 资源不足、调度限制、节点不可用         | 检查节点状态和 Pod 事件                     |
| Pod 是 `Running`，但无法访问 | 应用未就绪、端口或网络配置错误         | 检查日志、探针、监听端口                       |
| Service 没有后端          | Service 选择器与 Pod 标签不匹配  | 检查 `selector`、Pod 标签、EndpointSlice |
| 外部访问超时                | 防火墙、安全组、路由或 NodePort 问题 | 检查节点端口、网络策略和访问路径                   |

* 最常用的排查命令

```
# 查看所有 Pod
kubectl get pods -o wide

# 查看 Pod 的详细事件
kubectl describe pod <Pod名称>

# 查看容器日志
kubectl logs <Pod名称>

# 查看上一次崩溃的容器日志
kubectl logs <Pod名称> --previous

# 查看 Deployment 的发布状态
kubectl rollout status deployment/store-demo

# 查看最近的集群事件
kubectl get events --sort-by=.metadata.creationTimestamp

# 查看 Service 和后端
kubectl get svc store-demo-service
kubectl get endpoints store-demo-service
```

* 拉取harbor网络问题配置

**问题**：如果拉取镜像是提示：ImagePullBackOff

**解决**：
1、在需要拉去Harbor上镜像的各个服务器上添加一个目录：`/etc/containerd/certs.d/harbor.example.com/`**（harbor.example.com是自己搭建Harbor平台的的dmoain/ip）**，并在这个目录下新增文件 `hosts.toml`, 文件内容是：

```
server = "http://harbor.example.com"

[host."http://harbor.example.com"]
  capabilities = ["pull", "resolve", "push"]
  skip_verify = true
```

## 相关问题
1. Docker 镜像和 Pod 有什么区别？
Docker 镜像是应用运行所需文件和依赖的只读模板；Pod 是 Kubernetes 中最小的部署和调度单元，里面运行一个或多个容器。

2. Deployment 和 Service 有什么区别？
Deployment 负责管理 Pod 副本和发布更新；Service 为一组符合选择器条件的 Pod 提供稳定的网络访问入口。

3. Harbor 为什么要给镜像打完整标签？
因为镜像需要明确的仓库地址、项目路径、镜像名称和版本，Docker 才能将它推送到正确的 Harbor 项目。

4. 为什么本地能拉取镜像，K8s 却失败？
本地 Docker 的认证配置和 Kubernetes 节点的认证配置不是一回事。需要检查节点到 Harbor 的网络、证书、镜像地址和 imagePullSecrets。

5. 为什么 Pod 正常运行，网页还是无法访问？
Running 不代表 HTTP 服务一定可用。应继续检查容器监听端口、readinessProbe、Service 选择器、后端 EndpointSlice、NodePort 和防火墙。

6. Service 的 selector 有什么作用？
它根据 Pod 标签选择后端。如果标签不匹配，Service 就无法正确关联到应用 Pod。

7. Kubernetes 如何实现容器异常后的自动恢复？
Kubernetes 控制器持续协调实际状态与期望状态。容器异常退出时，容器运行机制可能重启容器；Pod 丢失时，Deployment 等控制器会尝试补足副本。具体行为取决于故障类型和配置。

8. 单个 Master 节点和多个工作节点可以部署吗？
可以。控制平面负责集群管理，工作节点负责运行工作负载。生产环境还需要考虑控制平面高可用、节点故障、网络和存储等问题。

## 常见的 kind 类型按功能主要分为以下几大类

* 1、工作负载 (Workloads) 用于运行容器应用

	 * Pod：Kubernetes 中最基本的调度和运行单元，包含一个或多个容器。
	 * Deployment：用于管理无状态（Stateless）的微服务应用，支持滚动升级和回滚。
	 * StatefulSet：用于管理有状态的应用（如数据库），能保证 Pod 的唯一持久化标识和有序部署。
	 * DaemonSet：确保集群中的每一个（或指定）节点上都运行一个 Pod 副本（常用于日志收集、监控Agent）。
	 * Job：运行一次性任务，直到任务成功完成即终止。
	 * CronJob：基于时间表（Cron 表达式）定期执行的 Job 任务。
	 * ReplicaSet：确保任意时间都有指定数量的 Pod 副本在运行（通常由 Deployment 自动管理）。

* 2、服务与网络 (Services & Networking)

	 * Service：为一组 Pod 提供一个稳定的网络访问入口和负载均衡（类型包括 ClusterIP, NodePort, LoadBalancer 等）。
	 * Ingress：管理集群外部到内部 Service 的 HTTP/HTTPS 路由规则。
	 * NetworkPolicy：定义 Pod 之间以及 Pod 与外界网络的流量访问控制策略。

* 3、配置与存储 (Config & Storage)

	 * ConfigMap：用于存储非敏感的键值对配置数据。
	 * Secret：用于存储敏感数据，如密码、OAuth 令牌、SSH 密钥等。
	 * PersistentVolume (PV)：集群中的一块由管理员配置的网络持久化存储空间。
	 * PersistentVolumeClaim (PVC)：用户对存储空间的申请（绑定到 PV）。
	 * StorageClass：定义了动态创建 PV 的存储类型和提供者。

* 4、集群与命名空间管理 (Cluster & Namespace)

	 * Namespace：用于将集群资源逻辑隔离到不同的虚拟集群中。
	 * Node：代表 Kubernetes 集群中的计算节点（通常由系统自动创建和管理）。
	 * ServiceAccount：为 Pod 内运行的进程提供身份标识。
	 * Role / ClusterRole：定义一组权限规则（RBAC 访问控制）。
	 * RoleBinding / ClusterRoleBinding：将权限规则绑定给用户或 ServiceAccount。

------
##### internalTrafficPolicy
> Kubernetes 中的 internalTrafficPolicy 是 Service 资源的一个配置字段（位于 .spec.internalTrafficPolicy），用来控制集群内部发起的流量（即 Pod 访问 Service 时）如何被路由到后端的 Pod 端点。

* **它支持两个有效值：**
	* Cluster（默认值）
		* 机制：将集群内部发起的流量路由到该 Service 对应的所有就绪后端 Pod（无论这些 Pod 位于哪个节点上）。
		* 优点：提供高可用性和均匀的负载均衡，只要集群内有可用 Pod 就能访问。
		* 缺点：可能会产生跨节点甚至跨可用区的网络跳转（Roundtrip），增加网络延迟并消耗跨节点流量成本。
	* Local
		* 机制：将集群内部发起的流量仅路由到发起方 Pod 所在同一节点（Local Node）上就绪的后端 Pod 端点。
		* 优点：避免了跨节点或跨网络设备的流量往返，显著提升网络性能（降低延迟、提高吞吐量）并节省跨节点流量开销。
		* 缺点：如果发起请求的节点上没有任何该 Service 的后端 Pod，流量会被直接丢弃（表现为连接不上或失败），可用性依赖于合理的 Pod 分布。

**例子**
> 我在k8s上面创建了一个爬虫服务，并在每个节点上配置了一个clash 代理服务，clash代理服务每个节点上都存在，并且爬虫服务使用的clash代理是本节点上的代理服务

**clash-linux-deployment.yaml**

kind是DaemonSet：确保集群中的每一个（或指定）节点上都运行一个 Clash Pod 副本。

```
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: clash-linux
spec:
  selector:
    matchLabels:
      app: clash-linux
  template:
    metadata:
      labels:
        app: clash-linux
    spec:
      containers:
      - name: clash-linux
        image: harbor.example.com/clash-linux/clash-linux:v4

        volumeMounts:
        - name: provider-all-yaml
          mountPath: /app/clash-linux/provider/provider-all.yaml

        env:
        - name: CLASH_PROVIDER_URL
          value: "http://192.168.31.11/api/proxies?max_latency=500"

        ports:
        - name: http
          containerPort: 7890
        - name: socks
          containerPort: 7891

      volumes:
      - name: provider-all-yaml
        hostPath: 
          path: /app/volume/clash-liux/data/provider-all.yaml
          type: FileOrCreate

```

**clash-linux-service.yaml**

`spec.type: ClusterIP`: 集群内部访问
`spec.internalTrafficPolicy: Local`: 爬虫使用clash 代理时，走的是同节点上面的Pod

```
apiVersion: v1
kind: Service
metadata:
  name: clash-linux-svc
spec:
  internalTrafficPolicy: Local
  type: ClusterIP
  selector:
    app: clash-linux

  ports:
  - name: http-proxy
    port: 7890
    targetPort: http

  - name: socks-proxy
    port: 7891
    targetPort: socks
```

**clash代理服务有检测节点延迟的功能，每个节点上面用一个代理节点检测出来的延迟可能不一样，所以每个节点上都部署一份clash，同节点上的服务走当前节点的clash代理，可以更好的发挥代理的作用**
