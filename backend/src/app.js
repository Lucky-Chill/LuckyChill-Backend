require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routeIndex = require("./routes");
const swaggerSpec = require("./docs/swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    data: { message: "server is running" },
    error: null
  });
});

app.get("/api-docs.json", (req, res) => {
  return res.status(200).json(swaggerSpec);
});

app.use("/api", routeIndex);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    data: null,
    error: {
      code: "NOT_FOUND",
      message: "요청한 리소스를 찾을 수 없습니다."
    }
  });
});

module.exports = app;
