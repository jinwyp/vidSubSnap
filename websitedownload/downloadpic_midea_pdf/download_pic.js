const fs = require('fs');
const path = require('path');
const https = require('https');

// 美的公众号 空调说明书返回信息
const a = {
    "code": "000000",
    "msg": "操作成功",
    "msgTemp": "",
    "errorList": ["000000:操作成功"],
    "traceId": "",
    "data": {
        "id": "9223269779956281843",
        "productId": 1011181,
        "catalogContentName": "查看说明书更多内容",
        "parentId": 0,
        "allowedEdit": true,
        "note": "",
        "bgImage": "https://sales-expedite.midea.com/mcsp-ic-ms/797f6fb1742b4b8484b11cab0a04d797.png",
        "subtitle": "",
        "subcatalogType": 1,
        "recipeFlag": 0,
        "tenantCode": "0",
        "sort": 5,
        "contents": [],
        "singleLv3Flag": 0,
        "lv3VideoFlag": 0,
        "children": [{
            "id": "9223269779956281844",
            "productId": 1011181,
            "catalogContentName": "请查阅使用说明、安装说明、服务指南详情",
            "parentId": "9223269779956281843",
            "allowedEdit": true,
            "note": "",
            "bgImage": "",
            "subtitle": "",
            "subcatalogType": 1,
            "recipeFlag": 0,
            "tenantCode": "0",
            "sort": 0,
            "contents": [{
                    "id": 1256496,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154126,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/70f7fdbb45f64532b4d9e3e6bd77daec.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                },
                {
                    "id": 1256497,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154127,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/3e884058c4cf45e4952be79e719b9065.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                },
                {
                    "id": 1256498,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154128,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/d22564e25ced4b6c9da7bac1966339ee.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256499,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154129,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/53ee2aab696e4847b20a88441d59193c.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256500,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154130,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/71b054ad726942d690ffebe6573fa449.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256501,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154131,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/95b06b7e56004d9f93d7d463bd628dda.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256502,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154132,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/f072964a328842dd9e97c3e9ecd18a10.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256503,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154133,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/9df31a585fdc452e897e944bee34b735.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256504,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154134,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/9d858580f15b480e8cd04a421ebb8422.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256505,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154135,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/8fc57e59341a467f8689c9c4e34ab36b.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256506,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154136,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/4a5f3de84b324de796629cc2f6750ec9.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256507,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154137,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/272d92107035401d803454edc8345d60.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256508,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154138,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/f39580e127fc4e75a0e8b0c33e22f2f4.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256509,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154139,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/775e3e07a88b41619ecfb519f427ddd1.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256510,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154140,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/579e475c11b24c7b975499db218c8fc4.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256511,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154141,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/2fc9c30eb79d4fee9cc1cd04b8bba8f8.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256512,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154142,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/5f79732dcb39495199b8f4c89c418596.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256513,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154143,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/aebf25cabcc04e5ea18dbedfad045442.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256514,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154144,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/9724ec8e7c4949bd9eb46c2f5fcc8a1d.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256515,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154145,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/852c196046cf46e6bf8bb0c2ae3e6109.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256516,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154146,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/cc77283d27914b8aaa4501a622264b54.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256517,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154147,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/3977d018d1f04c84a73a36eb22d2a78d.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256518,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154148,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/29f5f37906fd4461a6fcedba399339fa.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256519,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154149,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/991ced8658a44547826e428ee86e52a3.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256520,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154150,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/0b169bdaed0743ba9559eaefd834deda.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256521,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154151,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/e47d96821cd14f2f910eff6e8a77db5d.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256522,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154152,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/25d81b28eedc4bc091056295d8f0d24d.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256523,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154153,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/f92012701342440db49cf6adca97fd25.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256524,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154154,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/4e33d17462ea4f5381a39a1415c61827.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256525,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154155,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/8b0fba3d45ca47b6917b1d43256f55f9.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256526,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154156,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/cbf83d5c75404a1a990be2678f5816c5.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256527,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154157,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/ef089c84bda145babd7b198201180897.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256528,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154158,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/0d526c9071cf41968020383df724739c.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256529,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154159,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/7d0569d1ce0b4353a57474101a85a271.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256530,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154160,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/f548fe7f5fec4a048d2c644c4f3a9fc3.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256531,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154161,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/8122b4c715cf45f28a31faa40584c09c.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256532,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154162,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/c6349079fee34702b58ec8a1f8f40d8f.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256533,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154163,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/43c4baf2b04140cab821e700bd1b5f3d.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256534,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154164,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/40e13aa4a7c540d68f6a4a7bb6c48140.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256535,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154165,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/d1b606cb33fd4b2b9f708ab5cee864f6.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256536,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154166,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/0084208fb0714c4d9c5b8ae97cd5908c.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256537,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154167,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/c7e573952c654c2b916fac8820d2e50d.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256538,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154168,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/70e9d68abd104828b268c7bd2d6019ef.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }, {
                    "id": 1256539,
                    "instructionsId": "9223269779956281844",
                    "typeId": 1,
                    "imageId": 8154169,
                    "imageUrl": "https://sales-expedite.midea.com/mcsp-ic-ms/5830b525607343b38e09a84325f78a42.jpg",
                    "videoId": 0,
                    "videoUrl": "",
                    "sort": 1,
                    "usable": 1,
                    "remark": "",
                    "picturesLink": ""
                }
            ],
            "singleLv3Flag": 0,
            "lv3VideoFlag": 0
        }],
        "recipeList": []
    },
    "level": 0
}

// Function to download image from URL
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);

        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`Downloaded: ${path.basename(filepath)}`);
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
            }
        }).on('error', (error) => {
            fs.unlink(filepath, () => {}); // Delete the file on error
            reject(error);
        });
    });
}

// Extract and download all imageUrl fields
async function downloadAllImages(data, downloadDir = './downloaded_images') {
    const imageUrls = [];

    // Navigate through the data structure
    if (data.data && data.data.children) {
        data.data.children.forEach(child => {
            if (child.contents && Array.isArray(child.contents)) {
                child.contents.forEach(content => {
                    if (content.imageUrl) {
                        imageUrls.push(content.imageUrl);
                    }
                });
            }
        });
    }

    // Create download directory if it doesn't exist
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, {
            recursive: true
        });
        console.log(`Created directory: ${downloadDir}`);
    }

    // Download all images
    console.log(`开始下载 ${imageUrls.length} 张图片到目录: ${downloadDir}`);

    for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        // 生成文件名：image_序号_原始文件名.jpg
        // 例如：image_1_70f7fdbb45f64532b4d9e3e6bd77daec.jpg
        // const filename = `image_${i + 11}_${path.basename(url.split('?')[0])}.jpg`;
        const filename = `image_${i + 11}.jpg`;
        const filepath = path.join(downloadDir, filename);

        try {
            await downloadImage(url, filepath);
        } catch (error) {
            console.error(`下载失败 ${filename}:`, error.message);
        }
    }

    console.log('所有图片下载完成！');
    return imageUrls;
}

// Call the function to download all images
downloadAllImages(a, './downloadpic_midea');
