import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import routerUser from "./routes/user.router.js";

const app = express()
dotenv.config()
app.use(express.json())

app.use(routerUser);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT} at http://localhost:${process.env.PORT}`)
})

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB.');
});