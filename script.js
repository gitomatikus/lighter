import puppeteer from 'puppeteer';
import http from 'http';


const hostname = '0.0.0.0';
const port = 3066;
const server = http.createServer();
server.on('request', async (req, res) => {
    const data = await schedule();
    res.end(data);
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


async function schedule() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.dtek-krem.com.ua/ua/shutdowns');
    const pageSourceHTML = await page.content();
    await browser.close();
    const re = /DisconSchedule\.preset = ({.+)/;
    return pageSourceHTML.match(re)[1];
}

