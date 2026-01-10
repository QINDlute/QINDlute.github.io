# Git 托管

## 一、Git简介与安装

现在的个人博客或静态文档站通常选择托管形式发布，基于**免费、无需运维、访问速度快**等基准，大部分人选择将网站代码托管在GitHub Pages上。**如本网站就是托管在GitHub Pages上的**。需要注意的是，GitHub Pages属于境外服务，国内用户访问速度较慢，可能需要科学上网。

这种静态网站托管通常基于Git实现，因此在介绍托管流程前，你需要先安装Git：

1. 访问 [Git官方下载页](https://git-scm.com/install/windows)
2. 点击 `Click here to download` 下载安装包
3. 打开安装包，选择合适的安装路径后，**一直选择默认选项**完成安装

![git_install](/img/git_install.png)

<div class="figure-caption">图一 git安装界面</div>


## 二、Git基础配置（首次使用必做）

安装完成后，需要进行Git的基础配置：

### 1. 配置用户名和邮箱
```bash
git config --global user.name "Your Name"
git config --global user.email "youremail@example.com"
```

### 2. 配置默认编辑器（可选）
```bash
git config --global core.editor "code --wait"
```
这里使用VS Code作为默认编辑器，你可以根据喜好选择其他编辑器。

### 3. 查看配置
```bash
git config --list
```
确认用户名、邮箱和编辑器配置是否正确。


## 三、GitHub Pages托管流程

完成Git配置后，即可开始GitHub Pages的托管流程。

### 1. 前置准备
- ✅ GitHub账号
- ✅ 静态网站文件：如VitePress生成的静态文件，通常在 `.vitepress/dist` 目录下
- ✅ Git环境：用于本地推送文件

### 2. 创建GitHub Pages仓库

GitHub Pages的访问地址与仓库名强相关，需按规则创建仓库：

1. 登录GitHub后，点击右上角 **[+] -> [New repository]**
2. 填写仓库信息：
   - **Repository name**：格式为 `username.github.io`，其中 `username` 是你的GitHub用户名
   - **Visibility**：必须选择 **公开[Public]**
3. 点击 **[Create repository]** 创建仓库

### 3. 上传静态网站文件

#### 方式1：网页直接上传
适合文件少、无需本地开发的场景（如只有一个 `index.html` 文件）：

1. 点击仓库页面的 **[Add file] -> [Upload files]** 按钮
2. 选择静态网站文件拖到页面中
3. 填写提交信息，点击 **[Commit changes]** 提交

#### 方式2：本地Git推送（推荐）
适合本地开发的项目（如VitePress打包后的文件）：

1. 打开本地项目目录，先打包生成静态文件（以VitePress为例）：
   ```bash
   npm run docs:build
   ```

2. 初始化本地Git仓库（如果该文件夹未初始化）：
   ```bash
   git init
   ```

3. 关联远程GitHub仓库(yourusername替换为你的GitHub用户名)：
   ```bash
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   ```

4. 切换到GitHub Pages推荐分支：
   ```bash
   git checkout -b gh-pages
   ```

5. 添加所有文件到暂存区：
   ```bash
   git add .
   ```

6. 提交文件到本地仓库：
   ```bash
   git commit -m "deploy static site to GitHub Pages"
   ```

7. 推送文件到GitHub远程仓库：
   ```bash
   git push -u origin gh-pages
   ```
   > 注意：首次推送需加 `-u`，后续推送直接使用 `git push`

### 4. 开启GitHub Pages并配置

这一步是告诉GitHub：**把这个仓库的文件作为静态网站发布**：

1. 点击仓库页面的 **[Settings] -> [Pages]**
2. 在 **[Source]** 下拉菜单中：
   - **[Branch]** 选择 `gh-pages` 分支（或 `main` 分支，视情况而定）
   - **[Folder]** 保持默认 `/{root}`（根目录）
3. 点击 **[Save]** 保存设置，等待10秒左右，页面会显示：
   > "Your site is live at https://yourusername.github.io/"

### 5. 验证访问

访问 `https://yourusername.github.io`（替换为你的GitHub用户名），即可查看发布的静态网站。


## 四、注意事项

1. **确保文件完整**：仓库的 `gh-pages`（或 `main`）分支必须包含静态网站的**所有文件**（包括 `index.html` 等）

2. **定期更新推送**：每次更新静态网站文件后，都需要重新推送（`git push`）到托管分支

3. **缓存机制**：访问链接可能需要**几分钟才能生效**，因为GitHub Pages有缓存机制

4. **分支一致性**：本地推送的分支必须与GitHub Pages配置的分支一致


## 五、后续更新流程

如果后续需要更新网站内容，无需重复全部流程，只需执行以下步骤：

### 1. 本地修改内容并重新打包

1. 在本地项目中修改内容（如修改VitePress文档、调整CSS样式等）
2. 执行打包命令，生成最新静态文件：
   ```bash
   npm run docs:build
   ```
   打包后，`docs/.vitepress/dist` 目录下就是最新的静态文件

### 2. 推送最新文件

进入 `dist` 文件夹，右键点击 **[Open Git Bash Here]**，执行以下命令：

1. 切换到托管分支：
   ```bash
   git checkout gh-pages
   ```

2. 添加所有文件到暂存区：
   ```bash
   git add .
   ```

3. 提交变更（备注清晰，方便后续追溯）：
   ```bash
   git commit -m "update: 描述你的修改内容"
   ```

4. 推送文件到GitHub：
   ```bash
   git push
   ```


## 六、总结

现在你已经学会了如何将本地静态网站文件托管到GitHub Pages上。通过Git，你可以轻松管理和更新你的静态网站，享受免费托管服务带来的便利。

**核心优势**：
- 🆓 免费托管
- 🚀 无需自己搭建服务器
- 🔄 版本控制，便于追溯和回滚
- 🌐 全球访问

**后续建议**：
- 定期备份你的GitHub仓库
- 学习Git的进阶功能，如分支管理、冲突解决等
- 探索GitHub Actions，实现自动化部署
