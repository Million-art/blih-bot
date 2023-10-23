const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql');
const bot = new TelegramBot('6974551501:AAHbOIPfDuFoWNsOEyzJNQyq8D7bCoo5bFk', { polling: true });

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'telegrambot',
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  bot.sendMessage(chatId, 'Welcome to the bot! Please choose an option:', {
    reply_markup: {
      keyboard: [['login', 'signup']],
    },
  });
});

bot.onText(/\/login/, (msg) => {
  let chatId = msg.from.id;
  let userId = msg.from.username;

  connection.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      bot.sendMessage(chatId, `👋, Welcome back`);
    } else {
      bot.sendMessage(chatId, "You are not registered, please register first");
      bot.sendMessage(chatId, 'Please choose an option:', {
        reply_markup: {
          keyboard: [['/signup']],
        },
      });
    }
  });
});

bot.onText(/\/signup/, (msg) => {
  let chatId = msg.from.id;
  let userId = msg.from.username;

  bot.sendMessage(chatId, 'Please enter your first name:');
  bot.once('message', (firstNameMsg) => {
    const firstName = firstNameMsg.text;
    bot.sendMessage(chatId, 'Please enter your last name:');
    bot.once('message', (lastNameMsg) => {
      const lastName = lastNameMsg.text;
      bot.sendMessage(chatId, 'Please enter your phone number:');
      bot.once('message', (phoneMsg) => {
        const phoneNumber = phoneMsg.text;
        bot.sendMessage(chatId, 'Please enter your email:');
        bot.once('message', (emailMsg) => {
          const email = emailMsg.text;
          bot.sendMessage(chatId, 'Please enter your birth date (YYYY-MM-DD):');
          bot.once('message', (birthDateMsg) => {
            const birthDate = birthDateMsg.text;
            bot.sendMessage(chatId, 'Please enter your company name:');
            bot.once('message', (companyNameMsg) => {
              const companyName = companyNameMsg.text;

              // Insert user data into the database
              connection.query(
                'INSERT INTO users (user_id, first_name, last_name, phone_number, email, birth_date, company_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, firstName, lastName, phoneNumber, email, birthDate, companyName],
                (error) => {
                  if (error) throw error;
                  bot.sendMessage(chatId, 'Registration successful!');
                }
              );
            });
          });
        });
      });
    });
  });
});

bot.on('polling_error', (error) => {
  console.log(error);
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to MySQL database.');
});
