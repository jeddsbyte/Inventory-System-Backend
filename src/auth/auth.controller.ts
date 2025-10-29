
import { Request, Response } from "express";
import { createUserServices,  getUserByEmailService, } from "./auth.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendNotificationEmail } from "../emails/mailer";
import { UserLoginValidator, UserValidator } from "../validation/user.validator";

//Register a new user
export const createUser=async(req:Request,res:Response)=>{
try {
    const parseResult=UserValidator.safeParse(req.body)

    if(!parseResult.success){
        res.status(400).json({error:parseResult.error.issues})   
        return
     }

const user=parseResult.data

const userEmail=user.email

const existingUser=await getUserByEmailService(userEmail)

if(existingUser){
    res.status(400).json({error:"user already exists"})
    return
}

const salt =bcrypt.genSaltSync(10)
const hashedPassword=bcrypt.hashSync(user.password,salt)
user.password=hashedPassword

        const newUser = await createUserServices(user);
        const results = await sendNotificationEmail(user.email, user.userName, "Account created successfully", "Welcome to our smart inventory system</b>");
        if (!results) {
            res.status(500).json({ error: "Failed to send notification email" });
            return;
        }else {
            console.log("Email sent successfully:", results);
        }     
        res.status(201).json(newUser);  

} catch (error) {
    res.status(500).json({error: "Failed to register user"})
}
}




export const loginUser = async (req: Request, res: Response) => {
  try {
     const parseResult = UserLoginValidator.safeParse(req.body);
    if (!parseResult.success) {
       res.status(400).json({ error: parseResult.error.issues });
       return
    }

    const { email, password } = parseResult.data;

    const user = await getUserByEmailService(email);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return 
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid password" });
       return
    }

    const payload = {
      userId: user.userId,
      email: user.email,
      userName: user.userName,

    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 //expires after 1 week
    };

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(payload, secret);

       res.status(200).json({
      message: "Login successful",
      token,
      userId: user.userId,
      userName: user.userName,
        email: user.email,
 });

        
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login user" });
    return 
  }
};


