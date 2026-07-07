根据您提供的文档，以下是多机训练的配置步骤总结：

## 多机训练配置流程

### 1. 硬件要求
- 每台机器至少配备 **80GB 内存**

### 2. 密码无密登录配置（关键步骤）
> **注意**：仅单机训练可跳过此步

**在每台机器的 Docker 容器内执行：**
```sh
# 生成 SSH 密钥对
ssh-keygen

# 生成 SSH 主机密钥
ssh-keygen -t rsa -A

# 启动 SSH 服务（使用示例端口36005）
/usr/sbin/sshd -p 36005 -o ListenAddress=0.0.0.0

# 设置 SSH 连接端口
echo "Port 36005" > ~/.ssh/config

# 设置 root 密码（避免监控告警）
passwd root
```

**重要提示**：
- `36005` 为示例端口，可替换为任意未占用端口
- 确保所有机器都能互相访问该端口

### 3. 分发公钥
**在每台机器的容器中执行：**
```sh
cat ~/.ssh/id_rsa.pub
```
将输出的公钥分别粘贴到每台机器的 `~/.ssh/authorized_keys` 文件中，确保每台机器的该文件内容相同。

### 4. 设置训练节点列表
在启动训练前，需在训练脚本开头配置节点 IP 列表：

**DeepSpeed 训练示例：**
```shell
export HOST_GPU_NUM=8
# 单节点配置
IP_LIST=${IP_LIST:-"127.0.0.1"}
# 多节点配置示例："192.168.1.1,192.168.1.2"
```

**LLaMA-Factory 训练示例：**
```shell
export HOST_GPU_NUM=8
export IP_LIST=${IP_LIST:-"127.0.0.1"}
```

**ms-swift 训练示例：**
```shell
export HOST_GPU_NUM=8
export IP_LIST=${IP_LIST:-"127.0.0.1"}
```

### 5. 启动训练
在 **任一节点** 上执行对应训练命令即可：

```sh
# DeepSpeed 原生训练
bash train.sh

# LLaMA-Factory 训练
bash train_lf.sh

# ms-swift 训练
bash sft_train.sh
```

## 注意事项
1. **数据同步**：建议挂载共享网络驱动器，否则需手动复制数据集和代码到各节点
2. **代码一致性**：所有节点运行的代码必须完全相同
3. **首次连接确认**：首次运行时需输入 `yes` 确认 SSH 连接
4. **端口开放**：确保防火墙已开放配置的 SSH 端口

完成以上步骤后，即可成功进行多机分布式训练。
