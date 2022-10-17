<!--
 * @Author: songyipeng
 * @Date: 2022-10-17 16:43:03
-->

# Git 常用命令

git 使用过程中的几个工作区域：

1. 工作区 workspace
2. 暂存区 Index
3. 本地仓库 repository
4. 远程仓库 remote

## 基本操作

### git add

```
// 将工作区更改的文件添加至暂存区
git add xxx.xx
git add .
```

### git commit

```
// 将暂存区的改动提交到本地仓库
git commit -m "feature:xxx"
// 等同于git add . & git commit -m
git commit -am
// 对最近的一次提交修改提交信息，此操作会更改commit的hash值
git commit --amend
```

### git pull

```
// 从远程仓库拉取代码并合并到本地，可简写为 git pull 等同于 git fetch && git merge
git pull <远程主机名> <远程分支名>:<本地分支名>// git pull remote master:dev
// 使用rebase模式进行拉取
git pull --rebase remote master:master
```

### git fetch

与 git pull 的区别是 git fetch 不会自动进行 merge

```
git fetch remote master

git fetch --all
```

### git branch

```
// 新建本地分支
git branch <branch-name>
// 查看本地分支
git branch
// 查看远程分支
git branch -r
// 删除本地分支
git branch -D <branch-name>
// 重命名分支
git branch -m <old-branch-name> <new-branch-name>
```

### git checkout

git checkout 为检出，常用于切换分支

```
// 切换分支
git checkout <branch-name>
// 拉取远程分支并在本地新建与其对应的分支
git checkout --track origon/<branch-name>
// 新建一个干净的分支
git checkout --orphan <branch-name>
// 将工作区的更改撤销
git checkout -- <file-name>
```
