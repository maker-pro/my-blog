---
title: "Git 常用命令速查手册"
---

# Git 常用命令速查手册

## 日常最常用流程

```bash
git status
git add .
git commit -m "修改说明"
git pull --rebase origin main
git push origin main
```

---

# Git 常用命令速查手册

## 一、Git 基础概念

| 名称                | 说明                         |
| ----------------- | -------------------------- |
| Workspace         | 工作区                        |
| Index / Stage     | 暂存区                        |
| Local Repository  | 本地仓库                       |
| Remote Repository | 远程仓库(GitHub、GitLab、Gitee等) |

Git 工作流程：

```text
工作区
  ↓ git add
暂存区
  ↓ git commit
本地仓库
  ↓ git push
远程仓库
```

---

# 二、首次安装配置

查看版本

```bash
git --version
```

配置用户名

```bash
git config --global user.name "Joe Wang"
```

配置邮箱

```bash
git config --global user.email "your_email@example.com"
```

查看配置

```bash
git config --list
```

查看用户名

```bash
git config user.name
```

查看邮箱

```bash
git config user.email
```

---

# 三、创建仓库

初始化仓库

```bash
git init
```

查看当前仓库状态

```bash
git status
```

---

# 四、提交代码

添加单个文件

```bash
git add index.html
```

添加所有文件

```bash
git add .
```

提交代码

```bash
git commit -m "首次提交"
```

查看提交记录

```bash
git log
```

简洁模式

```bash
git log --oneline
```

查看最近5条记录

```bash
git log --oneline -5
```

---

# 五、查看修改

查看文件变化

```bash
git diff
```

查看已暂存变化

```bash
git diff --cached
```

查看指定文件

```bash
git diff index.html
```

---

# 六、撤销修改

撤销工作区修改

```bash
git checkout -- index.html
```

Git新版本推荐

```bash
git restore index.html
```

撤销暂存区

```bash
git restore --staged index.html
```

撤销所有未提交修改

```bash
git reset --hard HEAD
```

---

# 七、删除文件

删除文件

```bash
git rm test.txt
```

删除目录

```bash
git rm -r testdir
```

提交删除

```bash
git commit -m "删除测试文件"
```

---

# 八、远程仓库

查看远程仓库

```bash
git remote -v
```

添加远程仓库

```bash
git remote add origin git@github.com:user/demo.git
```

修改远程仓库

```bash
git remote set-url origin git@github.com:user/demo.git
```

删除远程仓库

```bash
git remote remove origin
```

---

# 九、推送代码

首次推送

```bash
git push -u origin master
```

推送到main

```bash
git push -u origin main
```

后续推送

```bash
git push
```

强制推送

```bash
git push -f
```

慎用：

```text
可能覆盖他人代码
```

---

# 十、拉取代码

拉取最新代码

```bash
git pull
```

指定分支

```bash
git pull origin main
```

仅下载不合并

```bash
git fetch
```

查看远程更新

```bash
git fetch
git log HEAD..origin/main --oneline
```

---

# 十一、克隆仓库

HTTPS方式

```bash
git clone https://github.com/user/demo.git
```

SSH方式

```bash
git clone git@github.com:user/demo.git
```

克隆指定分支

```bash
git clone -b dev git@github.com:user/demo.git
```

---

# 十二、分支管理

查看分支

```bash
git branch
```

查看所有分支

```bash
git branch -a
```

创建分支

```bash
git branch dev
```

切换分支

```bash
git checkout dev
```

新建并切换

```bash
git checkout -b dev
```

Git新语法

```bash
git switch dev
```

创建并切换

```bash
git switch -c dev
```

删除分支

```bash
git branch -d dev
```

强制删除

```bash
git branch -D dev
```

---

# 十三、分支合并

切换到主分支

```bash
git checkout main
```

合并dev

```bash
git merge dev
```

查看图形化历史

```bash
git log --graph --oneline --all
```

---

# 十四、解决冲突

查看冲突文件

```bash
git status
```

编辑文件

```text
<<<<<<< HEAD
当前分支内容
=======
合并分支内容
>>>>>>> dev
```

解决后

```bash
git add .
git commit
```

---

# 十五、标签(Tag)

创建标签

```bash
git tag v1.0
```

查看标签

```bash
git tag
```

推送标签

```bash
git push origin v1.0
```

推送所有标签

```bash
git push origin --tags
```

删除标签

```bash
git tag -d v1.0
```

删除远程标签

```bash
git push origin --delete v1.0
```

---

# 十六、版本回退

查看历史

```bash
git log --oneline
```

回退到指定版本

```bash
git reset --hard commit_id
```

例如

```bash
git reset --hard a1b2c3d
```

回退上一次提交

```bash
git reset --hard HEAD~1
```

回退两次提交

```bash
git reset --hard HEAD~2
```

---

# 十七、查看历史操作

查看所有操作记录

```bash
git reflog
```

恢复误删除提交

```bash
git reset --hard commit_id
```

---

# 十八、Stash 临时保存

保存当前修改

```bash
git stash
```

查看保存列表

```bash
git stash list
```

恢复

```bash
git stash pop
```

恢复指定记录

```bash
git stash apply stash@{0}
```

删除记录

```bash
git stash drop stash@{0}
```

---

# 十九、SSH配置

生成密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

查看公钥

Linux

```bash
cat ~/.ssh/id_ed25519.pub
```

Windows

```powershell
type %USERPROFILE%\.ssh\id_ed25519.pub
```

测试连接

```bash
ssh -T git@github.com
```

---

# 二十、Git 常见问题

## 1. 文件过大

查看大文件

```bash
find . -type f -size +100M
```

忽略文件

```bash
vim .gitignore
```

示例

```text
.idea/
.vscode/
node_modules/
vendor/
.env
*.log
```

---

## 2. 推送被拒绝

先拉取

```bash
git pull --rebase
```

再推送

```bash
git push
```

---

## 3. 误提交

修改最近一次提交说明

```bash
git commit --amend
```

---

# 二十一、开发常用流程

## 新项目

```bash
git init

git add .

git commit -m "init"

git remote add origin 仓库地址

git push -u origin main
```

---

## 日常开发

```bash
git pull

git add .

git commit -m "功能开发"

git push
```

---

## 分支开发

```bash
git checkout -b feature/login

git add .

git commit -m "完成登录功能"

git push origin feature/login
```

---

# 二十二、最常用命令（必须掌握）

```bash
git status

git add .

git commit -m "message"

git pull

git push

git branch

git checkout

git checkout -b

git merge

git log --oneline

git reset --hard

git stash

git clone
```

---

# 结束

掌握下面这10个命令，基本能完成90%的日常开发：

```bash
git clone
git status
git add .
git commit -m
git pull
git push
git branch
git checkout
git merge
git log --oneline
```
