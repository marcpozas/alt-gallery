import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function onlyAdmin(req, res, next) {
    const logged = checkCookie(req);
    if (logged) {
        return next();
    }
    return res.redirect("/");
}

export function onlyUser(req, res, next) {
    
}

function checkCookie(req) {
    try {
        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const decodifiedCookie = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        console.log(decodifiedCookie);
        // check if there is a user called decodifiedCookie.username
        if (0) {        // doesn't exist
            return false
        }
        return true;    // exist
    }
    catch (error) {
        return false;   
    }
}