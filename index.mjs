import express from 'express';
import bodyParser from 'body-parser';
import db from './config/db.js';
import axios from 'axios';
import hadith from './models/hadith.js'
import cors from 'cors'

const app = express();

app.use(cors()); // Enable CORS for all routes


const API_KEY = '$2y$10$BXjBmzwuN1SyPBREr1LnXk4XfQtZ07ZXNw8zTBWAUy0hVFvPij2';


// Connect to MongoDB
db.connection.once('open', () => {
    console.log('Database connected successfully!');
});


// Middleware to parse JSON
app.use(express.json());

// Endpoint to fetch and save Hadiths
app.get('/fetch-hadiths', async (req, res) => {
    try {
      const response = await axios.get(`https://hadithapi.com/api/hadiths/?apiKey=${API_KEY}`, {
        params: {
          paginate: 200, // Fetch 200 Hadiths
        },
      });
  
      // Log the response for debugging
      console.log('API Response:', response.data);
  
      if (response.data && response.data.hadiths && Array.isArray(response.data.hadiths.data)) {
        const hadiths = response.data.hadiths.data.map(hadith => ({
          id: hadith.id,
          hadithNumber: hadith.hadithNumber,
          englishNarrator: hadith.englishNarrator,
          hadithEnglish: hadith.hadithEnglish,
          hadithUrdu: hadith.hadithUrdu,
          urduNarrator: hadith.urduNarrator,
          hadithArabic: hadith.hadithArabic,
          headingArabic: hadith.headingArabic,
          headingUrdu: hadith.headingUrdu,
          headingEnglish: hadith.headingEnglish,
          chapterId: hadith.chapterId,
          bookSlug: hadith.bookSlug,
          volume: hadith.volume,
          status: hadith.status,
        }));
  
        // Save all Hadiths to the database
        await hadith.insertMany(hadiths);
  
        return res.status(200).json({ message: 'All Hadiths saved successfully' });
      } else {
        return res.status(404).json({ message: 'No Hadiths found in the response.' });
      }
    } catch (error) {
      console.error('Error fetching Hadiths:', error);
      return res.status(500).json({ error: 'Failed to fetch Hadiths from API.' });
    }
  });
  
  // Endpoint to retrieve Hadiths from MongoDB
  let currentIndex = 0;

app.get('/hadiths', async (req, res) => {
  try {
    const allHadiths = await hadith.find(); // Fetch all Hadiths from DB
    const hadithCount = allHadiths.length;

    if (hadithCount === 0) {
      return res.status(404).json({ message: 'No Hadiths found in the database.' });
    }

    if (currentIndex < hadithCount) {
      // Get the current Hadith
      const currentHadith = allHadiths[currentIndex];

      // Increment the index for the next request
      currentIndex++;

      // Send the current Hadith as the response
      res.json(currentHadith);

      // If there are more Hadiths, set a timeout to send the next one after 1 minute
    
    } 
  } catch (err) {
    console.error('Error fetching Hadiths from DB:', err);
    res.status(500).json({ message: 'Error fetching Hadiths from database.' });
  }
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
