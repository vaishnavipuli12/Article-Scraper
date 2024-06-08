const puppeteer = require('puppeteer');
require('dotenv').config();

async function scrapeMediumArticles(topic) {
  let browser;
  try {
    browser = await puppeteer.launch({});
    const page = await browser.newPage();

    await page.goto(`https://medium.com/search?q=${encodeURIComponent(topic)}`, {
      waitUntil: 'networkidle2',
      timeout: 90000 // Increased timeout
    });

    // Wait for a key element that indicates articles have loaded
    await page.waitForSelector('article', { timeout: 90000 }); // Ensure articles are loaded

    // Log the page content for debugging
    const content = await page.content();
    // console.log(content);

    // Extract articles
    const results = await page.evaluate(() => {
      const items = [];
      const elements = document.querySelectorAll('article');

      elements.forEach(element => {
        const titleElement = element.querySelector('h2');
        const title = titleElement ? titleElement.innerText : null;

        const imgElement = element.querySelector('.j img');
        const img = imgElement ? imgElement.src : null;

        // if (img && img.includes('?')) {
        //   img = img.split('?')[0]; // Remove query parameters for higher resolution
        // }


        const urlElement = element.querySelector('a');
        const url = urlElement ? urlElement.href : null;

        const dateSpan = element.querySelectorAll('span');
        let date = null;
        dateSpan.forEach(span => {
          if (span.innerText.match(/\d+\s\w+\sago/)) {
            date = span.innerText;
          }
        });

        const publisherElement = element.querySelector('p');
        const publisher = publisherElement ? publisherElement.innerText : null;


        const descriptionElement = element.querySelector('h3');
        const description = descriptionElement ? descriptionElement.innerText : null;

        if (title && url) {
          items.push({ title, img, date, publisher, url,description });
        }
      });

      return items;
    });

    await browser.close();
    return results;
  } catch (error) {
    console.error('Error scraping articles:', error);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

module.exports = { scrapeMediumArticles };
