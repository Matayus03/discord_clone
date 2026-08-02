import userRepositories from "../repositories/userRepositories.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const saltRounds = 10;

async function register(username: string, email: string, password: string) {
    const existingEmail = await userRepositories.findByEmail(email);

    if (existingEmail) {
        throw new Error("Email already exists");
    }
    
    const passwordHash = await bcrypt.hash(password, saltRounds);
        
    const user = await userRepositories.createUser(username, email, passwordHash);
    
    const token = jwt.sign({
        id: user.id,
        username: user.username
    },
        process.env.JWT_SECRET!,
    { expiresIn: "1h" }
    );

    return {
        user,
        token
    };
}

async function login(email: string, password: string) {
    const user = await userRepositories.findByEmail(email);

    if (!user) {
        throw new Error("Invalid Credentials");
    }

    const passwordValid = await bcrypt.compare(password, user.hash_password);

    if (!passwordValid) {
        throw new Error("Invalid Credentials")
    } 

    const token = jwt.sign({
        id: user.id,
        username: user.username
    },
        process.env.JWT_SECRET!,
    { expiresIn: "1h"}
    );

    const safeUser = {
        id: user.id,
        username: user.username
    }

    return {
        user: safeUser,
        token
    };

}

export default {
    register,
    login
}