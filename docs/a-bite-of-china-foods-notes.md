# 《舌尖上的中国》美食数据表说明

数据文件：`docs/a-bite-of-china-foods.csv`

## 字段
- `id`：稳定数据 ID，可用于前端 key。
- `season` / `episode` / `episodeTitle`：节目季、集数、集名。
- `foodName`：节目登场或公开资料点名的美食、食材、饮品或食俗名称。
- `province` / `city` / `regionText`：项目地图需要的地域字段。资料未明确到城市时，`city` 留空，`regionText` 保留节目或公开资料中的地域语义。
- `category`：用于前端筛选或卡片标签，如主食、菜肴、食材、点心、海鲜、腌腊、发酵等。
- `description`：弹窗简介字段，当前为节目登场信息的简短描述。
- `imageUrl` / `imageAlt`：图片素材字段。当前不填 `imageUrl`，避免默认接入版权或授权状态不明的图片；`imageAlt` 已按美食名预填。
- `audioUrl`：方言音频字段。当前不填，后续必须接入来源清晰、可授权使用的音频。
- `sourceName` / `sourceUrl`：数据来源名称与链接。
- `sourceStatus`：`listed` 表示来源提供登场美食清单；`official-mentioned` 表示央视公开简介点名；`mentioned` 表示媒体或视频标题点名。
- `locationConfidence`：地域映射置信度。`high` 为明确地域或高度确定；`medium` 为常见归属或来源部分明确；`low` 为节目资料未明确，暂不建议直接用于地图主数据。

## 来源边界
- 第一至第三季：以维基百科《舌尖上的中国》页面的分集“美食及厨房”清单为基础整理。
- 第四季：截至 2026-07-18，央视网第四季节目页和公开媒体资料没有提供完整逐集美食清单；本表只录入当前可核查、公开资料明确点名的条目。
- 表中 `imageUrl` 与 `audioUrl` 故意留空。项目规则要求素材来源清晰，不能把节目原声或版权不明图片作为默认素材。

## 前端使用建议
- 地图首版只使用 `locationConfidence` 为 `high` 或 `medium` 且 `province` 非空的记录。
- 同一省份轮播可以按 `season`、`episode` 排序，再按 `category` 做标签。
- 详情弹窗可直接读取 `foodName`、`province`、`city`、`description`、`imageAlt`。
- 缺失图片时使用项目内统一占位图；缺失音频时不显示音频来源或显示非阻塞提示。
