const mysql = require('mysql');

// Create a connection
const connection = mysql.createConnection({
  host: '192.250.239.60',
  user: 'blihmarketingcom_million',
  password: 'Acslf0213fne!',
  database: 'blihmarketingcom_telegrambot',
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to MySQL database.');

  // Perform database operations here

  // Close the connection when done
  connection.end();
});