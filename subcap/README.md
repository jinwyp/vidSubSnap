# 视频字幕截图工具

这是一个基于 Node.js 和 FFmpeg 的工具，可以根据 SRT 字幕文件的时间轴自动截取视频帧。

## 功能特性

- 根据字幕时间轴截取视频帧
- 每个字幕切换时间点截图一张
- 支持自定义输出目录和文件名
- 把所有截图生成幻灯片

## 安装依赖

```bash
npm install fluent-ffmpeg fs-extra
```

## 使用方法

### 1. 修改配置

在 `main.js` 文件中修改配置参数：

```javascript
const config = {
    videoPath: './video_source/video.mp4',      // 视频文件路径
    srtPath: './video_source/subtitles.srt',    // SRT字幕文件路径
    outputDir: './output_screenshots',    // 输出目录
    slideshowVideo: './output_screenshots/slideshow.mp4', // 幻灯片视频输出路径
};
```



### 2. 运行程序

```bash
npm start
```


## SRT 字幕格式

SRT 文件应该遵循标准格式：

```
1
00:00:00,000 --> 00:00:05,000
第一段字幕内容

2
00:00:05,000 --> 00:00:10,000
第二段字幕内容
```

## 注意事项

1. 需要预先安装 FFmpeg 并确保可以在命令行中访问
2. 视频文件和字幕文件必须存在
3. 程序会在每个字幕的开始时间点截图

