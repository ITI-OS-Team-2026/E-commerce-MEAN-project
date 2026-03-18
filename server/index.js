const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

mongoose
  .connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
  .then(() => console.log('Db success conn'));

const port = Number(process.env.PORT) || 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
