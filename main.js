const axios = require("axios");
const fs = require("fs").promises;

async function getWaifuPics() {
    const data = {
        exclude: []
    };

    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Length': '14',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': 'https://waifu.pics',
        'Referer': 'https://waifu.pics/',
        'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Brave";v="116"',
        'Sec-Ch-Ua-Mobile': '?1',
        'Sec-Ch-Ua-Platform': '"Android"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Gpc': '1',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
    };

    const numRequests = 100;
    const imageUrls = new Set();

    async function fetchImageUrls() {
        try {
            const response = await axios.post('https://api.waifu.pics/many/sfw/waifu', { exclude: [] });
            response.data.files.forEach(imageUrl => imageUrls.add(imageUrl));
        } catch (error) {
            console.error(error);
        }
    }

    await Promise.all(Array.from({ length: numRequests }, fetchImageUrls));

    const filePath = 'scraped_image_urls.json';

    try {
        const existingData = await fs.readFile(filePath, 'utf8');
        const existingImageUrls = JSON.parse(existingData);
        const combinedImageUrls = [...new Set([...existingImageUrls, ...imageUrls])];
        await fs.writeFile(filePath, JSON.stringify(combinedImageUrls, null, 2), 'utf8');
        console.log('Image URLs added to JSON file:', filePath);
    } catch (error) {
        await fs.writeFile(filePath, JSON.stringify([...imageUrls], null, 2), 'utf8');
        console.log('New JSON file created with unique image URLs:', filePath);
    }
}

getWaifuPics();