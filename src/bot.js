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

  const keyboard = {
    reply_markup: {
      keyboard: [['Login'], ['Sign Up']],
      one_time_keyboard: true,
    },
  };
  bot.sendMessage(chatId, 'Welcome to the blih marketing and communication Bot! Please choose an option:', keyboard);
});

bot.onText(/Login/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  connection.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
    if (error) throw error;
    if (results.length > 0 && userId=='386095768') {
      const firstName = msg.from.first_name;
      bot.sendMessage(chatId, `Welcome back, ${firstName}!`);
     } 
    else if (results.length > 0) {
      const firstName = msg.from.first_name;
      bot.sendMessage(chatId, `Welcome back, ${firstName}!`);
      sendMenuKeyboard(chatId); // Call the sendMenuKeyboard function here
    }
    else {
      const keyboard = {
        reply_markup: {
          keyboard: [['Login'], ['Sign Up']],
          one_time_keyboard: true,
        },
      };
      bot.sendMessage(chatId, 'You are not registered yet. Please register first.', keyboard);
    }
  });
});

bot.onText(/Sign Up/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  connection.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      bot.sendMessage(chatId, 'You are already registered. Please login instead.');
      const keyboard = {
        reply_markup: {
          keyboard: [['Login']],
          one_time_keyboard: true,
        },
      };
      bot.sendMessage(chatId, 'Please choose an option:', keyboard);
    } else {
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
                    'INSERT INTO users (user_id, fristname, lastname, phone_number, email, birth_date, company_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [userId, firstName, lastName, phoneNumber, email, birthDate, companyName],
                    (error) => {
                      if (error) throw error;
                      bot.sendMessage(chatId, 'Registration successful!');
                      sendMenuKeyboard(chatId);
                    }
                  );
                });
              });
            });
          });
        });
      });
    }
  });
});

bot.on('polling_error', (error) => {
  console.log(error);
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Connected to MySQL database.');
});

 
function sendMenuKeyboard(chatId) {
  const keyboard = {
    reply_markup: {
      keyboard: [
        ['About Blih'],
        ['About You'],
        ['Success Stories'],
        ['FAQ'],
        ['Articles'],
        ['Schedule A Meeting'],
        ['Study Marketing'],
        ['Marketing Resources'],
        ['Contact Us'],
        ['Recommend Blih']
      ],
      // one_time_keyboard: true,
    },
  };
  bot.sendMessage(chatId, 'Please choose an option:', keyboard)
    .then(() => {
      bot.on('message', (msg) => {
        const chosenOption = msg.text;
        let responseText;

        switch (chosenOption) {
          case 'About Blih':
            responseText = `We are one of the best marketing agencies in Ethiopia and we are here to make your business grow, shine and stand out from the crowd`;
            break;
          case 'About You':
            responseText = `You chose: About You`;
            break;
          case 'Success Stories':
            responseText = `You chose: Success Stories`;
            break;
          case 'FAQ':
            responseText = `You chose: FAQ`;
            break;
          case 'Articles':
            responseText = `You chose: Articles`;
            break;
          case 'Schedule A Meeting':
            responseText = `You chose: Schedule A Meeting`;
            break;
          case 'Study Marketing':
            responseText = `You chose: Study Marketing`;
            break;
          case 'Marketing Resources':
            responseText = `You chose: Marketing Resources`;
            break;
          case 'Contact Us':
            responseText = `You chose: Contact Us`;
            break;
          case 'Recommend Blih':
            responseText = `You chose: Recommend Blih`;
            break;
          default:
            responseText = `Invalid option. Please choose again.`;
            break;
        }

        bot.sendMessage(chatId, responseText);
      });
    });
}