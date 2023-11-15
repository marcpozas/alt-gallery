import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import User from '../models/user.model.js';

dotenv.config()
const saltOrRounds = 10;

export async function register(req, res) {
    try {
        if (!req.body.username || !req.body.email || !req.body.password || !req.body.confirmPassword) {
            return res.status(400).send({status: "Error", message: "Some fields are incomplete."})
        }
        const {username, email, password, confirmPassword} = req.body;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
          return res.status(400).send({ status: "Error", message: "This username or email already exists." });
        }

        if (password == confirmPassword) {
            const newUser = new User({
                username,
                email,
                hashPassword: await bcrypt.hash(password, saltOrRounds),
              });
            console.log(newUser);
            await newUser.save();
            res.status(201).send({status: "ok", message: "User registered", redirect: "/"});
        } else {
            res.status(400).send({status: "Error", message: "Passwords are different" });
        }
    } catch (error) {
        res.status(400).send({status: "Error", message: "Something failed" });
    }
}

export async function login(req, res) {
    if (!req.body.identification || !req.body.password) {
        return res.status(400).send({status: "Error", message: "Some fields are incomplete."})
    }
    const {identification, password} = req.body;

    const existingUser = await User.findOne({ $or: [{ username: identification }, { email: identification }] });

    if (!existingUser) {
        return res.status(400).send({status: "Error", message: "Error while logging."});
    }

    const loginCorrect = await bcrypt.compare(password, existingUser.hashPassword);
    if (!loginCorrect) {
        return res.status(400).send({status: "Error", message: "Error while logging."});
    }
    const token = jsonwebtoken.sign(
        {user:existingUser.username}, 
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRATION}
        );
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: "/"
    }
    res.cookie("jwt", token, cookieOption);
    res.status(200).send({status: "ok", message: "User logged", redirect: "/"});
    try {
    } catch (error) {
        res.json({isOk: false, msj: "Something failed."})
    }
}