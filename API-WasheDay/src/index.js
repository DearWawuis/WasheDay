import app from "../app";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
app.listen(3000)

console.log('Servidor iniciado en el puerto ', 3000);

//Conexión con mongoose
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a la BD'))
    .catch((error) => console.error(error))