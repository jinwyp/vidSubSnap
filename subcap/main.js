const fs = require('fs-extra');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

/**
 * 解析SRT字幕文件
 * @param {string} srtPath - SRT文件路径
 * @returns {Array} 字幕时间轴数组
 */
function parseSRT(srtPath) {
    try {
        const content = fs.readFileSync(srtPath, 'utf8');
        // 修复Windows平台换行符问题：先统一换行符，然后分割
        const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const blocks = normalizedContent.trim().split('\n\n');
        console.log('===== 已解析到的字幕块数量:', blocks.length);
        const subtitles = [];

        for (const block of blocks) {
            const lines = block.trim().split('\n');
            if (lines.length >= 3) {
                const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
                if (timeMatch) {
                    const text = lines.slice(2).join('\n');
                    const tempSinleLineSub = {
                        start: timeMatch[1],
                        end: timeMatch[2],
                        text: text,
                        startSeconds: convertTimeToSeconds(timeMatch[1]),
                        endSeconds: convertTimeToSeconds(timeMatch[2])
                    }
                    subtitles.push(tempSinleLineSub);
                    console.log(`===== 字幕: ${tempSinleLineSub.start} | ${tempSinleLineSub.startSeconds} -->   ${tempSinleLineSub.end} | ${tempSinleLineSub.endSeconds}, 内容: "${text}"`);
                }
            }
        }

        return subtitles;
    } catch (error) {
        console.error('解析SRT文件错误:', error);
        return [];
    }
}

/**
 * 将时间格式转换为秒数
 * @param {string} timeString - 时间字符串 (HH:MM:SS,mmm)
 * @returns {number} 秒数
 */
function convertTimeToSeconds(timeString) {
    const [time, ms] = timeString.split(',');
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds + parseInt(ms) / 1000;
}

/**
 * 获取视频总长度
 * @param {string} videoPath - 视频文件路径
 * @returns {Promise<number>} 视频总长度(秒)
 */
function getSingleVideoDuration(videoPath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                console.error('获取视频信息失败:', err);
                reject(err);
                return;
            }
            
            const duration = metadata.format.duration;
            resolve(duration);
        });
    });
}

/**
 * 截取视频帧并添加字幕
 * @param {string} videoPath - 视频文件路径
 * @param {string} srtPath - SRT字幕文件路径
 * @param {number} timeInSeconds - 截图时间点(秒)
 * @param {string} outputPath - 输出图片路径
 * @returns {Promise}
 */
function captureFrame(videoPath, srtPath, timeInSeconds, outputPath) {
    return new Promise((resolve, reject) => {
        console.log(`\n========== 开始截图 ==========`);
        console.log(`===== 正在截图: ${timeInSeconds.toFixed(2)}秒 -> ${outputPath}`);
        
        // 删除已存在的输出文件
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
            console.log(`删除已存在的文件: ${outputPath}`);
        }
        
        // 获取SRT文件的绝对路径
        const absoluteSrtPath = path.resolve(srtPath);
        console.log(`SRT文件绝对路径: ${absoluteSrtPath}`);
        
        // 检查SRT文件是否存在
        if (!fs.existsSync(absoluteSrtPath)) {
            console.error(`SRT文件不存在: ${absoluteSrtPath}`);
            reject(new Error(`SRT文件不存在: ${absoluteSrtPath}`));
            return;
        }
        
        // 在Windows上，需要正确转义路径
        // 方法1: 使用双反斜杠转义
        let normalizedSrtPath = absoluteSrtPath.replace(/\\/g, '\\\\').replace(/:/g, '\\:');
        console.log(`标准化路径（方法1）: ${normalizedSrtPath}`);

        /* 
-copyts 会告诉 FFmpeg 在做输入跳转时，不要移动时间戳的起点。这可以大大提高计时准确性。

-vframes 1
-vframes (video frames): 指示 FFmpeg 在处理完指定数量的视频帧后就停止。
1: 我们只需要一张截图，所以这里设置为 1。FFmpeg 在处理完第1个有效的视频帧后就会结束任务，非常高效。

-f image2
-f (format): 强制指定输出文件的格式（或称为“muxer”）。
image2: 这是一个专门用于输出单张图片的格式封装器。FFmpeg 通常能根据输出文件的扩展名（如 .jpg, .png）自动选择，但明确指定 -f image2 是一个更严谨的做法，可以确保 FFmpeg 按照我们的意图生成图片。

-q:v 2
-q:v (quality, video stream): 为视频流设置一个固定的质量等级。它也被称为 -qscale:v。
2: 这个值用于控制输出JPEG图像的质量。对于JPEG编码器，这个值的范围通常是 1 到 31，数字越小，质量越高，文件也越大。2 是一个非常高的质量设置，几乎无损，非常适合用于生成高质量的截图。

*/
        const ffmpegCommand = ffmpeg(videoPath)
            .seekInput(timeInSeconds)
            .outputOptions([
                '-copyts',
                '-vf', `subtitles='${normalizedSrtPath}'`,  // 添加单引号包裹路径
                '-vframes', '1',
                '-f', 'image2',
                '-q:v', '2',
                '-y' // 覆盖输出文件
            ])
            .output(outputPath);
        
        ffmpegCommand
            .on('start', (commandLine) => {
                console.log('FFmpeg命令: ' + commandLine);
            })
            .on('stderr', (stderrLine) => {
                console.log('FFmpeg stderr 输出: ' + stderrLine);
            })
            .on('end', () => {
                console.log(`截图完成: ${outputPath} (时间: ${timeInSeconds.toFixed(2)}秒)`);
                
                // 验证文件是否创建成功
                setTimeout(() => {
                    if (fs.existsSync(outputPath)) {
                        const stats = fs.statSync(outputPath);
                        console.log(`验证截图文件: ${outputPath}, 大小: ${stats.size} bytes`);
                        resolve();
                    } else {
                        reject(new Error(`截图文件未创建: ${outputPath}`));
                    }
                }, 100);
            })
            .on('error', async (err) => {
                console.error(`截图失败（方法1）: ${err.message}`);
            });
            
        // 启动FFmpeg进程
        try {
            ffmpegCommand.run();
        } catch (error) {
            console.error(`启动FFmpeg失败: ${error.message}`);
            reject(error);
        }
    });
}

/**
 * 根据SRT字幕时间轴截取视频帧
 * @param {string} videoPath - 视频文件路径
 * @param {string} srtPath - SRT字幕文件路径
 * @param {string} outputDir - 输出目录
 */
async function captureFramesBySRT(videoPath, srtPath, outputDir) {
    try {
        // 确保输出目录存在
        await fs.ensureDir(outputDir);
        
        // 获取视频总长度
        const videoDuration = await getSingleVideoDuration(videoPath);
        console.log(`===== 视频总长度: ${videoDuration} 秒`);
        
        // 解析SRT文件
        const subtitles = parseSRT(srtPath);
        if (subtitles.length === 0) {
            console.error('未找到有效的字幕信息');
            return;
        }
        
        let validSubtitles = 0;
        let skippedSubtitles = 0;
        
        // 为每个字幕时间点截图
        for (let i = 0; i < subtitles.length; i++) {
            const subtitle = subtitles[i];
            
            console.log(`\n===== 处理字幕 ${i + 1}/${subtitles.length} ---`);
            console.log(`===== 字幕内容: "${subtitle.text}"`);
            console.log(`===== 时间: ${subtitle.start}|${subtitle.startSeconds.toFixed(2)} --> ${subtitle.end}|${subtitle.endSeconds.toFixed(2)}`);


            // 检查字幕开始时间是否超过视频长度
            if (subtitle.startSeconds > videoDuration) {
                console.warn(`跳过字幕 ${i + 1}: 时间 ${subtitle.startSeconds.toFixed(2)}秒 超过视频长度 ${videoDuration.toFixed(2)}秒`);
                skippedSubtitles++;
                continue;
            }
            
            // 如果字幕开始时间在视频范围内但很接近结尾，给出提示
            if (subtitle.startSeconds > videoDuration - 0.5) {
                console.warn(`字幕 ${i + 1}: 时间 ${subtitle.startSeconds.toFixed(2)}秒 接近视频结尾 ${videoDuration.toFixed(2)}秒`);
            }
            
            // 计算字幕中间时间点，确保字幕能显示
            const midTime = subtitle.startSeconds + (subtitle.endSeconds - subtitle.startSeconds) / 2;
            console.log(`----- 字幕中间时间点: ${midTime.toFixed(2)}秒`);
            
            const outputScreenshotFilePath = path.join(outputDir, `frame_${String(i + 1).padStart(4, '0')}.jpg`);
            console.log(`===== 截图输出路径: ${outputScreenshotFilePath}`);
            
            try {
                // 在字幕中间时间点截图，确保字幕显示
                console.log(`----- 开始截图第 ${i + 1} 个字幕...`);
                await captureFrame(videoPath, srtPath, midTime, outputScreenshotFilePath);
                validSubtitles++;
                console.log(`----- 成功完成第 ${i + 1} 个字幕截图`);
                
                // 验证文件是否创建成功
                if (fs.existsSync(outputScreenshotFilePath)) {
                    const stats = fs.statSync(outputScreenshotFilePath);
                    console.log(`文件大小: ${stats.size} bytes`);
                    
                    if (stats.size === 0) {
                        console.warn(`警告: 截图文件为空! ${outputScreenshotFilePath}`);
                    }
                } else {
                    console.error(`错误: 截图文件未创建! ${outputScreenshotFilePath}`);
                }
                
                // 添加延迟避免FFmpeg处理过快
                console.log(`等待 1000ms 后处理下一个字幕...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.error(`处理第 ${i + 1} 个字幕时出错:`, error);
                console.error(`错误详情:`, error.stack);
                // 继续处理下一个字幕
            }
        }

        console.log(`\n=== 截图完成 ===`);
        console.log(`有效截图: ${validSubtitles} 张`);
        console.log(`跳过字幕: ${skippedSubtitles} 个`);
        console.log(`总处理: ${subtitles.length} 个字幕`);
        
    } catch (error) {
        console.error('处理过程中出错:', error);
        console.error('错误详情:', error.stack);
    }
}





/**
 * 计算字幕文字的停留时间
 * @param {string} text - 字幕文字
 * @param {number} baseTime - 基础时间(秒)，每5个字的停留时间
 * @param {number} minTime - 最小停留时间(秒)
 * @param {number} maxTime - 最大停留时间(秒)
 * @returns {number} 停留时间(秒)
 */
function calculateDurationByText(text, baseTime = 3, minTime = 2, maxTime = 10) {
    // 去除HTML标签和特殊字符，只统计实际文字
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
    const textLength = cleanText.length;
    
    // 按照每5个字停留baseTime秒计算
    const calculatedTime = Math.ceil(textLength / 5) * baseTime;
    
    // 确保在最小和最大时间范围内
    const finalTime = Math.max(minTime, Math.min(maxTime, calculatedTime));
    
    console.log(`字幕文字长度: ${textLength}, 停留时间: ${finalTime}秒`);
    return finalTime;
}

/**
 * 将截图制作成幻灯片视频
 * @param {string} imageDir - 图片目录
 * @param {string} outputVideoPath - 输出视频路径
 * @param {Array} subtitles - 字幕数组，用于计算每张图片的停留时间
 * @param {number} defaultDuration - 默认停留时间(秒)
 * @returns {Promise}
 */
function createSlideshowVideo(imageDir, outputVideoPath, srtFilePath = '', defaultDuration = 3) {
    return new Promise(async (resolve, reject) => {
        console.log(`\n===== 开始制作幻灯片视频 ===`);
        console.log(`图片目录: ${imageDir}`);
        console.log(`输出视频: ${outputVideoPath}`);
        console.log(`使用动态停留时间（根据字幕长度）默认 ${defaultDuration}秒`);

        // 检查图片目录是否存在
        if (!fs.existsSync(imageDir)) {
            console.error(`图片目录不存在: ${imageDir}`);
            reject(new Error(`图片目录不存在: ${imageDir}`));
            return;
        }
        
        // 获取目录中的所有jpg文件，并按文件名排序
        const imageFiles = fs.readdirSync(imageDir)
            .filter(file => file.toLowerCase().endsWith('.jpg'))
            .sort();
            
        if (imageFiles.length === 0) {
            console.error(`在目录 ${imageDir} 中没有找到jpg图片文件`);
            reject(new Error(`没有找到jpg图片文件`));
            return;
        }
        
        console.log(`找到 ${imageFiles.length} 张图片`);
        
        // 删除已存在的输出视频文件
        if (fs.existsSync(outputVideoPath)) {
            fs.unlinkSync(outputVideoPath);
            console.log(`删除已存在的视频文件: ${outputVideoPath}`);
        }
        
        // 解析字幕文件
        const subtitles = parseSRT(srtFilePath);
        if (subtitles.length === 0) {
            console.error('未找到有效的字幕信息');
            return;
        }

    
        // 创建临时的concat文件列表，使用绝对路径
        const concatListPath = path.resolve(imageDir, 'concat_list.txt');
        let concatContent = '';
        let totalDuration = 0;
        
        console.log(`创建concat文件: ${concatListPath}`);
        
        imageFiles.forEach((file, index) => {
            // 使用绝对路径
            const imagePath = path.resolve(imageDir, file);
            // 在Windows上，FFmpeg需要使用正斜杠
            const normalizedImagePath = imagePath.replace(/\\/g, '/');
            
            // 计算当前图片的停留时间
            let duration = defaultDuration;
            if (subtitles && subtitles[index]) {
                duration = calculateDurationByText(subtitles[index].text);
            }
            
            totalDuration += duration;
            console.log(`图片 ${index + 1}: ${file} - 停留时间: ${duration}秒`);
            console.log(`图片路径: ${normalizedImagePath}`);
            
            concatContent += `file '${normalizedImagePath}'\n`;
            concatContent += `duration ${duration}\n`;
        });
        
        // 最后一张图片需要重复添加，不然最后一帧会被跳过
        if (imageFiles.length > 0) {
            const lastImagePath = path.resolve(imageDir, imageFiles[imageFiles.length - 1]);
            const normalizedLastImagePath = lastImagePath.replace(/\\/g, '/');
            concatContent += `file '${normalizedLastImagePath}'\n`;
        }
        
        console.log(`预计视频总时长: ${totalDuration.toFixed(1)}秒`);
        
        try {
            // 写入concat文件
            fs.writeFileSync(concatListPath, concatContent);
            console.log(`===== 成功创建concat文件: ${concatListPath}`);
            
            // 验证文件是否创建成功
            if (!fs.existsSync(concatListPath)) {
                console.error(`concat文件创建失败: ${concatListPath}`);
                reject(new Error(`concat文件创建失败: ${concatListPath}`));
                return;
            }
            
            
            // 显示concat文件内容用于调试
            console.log('concat文件内容:');
            console.log(concatContent);
            
            // 使用绝对路径作为FFmpeg输入
            const normalizedConcatPath = concatListPath.replace(/\\/g, '/');
            console.log(`===== FFmpeg使用的concat文件路径: ${normalizedConcatPath}`);
            
            const ffmpegCommand = ffmpeg()
                .input(normalizedConcatPath)
                .inputOptions([
                    '-f', 'concat',
                    '-safe', '0'
                ])
                .outputOptions([
                    '-c:v', 'libx264',
                    '-pix_fmt', 'yuv420p',
                    '-r', '30',
                    '-y'
                ])
                .output(outputVideoPath);
                
            ffmpegCommand
                .on('start', (commandLine) => {
                    console.log('Concat FFmpeg命令: ' + commandLine);
                })
                .on('progress', (progress) => {
                    if (progress.percent) {
                        console.log(`制作进度: ${progress.percent.toFixed(1)}%`);
                    }
                })
                .on('stderr', (stderrLine) => {
                    console.log('FFmpeg输出: ' + stderrLine);
                })
                .on('end', () => {
                    console.log(`幻灯片视频制作完成: ${outputVideoPath}`);
                    
                    // 清理临时文件
                    if (fs.existsSync(concatListPath)) {
                        // fs.unlinkSync(concatListPath);
                        console.log('清理临时concat文件');
                    }
                    
                    // 验证文件是否创建成功
                    setTimeout(() => {
                        if (fs.existsSync(outputVideoPath)) {
                            const stats = fs.statSync(outputVideoPath);
                            console.log(`视频文件大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
                            console.log(`实际视频时长: ${totalDuration.toFixed(1)}秒`);
                            resolve();
                        } else {
                            reject(new Error(`视频文件未创建: ${outputVideoPath}`));
                        }
                    }, 100);
                })
                .on('error', (err) => {
                    console.error(`concat方法失败: ${err.message}`);
                    // 清理临时文件
                    if (fs.existsSync(concatListPath)) {
                        fs.unlinkSync(concatListPath);
                    }
                    reject(err);
                });
                
            ffmpegCommand.run();
            
        } catch (error) {
            console.error(`创建concat文件失败: ${error.message}`);
            reject(error);
        }

    });
}





/**
 * 主函数
 */
async function main() {
    // 配置参数
    const config = {
        videoPath: './video_source/Sephiroth_2.mp4',      // 视频文件路径
        srtPath: './video_source/Sephiroth_2.srt',        // SRT字幕文件路径
        outputDir: './output_screenshots',    // 输出目录
        slideshowVideo: './output_screenshots/slideshow.mp4', // 幻灯片视频输出路径
        baseTime: 2,                   // 基础时间：每5个字停留的秒数
        minTime: 1,                    // 最小停留时间(秒)
        maxTime: 10                    // 最大停留时间(秒)
    };

    // 检查文件是否存在
    if (!fs.existsSync(config.videoPath)) {
        console.error(`视频文件不存在: ${config.videoPath}`);
        return;
    }

    if (!fs.existsSync(config.srtPath)) {
        console.error(`SRT文件不存在: ${config.srtPath}`);
        return;
    }

    console.log('===== 开始处理视频截图...');
    console.log(`视频文件: ${config.videoPath}`);
    console.log(`字幕文件: ${config.srtPath}`);
    console.log(`输出目录: ${config.outputDir}`);
    console.log(`幻灯片视频: ${config.slideshowVideo}`);
    console.log(`停留时间规则: 每5个字停留${config.baseTime}秒. 时间范围: ${config.minTime}秒 - ${config.maxTime}秒`);
    console.log('===== =====');

    await captureFramesBySRT(config.videoPath, config.srtPath, config.outputDir);

    // 截图完成后，制作幻灯片视频
    try {
        await createSlideshowVideo(config.outputDir, config.slideshowVideo, config.srtPath);
        console.log('\n=== 全部任务完成 ===');
        console.log(`截图保存在: ${config.outputDir}`);
        console.log(`幻灯片视频: ${config.slideshowVideo}`);
    } catch (error) {
        console.error('制作幻灯片视频时出错:', error);
        console.error('错误详情:', error.stack);
    }
    
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    parseSRT,
    captureFrame,
    captureFramesBySRT,
    createSlideshowVideo,
    calculateDurationByText
};