import client from './client'

export const register = (data: { name: string; phone: string; role: string }) =>
  client.post('/auth/register', data)

export const login = (data: { phone: string }) =>
  client.post('/auth/login', data)

export const getMe = () =>
  client.get('/auth/me')