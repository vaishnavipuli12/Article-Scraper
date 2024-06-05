const puppeteer = require('puppeteer');

async function scrapeMediumArticles(topic) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.ndtv.com/search?searchtext=${encodeURIComponent(topic)}`, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await page.waitForSelector('.src_lst-li', { timeout: 60000 });

    const results = await page.evaluate(() => {
      const items = [];
      const elements = document.querySelectorAll('.src_lst-li');

      elements.forEach(element => {
        const title = element.querySelector('.src_itm-ttl a')?.innerText;
        const img = element.querySelector('img')?.src;
        const date = element.querySelector('.src_itm-stx')?.innerText.trim();
        const publisher = "NDTV";
        const url = element.querySelector('.src_itm-ttl a')?.href; 

        if (title && img && date) {
          items.push({ title, img, date, publisher,url });
        }
      });

      return items;
    });

    await browser.close();
    return results;
  } catch (error) {
    console.error('Error scraping articles:', error);
    await browser.close();
    throw error;
  }
}

module.exports = { scrapeMediumArticles };
