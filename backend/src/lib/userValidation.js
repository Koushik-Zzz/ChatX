import { z } from 'zod'


const signupSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    fullName: z.string().min(1, {message: "Full name is required"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})

const signinSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, {message: "Password must be at least 6 characters"})
})

export {
    signupSchema,
    signinSchema
}