<p align="left">
    <a href="README_CN.md">中国語</a>&nbsp;｜&nbsp;英語
</p>
<br>

<p align="center">
 <img src="assets/logo-en.png" width="400"/> <br>
</p>

<div align="center" style="line-height: 1;">

[![ライセンス](https://img.shields.io/badge/License-Apache%202.0-blue)](#license)
&nbsp;&nbsp;
[![HuggingFace](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Tencent%20Hy-ffc107?color=ffc107&logoColor=white)](https://huggingface.co/tencent/Hy3)
&nbsp;&nbsp;
[![ModelScope](https://img.shields.io/badge/ModelScope-Tencent%20Hy-624aff)](https://modelscope.cn/models/Tencent-Hunyuan/Hy3)
&nbsp;&nbsp;
[![cnb.cool](https://img.shields.io/badge/cnb.cool-Tencent%20Hy-blue?logoColor=white)](https://cnb.cool/ai-models/tencent/Hy3)
&nbsp;&nbsp;
[![GitCode](https://img.shields.io/badge/GitCode-Tencent%20Hy-red?logoColor=white)](https://ai.gitcode.com/tencent_hunyuan/Hy3)

</div>

<p align="center">
    🖥️&nbsp;<a href="https://aistudio.tencent.com/"><b>公式ウェブサイト</b></a>&nbsp;&nbsp;|&nbsp;&nbsp;
    💬&nbsp;<a href="https://github.com/Tencent-Hunyuan/Hy3"><b>GitHub</b></a></p>

---

## 目次

- [モデル紹介](#model-introduction)
- [エージェント機能の強化](#stronger-agent-capabilities)
- [製品体験の信頼性向上](#more-reliable-product-experiences)
- [ベンチマーク付録](#benchmark-appendix)
- [ニュース](#news)
- [モデルリンク](#model-links)
- [クイックスタート](#quickstart)
- [デプロイメント](#deployment)
  - [vLLM](#vllm)
  - [SGLang](#sglang)
- [ファインチューニング](#finetuning)
- [量子化](#quantization)
- [ライセンス](#license)
- [お問い合わせ](#contact-us)

---

## モデル紹介

**Hy3**は、Tencent Hyチームが開発したパラメータ数2950億のMixture-of-Experts（MoE）モデルです。実際に活性化するパラメータ数は210億で、MTPレイヤーのパラメータ数は38億です。4月下旬にHy3プレビュー版を公開した後、50以上の製品からフィードバックを収集し、より高品質なデータを用いた追加学習を行いました。本日公開するHy3は、同規模の他モデルを上回る性能を示し、パラメータ数が2～5倍多い主要なオープンソースモデルにも匹敵します。また、さまざまな製品や生産性タスクにおいても有用性が大幅に向上しています。


| 項目 | 値 |
|:---|:---|
| アーキテクチャ | Mixture-of-Experts（MoE） |
| 総パラメータ数 | 2950億 |
| 活性化パラメータ数 | 210億 |
| MTPレイヤー・パラメータ数 | 38億 |
| レイヤー数（MTPレイヤー除く） | 80 |
| MTPレイヤー数 | 1 |
| アテンション・ヘッド数 | 64（GQA、KVヘッド数8、ヘッド次元128） |
| 隠れ層サイズ | 4096 |
| 中間層サイズ | 13312 |
| コンテキスト長 | 256K |
| 語彙数 | 120832 |
| エキスパート数 | 192個、上位8つが活性化 |
| 対応精度 | BF16 |

## エージェント機能の強化

Hy3プレビュー版を基盤として、追加学習用データの品質と多様性をさらに向上させるとともに、RL学習の規模も拡大しました。その結果、推論、エージェント処理、長文コンテキスト処理といった分野で確かな進歩が見られ、パラメータ数がはるかに多い主要モデルにも十分対抗できる水準となりました。

<p align="center">
  <img src="assets/benchmark.png" width="100%"/>
</p>

コーディング、事務作業、金融モデリング、フロントエンド設計、ゲーム開発といった生産性シナリオにおいてもHy3は顕著な進歩を遂げており、今では信頼性が高く費用対効果にも優れた選択肢となっています。

一般向けベンチマークのスコアだけでは全体像が把握できないと考え、実際の業務で使われる課題を用いて270人の専門家によるブラインド評価も実施しました。その結果、Hy3は4点満点中2.67点を獲得し、2.51点だったGLM-5.1を上回りました。特にフロントエンド開発、データ・ストレージ、CI/CD関連のタスクでその優位性が顕著でした。

## 製品体験の信頼性向上

ベンチマークだけではモデルの有用性を完全に捉えきれません。多くの製品から寄せられたフィードバックをもとに以下の問題点を特定・修正した結果、各製品チームから一貫して好意的な反応を得ています。

**ツール呼び出しおよび出力フォーマットの安定性**：いくつかの基本的な信頼性問題を解消し、各種ツール設定や出力制約の下でも実用レベルの品質を実現しました。ツール呼び出し時のエラー復旧能力や全体的な効率性も向上しています。また、さまざまなエージェント構成に対しても適応性が高まっています。SWE-Bench Verifiedにおいて、CodeBuddy、Cline、KiloCodeといった異なるフレームワーク間での精度差は4％以内に抑えられています。

**知識の正確性とハルシネーション防止**：「根拠がある場合は回答し、証拠が不足している場合はその旨を伝え、情報源を混同したり偽のデータを作り出したりしない」という方針のもと、細かなデータ洗浄や学習制約を導入しました。実環境を想定した社内評価では、Hy3のハルシネーション発生率が12.5％から5.4％へ、常識的な誤り率も25.4％から12.7％へとそれぞれ低下しました。これにより、事実の混同や虚偽生成、論理的矛盾の発生が大幅に抑制されています。

**複雑なコンテキストの維持と複数ターンの意図追跡**：SFTおよびRLの共同最適化によって、照応関係の解決、省略情報の復元、複数ターンにわたる制約条件の継承といった運用上の課題が改善されました。社内で実施した総合的な複数ターン評価では、問題発生率が17.4％から7.9％へと減少しています。また、MRCRなどの長時間対話評価でも大きく向上しており、長期間にわたる対話においても複雑な意図が損なわれたり逸脱したりすることなく、より簡潔な出力が可能になっています。

## ベンチマーク付録

<p align="center">
  <img src="assets/benchmark-appendix.png" width="100%"/>
</p>

## ニュース

* 🔥 **Hy3**および**Hy3-FP8**のモデル重みを [Hugging Face](https://huggingface.co/tencent/Hy3)、[ModelScope](https://modelscope.cn/models/Tencent-Hunyuan/Hy3)、[GitCode](https://ai.gitcode.com/tencent_hunyuan/Hy3)、[CNB](https://cnb.cool/ai-models/tencent/Hy3) にてオープンソース化しました。

## モデルリンク

| モデル名 | 説明 | Hugging Face | ModelScope | GitCode | CNB |
|:---|:---|:---:|:---:|:---:|:---:|
| Hy3 | 指示応答用モデル | 🤗 [モデル](https://huggingface.co/tencent/Hy3) | [モデル](https://modelscope.cn/models/Tencent-Hunyuan/Hy3) | [モデル](https://ai.gitcode.com/tencent_hunyuan/Hy3) | [モデル](https://cnb.cool/ai-models/tencent/Hy3) |
| Hy3-FP8 | FP8量子化版の指示応答用モデル | 🤗 [モデル](https://huggingface.co/tencent/Hy3-FP8) | [モデル](https://modelscope.cn/models/Tencent-Hunyuan/Hy3-FP8) | [モデル](https://ai.gitcode.com/tencent_hunyuan/Hy3-FP8) | [モデル](https://cnb.cool/ai-models/tencent/Hy3-FP8) |

## クイックスタート

まず [vLLM](#vllm) または [SGLang](#sglang) を用いてHy3をデプロイした後、OpenAI互換のAPIを呼び出してください。

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8000/v1", api_key="EMPTY")

response = client.chat.completions.create(
    model="hy3",
    messages=[
        {"role": "user", "content": "Hello! Can you briefly introduce yourself?"},
    ],
    temperature=0.9,
    top_p=1.0,
    # reasoning_effort: "no_think"（デフォルト、直接回答）、"low"、"high"（深い思考過程）
    extra_body={"chat_template_kwargs": {"reasoning_effort": "no_think"}},
)
print(response.choices[0].message.content)
```

> **推奨パラメータ**：`temperature=0.9`、`top_p=1.0`。
>
> **推論モード**：数学、コーディング、論理的思考など複雑なタスクには `reasoning_effort` を `"high"` に、単純な回答が必要な場合は `"no_think"` に設定してください。

APIサーバーの起動方法については、以下の [デプロイメント](#deployment) セクションをご覧ください。

## デプロイメント

Hy3の総パラメータ数は2950億です。8枚のGPUで稼働させる場合、H20-3eやそれ以上のメモリ容量を持つGPUの利用を推奨します。

本番環境での運用には、Hy3向けの専用手順書を提供している vLLM または SGLang の使用をお勧めします。

- [vLLM](https://github.com/vllm-project/vllm) – [vLLMレシピ](https://recipes.vllm.ai/tencent/Hy3) を参照
- [SGLang](https://docs.sglang.io/) – [SGLangクックブック](https://lmsysorg.mintlify.app/cookbook/autoregressive/Tencent/Hy3) を参照

### vLLM

ソースからvLLMをビルドします：
```bash
uv venv --python 3.12 --seed --managed-python
source .venv/bin/activate
git clone https://github.com/vllm-project/vllm.git
cd vllm
uv pip install --editable . --torch-backend=auto
```

MTPを有効化した状態でvLLMサーバーを起動します：

```bash
# mnnvlワークスペースのサイズ問題を回避するためtrtllmバックエンドに切り替える
export VLLM_FLASHINFER_ALLREDUCE_BACKEND=trtllm
vllm serve tencent/Hy3 \
  --tensor-parallel-size 8 \
  --speculative-config.method mtp \
  --speculative-config.num_speculative_tokens 2 \
  --tool-call-parser hy_v3 \
  --reasoning-parser hy_v3 \
  --enable-auto-tool-choice \
  --port 8000 \
  --served-model-name hy3
```

### SGLang

ソースからSGLangをビルドします：
```bash
git clone https://github.com/sgl-project/sglang
cd sglang
pip3 install pip --upgrade
pip3 install "transformers>=5.6.0"
pip3 install -e "python"
```

MTPを有効化した状態でSGLangサーバーを起動します：

```bash
python3 -m sglang.launch_server \
  --model tencent/Hy3 \
  --tp-size 8 \
  --tool-call-parser hunyuan \
  --reasoning-parser hunyuan \
  --speculative-num-steps 2 \
  --speculative-eagle-topk 1 \
  --speculative-num-draft-tokens 3 \
  --speculative-algorithm EAGLE \
  --port 8000 \
  --served-model-name hy3
```

## ファインチューニング

Hy3には完全なファインチューニングパイプラインが用意されています。詳細なドキュメントは [ファインチューニングガイド](./finetune/README.md) をご参照ください。

## 量子化

大規模モデル圧縮向けに、より使いやすく包括的かつ効率的なツールキットである [AngelSlim](https://github.com/tencent/AngelSlim) を提供しています。AngelSlimでは、一般的な量子化アルゴリズムや低ビット量子化、スペキュレーティブサンプリングなど、大規模マルチモーダルモデル向けのさまざまな圧縮手法を利用できます。

## ライセンス

Hy3は **Apache License 2.0** の下で公開されています。詳細は [LICENSE](./LICENSE) をご覧ください。

## お問い合わせ

研究開発・製品チームへのご意見・ご要望がございましたら、ぜひご連絡ください。メールでのお問い合わせも受け付けております。

📧 **hunyuan_opensource@tencent.com**

---

<p align="center">
  <i>Hy3はTencent Hyチームによって開発されました。</i>
</p>
