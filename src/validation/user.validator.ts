import zod from "zod/v4";

export const UserValidator = zod.object({
    userName: zod.string().min(3).max(50),
    email: zod.string().email().max(100),
    password: zod.string().min(8).max(255), 
 });


 
 export const UserLoginValidator = zod.object({
  email: zod.email().trim(),
  password: zod.string().min(8).max(100).trim(),
});