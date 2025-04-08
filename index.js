process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

console.log("🚀 index.js запущен");

app.post("/proxy", async (req, res) => {
  try {
    const response = await fetch("https://reestr.nostroy.ru/api/sro/all/member/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Connection": "keep-alive",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при проксировании запроса", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
