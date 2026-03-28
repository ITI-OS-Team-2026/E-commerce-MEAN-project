const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


const mongoose = require('mongoose');
const app = require('./app');

const startServer = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
    console.log("Db connected successfully");

    const port = Number(process.env.PORT) || 8000;
    app.listen(port, () => {
      console.log(`App running on this url http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Db connection failed:", err);
    process.exit(1);
  }
};

startServer();
