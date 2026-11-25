---
title: "ThinkPHP6智障坑"
---

# ThinkPHP6智障坑

#### 通过官方文档composer安装的框架，需要检查linux系统安全模式 setenforce（需要设置=0）

setenforce 是一个命令，用于在 CentOS 7 和其他基于 SELinux 的 Linux 发行版中更改 SELinux 模式。SELinux（Security-Enhanced Linux）是一种 Linux 安全模块，用于实施强化的安全策略，可以对系统资源和进程的访问进行详细的控制。

* setenforce 命令有三个主要的 SELinux 模式：
	* 1.Enforcing（强制执行）
：在此模式下，SELinux 启用并强制执行安全策略。如果进程试图执行不被允许的操作，它将被拒绝并记录到 SELinux 日志中。这是最安全的模式，但也可能导致某些应用程序无法正常工作，因为它们需要执行一些 SELinux 规则不允许的操作。
	* 2.Permissive（宽松模式）
：在此模式下，SELinux 启用，但不强制执行安全策略。它会记录与安全策略冲突的操作，但不会阻止它们。这对于诊断与 SELinux 冲突相关的问题非常有用，同时仍然保留了 SELinux 提供的日志记录功能。
	* 3.Disabled（禁用）
：在此模式下，SELinux 完全禁用，不会对系统资源或进程的访问进行任何控制。这是最不安全的模式，不建议在生产环境中长期使用。
要使用 setenforce 命令更改 SELinux 模式，可以运行以下命令：
		* 将 SELinux 设置为强制执行模式：
			```sudo setenforce 1```

		* 将 SELinux 设置为宽松模式：
			```sudo setenforce 0```

请注意，setenforce 命令仅在当前会话中更改 SELinux 模式。要使更改永久生效，您需要编辑 /etc/selinux/config 文件，将 SELINUX 参数设置为 enforcing（强制执行）、permissive（宽松模式）或 disabled（禁用），然后重新启动系统。
```
SELINUX=enforcing
```
或
```
SELINUX=permissive
```

或
```
SELINUX=disabled
```
**完成编辑后，保存文件并重新启动系统，以使更改生效。**
