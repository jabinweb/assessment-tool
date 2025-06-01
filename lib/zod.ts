import { object, string } from "zod"

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const signUpSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .min(2, "Name must be more than 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  age: string({ required_error: "Age is required" })
    .min(1, "Age is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 13 && val <= 100, "Age must be between 13 and 100"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})
