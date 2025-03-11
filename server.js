const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const KEYS_FILE = "keys.txt"; // Файл с ключами

// Проверка ключа
app.post("/validate-key", (req, res) => {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: "Ключ не указан" });

    const keys = fs.readFileSync(KEYS_FILE, "utf-8").split("\n").map(k => k.trim());
    res.json({ valid: keys.includes(key) });
});

// Добавление ключа (для админа)
app.post("/add-key", (req, res) => {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: "Ключ не указан" });

    fs.appendFileSync(KEYS_FILE, key + "\n");
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`));
