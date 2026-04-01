// ==UserScript==
// @name         必应数据提取器
// @namespace    http://yourdomain.com/
// @version      5.0
// @description  自动翻页提取全部必应结果，通过 opener 实时回传，完成后自毁
// @match        https://cn.bing.com/search*
// @match        https://www.bing.com/search*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 配置 ----------
    const ITEMS_PER_PAGE = 10;        // 必应每页结果数（通常固定）
    const MAX_PAGES = 50;             // 最大页数限制（防止无限循环，实际可调大）
    const SCROLL_WAIT = 1000;         // 滚动等待时间(ms)
    const PAGE_CHANGE_WAIT = 1500;    // 翻页后等待加载时间(ms)

    // ---------- 状态管理 ----------
    let state = {
        first: 0,                     // 当前页的 first 参数
        results: [],                 // 累计结果（URL去重）
        pageCount: 0,               // 已处理页数
        isComplete: false           // 是否已完成全部提取
    };

    // 从 URL 中获取 first 参数
    function getFirstFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const first = parseInt(urlParams.get('first'), 10);
        return isNaN(first) ? 0 : first;
    }

    // 从 sessionStorage 恢复状态
    function loadState() {
        const saved = sessionStorage.getItem('bing_auto_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                state = { ...state, ...parsed };
                // 确保 results 是数组
                if (!Array.isArray(state.results)) state.results = [];
            } catch(e) {}
        }
        // 用当前页的 first 覆盖（确保一致性）
        const currentFirst = getFirstFromURL();
        if (state.first !== currentFirst) {
            state.first = currentFirst;
        }
    }

    // 保存状态到 sessionStorage
    function saveState() {
        sessionStorage.setItem('bing_auto_state', JSON.stringify({
            first: state.first,
            results: state.results,
            pageCount: state.pageCount,
            isComplete: state.isComplete
        }));
    }

    // 提取当前页面的所有结果（去重）
    function extractCurrentPage() {
        const results = [];
        const selectors = [
            '#b_results .b_algo',
            '.b_results .b_algo',
            '.b_algo',
            'li.b_algo',
            'div.b_algo'
        ];
        let items = [];
        for (let sel of selectors) {
            items = document.querySelectorAll(sel);
            if (items.length) break;
        }

        items.forEach(item => {
            let titleElem = item.querySelector('h2 a') || item.querySelector('.b_title a') || item.querySelector('a[href*="https://"]');
            if (!titleElem) return;
            let title = titleElem.innerText.trim();
            let url = titleElem.href;
            if (url && url.startsWith('/')) url = 'https://cn.bing.com' + url;

            let snippetElem = item.querySelector('.b_caption p') || item.querySelector('.b_snippet');
            let snippet = snippetElem ? snippetElem.innerText.trim() : '';

            // 过滤广告
            if (title.includes('广告') || url.includes('ad.doubleclick') || url.includes('go.microsoft.com')) return;
            if (title && url) results.push({ title, url, snippet, engine: 'bing' });
        });

        // 去重（基于URL）
        const unique = [];
        const seen = new Set();
        for (let r of results) {
            let key = r.url.replace(/\/$/, '');
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(r);
            }
        }
        return unique;
    }

    // 合并新结果到全局状态（去重）
    function mergeResults(newResults) {
        const existingUrls = new Set(state.results.map(r => r.url.replace(/\/$/, '')));
        for (let r of newResults) {
            let key = r.url.replace(/\/$/, '');
            if (!existingUrls.has(key)) {
                existingUrls.add(key);
                state.results.push(r);
            }
        }
    }

    // 发送当前累计结果给父窗口
    function sendResults() {
        if (!window.opener) return;
        const keyword = new URLSearchParams(window.location.search).get('q') || '';
        const message = {
            type: 'BING_RESULTS',
            keyword: keyword,
            results: state.results,
            pageCount: state.pageCount,
            totalExtracted: state.results.length,
            timestamp: Date.now(),
            url: window.location.href
        };
        window.opener.postMessage(message, '*');
        console.log(`[BingExtractor] 已发送 ${state.results.length} 条结果 (已处理 ${state.pageCount} 页)`);
    }

    // 构造下一页的 URL
    function getNextPageUrl() {
        const currentUrl = new URL(window.location.href);
        const nextFirst = state.first + ITEMS_PER_PAGE;
        currentUrl.searchParams.set('first', nextFirst);
        return currentUrl.href;
    }

    // 等待页面稳定（网络请求完成，DOM 更新）
    function waitForPageStable() {
        return new Promise(resolve => {
            // 简单延时 + 监听 load 事件
            const timeout = setTimeout(resolve, PAGE_CHANGE_WAIT);
            window.addEventListener('load', () => {
                clearTimeout(timeout);
                resolve();
            }, { once: true });
        });
    }

    // 检查是否有更多结果（根据当前页面的结果数判断）
    function hasMoreResults() {
        const currentResults = extractCurrentPage();
        return currentResults.length > 0;
    }

    // 核心流程：处理当前页，然后决定是否继续翻页
    async function process() {
        // 如果是首次运行，隐藏窗口（避免干扰）
        if (!state.pageCount) {
            // 将窗口移出可视区并最小化（由于跨域无法直接设置样式，但可以尝试）
            document.documentElement.style.overflow = 'hidden';
            document.body.style.margin = '0';
            document.body.style.padding = '0';
            // 尝试将窗口移动到左上角并缩小（仅影响视觉）
            window.moveTo(0, 0);
            window.resizeTo(1, 1);
        }

        // 提取当前页结果
        const pageResults = extractCurrentPage();
        if (pageResults.length === 0 && state.pageCount > 0) {
            // 如果当前页无结果且之前已有结果，可能已到底
            console.log('当前页无结果，停止翻页');
            state.isComplete = true;
            saveState();
            sendResults();
            closeWindow();
            return;
        }

        // 合并结果
        mergeResults(pageResults);
        state.pageCount++;
        saveState();
        sendResults();

        // 检查是否达到最大页数限制
        if (state.pageCount >= MAX_PAGES) {
            console.log(`已达到最大页数 ${MAX_PAGES}，停止翻页`);
            state.isComplete = true;
            saveState();
            sendResults();
            closeWindow();
            return;
        }

        // 尝试加载下一页
        const nextUrl = getNextPageUrl();
        // 跳转前保存状态
        sessionStorage.setItem('bing_auto_state', JSON.stringify(state));
        // 跳转到下一页
        window.location.href = nextUrl;
        // 注意：跳转后脚本将重新执行，所以不需要继续执行下面的代码
    }

    // 关闭窗口（由脚本打开的窗口）
    function closeWindow() {
        // 延迟关闭，确保最后一条消息已发送
        setTimeout(() => {
            window.close();
        }, 500);
    }

    // 启动流程
    async function start() {
        if (!window.opener) {
            // 没有父窗口，可能被单独打开，直接退出
            console.log('[BingExtractor] 无父窗口，退出');
            return;
        }

        // 加载状态
        loadState();

        // 如果已经完成，直接关闭
        if (state.isComplete) {
            closeWindow();
            return;
        }

        // 开始处理
        await process();
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();