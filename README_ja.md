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

**Hy3**は、Tencent Hyチームが開発した2950億パラメータを持つMixture-of-Experts（MoE）型モデルです。有効なパラメータ数は210億、MTPレイヤーのパラメータ数は38億です。4月下旬にHy3プレビュー版を公開した後、50以上の製品からフィードバックを得て、より高品質なデータを用いた事後訓練を行いました。今回リリースされるHy3は、同等規模の他モデルを上回り、パラメータ数が2〜5倍多い主要なオープンソースモデルにも匹敵する性能を示します。また、さまざまな製品や生産性タスクにおいても実用性が大幅に向上しています。


| 項目 | 値 |
|:---|:---|
| アーキテクチャ | Mixture-of-Experts（MoE） |
| 総パラメータ数 | 2950億 |
| 有効パラメータ数 | 210億 |
| MTPレイヤー・パラメータ数 | 38億 |
| レイヤー数（MTPレイヤー除く） | 80 |
| MTPレイヤー数 | 1 |
| アテンション・ヘッド数 | 64（GQA方式、KVヘッド数8、ヘッド次元128） |
| 隠れ層サイズ | 4096 |
| 中間層サイズ | 13312 |
| コンテキスト長 | 256K |
| 語彙数 | 120832 |
| エキスパート数 | 192種類、上位8つが有効化 |
| 対応精度 | BF16 |

## エージェント機能の強化

Hy3プレビュー版を基盤として、事後訓練用データの品質と多様性をさらに向上させ、RL訓練の規模も拡大しました。Hy3は推論能力、エージェント関連タスク、長文処理において確かな進歩を見せており、はるかに大規模な主要モデルにも十分対抗できる水準にあります。

<p align="center">
  <img src="assets/benchmark.png" width="100%"/>
</p>

コーディング、事務作業、金融モデリング、フロントエンド設計、ゲーム開発といった生産性シーンにおいてもHy3は顕著な進歩を遂げており、信頼性が高くコスト効率にも優れた選択肢となっています。

一般公開されているベンチマークのスコアだけでは全体像が見えないと考え、実際の業務で使用される課題を用いて270人の専門家によるブラインド評価も実施しました。その結果、Hy3は4点満点中2.67点を獲得し、2.51点だったGLM-5.1を上回りました。特にフロントエンド開発、データ・ストレージ管理、CI/CD関連タスクにおいてその優位性が顕著でした。

## 製品体験の信頼性向上

ベンチマークだけではモデルの有用性を完全に把握することはできません。多くの製品から寄せられたフィードバックを基に、以下の問題点を特定・修正した結果、各製品チームから一貫して好意的な反応を得ています。

**ツール呼び出しおよび出力形式の安定性**：いくつかの基本的な信頼性問題を解消し、各種ツール設定や出力制約下でも本番環境レベルの安定性を実現しました。ツール呼び出し時のエラー復旧能力や全体的な効率も向上しています。Hy3はさまざまなエージェント構成に対しても汎化性を示します。SWE-Bench Verifiedにおける検証では、CodeBuddy、Cline、KiloCodeといった各構成下での精度差は最大でも4％以内に収まっています。

**知識の正確性とハルシネーション抑制**：「根拠がある場合は回答し、証拠が不足している場合はその旨を伝え、情報源を混同したり偽のデータを生成したりしない」という方針のもと、細かなデータクリーニングや訓練制約を導入しました。実際の利用シーンを想定した社内評価では、Hy3のハルシネーション発生率が12.5％から5.4％へ、常識的な誤り率も25.4％から12.7％へと減少しました。これらの改善により、事実の混同や虚偽情報の生成、論理的矛盾の発生が大幅に抑えられています。

**複雑な文脈の維持と複数ターンの意図追跡**：SFTおよびRLの共同最適化を通じて、照応関係の解決、省略表現の補完、複数ターンにわたる制約条件の継承といった運用上の課題が改善されました。社内で実施した包括的な複数ターン評価では、問題発生率が17.4％から7.9％へと低下しています。またMRCRなどの長時間対話評価においてもHy3は顕著な向上を示しており、長期間にわたる対話の中でも複雑な意図が損なわれたり逸脱したりすることなく、より簡潔な出力が可能になっています。

## ベンチマーク付録

<p align="center">
  <img src="assets/benchmark-appendix.png" width="100%"/>
</p>

## ニュース

* 🔥 **Hy3**および**Hy3-FP8**のモデル重みを、[Hugging Face](https://huggingface.co/tencent/Hy3)、[ModelScope](https://modelscope.cn/models/Tencent-Hunyuan/Hy3)、[GitCode](https://ai.gitcode.com/tencent_hunyuan/Hy3)、[CNB](https://cnb.cool/ai-models/tencent/Hy3)にてオープンソース化しました。

## モデルリンク

| モデル名 | 説明 | Hugging Face | ModelScope | GitCode | CNB |
|:---|:---|:---:|:---:|:---:|:---:|
| Hy3 | 指示応答用モデル | 🤗 [モデル](https://huggingface.co/tencent/Hy3) | [モデル](https://modelscope.cn/models/Tencent-Hunyuan/Hy3) | [モデル](https://ai.gitcode.com/tencent_hunyuan/Hy3) | [モデル](https://cnb.cool/ai-models/tencent/Hy3) |
| Hy3-FP8 | FP8量子化版指示応答モデル | 🤗 [モデル](https://huggingface.co/tencent/Hy3-FP8) | [モデル](https://modelscope.cn/models/Tencent-Hunyuan/Hy3-FP8) | [モデル](https://ai.gitcode.com/tencent_hunyuan/Hy3-FP8) | [モデル](https://cnb.cool/ai-models/tencent/Hy3-FP8) |

## クイックスタート

まず[vLLM](#vllm)または[SGLang](#sglang)を用いてHy3をデプロイした後、OpenAI互換のAPIを呼び出します：

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
    # reasoning_effort: "no_think"（デフォルトで直接回答）、"low"、"high"（深い思考過程を生成）
    extra_body={"chat_template_kwargs": {"reasoning_effort": "no_think"}},
)
print(response.choices[0].message.content)
```

> **推奨パラメータ**：`temperature=0.9`、`top_p=1.0`。
>
> **推論モード**：数学、コーディング、論理的思考を要する複雑なタスクには`reasoning_effort`を`"high"`に、直接的な回答が必要な場合は`"no_think"`に設定してください。

APIサーバーの起動方法については、以下の[デプロイメント](#deployment)セクションをご覧ください。

## デプロイメント

Hy3は総パラメータ数が2950億に達します。8枚のGPUで運用する場合、H20-3eやそれ以上のメモリ容量を持つGPUの利用を推奨します。

本番環境での運用には、Hy3向けの専用手順書を提供しているvLLMまたはSGLangの使用を推奨します：

- [vLLM](https://github.com/vllm-project/vllm) – [vLLM手順書](https://recipes.vllm.ai/tencent/Hy3)を参照

- [SGLang](https://docs.sglang.io/) – [SGLangクックブック](https://lmsysorg.mintlify.app/cookbook/autoregressive/Tencent/Hy3)を参照

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

Hy3には完全なファインチューニングパイプラインが用意されています。詳細なドキュメントは[ファインチューニングガイド](./finetune/README.md)をご参照ください。

## 量子化

大規模モデル圧縮用の使いやすく、包括的かつ効率的なツールキットとして[AngelSlim](https://github.com/tencent/AngelSlim)を提供しています。AngelSlimは一般的な量子化アルゴリズムや低ビット量子化、推測サンプリングなど、大規模マルチモーダルモデル向けのさまざまな圧縮ツール群を備えています。

## ライセンス

Hy3は**Apache License 2.0**のもとで公開されています。詳細は[LICENSE](./LICENSE)をご覧ください。

## お問い合わせ

研究開発・製品チームへのメッセージをお寄せいただく場合は、どうぞお気軽にお問い合わせください。メールでのお問い合わせも受け付けております：

📧 **hunyuan_opensource@tencent.com**

---

<p align="center">
  <i>Hy3はTencent Hyチームによって開発されました。</i>
</p>
