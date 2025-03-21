const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const KEYS_FILE = "keys.txt"; // Файл с ключами

// Читаем ключи из файла
const readKeys = () => {
    if (!fs.existsSync(KEYS_FILE)) fs.writeFileSync(KEYS_FILE, ""); // Создаем файл, если его нет
    return fs.readFileSync(KEYS_FILE, "utf-8").split("\n").map(k => k.trim()).filter(k => k);
};

// Записываем ключи в файл
const writeKeys = (keys) => {
    fs.writeFileSync(KEYS_FILE, keys.join("\n"), "utf-8");
};

// Проверка ключа
app.post("/validate-key", (req, res) => {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: "Ключ не указан" });

    const keys = readKeys();
    res.json({ valid: keys.includes(key) });
});

// Добавление ключа
app.post("/add-key", (req, res) => {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: "Ключ не указан" });

    let keys = readKeys();
    if (keys.includes(key)) return res.status(400).json({ error: "Ключ уже существует" });

    keys.push(key);
    writeKeys(keys);
    res.json({ success: true, message: "Ключ добавлен" });
});

// Удаление ключа
app.delete("/delete-key", (req, res) => {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: "Ключ не указан" });

    let keys = readKeys();
    if (!keys.includes(key)) return res.status(400).json({ error: "Ключ не найден" });

    keys = keys.filter(k => k !== key);
    writeKeys(keys);
    res.json({ success: true, message: "Ключ удален" });
});

// Новый маршрут для вывода всех ключей в консоль
app.get("/list-keys", (req, res) => {
    const keys = readKeys();
    console.log("Список ключей:");
    keys.forEach((key, index) => {
        console.log(`${index + 1}. ${key}`);
    });
    res.json({ success: true, message: "Список ключей выведен в консоль" });
});

// Добавляем маршрут для удаления ключа после его применения
app.post("/apply-key", (req, res) => {
    const { key } = req.body;
    if (!key) return res.status(400).json({ error: "Ключ не указан" });

    let keys = readKeys();
    if (!keys.includes(key)) return res.status(400).json({ error: "Ключ не найден" });

    // Удаляем ключ из списка
    keys = keys.filter(k => k !== key);
    writeKeys(keys);

    res.json({ success: true, message: "Ключ применен и удален с сервера" });
});


// Запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`));
