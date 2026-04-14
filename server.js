const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// --- Middleware ---
// Use EJS to render HTML templates
app.set('view engine', 'ejs');
// Parse data coming from HTML forms
app.use(express.urlencoded({ extended: true })); 

// --- Database Connection ---
// Connect to a local MongoDB database named 'travelDB'
mongoose.connect('mongodb://127.0.0.1:27017/travelDB')
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Database Schema & Model ---
const packageSchema = new mongoose.Schema({
    title: String,
    destination: String,
    price: Number,
    duration: String
});

const Package = mongoose.model('Package', packageSchema);

// --- Routes ---

// GET Route: Fetch all packages from MongoDB and render the homepage
app.get('/', async (req, res) => {
    try {
        const packages = await Package.find({});
        res.render('index', { packages: packages });
    } catch (err) {
        console.error("GET / Error:", err);
        res.status(500).send("Error fetching packages: " + err.message);
    }
});

// POST Route: Handle form submission to add a new package
app.post('/add-package', async (req, res) => {
    try {
        const newPackage = new Package({
            title: req.body.title,
            destination: req.body.destination,
            price: req.body.price,
            duration: req.body.duration
        });
        await newPackage.save(); // Save to database
        res.redirect('/'); // Refresh the page to show the new data
    } catch (err) {
        console.error("POST /add-package Error:", err);
        res.status(500).send("Error saving package.");
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});