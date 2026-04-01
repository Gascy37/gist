# gist AI
Scrape the web. Summarize the signal.  /  抓取全网，提炼关键。

轻搜·AI智搜版 (LightSearch · AI Smart Search)

A lightweight, browser-based search aggregator that automatically crawls Bing search results and uses AI to summarize and analyze the top results. No backend required — runs entirely in your browser.

English | 中文

---

English

Overview

LightSearch is a smart search tool that combines traditional search engine crawling with AI-powered summarization. It opens a silent Bing window in the background, extracts all pages automatically, and then lets you use your DeepSeek API key to summarize the results. All settings, search history, and AI analysis are saved locally, so you never lose your data.

Features

· 🔍 Auto Crawl – One-click to start crawling Bing search results (supports unlimited pages, auto‑stop after 50 pages or no more results).
· 🧠 AI Summary – Send the top N results (10–100) to DeepSeek AI with a custom prompt; get a structured, well-formatted summary.
· 🎨 Customizable Interface – Light/dark mode, accent color picker, hide any element (title, URL, snippet, tag, API key, whole AI panel).
· 📄 Pagination & Display – Adjustable items per page (10–50), clickable pagination with “go to top” button.
· 💾 Full Local Persistence – All search results, AI summaries, settings, and conversations are saved automatically and restored after refresh or crash.
· 📦 One-click Plugin – Built-in user script (Tampermonkey) for Bing extraction, with copy/download options.
· 📱 Mobile Friendly – Responsive design works on all devices.

How to Use

1. Install the plugin
      Click the “Download Plugin” section, copy the script code and install it in Tampermonkey (or download the .js file and import it).
2. Search
      Enter your keyword and click “自动搜索”. A silent Bing window will open and automatically flip through all pages. Once finished, results appear on the page.
3. AI Analysis (optional)
   · Fill in your DeepSeek API key (get one from platform.deepseek.com).
   · Enter your instruction in the AI prompt box (or leave it blank to use the default).
   · Click the “✨ AI 总结” button. The AI will analyze the top N results (you can set the number in Settings) and display a clean report.
   · Use the “🔍 全屏查看” button to read the report in full-screen mode.
4. Customize
      Open the settings panel (⚙) to adjust page size, AI analysis count, theme, accent color, and hide any UI elements you don’t need.

Technical Stack

· Frontend: HTML5, CSS3, Vanilla JavaScript (no frameworks)
· Crawler: Tampermonkey user script (embedded) – uses window.open + postMessage to communicate
· AI: DeepSeek Chat API (streaming)
· Storage: localStorage for settings and full state; sessionStorage for temporary crawling state
· Markdown: marked.js (loaded on‑demand)

Installation

1. Download the index.html file.
2. Open it in any modern browser (Chrome, Edge, Safari, Firefox).
3. Install Tampermonkey extension if you want to use the automatic crawling feature.
4. No server, no database, no installation — just a single file.

Notes

· The Bing crawler script uses window.open; allow pop-ups for the site.
· API calls are made directly from your browser to DeepSeek – your API key stays on your device.
· If you close the page unexpectedly, everything is automatically saved and restored.

License

MIT License – free to use, modify, and share.

---

中文

简介

轻搜·AI智搜版 是一个轻量级、纯前端的搜索聚合工具。它自动抓取必应搜索的全部结果，并利用 AI（DeepSeek）对前 N 条结果进行智能总结。无需后端，所有数据都保存在你的浏览器中。

主要功能

· 🔍 自动抓取 – 一键启动，后台静默翻遍必应所有结果页（最多 50 页或抓完为止）。
· 🧠 AI 总结 – 将前 10–100 条结果发送给 DeepSeek AI，按你的指令生成结构化总结报告。
· 🎨 高度自定义 – 深浅色模式、主题色自定义、可隐藏标题/链接/摘要/标签/API 密钥/整个 AI 板块。
· 📄 分页与显示 – 可调节每页条数（10–50），分页控件支持跳转页码和回到顶部。
· 💾 完全本地持久化 – 搜索结果、AI 总结、设置、甚至当前阅读进度都会自动保存，刷新或意外关闭后恢复。
· 📦 一键获取插件 – 内置必应抓取用户脚本，支持复制代码或下载 .js 文件。
· 📱 移动端适配 – 响应式布局，手机也能流畅使用。

使用方法

1. 安装插件
      点击“📦 下载插件”展开内容，复制脚本代码到 Tampermonkey 中安装（或直接下载 .js 文件导入）。
2. 开始搜索
      输入关键词，点击“自动搜索”。会弹出一个必应窗口并自动翻页，抓取完成后结果自动显示在页面中。
3. AI 分析（可选）
   · 在 DeepSeek API 密钥框填入你的密钥（可从 platform.deepseek.com 获取）。
   · 在 AI 指令输入框输入你想要的总结要求（留空则使用默认提示）。
   · 点击“✨ AI 总结”按钮，稍等片刻即可看到结构化的分析报告。
   · 点击“🔍 全屏查看”可在全屏模式下阅读报告。
4. 个性化设置
      点击 ⚙ 打开设置面板，调整每页数量、AI 分析数量、主题色、隐藏不需要的界面元素等。

技术栈

· 前端：HTML5 / CSS3 / 原生 JavaScript（无框架）
· 抓取：Tampermonkey 用户脚本（内嵌），通过 window.open + postMessage 跨窗口通信
· AI：DeepSeek Chat API（支持流式输出）
· 存储：localStorage 存储设置和完整状态，sessionStorage 暂存抓取进度
· Markdown：marked.js（按需加载）

安装与运行

1. 下载 index.html 文件。
2. 用现代浏览器（Chrome、Edge、Safari、Firefox 等）打开。
3. 如需自动抓取功能，请安装 Tampermonkey 扩展。
4. 无需服务器、无需数据库，单文件即开即用。

注意事项

· 必应抓取脚本会打开新窗口，请允许该站点的弹出窗口。
· API 请求直接从你的浏览器发送到 DeepSeek，API 密钥不会被上传到任何第三方服务器。
· 如果页面意外关闭，所有数据会自动保存，再次打开即可恢复。

许可证

MIT 许可证 – 可自由使用、修改和分享。
