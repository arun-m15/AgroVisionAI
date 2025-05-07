// server.js
// Top of server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import cheerio from 'cheerio';


const app = express();
const PORT = 8000;

app.use(cors());

app.get('/get-recommendations', async (req, res) => {
  const disease = req.query.disease;
  if (!disease) return res.status(400).json({ error: "Disease name required" });

  const query = encodeURIComponent(`${disease} treatment fertilizer pesticide`);
  const url = `https://www.google.com/search?q=${query}`;

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    const results = [];

    $('div span').each((i, el) => {
      const text = $(el).text();
      if (text.length > 40 && results.length < 5) results.push(text);
    });

    res.json({
      fertilizers: results.slice(0, 2),
      pesticides: results.slice(2, 4),
      note: results[4] || "Use as per label and crop condition"
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
