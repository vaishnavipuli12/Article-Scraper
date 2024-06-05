// server.js

const express = require('express');
const { scrapeMediumArticles } = require('./scrapper');

const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3001;

app.use(express.json());
let scrapedArticles = [];//temporary database
app.use(cors())

// POST endpoint to trigger the scraping process
app.post('/scrape', async (req, res) => {
  const { topic } = req.body;

  try {
    const articles = await scrapeMediumArticles(topic);
    scrapedArticles = articles; // Store scraped articles in memory
    res.json({ message: 'Scraping successful' });
  } catch (error) {
    console.error('Error scraping articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to return details of scraped articles
app.get('/articles', (req, res) => {
  res.json(scrapedArticles); // Return stored articles
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
