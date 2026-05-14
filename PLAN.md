# 双文档"找茬器" — 实现规划

## Context

做一个网页版工具，用户上传/粘贴两份文档，AI 自动找出矛盾点、遗漏项、不一致之处，左右分栏 + 红色高亮标注，视觉冲击强。

技术选型：React + Vite + TypeScript + Tailwind CSS，纯前端 SPA，直接调用 OpenAI 兼容 API。

---

## API 配置

- **请求地址**：用户自行配置（支持 OpenAI 兼容格式）
- **API Key**：用户自行配置（存储在浏览器 localStorage）
- **模型名称**：用户自行配置
- **接口格式**：OpenAI 兼容（`/v1/chat/completions`）

---

## 项目结构

```
0513_zhaocha/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── index.html
├── .env                           # VITE_API_KEY, VITE_API_BASE
└── src/
    ├── main.tsx
    ├── App.tsx                    # 顶层状态 + 视图切换（编辑/结果）
    ├── index.css                  # Tailwind + 自定义高亮样式
    ├── types/index.ts             # 所有 TypeScript 接口
    ├── constants/index.ts         # API 配置、示例文档
    ├── services/
    │   ├── ai.ts                  # Streaming fetch 调用 AI API
    │   ├── prompt.ts              # System prompt + User prompt 构建
    │   └── parser.ts              # 从流式文本中提取 JSON 结果
    ├── hooks/
    │   ├── useComparison.ts       # 编排 hook：触发对比、管理状态
    │   └── useStreamingAI.ts      # 底层流式请求 hook
    ├── components/
    │   ├── Header.tsx             # 标题栏
    │   ├── SplitEditor.tsx        # 编辑阶段：左右文本输入区
    │   ├── DocumentPanel.tsx      # 单个文档输入面板
    │   ├── ComparisonView.tsx     # 结果阶段：左右高亮对比
    │   ├── AnnotatedPanel.tsx     # 单个文档高亮渲染面板
    │   ├── IssueSidebar.tsx       # 右侧问题列表
    │   ├── IssueCard.tsx          # 单个问题卡片
    │   ├── SummaryBar.tsx         # 顶部统计条
    │   └── LoadingOverlay.tsx     # 分析中加载动画
    └── utils/
        └── lineMapping.ts         # 行号映射辅助
```

---

## 核心数据模型

```typescript
type IssueType = 'CONTRADICTION' | 'OMISSION' | 'INCONSISTENCY' | 'AMBIGUITY';
type Severity = 'critical' | 'warning' | 'info';

interface ComparisonIssue {
  id: string;
  type: IssueType;
  severity: Severity;
  title: string;
  description: string;
  documentA: { lineStart: number | null; lineEnd: number | null; excerpt: string };
  documentB: { lineStart: number | null; lineEnd: number | null; excerpt: string };
  suggestion: string;
}

interface ComparisonResult {
  summary: string;
  issues: ComparisonIssue[];
  stats: { totalIssues: number; critical: number; warning: number; info: number };
}
```

---

## AI Prompt 设计要点

- System prompt 要求 AI 输出严格 JSON，包含行号引用
- User prompt 将两份文档加行号前缀（`1: xxx`）传入
- temperature = 0.2 保证稳定输出
- 要求 AI 输出 4 种问题类型：矛盾(CONTRADICTION)、遗漏(OMISSION)、不一致(INCONSISTENCY)、模糊(AMBIGUITY)

---

## UI/UX 流程

1. **输入阶段**：左右分栏文本框，支持粘贴/上传 .txt/.md，提供"加载示例"一键填充
2. **分析阶段**：点击"开始找茬"，显示流式加载动画 + 已发现问题数实时递增
3. **结果阶段**：
   - 左右分栏变为只读高亮视图
   - 行级彩色标注（红=严重矛盾，橙=不一致，黄=遗漏）
   - 右侧 issue 卡片列表，点击跳转到对应行
   - 顶部统计条显示问题数量分布
   - "返回编辑"按钮可重新修改

---

## 视觉高亮方案

不使用 diff 库，自定义逐行渲染：
- 每行是一个 div，通过 data-line 属性对应行号
- 有问题的行加 `border-left: 4px solid #ef4444` + 浅红背景
- 选中问题时目标行 pulse 动画
- 两面板间用 SVG 曲线连接对应问题区域（锦上添花）

---

## 依赖（极简）

Runtime: react, react-dom
Dev: vite, @vitejs/plugin-react, typescript, tailwindcss, postcss, autoprefixer, lucide-react（图标）

---

## 实现分阶段

### Phase 1: 脚手架 + 输入 UI
- 初始化 Vite + React + TS + Tailwind 项目
- 实现 Header、SplitEditor、DocumentPanel
- 文件上传（FileReader）+ 示例文档加载
- **验证**：两侧能正常输入/上传文本

### Phase 2: AI 对接 + 流式调用
- 实现 services/ai.ts（SSE streaming fetch）
- 实现 services/prompt.ts（构建 prompt）
- 实现 services/parser.ts（从流式文本提取 JSON）
- 实现 useComparison hook 编排流程
- **验证**：点击按钮能调通 API 并拿到结构化结果

### Phase 3: 结果展示 + 高亮标注
- 实现 ComparisonView、AnnotatedPanel 逐行高亮渲染
- 实现 IssueSidebar、IssueCard
- 点击 issue 同步滚动两侧面板到对应行
- 实现 SummaryBar 统计
- **验证**：完整流程跑通，视觉效果达到 demo 标准

### Phase 4: 打磨
- 加载动画优化
- SVG 连接线（可选）
- 筛选过滤（按类型/严重程度）
- 准备 2-3 组精心设计的示例文档对
- 边界处理（空文档、API 超时、非法 JSON）

---

## 验证方式

1. `npm run dev` 启动后访问 localhost
2. 点击"加载示例"填入 PRD vs 技术方案示例
3. 点击"开始找茬"，确认：
   - 流式加载有反馈
   - 结果展示有高亮标注
   - 点击 issue 能跳转定位
4. 测试自定义文本粘贴/上传 .txt 文件
5. 测试空文档等边界情况的错误提示
