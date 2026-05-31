# 共鸣树项目说明

这是一个纯静态前端项目，包含协会选择、世界观展示和共鸣树可视化页面。当前重点资产是共鸣树：树干按小树干、中树干、大树干三个阶段切换，每个阶段用一张稀疏底图叠加四个协会枝桠的适中/茂密状态图。

## 运行方式

在项目根目录启动本地静态服务：

```powershell
python -m http.server 4176 --bind 127.0.0.1
```

常用入口：

- `http://127.0.0.1:4176/index.html`：协会测评入口
- `http://127.0.0.1:4176/world.html`：世界观页面
- `http://127.0.0.1:4176/tree.html`：共鸣树页面
- `http://127.0.0.1:4176/tree.html?preset=stage2&debug=1`：共鸣树调试页面，可手动微调枝桠位置

## 目录结构

```text
.
├─ index.html                 # 协会测评页面
├─ world.html                 # 世界观页面
├─ tree.html                  # 共鸣树页面
├─ styles.css                 # 全站样式与共鸣树样式
├─ src/
│  ├─ app.js                  # 测评页交互逻辑
│  ├─ world.js                # 世界观页交互逻辑
│  ├─ tree.js                 # 共鸣树渲染、分数映射、调试面板
│  └─ api/
│     ├─ communityData.js     # 社群/协会数据读取
│     └─ report.js            # 测评报告逻辑
├─ data/
│  ├─ associations.json       # 四个协会基础信息
│  ├─ community-mock.json     # 社群页模拟数据
│  ├─ questions.json          # 测评题库
│  ├─ tree-config.json        # 共鸣树阶段、阈值、资源路径、枝桠对齐配置
│  └─ tree-mock.json          # 共鸣树调试预设分数
└─ assets/
   ├─ cards/
   │  ├─ logic.svg            # 逻辑构序图标
   │  ├─ sense.svg            # 感官铸型图标
   │  ├─ soul.svg             # 灵魂编织图标
   │  └─ rules.svg            # 规则制定图标
   └─ tree/
      └─ resonance-art/
         ├─ stage1/           # 小树干资源
         ├─ stage2/           # 中树干资源
         └─ stage3/           # 大树干资源
```

## 共鸣树资源规则

每个阶段目录都保持同一套命名：

```text
base-sparse.png
logic-medium.png
logic-lush.png
sense-medium.png
sense-lush.png
soul-medium.png
soul-lush.png
rules-medium.png
rules-lush.png
```

- `base-sparse.png` 是该树干阶段的稀疏底图，包含树干和四个协会的稀疏枝桠。
- `{association}-medium.png` 是单个协会枝桠的适中状态叠加图。
- `{association}-lush.png` 是单个协会枝桠的茂密状态叠加图。
- 当前协会 ID 固定为 `logic`、`sense`、`soul`、`rules`。
- 图片资源应保持透明 PNG，并使用一致画布尺寸，避免渲染时产生额外缩放误差。

## 共鸣树配置

`data/tree-config.json` 是共鸣树的核心配置文件：

- `stageThresholds` 控制小树干、中树干、大树干的分数阈值。
- `branchThresholds` 控制枝桠从稀疏到适中、茂密的阈值。
- `compositeAssets` 维护每个阶段的底图和枝桠资源路径。
- `branchAlignments` 保存各阶段、各协会、各密度的 `x`、`y`、`scale`、`rotate` 对齐参数。

如果需要继续调枝桠位置，打开：

```text
tree.html?preset=stage2&debug=1
```

在调试面板选择阶段、枝桠和密度后调整参数，使用“复制当前对齐 JSON”把结果写回 `data/tree-config.json`。

## 资源维护约定

- 运行态只保留页面实际引用的图片资源。
- 历史生成预览、拆图脚本、单片叶子素材和临时抠图文件不放在项目目录内。
- 新增共鸣树图片时，优先放入对应的 `assets/tree/resonance-art/stageX/` 目录，并遵守现有命名规则。
- 如需重新引入批处理脚本，建议放入独立工具目录，并在 README 中补充用途和输出位置。
