# vidSubSnap

A Node.js toolkit for video processing includes subtitle-based video frame extraction

## Features

### 📹 Video Subtitle Screenshot Tool (`/subcap`)
- Extract video frames based on SRT subtitle timestamps
- Generate screenshots at subtitle transition points
- Create slideshow videos from extracted frames
- Support for custom output directories and file naming


## Installation

### Prerequisites
- Node.js (v14 or higher)
- FFmpeg (for video processing)

### Dependencies
Navigate to the specific tool directory and install dependencies:

```bash
# For video subtitle tool
cd subcap
npm install

```

## Usage

### Video Subtitle Screenshot Tool

1. **Configure settings** in `subcap/main.js`:
```javascript

const config = {
    videoPath: './video_source/video.mp4',      // Video file path
    srtPath: './video_source/subtitles.srt',    // SRT subtitle file path
    outputDir: './output_screenshots',          // Output directory
    slideshowVideo: './output_screenshots/slideshow.mp4', // Slideshow output
};

```

2. **Run the tool**:
```bash
cd subcap
npm start
```

## SRT Subtitle Format

The SRT subtitle file should follow the standard format:

```
1
00:00:00,000 --> 00:00:05,000
First subtitle text

2
00:00:05,000 --> 00:00:10,000
Second subtitle text
```


## Requirements

1. **FFmpeg**: Must be installed and accessible from command line
2. **Node.js**: Version 14 or higher



## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open an issue on the GitHub repository.