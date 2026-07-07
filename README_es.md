<p align="left">
    <a href="README_CN.md">Chino</a>&nbsp;｜&nbsp;Inglés
</p>
<br>

<p align="center">
 <img src="assets/logo-en.png" width="400"/> <br>
</p>

<div align="center" style="line-height: 1;">

[![Licencia](https://img.shields.io/badge/License-Apache%202.0-blue)](#license)
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
    🖥️&nbsp;<a href="https://aistudio.tencent.com/"><b>Sitio web oficial</b></a>&nbsp;&nbsp;|&nbsp;&nbsp;
    💬&nbsp;<a href="https://github.com/Tencent-Hunyuan/Hy3"><b>GitHub</b></a></p>

---

## Tabla de contenidos

- [Introducción al modelo](#model-introduction)
- [Capacidades de agente más potentes](#stronger-agent-capabilities)
- [Experiencias de producto más fiables](#more-reliable-product-experiences)
- [Apéndice de evaluaciones comparativas](#benchmark-appendix)
- [Noticias](#news)
- [Enlaces al modelo](#model-links)
- [Guía rápida](#quickstart)
- [Despliegue](#deployment)
  - [vLLM](#vllm)
  - [SGLang](#sglang)
- [Ajuste fino](#finetuning)
- [Cuantización](#quantization)
- [Licencia](#license)
- [Contáctenos](#contact-us)

---

## Introducción al modelo

**Hy3** es un modelo Mixture-of-Experts (MoE) con 295 mil millones de parámetros, de los cuales 21 mil millones están activos y 3,8 mil millones corresponden a la capa MTP. Fue desarrollado por el equipo Hy de Tencent. Tras el lanzamiento preliminar de Hy3 a finales de abril, recopilamos comentarios de más de 50 productos y ampliamos el entrenamiento posterior utilizando datos de mayor calidad. Hoy presentamos Hy3, que supera a otros modelos de tamaño similar e iguala a los principales modelos de código abierto que poseen entre 2 y 5 veces más parámetros. Además, muestra mejoras significativas en su utilidad para diversos productos y tareas de productividad.

| Propiedad | Valor |
|:---|:---|
| Arquitectura | Mixture-of-Experts (MoE) |
| Parámetros totales | 295 mil millones |
| Parámetros activados | 21 mil millones |
| Parámetros de la capa MTP | 3,8 mil millones |
| Número de capas (excluyendo la capa MTP) | 80 |
| Número de capas MTP | 1 |
| Cabezas de atención | 64 (GQA, 8 cabezas KV, dimensión de cabeza 128) |
| Tamaño oculto | 4096 |
| Tamaño intermedio | 13312 |
| Longitud de contexto | 256K |
| Tamaño del vocabulario | 120832 |
| Número de expertos | 192 expertos; se activan los 8 principales |
| Precisiones soportadas | BF16 |

## Capacidades de agente más potentes

Basándonos en la versión preliminar de Hy3, hemos mejorado aún más la calidad y diversidad de los datos de entrenamiento posterior, además de escalar el entrenamiento mediante RL. Hy3 presenta avances notables en tareas de razonamiento, gestión autónoma y contexto prolongado, manteniendo un nivel competitivo frente a modelos mucho más grandes y emblemáticos.

<p align="center">
  <img src="assets/benchmark.png" width="100%"/>
</p>

En escenarios de productividad como programación, trabajo de oficina, modelado financiero, diseño frontend y desarrollo de videojuegos, Hy3 ha logrado progresos destacados, convirtiéndose en una opción fiable y rentable para estas aplicaciones.

Consideramos que las puntuaciones de las evaluaciones públicas no reflejan toda la realidad. Por eso realizamos una evaluación ciega con 270 expertos, empleando tareas propias de su ámbito laboral. En dicha prueba, Hy3 obtuvo 2,67/4, superando a GLM-5.1, que quedó en 2,51/4. Esta ventaja fue especialmente notable en tareas de desarrollo frontend, manejo de datos y sistemas CI/CD.

## Experiencias de producto más fiables

La utilidad de un modelo no queda plenamente reflejada en las evaluaciones estándar. Gracias a la retroalimentación de múltiples productos, identificamos y corregimos varios problemas, lo que generó valoraciones positivas constantes por parte de los equipos de producto.

**Estabilidad en llamadas a herramientas y formatos de salida**: Solucionamos numerosos problemas básicos de fiabilidad, elevando el modelo a estándares aptos para producción en cuanto a configuraciones de herramientas y restricciones de salida. Asimismo, mejoramos la recuperación ante errores en llamadas a herramientas y la eficiencia general. Hy3 también se adapta bien a distintos entornos de agentes. En SWE-Bench Verified, la varianza en precisión entre entornos como CodeBuddy, Cline y KiloCode se mantiene por debajo del 4%.

**Conocimiento y reducción de alucinaciones**: Guiados por el principio de “responder cuando existan bases sólidas, indicarlo cuando falten evidencias, sin mezclar fuentes ni inventar datos”, implementamos una limpieza detallada de datos y restricciones durante el entrenamiento. En evaluaciones internas basadas en situaciones reales, la tasa de alucinaciones de Hy3 descendió del 12,5% al 5,4%, mientras que los errores de sentido común pasaron del 25,4% al 12,7%. Estas mejoras reducen notablemente la confusión de hechos, la invención de información y las contradicciones lógicas.

**Retención de contexto complejo y seguimiento de intenciones en diálogos múltiples**: Mediante la optimización conjunta de SFT y RL, Hy3 mejoró aspectos operativos críticos como la resolución de referencias, la recuperación de elipsis y la herencia de restricciones en conversaciones largas. En pruebas internas exhaustivas de diálogos múltiples, la tasa de fallos disminuyó del 17,4% al 7,9%. Además, Hy3 obtuvo resultados sobresalientes en evaluaciones de diálogos extensos como MRCR. Sus respuestas son ahora más concisas, sin perder la capacidad de preservar intenciones complejas a lo largo de interacciones prolongadas.

## Apéndice de evaluaciones comparativas

<p align="center">
  <img src="assets/benchmark-appendix.png" width="100%"/>
</p>

## Noticias

* 🔥 Hemos publicado en código abierto los pesos de los modelos **Hy3** y **Hy3-FP8** en [Hugging Face](https://huggingface.co/tencent/Hy3), [ModelScope](https://modelscope.cn/models/Tencent-Hunyuan/Hy3), [GitCode](https://ai.gitcode.com/tencent_hunyuan/Hy3) y [CNB](https://cnb.cool/ai-models/tencent/Hy3).

## Enlaces al modelo

| Nombre del modelo | Descripción | Hugging Face | ModelScope | GitCode | CNB |
|:---|:---|:---:|:---:|:---:|:---:|
| Hy3 | Modelo de instrucciones | 🤗 [Modelo](https://huggingface.co/tencent/Hy3) | [Modelo](https://modelscope.cn/models/Tencent-Hunyuan/Hy3) | [Modelo](https://ai.gitcode.com/tencent_hunyuan/Hy3) | [Modelo](https://cnb.cool/ai-models/tencent/Hy3) |
| Hy3-FP8 | Modelo de instrucciones cuantizado en FP8 | 🤗 [Modelo](https://huggingface.co/tencent/Hy3-FP8) | [Modelo](https://modelscope.cn/models/Tencent-Hunyuan/Hy3-FP8) | [Modelo](https://ai.gitcode.com/tencent_hunyuan/Hy3-FP8) | [Modelo](https://cnb.cool/ai-models/tencent/Hy3-FP8) |

## Guía rápida

Primero despliegue Hy3 mediante [vLLM](#vllm) o [SGLang](#sglang), y luego utilice la API compatible con OpenAI:

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8000/v1", api_key="EMPTY")

response = client.chat.completions.create(
    model="hy3",
    messages=[
        {"role": "user", "content": "¡Hola! ¿Podría presentarse brevemente?"},
    ],
    temperature=0.9,
    top_p=1.0,
    # reasoning_effort: "no_think" (por defecto, respuesta directa); "low", "high" (razonamiento profundo)
    extra_body={"chat_template_kwargs": {"reasoning_effort": "no_think"}},
)
print(response.choices[0].message.content)
```

> **Parámetros recomendados**: `temperature=0.9`, `top_p=1.0`.
>
> **Modo de razonamiento**: Para tareas complejas (matemáticas, programación, razonamiento), establezca `reasoning_effort` en `"high"`; para respuestas directas, use `"no_think"`.

Consulte la sección [Despliegue](#deployment) para saber cómo iniciar el servidor de API.

## Despliegue

Hy3 cuenta con un total de 295 mil millones de parámetros. Para desplegarlo en 8 GPU, recomendamos usar H20-3e u otras GPU con mayor capacidad de memoria.

Para entornos de producción, sugerimos emplear vLLM o SGLang, ambos disponen de instrucciones específicas para Hy3:

- [vLLM](https://github.com/vllm-project/vllm) – consulte [recetas para vLLM](https://recipes.vllm.ai/tencent/Hy3)

- [SGLang](https://docs.sglang.io/) – consulte el [manual de SGLang](https://lmsysorg.mintlify.app/cookbook/autoregressive/Tencent/Hy3)

### vLLM

Compile vLLM desde el código fuente:
```bash
uv venv --python 3.12 --seed --managed-python
source .venv/bin/activate
git clone https://github.com/vllm-project/vllm.git
cd vllm
uv pip install --editable . --torch-backend=auto
```

Inicie el servidor vLLM con la capa MTP habilitada:

```bash
# Cambie al backend trtllm para solucionar limitaciones de tamaño de espacio de trabajo mnnvl.
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

Compile SGLang desde el código fuente:
```bash
git clone https://github.com/sgl-project/sglang
cd sglang
pip3 install pip --upgrade
pip3 install "transformers>=5.6.0"
pip3 install -e "python"
```

Active el servidor SGLang con la capa MTP habilitada:

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

## Ajuste fino

Hy3 dispone de un flujo completo para el ajuste fino del modelo. Para obtener documentación detallada, consulte: [Guía de ajuste fino](./finetune/README.md)

## Cuantización

Ofrecemos [AngelSlim](https://github.com/tencent/AngelSlim), una herramienta más accesible, integral y eficiente para la compresión de modelos de gran tamaño. AngelSlim incluye un conjunto completo de utilidades para modelos multimodales a gran escala, entre ellas algoritmos habituales de cuantización, cuantización en baja precisión y muestreo especulativo.

## Licencia

Hy3 se distribuye bajo la **Licencia Apache 2.0**. Consulte [LICENSE](./LICENSE) para más detalles.

## Contáctenos

Si desea enviar mensajes a nuestros equipos de I+D y producto, no dude en contactarnos. También puede escribirnos por correo electrónico:

📧 **hunyuan_opensource@tencent.com**

---

<p align="center">
  <i>Hy3 ha sido desarrollado por el equipo Hy de Tencent.</i>
</p>
