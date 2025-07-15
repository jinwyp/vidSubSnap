const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * 网页爬虫类 - 使用 axios 和 cheerio 抓取列表页面的URL
 */
class SimpleWebCrawler {
    constructor(options = {}) {
        this.headers = {
            'User-Agent': options.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            ...options.headers
        };
        
        this.timeout = options.timeout || 30000; // 默认30秒超时
        this.delay = options.delay || 1000; // 默认延迟1秒
        
        // 配置 axios 实例
        this.axiosInstance = axios.create({
            timeout: this.timeout,
            headers: this.headers,
            maxRedirects: 5,
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            }
        });
    }

    /**
     * 获取网页HTML内容
     * @param {string} url - 要抓取的URL
     * @returns {string} HTML内容
     */
    async fetchHtml(url) {
        try {
            console.log(`正在抓取页面: ${url}`);
            
            const response = await this.axiosInstance.get(url);
            
            if (response.status === 200) {
                console.log(`成功获取页面内容，长度: ${response.data.length} 字符`);
                return response.data;
            } else {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            console.error(`获取页面失败: ${url}`, error.message);
            throw error;
        }
    }

    /**
     * 获取POST json 数据
     * @param {string} url - 要Post的URL
     * @returns {array} JSON内容
     */
    async fetchPostJson(url, data = {}) {
        console.log(`正在获取POST数据: ${url}`);
        const response = await this.axiosInstance.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            console.log(`成功获取POST数据，长度: ${JSON.stringify(response.data).length} 字符`);
            return response.data;
        } else {
            throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
        }
    }

    /**
     * 处理 POST 获取的 json 数据 上海空中课堂获取的课程列表数据
     * @param {string} url - 要Post的URL
     * @returns {array} JSON内容
     */
    async processPostJsonSHSmartEDU(url, data = {}) {
        const resultJson1 = await this.fetchPostJson(url, data);
        // 处理数据
        if (!resultJson1 ) {
            throw new Error('获取的数据为空');
        }
        if (resultJson1.code !== "200" || !resultJson1.success) {
            throw new Error('获取的数据错误');
        }

        if (!Array.isArray(resultJson1.data.list)) {
            throw new Error('获取的数据不是数组');
        }

        // 提取课程信息
        let tempClassList = [];
        if (resultJson1.data.list.length === 0) {
            console.warn('没有找到任何课程数据');
            return tempClassList;
        }

        resultJson1.data.list.forEach(item => {
            const tempClass = {
                subjectId: item.subjectId, // 课程ID
                courseId: item.subjectId,
                id: item.id,   // 每节课ID
                resourceId: item.id, // 资源ID
                applicableLearnerName: item.applicableLearnerName, // 五年级
                educationTypeName: item.educationTypeName, // 基础教育
                gradeName: item.gradeName, // 五年级
                volumeName: item.volumeName, // 第一学期
                subjectName: item.subjectName, // 数学
                teacher : item.teacher || '', // 沈睿贇
                resourceName: item.resourceName, // 符号表示数

                pictureUrl:item.pictureUrl,   // 课视频封面文件地址
                requestUrl: item.requestUrl,  // 课视频视频下载文件地址
                uploadFileName: item.uploadFileName, // 课视频文件名称
                
                resourceItem: item.resourceItem, // 课视频信息
                resourceLearnings: item.resourceLearnings || '', // 下载课程学习资源
            };
            tempClassList.push(tempClass);
        });

        // 每节课程URL
        // https://basic.sh.smartedu.cn/airclassroom/airClassroomTaskDetail?resource=1694227347399639040

        return tempClassList;
    }

    /**
     * 下载指定URL的 PDF, WORD文档, 图片, 视频文件到指定目录
     * @param {string} url - 要下载的URL
     * @param {string} downloadDir - 下载目录
     * @param {string} fileName - 下载的文件名
     * @param {boolean} showProgress - 是否显示下载进度，默认true
     * @returns {Promise<void>}
     */
    async downloadLargeFile(url, downloadDir, fileName, showProgress = true) {
        // 确保下载目录存在
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        const filePath = path.join(downloadDir, fileName);
        console.log(`\n===== 下载大文件: ${filePath}`);
        console.log(`下载URL: ${url}`);

        try {
            // 使用 stream 方式下载
            const response = await this.axiosInstance.get(url, {
                responseType: 'stream'
            });

            if (response.status !== 200) {
                throw new Error(`下载失败: HTTP ${response.status}`);
            }

            // 获取文件大小
            const totalLength = parseInt(response.headers['content-length'] || '0', 10);
            let downloadedLength = 0;
            let lastProgressTime = Date.now();

            // 创建写入流
            const writer = fs.createWriteStream(filePath);

            // 监听下载进度
            if (showProgress && totalLength > 0) {
                response.data.on('data', (chunk) => {
                    downloadedLength += chunk.length;
                    const now = Date.now();
                    
                    // 每500ms更新一次进度，避免输出过于频繁
                    if (now - lastProgressTime > 500) {
                        const progress = ((downloadedLength / totalLength) * 100).toFixed(1);
                        const downloadedMB = (downloadedLength / 1024 / 1024).toFixed(1);
                        const totalMB = (totalLength / 1024 / 1024).toFixed(1);
                        process.stdout.write(`\r下载进度: ${progress}% (${downloadedMB}MB/${totalMB}MB)`);
                        lastProgressTime = now;
                    }
                });
            }

            // 开始下载
            return new Promise((resolve, reject) => {
                response.data.pipe(writer);

                writer.on('finish', () => {
                    if (showProgress && totalLength > 0) {
                        process.stdout.write('\n'); // 换行
                    }
                    console.log(`✅ 文件下载完成: ${fileName}`);
                    console.log(`文件大小: ${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)}MB`);
                    resolve();
                });

                writer.on('error', (error) => {
                    console.error(`\n❌ 文件写入失败: ${error.message}`);
                    // 删除不完整的文件
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    reject(error);
                });

                response.data.on('error', (error) => {
                    console.error(`\n❌ 下载流错误: ${error.message}`);
                    writer.destroy();
                    // 删除不完整的文件
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    reject(error);
                });
            });

        } catch (error) {
            console.error(`❌ 下载失败: ${fileName}`, error.message);
            // 删除不完整的文件
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            throw error;
        }
    }

    /**
     * 下载小文件 (< 50MB) - 使用 arraybuffer 方式
     * @param {string} url - 要下载的URL
     * @param {string} downloadDir - 下载目录
     * @param {string} fileName - 下载的文件名
     * @returns {Promise<void>}
     */
    async downloadSmallFile(url, downloadDir, fileName) {
        // 确保下载目录存在
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        const filePath = path.join(downloadDir, fileName);
        console.log(`\n===== 下载小文件: ${fileName}`);
        console.log(`下载URL: ${url}`);

        const response = await this.axiosInstance.get(url, {
            responseType: 'arraybuffer'
        });

        if (response.status === 200) {
            fs.writeFileSync(filePath, response.data);
            const fileSize = (response.data.byteLength / 1024 / 1024).toFixed(2);
            console.log(`✅ 小文件下载完成: ${fileName} (${fileSize}MB)`);
        } else {
            throw new Error(`下载失败: HTTP ${response.status}`);
        }

    }

    /**
     * 批量下载文件
     * @param {Array} downloadList - 下载列表 [{url, dir, fileName}, ...]
     * @param {number} concurrent - 并发下载数量，默认3
     * @returns {Promise<void>}
     */
    async batchDownloadFiles(downloadList, concurrent = 3) {
        console.log(`开始批量下载 ${downloadList.length} 个文件，并发数: ${concurrent}`);
        
        const results = [];
        const errors = [];
        
        // 分批下载，控制并发数
        for (let i = 0; i < downloadList.length; i += concurrent) {
            const batch = downloadList.slice(i, i + concurrent);
            
            console.log(`\n=== 处理第 ${i + 1}-${Math.min(i + concurrent, downloadList.length)} 个文件 ===`);
            
            const batchPromises = batch.map(async (item, index) => {
                try {
                    await this.downloadLargeFile(item.url, item.dir, item.fileName);
                    results.push({ ...item, status: 'success' });
                    return { success: true, item };
                } catch (error) {
                    console.error(`下载失败: ${item.fileName} - ${error.message}`);
                    errors.push({ ...item, error: error.message });
                    return { success: false, item, error };
                }
            });
            
            await Promise.allSettled(batchPromises);
            
            // 批次间延迟
            if (i + concurrent < downloadList.length) {
                console.log(`批次完成，等待 ${this.delay}ms 后继续...`);
                await this.sleep(this.delay);
            }
        }
        
        // 输出下载统计
        console.log('\n========== 下载完成统计 ==========');
        console.log(`✅ 成功: ${results.length} 个文件`);
        console.log(`❌ 失败: ${errors.length} 个文件`);
        
        if (errors.length > 0) {
            console.log('\n失败的文件:');
            errors.forEach((item, index) => {
                console.log(`${index + 1}. ${item.fileName} - ${item.error}`);
            });
        }
        
        return { success: results, failed: errors };
    }











    /**
     * 从列表页面提取所有item的URL
     * @param {string} listUrl - 列表页面的URL
     * @param {object} selectors - CSS选择器配置
     * @returns {Array} URL数组
     */
    async extractUrlsFromListPage(listUrl, selectors = {}) {
        try {
            // 获取页面HTML
            const html = await this.fetchHtml(listUrl);
            
            // 使用 cheerio 解析HTML
            const $ = cheerio.load(html);
            
            // 默认选择器配置
            const defaultSelectors = {
                linkSelector: 'a[href]', // 所有包含href的链接
                titleSelector: null, // 标题选择器（可选）
                containerSelector: null, // 容器选择器（可选）
                filterPattern: null // URL过滤模式（可选）
            };

            const config = { ...defaultSelectors, ...selectors };
            
            const urls = [];
            const baseContainer = config.containerSelector ? $(config.containerSelector) : $('body');

            console.log(`使用选择器: ${config.linkSelector}`);
            if (config.containerSelector) {
                console.log(`容器选择器: ${config.containerSelector}`);
            }

            // 提取所有链接
            baseContainer.find(config.linkSelector).each((index, element) => {
                const $link = $(element);
                const href = $link.attr('href');
                
                if (href) {
                    // 获取链接文本
                    let title = '';
                    if (config.titleSelector) {
                        title = $link.find(config.titleSelector).text().trim();
                    }
                    if (!title) {
                        title = $link.text().trim() || $link.attr('title') || '';
                    }
                    
                    // 处理相对URL
                    let fullUrl = this.resolveUrl(href, listUrl);
                    
                    // 过滤URL
                    if (this.isValidUrl(fullUrl, config.filterPattern)) {
                        urls.push({
                            url: fullUrl,
                            title: title,
                            originalHref: href,
                            index: index + 1
                        });
                    }
                }
            });

            console.log(`从页面 ${listUrl} 提取到 ${urls.length} 个有效URL`);
            return urls;

        } catch (error) {
            console.error('提取URL时发生错误:', error);
            throw error;
        }
    }

    /**
     * 解析相对URL为绝对URL
     * @param {string} href - 原始href
     * @param {string} baseUrl - 基础URL
     * @returns {string} 绝对URL
     */
    resolveUrl(href, baseUrl) {
        try {
            // 如果已经是绝对URL，直接返回
            if (href.startsWith('http://') || href.startsWith('https://')) {
                return href;
            }
            
            // 如果是协议相对URL
            if (href.startsWith('//')) {
                const baseUrlObj = new URL(baseUrl);
                return `${baseUrlObj.protocol}${href}`;
            }
            
            // 如果是绝对路径
            if (href.startsWith('/')) {
                const baseUrlObj = new URL(baseUrl);
                return `${baseUrlObj.protocol}//${baseUrlObj.host}${href}`;
            }
            
            // 相对路径
            return new URL(href, baseUrl).href;
            
        } catch (error) {
            console.warn(`解析URL失败: ${href}`, error.message);
            return href;
        }
    }

    /**
     * 验证URL是否有效
     * @param {string} url - 要验证的URL
     * @param {string|RegExp} filterPattern - 过滤模式
     * @returns {boolean} 是否有效
     */
    isValidUrl(url, filterPattern = null) {
        // 基本URL格式检查
        if (!url.startsWith('http') || url.includes('javascript:') || url.includes('mailto:')) {
            return false;
        }
        
        // 如果有过滤模式，应用过滤
        if (filterPattern) {
            if (typeof filterPattern === 'string') {
                return url.includes(filterPattern);
            } else if (filterPattern instanceof RegExp) {
                return filterPattern.test(url);
            }
        }
        
        return true;
    }

    /**
     * 批量抓取多个列表页面
     * @param {Array} listUrls - 列表页面URL数组
     * @param {object} selectors - CSS选择器配置
     * @returns {Array} 所有URL的数组
     */
    async extractUrlsFromMultiplePages(listUrls, selectors = {}) {
        const allUrls = [];
        
        for (let i = 0; i < listUrls.length; i++) {
            try {
                console.log(`\n处理第 ${i + 1}/${listUrls.length} 个列表页面`);
                const urls = await this.extractUrlsFromListPage(listUrls[i], selectors);
                
                // 为每个URL添加来源页面信息
                const urlsWithSource = urls.map(item => ({ 
                    ...item, 
                    sourceListPage: listUrls[i],
                    sourcePageIndex: i + 1
                }));
                
                allUrls.push(...urlsWithSource);
                
                // 延迟避免请求过于频繁
                if (i < listUrls.length - 1) {
                    console.log(`等待 ${this.delay}ms 后继续...`);
                    await this.sleep(this.delay);
                }
                
            } catch (error) {
                console.error(`处理列表页面 ${listUrls[i]} 时出错:`, error.message);
            }
        }
        
        return allUrls;
    }

    /**
     * 去重URL
     * @param {Array} urls - URL数组
     * @returns {Array} 去重后的URL数组
     */
    removeDuplicateUrls(urls) {
        const seen = new Set();
        return urls.filter(item => {
            if (seen.has(item.url)) {
                return false;
            }
            seen.add(item.url);
            return true;
        });
    }

    /**
     * 保存URL到文件
     * @param {Array} urls - URL数组
     * @param {string} filename - 文件名
     */
    async saveUrlsToFile(urls, filename = 'extracted_urls.json') {
        try {
            const outputPath = path.join(__dirname, filename);
            
            // 保存为JSON格式
            if (filename.endsWith('.json')) {
                await fs.promises.writeFile(outputPath, JSON.stringify(urls, null, 2), 'utf8');
            } 
            // 保存为文本格式
            else if (filename.endsWith('.txt')) {
                const urlList = urls.map(item => `${item.url}\t${item.title}`).join('\n');
                await fs.promises.writeFile(outputPath, urlList, 'utf8');
            }
            // 保存为CSV格式
            else if (filename.endsWith('.csv')) {
                const csvHeader = 'URL,Title,Original Href,Index,Source List Page\n';
                const csvContent = urls.map(item => 
                    `"${item.url}","${item.title}","${item.originalHref}","${item.index}","${item.sourceListPage || ''}"`
                ).join('\n');
                await fs.promises.writeFile(outputPath, csvHeader + csvContent, 'utf8');
            }

            console.log(`\nURL已保存到文件: ${outputPath}`);
            console.log(`总共保存了 ${urls.length} 个URL`);
            
        } catch (error) {
            console.error('保存文件时发生错误:', error);
            throw error;
        }
    }

    /**
     * 延迟函数
     * @param {number} ms - 延迟毫秒数
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}







/**
 * 使用示例
 */
async function crawlExample() {
    const crawler = new SimpleWebCrawler({
        timeout: 30000,
        delay: 2000
    });

    try {
        // 配置要抓取的列表页面URL
        const listPageUrl1 = 'https://www.sh.smartedu.cn/smile-index-service/api/index/kzktNewResource/page'; // 替换为实际的列表页面URL
        const downloadPath1 = path.join(__dirname, 'files_downloads'); // 下载目录

        console.log('开始抓取列表页面URL...\n');

        const postQuery1 = {
            "start": 1,
            "length": 100,
            "isShowNotStudy": 0,
            "editionId": "1554710711844864003",
            "subjectId": "1554711046177112001",
            "sectionId": "1554711046177124000",
            "gradeId": "1554711046177124005",
            "volumeId": "1554712298873000001",
            "pointIdList": [],
            "keyword": ""
        }
        crawler.processPostJsonSHSmartEDU(listPageUrl1, postQuery1)
            .then(async (data) => {
                console.log('获取到数据:', data);

                // 下载视频和课程 学习任务单 课后练习
                let number = 101;

                for (const item of data) {
                    let tempClassPic = {
                        url: item.pictureUrl, 
                        dir: downloadPath1,
                        fileName: number.toString() + '_' + item.gradeName + '_' + item.volumeName + '_' + item.subjectName + '_' + item.resourceName + '_视频封面.png'
                    }
                    await crawler.downloadSmallFile(tempClassPic.url, tempClassPic.dir, tempClassPic.fileName);
                    let tempClassVideo = {
                        url: item.requestUrl, 
                        dir: downloadPath1,
                        videoOriginalFileName: item.resourceItem.uploadFileName, // 原始视频文件名
                        fileName: number.toString() + '_' + item.gradeName + '_' + item.volumeName + '_' + item.subjectName + '_' + item.resourceName + '_' + item.resourceItem.uploadFileName
                    }
                    // await crawler.downloadLargeFile(tempClassVideo.url, tempClassVideo.dir, tempClassVideo.fileName);
                    

                    item.resourceLearnings.forEach(async (resource) => {
                        if (resource.dataSuffix === 'docx' || resource.dataSuffix === 'doc' || resource.dataSuffix === 'pdf' || resource.dataSuffix === '') {
                            let tempResource = {
                                url: resource.dataUrl, 
                                dir: downloadPath1,
                                originalFilename: resource.name, // 原始文件名
                                fileName: number.toString()  + '_' + item.gradeName + '_' + item.volumeName + '_' + item.subjectName + '_' + item.resourceName + '_' + resource.name
                            }
                            await crawler.downloadSmallFile(tempResource.url, tempResource.dir, tempResource.fileName);
            
                        } else {
                            console.log('===== ===== ----- ----- ');
                            console.warn(`不支持下载的文件名: ${resource.name}`);
                            console.warn(`不支持下载URL: ${resource.dataUrl}`);
                            console.warn(`不支持的资源类型: ${resource.dataSuffix}`);
                        }
                    });
                    number++;
                }
            })
            .catch(error => {
                console.error('获取数据失败:', error.message);
            });

        console.log('抓取完成！');


/*         
        // 配置选择器（根据实际网站结构调整）
        const selectors = {
            linkSelector: 'a[href]', // 选择所有链接
            titleSelector: null, // 如果需要特定的标题选择器
            containerSelector: '.content-list', // 内容容器选择器（可选）
            filterPattern: '/detail/' // 只抓取包含 "/detail/" 的URL
        };

    
        // 抓取单个列表页面
        const urls = await crawler.extractUrlsFromListPage(listPageUrl, selectors);
        
        // 去重
        const uniqueUrls = crawler.removeDuplicateUrls(urls);
        
        
        // 保存到文件
        await crawler.saveUrlsToFile(uniqueUrls, 'extracted_urls.json');
        await crawler.saveUrlsToFile(uniqueUrls, 'extracted_urls.csv');
        await crawler.saveUrlsToFile(uniqueUrls, 'extracted_urls.txt');
 */

    } catch (error) {
        console.error('爬虫执行失败:', error);
    }
}

// 导出
module.exports = {
    SimpleWebCrawler,
    crawlExample
};

// 如果直接运行此文件
if (require.main === module) {
    console.log('网页URL爬虫工具');
    console.log('请根据需要修改配置参数：');
    console.log('1. 修改 listPageUrl 为实际的列表页面URL');
    console.log('2. 根据目标网站调整 selectors 配置');
    console.log('3. 运行: node download_pdf.js\n');
    
    // 取消注释下面这行来运行示例
    crawlExample();
}

