import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email({ error: "Please enter a valid email" }),
    password: z.string().min(1, "Password is required"),
});


export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email({ error: 'Please enter a valid email' }),
    phoneNumber: z
        .string()
        .trim()
        .refine((s) => !s || s.length === 11, {
            message: 'Phone number must be empty or exactly 11 digits',
        }),
    password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

