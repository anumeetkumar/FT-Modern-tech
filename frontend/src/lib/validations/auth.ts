import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
    
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Register validation schema


// Type inference from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
