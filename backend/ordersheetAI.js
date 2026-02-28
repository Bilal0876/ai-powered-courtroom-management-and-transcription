const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const router = express.Router();

router.post("/generate", (req, res) => {
    const { transcript, caseInfo } = req.body;

    if (!transcript || !caseInfo) {
        return res.status(400).json({ error: "Transcript and case info required" });
    }

    const scriptPath = path.join(__dirname, "..", "mistral-ai", "generate_ordersheet.py");

    if (!fs.existsSync(scriptPath)) {
        return res.status(500).json({ error: "Python script not found" });
    }
    const PYTHON_PATH = "C:/Users/BILAL/AppData/Local/Programs/Python/Python310/python.exe"; // 👈 adjust to your actual path
    const python = spawn(PYTHON_PATH, [scriptPath]);

    //const python = spawn("python", [scriptPath]);

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
        output += data.toString();
    });

    python.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    python.on("close", (code) => {
        if (code !== 0) {
            console.error("Python Error:", errorOutput);
            return res.status(500).json({
                error: errorOutput || "Python script failed"
            });
        }
        res.json({ ordersheet: output });
    });

    python.on("error", (err) => {
        console.error("Failed to start Python:", err);
        return res.status(500).json({ error: "Failed to start Python process" });
    });

    python.stdin.write(JSON.stringify({ transcript, case_info: caseInfo }));
    python.stdin.end();
});

module.exports = router;