const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');
const localDB = process.env.DATABASE_LOCAL;

(async () => {
  try {
    await mongoose.connect(localDB);
    console.log('Database connection successful...');
  } catch (err) {
    console.error(`Connection error: ${err}`);
  }
})();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
