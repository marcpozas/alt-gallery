import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // El nombre de usuario debe ser único
  },
  email: {
    type: String,
    required: true,
    unique: true, // El correo electrónico debe ser único
  },
  hashPassword: {
    type: String,
    required: true,
  },
});

// Crea el modelo de usuario a partir del esquema
const User = mongoose.model("User", userSchema);

export default User;