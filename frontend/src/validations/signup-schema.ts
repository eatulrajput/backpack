// src/validations/signup-schema.ts
import { z } from "zod"

// Define the schema for form validation using Zod
export const SignUpSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
})
.refine((data)=> data.password === data.confirmPassword, {
    message:"Passwords do not match",
    path:["confirmPassword"], // This attaches the error to the confirmPassword field
})

// Infer the form data type from the schema
export type SignUpFormData = z.infer<typeof SignUpSchema>
