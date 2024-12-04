import puppeteer from 'puppeteer';
import http from 'http';


const hostname = '127.0.0.1';
const port = 3066;

// const server = http.createServer(async (req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end(JSON.stringify(await schedule()));
// });

const server = http.createServer();
server.on('request', async (req, res) => {
    const data = await schedule();
    res.end(JSON.stringify(data));
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


async function schedule() {
    // Or import puppeteer from 'puppeteer-core';

// Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

// Navigate the page to a URL.
    await page.goto('https://www.dtek-krem.com.ua/ua/shutdowns');
    await page.setViewport({width: 1080, height: 4000});

    await page.locator('.modal__close').click();
    await page.locator('#city').fill('Софіївська Борщагівка')
    await page.locator('#cityautocomplete-list').click()
    await page.locator('#street').fill('Шевченка')
    await page.locator('#streetautocomplete-list').click()
    await page.locator('#house_num').fill('219')
    await page.locator('#house_numautocomplete-list').click()

    const fileElement = await page.waitForSelector('#tableRenderElem');


    const schedule = await fileElement.evaluate(() => {
        const LIGHT_MAP = {
            "cell-scheduled": -1,
            "cell-scheduled-maybe": 0,
            "cell-non-scheduled": 1,
        };
        const tds = Array.from(document.querySelectorAll('tbody tr td'))
        let hours = tds.map(td => {
            return td.className
        });
        const schedule = [];
        let dayOfTheWeek = -1;
        hours.forEach(function (value) {
            if (value === '' || value === 'current-day') {
                dayOfTheWeek++;
                schedule[dayOfTheWeek] = [];
                return;
            }
            schedule[dayOfTheWeek].push(LIGHT_MAP[value]);
        })
        return schedule
    });
    await browser.close();

    return schedule;
}

