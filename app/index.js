const express = require('express');
const path = require('path');
const cors = require('cors');
const deploy = require('./deploy');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.post('/api/deploy', async (req, res) => {
    const { environment } = req.body;

    try {
        const result = await deploy(environment);
        res.json({ success: true, ...result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Serve index.html for any non-API route (SPA)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
