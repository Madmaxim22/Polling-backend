import express from 'express';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для CORS заголовков
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Обработка preflight запросов
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

/**
 * Генерирует случайное количество непрочитанных сообщений
 */
const generateUnreadMessages = async () => {
  const messageCount = Math.floor(Math.random() * 5); // Случайное число сообщений от 0 до 4
  const messages = [];

  for (let i = 0; i < messageCount; i++) {
    messages.push({
      id: uuidv4(),
      from: faker.internet.email(),
      subject: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      received: faker.date.recent().getTime() / 1000 // Временная метка в секундах
    });
  }

  return messages;
};

/**
 * Endpoint для получения непрочитанных сообщений
 */
app.get('/messages/unread', async (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const messages = await generateUnreadMessages();

    res.json({
      status: 'ok',
      timestamp,
      messages
    });
  } catch (error) {
    console.error('Ошибка при получении непрочитанных сообщений:', error);
    res.status(500).json({
      status: 'error',
      timestamp: Math.floor(Date.now() / 1000),
      error: 'Внутренняя ошибка сервера'
    });
  }
});

// Асинхронная функция для запуска сервера
async function startServer() {
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
    console.log(`Endpoint доступен по адресу: http://localhost:${port}/messages/unread`);
  });
}

startServer();

export default app;