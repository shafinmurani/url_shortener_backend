import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Url from './models/url.model.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
connectDB();

app.post("/get", async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Missing 'id' in request body" });
    }
    try {
        const url = await Url.findOne({ shortUrl: id });
        if (url) {
            return res.send({ originalUrl: url.originalUrl });
        } else {
            return res.status(404).json({ message: "Short URL not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/shorten", async (req, res) => {
    const { originalUrl } = req.body;
    // Validate originalUrl
    if (!originalUrl) {
        return res.status(400).json({ message: "Missing 'originalUrl' in request body" });
    }
    // Simple URL validation
    try {
        new URL(originalUrl);
    } catch {
        return res.status(400).json({ message: "Invalid URL format" });
    }
    // Check if originalUrl already exists
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
        return res.json({ shortUrl: existing.shortUrl });
    }
    // Generate a unique shortUrl
    let shortUrl;
    let exists = true;
    let attempts = 0;
    while (exists && attempts < 5) {
        shortUrl = Math.random().toString(36).substring(2, 8);
        exists = await Url.findOne({ shortUrl });
        attempts++;
    }
    if (exists) {
        return res.status(500).json({ message: "Could not generate a unique short URL. Please try again." });
    }
    try {
        const newUrl = new Url({ originalUrl, shortUrl });
        await newUrl.save();
        res.json({ shortUrl });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({ message: "Short URL already exists. Please try again." });
        }
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/', (req, res) => {
    res.send('URL Shortener API is running...');
}
);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});