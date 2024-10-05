const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Route to perform Nmap scan
app.post('/scan', (req, res) => {
    const domain = req.body.domain;

    if (!domain) {
        return res.status(400).json({ error: 'Domain name is required' });
    }

    // Execute Nmap command with the provided domain
    exec(`nmap -sT ${domain}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Nmap: ${error}`);
            return res.status(500).json({ error: 'Failed to execute Nmap' });
        }
        if (stderr) {
            console.error(`Nmap stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        // Send the Nmap scan output to the client
        res.send(`<pre>${stdout}</pre>`);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
