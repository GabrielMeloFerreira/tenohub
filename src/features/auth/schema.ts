import { z } from 'zod'

export const emailSchema = z.email('E-mail invalido.')

export const passwordSchema = z
  .string()
  .min(6, 'A senha precisa de ao menos 6 caracteres.')
  .regex(/[^A-Za-z0-9]/, 'A senha precisa de ao menos um caractere especial.')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe a senha.'),
})

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas nao conferem.',
    path: ['confirmPassword'],
  })
