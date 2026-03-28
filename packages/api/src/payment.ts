import client from './client'

export const createOrder = (tradeId: string, amount: number) =>
  client.post('/payment/create-order', {tradeId, amount})