import { z } from 'zod'

export const LoginBody = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
  tenant:   z.string().min(1),
})
export type LoginBodyType = z.infer<typeof LoginBody>

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'tenant'],
    properties: {
      email:    { type: 'string', format: 'email' },
      password: { type: 'string' },
      tenant:   { type: 'string' },
    },
  },
}
export const refreshSchema = {
  body: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } },
}
export const totpSchema = {
  body: { type: 'object', required: ['totpCode'], properties: { totpCode: { type: 'string' } } },
}
