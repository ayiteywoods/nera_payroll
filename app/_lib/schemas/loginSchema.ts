import { z } from "zod";


export const LoginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }).trim(),
  password : z
  .string ()
  .min(8, {error: "Password must be at least 8 characters long." })
  .trim(),
});

export type LoginFormState = 
 | {
  errors? : {
    email?: string[]
    password?: string[]
  };
  message?: string
 }
  | undefined;
 