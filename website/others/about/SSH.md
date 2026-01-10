# SSH 传输

SSH（Secure Shell，安全外壳协议）是一种加密的**网络传输协议**，核心目的是在不安全的网络环境中，建立两台设备之间的安全连接，它是一种长连接协议，建立一次连接后可复用会话，无需反复认证和加密，它有着更宽松的防火墙策略和更少的中间人干扰。

Git 通常使用 HTTPS 协议进行传输，但 HTTPS 协议在访问 GitHub 容易出现连接不稳定的问题，此时切换为 SSH 协议更加稳定。

一般的 Git 自带 SSH 客户端，无需额外安装，下面我们来实现 Git 中的 SSH 传输。


## 1. 生成 SSH 密钥对（如果本地没有）

1. 打开 Git Bash（Windows）或终端（Mac/Linux），执行以下命令（`yourmail@example.com`替换为你的GitHub注册邮箱）：
   ```bash
   ssh-keygen -t ed25519 -C "yourmail@example.com"
   ```

2. 执行后会出现 3 次提示，一路回车默认配置即可：
   * 提示 1：Enter file in which to save the key（密钥保存路径，默认即可）；
   * 提示 2：Enter passphrase（密钥密码，留空则无需输入密码）；
   * 提示 3：Enter same passphrase again（重复密码，留空即可）。

3. 生成成功后，会在默认路径生成密钥文件：

   | 操作系统 | 密钥文件路径 |
   |---------|------------|
   | Windows | `C:\Users\yourusername\.ssh\` |
   | Mac/Linux | `~/.ssh/` |

   > **密钥文件说明**：
   > * `id_ed25519`：私钥，不可泄露！
   > * `id_ed25519.pub`：公钥，需要上传到GitHub


## 2. 复制 SSH 公钥内容

打开公钥文件`id_ed25519.pub`（可用记事本/文本编辑器打开），复制文件中的全部内容（不要多复制空格）。

> **提示**：可以使用命令行直接复制公钥内容：
> * Windows: `clip < ~/.ssh/id_ed25519.pub`
> * Mac: `pbcopy < ~/.ssh/id_ed25519.pub`
> * Linux: `cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard`


## 3. 将 SSH 公钥添加到 GitHub

1. 登录GitHub，点击右上角头像 -> [Settings] -> 左侧菜单[SSH and GPG keys] -> 右上角[New SSH key]

2. 填写配置：
   * **Title**：自定义名称（如「My Computer」，方便识别）；
   * **Key type**：默认选 Authentication key；
   * **Key**：粘贴你刚才复制的公钥全部内容（确保完整无修改）；

3. 点击 [Add SSH key] 完成添加(若弹出GitHub密码验证，输入密码即可)，添加成功后会在SSH keys列表中显示。


## 4. 修改本地仓库的远程地址为 SSH 格式

1. 进入你的本地仓库目录（GitHub Pages 对应的本地文件夹）,打开 Git Bash；

2. 先查看当前远程地址（确认是HTTPS格式）：
   ```bash
   git remote -v
   ```
   此时会显示类似：`origin https://github.com/yourusername/yourusername.github.io.git (fetch)`，说明是 HTTPS 协议（yourusername 替换为你的 GitHub 用户名）；

3. 修改远程地址为 SSH 格式：
   ```bash
   git remote set-url origin git@github.com:yourusername/yourusername.github.io.git
   ```

4. 再次查看远程地址，确认已切换为 SSH 格式：
   ```bash
   git remote -v
   ```
   显示 `origin git@github.com:yourusername/yourusername.github.io.git (fetch)` 即为成功。


## 5. 验证 SSH 连接 + 重新推送

1. 验证本地与 GitHub 的 SSH 连接：
   ```bash
   ssh -T git@github.com
   ```

2. 首次连接会提示 `Are you sure you want to continue connecting (yes/no)?` 输入 `yes` 回车。

3. 若连接成功，会显示：
   ```
   Hi yourusername! You've successfully authenticated, but GitHub does not provide shell access.
   ```

4. 此时执行 `git push` 即可正常推送。

> **恭喜**：SSH 配置成功！现在你可以使用更稳定的 SSH 协议进行 Git 操作了。