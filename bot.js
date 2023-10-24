const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql');
require(env)
const bot = new TelegramBot(process.env.TOOKEN, { polling: true });
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'telegrambot',
});
 
const createOptionsKeyboard = () => {
  return {
    reply_markup: {
      keyboard: [
        ['About Blih'],
        ['Success Stories'],
        ['FAQ'],
        ['Articles'],
        ['Schedule A Meeting'],
        ['Study Marketing'],
        ['Marketing Resources'],
        ['Contact Us'],
        ['Recommend Blih']
      ],
    },
  };
};

const scheduleAMeeting = (bot, chatId, connection, createOptionsKeyboard) => {
  const formFields = [
    { label: 'Name', input: /Name:/i, required: true },
    { label: 'Email', input: /Email:/i, required: true },
    { label: 'Phone', input: /Phone:/i, required: true },
    { label: 'Company', input: /Company:/i, required: true },
    { label: 'Birth Date', input: /Birth Date:/i, required: true },
    { label: 'Preferred Date', input: /Preferred Date:/i, required: true },
    { label: 'Preferred Time', input: /Preferred Time:/i, required: true },
    { label: 'Additional Information', input: /Additional Information:/i, required: false }
  ];

  const form = {};

  const askQuestion = (field) => {
    const options = {
      reply_markup: {
        keyboard: [[{ text: 'Cancel' }]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    };
    bot.sendMessage(chatId, `Please enter your ${field.label}:`, options);
  };

  const saveAnswer = (msg) => {
    const answer = msg.text;
    const field = formFields.find((f) => f.label === form.currentField);

    if (answer.toLowerCase() === 'cancel') {
      cancelForm();
      return;
    }

    form[field.label] = answer;
    form.currentFieldIndex++;

    if (form.currentFieldIndex < formFields.length) {
      askQuestion(formFields[form.currentFieldIndex]);
    } else {
      saveMeetingData();
    }
  };

  const cancelForm = () => {
    const keyboard = createOptionsKeyboard();
    bot.sendMessage(chatId, 'Meeting form canceled.', { reply_markup: keyboard.reply_markup });
    resetForm();
  };

  const saveMeetingData = () => {
    const adminId = '386095768';
    const adminMessage = `New meeting scheduled with the following details:\n\n${formatMeetingData()}`;
  
    const { Name, Email, Phone, Company, 'Birth Date': BirthDate, 'Preferred Date': PreferredDate, 'Preferred Time': PreferredTime, 'Additional Information': AdditionalInformation } = form;
  
    connection.query(
      'INSERT INTO users (user_id, name, email, phone, birth_date, company, preferred_date, preferred_time, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [chatId, Name, Email, Phone, BirthDate, Company, PreferredDate, PreferredTime, AdditionalInformation],
      (error) => {
        if (error) {
          console.error('Error saving meeting to database:', error);
          bot.sendMessage(chatId, 'An error occurred while scheduling the meeting. Please try again later.');
        } else {
          bot.sendMessage(adminId, adminMessage);
          bot.sendMessage(chatId, 'Meeting scheduled successfully!');
        }
      }
    );
  
    resetForm();
  };

  const formatMeetingData = () => {
    let formattedData = '';

    formFields.forEach((field) => {
      formattedData += `${field.label}: ${form[field.label] || '-'}\n`;
    });

    return formattedData;
  };

  const resetForm = () => {
    form.currentFieldIndex = 0;
    form.currentField = null;

    formFields.forEach((field) => {
      delete form[field.label];
    });
  };

  form.currentFieldIndex = 0;
  form.currentField = formFields[0].label;

  askQuestion(formFields[0]);

  bot.on('message', (msg) => {
    if (msg.chat.id === chatId) {
      saveAnswer(msg);
    }
  });
};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  switch (text) {
    case '/start':
      const keyboard = createOptionsKeyboard();
      bot.sendMessage(chatId, 'Welcome to the Blih marketing and communication Bot! Please choose an option:', keyboard);
      break;
    case 'About Blih':
      bot.sendMessage(chatId, 'Blih is a marketing and communication platform that helps businesses grow and succeed.');
      break;
    case 'Success Stories':
      bot.sendMessage(chatId, 'Here are some success stories from our clients...');
      break;
    case 'FAQ':
      bot.sendMessage(chatId, 'Frequently Asked Questions:\n\n1. How can I get started with Blih?\n2. What services do you offer?\n3. How much does it cost?');
      break;
    case 'Articles':
      bot.sendMessage(chatId, 'Here are some informative articles on marketing and communication...');
      break;
    case 'Schedule A Meeting':
      scheduleAMeeting(bot, chatId, connection, createOptionsKeyboard);
      break;
    case 'Study Marketing':
      bot.sendMessage(chatId, 'We offer various marketing courses and resources to help you enhance your skills. Visit our website for more details.');
      break;
    case 'Marketing Resources':
      bot.sendMessage(chatId, 'Here are some marketing resources you can explore:\n\n1. E-books\n2. Webinars\n3. Case studies');
      break;
    case 'Contact Us':
      bot.sendMessage(chatId, 'Let us talk about your business, contact us now we have so many ብልህ የማርኬቲንግ ሃሳቦች\n\nEmail: blihmarketing.com\nPhone: +251910628762');
      break;
    case 'Recommend Blih':
      bot.sendMessage(chatId, 'Refer this bot to atleast 10 ብልህ የቢዝነስ ሰዎች and get a 30 minute free marketing consultation');
      bot.sendMessage(chatId,'Here is your referal link')
      bot.sendMessage(chatId,`https://t.me/technologycfy${chatId}`)
      break;
    default:
      // Handle unrecognized commands or inputs
      break;
  }
});
