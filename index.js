process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

console.log("\u{1F680} Прокси сервер запущен");

async function fetchWithRetry(url, options, retries = 5, delay = 10000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      console.warn(`Попытка ${i + 1} не удалась:`, err.message);
      if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
      else throw err;
    }
  }
}

app.post("/proxy", async (req, res) => {
  try {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Connection": "keep-alive",
      },
      body: JSON.stringify(req.body),
    };

    const response = await fetchWithRetry(
      "https://reestr.nostroy.ru/api/sro/all/member/list",
      fetchOptions
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Ошибка при проксировании запроса:", error);
    res.status(500).json({
      error: "Ошибка при проксировании запроса",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));