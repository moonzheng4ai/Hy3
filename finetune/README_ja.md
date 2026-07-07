Based on the documentation provided, here is a structured summary of how to perform both single-machine and multi-machine training for Hunyuan-Large using three different frameworks: **DeepSpeed Native**, **LLaMA-Factory**, and **ms-swift**.

---

### Prerequisites (Common for all methods)
*   **Hardware:** Machines with at least 80GB memory each.
*   **Docker:** All commands must be executed inside a Docker container.
*   **SSH Configuration:** For multi-machine training, passwordless SSH must be configured between all nodes.
    1.  Generate SSH keys: `ssh-keygen`
    2.  Generate host keys: `ssh-keygen -t rsa -A`
    3.  Start SSH service: `/usr/sbin/sshd -p 36005`
    4.  Set root password: `passwd root`
    5.  Copy the public key (`cat ~/.ssh/id_rsa.pub`) from each machine and append it to `authorized_keys` on **all** machines so that every machine trusts every other machine.

---

### 1. DeepSpeed Native Training
**Directory:** `train/deepspeed_support`

#### Single-Machine Execution
1.  Install dependencies: `pip install -r requirements.txt`
2.  Run training: `bash train.sh`

#### Multi-Machine Execution
1.  Ensure SSH configuration is complete.
2.  Edit `train.sh` and set the IP list:
    ```shell
    export HOST_GPU_NUM=8
    export IP_LIST=${IP_LIST:-"127.0.0.1"} # Replace with "ip1,ip2" for multi-node
    ```
3.  Execute on the master node: `bash train.sh`

#### Key Parameters
*   `--deepspeed`: Path to config file (`ds_zero2_no_offload.json`, `ds_zero3_no_offload.json`, or `ds_zero3_offload.json`).
*   `--model_name_or_path`: Path to Hunyuan-Large HF model weights.
*   `--use_lora`: Enables LoRA training.
*   **Memory Issues:** Modify `stage3_param_persistence_threshold` and related values in the DeepSpeed JSON config.

#### LoRA Weight Merging
Since ZeRO-3 partitions weights, LoRA weights must be merged offline:
```shell
bash merge_lora_weight.sh \
  --base_model_path ./path/to/model \
  --adapter_model_path ./path/to/lora_weights \
  --output_path ./merged_model \
  --save_dtype fp16
```

---

### 2. LLaMA-Factory Training
**Directory:** `train/llama_factory_support`

#### Installation
Clone the official repo and install: https://github.com/hiyouga/LLaMA-Factory

#### Configuration Files
*   `hy_v3_lora_sft.yaml`: For LoRA fine-tuning.
*   `hy_v3_full_sft.yaml`: For Full fine-tuning.

#### Critical Config Notes
*   `model_name_or_path`: Path to HF model weights.
*   `trust_remote_code`: Must be `true`.
*   `deepspeed`: Use `ds_zero3_offload.json` for full fine-tuning; `ds_zero2_offload_lora.json` for LoRA.
*   `cutoff_len`: Set to `8192` for LoRA to save memory; `262144` for full fine-tuning.

#### Multi-Machine Execution
1.  Configure SSH as described in prerequisites.
2.  Edit `train_lf.sh`:
    ```shell
    export HOST_GPU_NUM=8
    export IP_LIST=${IP_LIST:-"127.0.0.1"} # Replace with "ip1,ip2"
    ```
3.  Run on all nodes: `bash train_lf.sh`

---

### 3. ms-swift Training
**Directory:** `train/ms_swift_support`

#### Installation
```shell
pip install ms-swift==4.2.2
```

#### Training Modes
*   **Full Fine-tuning:** Use `hy_v3_full_sft.yaml` with `bash sft_train.sh`.
*   **LoRA Fine-tuning:** Use `hy_v3_lora_sft.yaml` with `bash sft_train.sh`.

#### Important Patches
The file `hy_v3_swift_patches.py` automatically registers a correct EOS token handler to prevent generation errors. No manual intervention is required.

#### Multi-Machine Execution
1.  Configure SSH between nodes.
2.  Edit `sft_train.sh`:
    ```shell
    export HOST_GPU_NUM=8
    export IP_LIST=${IP_LIST:-"127.0.0.1"} # Replace with "ip1,ip2"
    ```
3.  Execute on all nodes:
    ```shell
    # Single Machine
    bash sft_train.sh
    
    # Multi Machine
    IP_LIST="10.0.0.1,10.0.0.2" bash sft_train.sh
    ```

---

### Summary Table

| Feature | DeepSpeed | LLaMA-Factory | ms-swift |
| :--- | :--- | :--- | :--- |
| **Config Files** | Manual JSON | `.yaml` files | `.yaml` files |
| **LoRA Merge** | Requires Offline Script | N/A | N/A |
| **EOS Patch** | N/A | N/A | Automatic via `hy_v3_swift_patches.py` |
| **Batch Size Control** | `per_device_train_batch_size` | `per_device_train_batch_size` | `per_device_train_batch_size` |
