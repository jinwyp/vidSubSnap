# 网页爬虫工具 - 抓取列表页面URL

这是一个简单的网页爬虫工具，使用 axios 和 cheerio 来抓取列表页面中的所有URL。

## 安装依赖

```bash
npm install
```

## 使用方法

### 1. 基本使用

```javascript
const { SimpleWebCrawler } = require('./download_pdf.js');

const crawler = new SimpleWebCrawler();

// 抓取单个列表页面
const urls = await crawler.extractUrlsFromListPage('https://example.com/list', {
    linkSelector: 'a[href*="/detail/"]', // CSS选择器
    containerSelector: '.content-list'   // 容器选择器（可选）
});

// 保存结果
await crawler.saveUrlsToFile(urls, 'results.json');
```

### 2. 高级配置

```javascript
const crawler = new SimpleWebCrawler({
    timeout: 30000,  // 请求超时时间
    delay: 2000,     // 请求间隔延迟
    headers: {       // 自定义请求头
        'Referer': 'https://example.com'
    }
});

const selectors = {
    linkSelector: 'a[href]',           // 链接选择器
    titleSelector: '.title',           // 标题选择器
    containerSelector: '.list-item',   // 容器选择器
    filterPattern: '/content/'         // URL过滤模式
};
```

### 3. 多页面抓取

```javascript
const listUrls = [
    'https://example.com/list?page=1',
    'https://example.com/list?page=2',
    'https://example.com/list?page=3'
];

const allUrls = await crawler.extractUrlsFromMultiplePages(listUrls, selectors);
```

## 配置选项

### 爬虫配置 (SimpleWebCrawler options)

- `timeout`: 请求超时时间（毫秒），默认 30000
- `delay`: 请求间隔延迟（毫秒），默认 1000
- `headers`: 自定义HTTP请求头
- `userAgent`: 用户代理字符串

### 选择器配置 (selectors)

- `linkSelector`: CSS选择器，用于选择链接元素，默认 'a[href]'
- `titleSelector`: CSS选择器，用于获取链接标题（可选）
- `containerSelector`: CSS选择器，限制搜索范围的容器（可选）
- `filterPattern`: 字符串或正则表达式，用于过滤URL（可选）

## 输出格式

工具支持多种输出格式：

- JSON格式 (.json): 包含完整的URL信息
- CSV格式 (.csv): 表格形式，方便Excel打开
- 文本格式 (.txt): 简单的URL列表

## 示例输出

```json
[
  {
    "url": "https://example.com/detail/123",
    "title": "文章标题",
    "originalHref": "/detail/123",
    "index": 1,
    "sourceListPage": "https://example.com/list"
  }
]
```

## 注意事项

1. 请合理设置请求延迟，避免对目标网站造成过大压力
2. 某些网站可能有反爬虫机制，请根据需要调整请求头
3. 对于需要登录的页面，可能需要额外配置Cookie
4. 大量数据抓取时建议分批进行

## 常见问题

**Q: 抓取不到数据怎么办？**
A: 检查CSS选择器是否正确，可以在浏览器开发者工具中测试选择器

**Q: 被网站拒绝访问怎么办？**
A: 调整User-Agent和请求头，增加请求延迟时间

**Q: 如何处理相对URL？**
A: 工具会自动将相对URL转换为绝对URL
