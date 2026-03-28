import client from './client'

export const createOrder = (tradeId: string | number, amount: number) =>
  client.post('/payment/create-order', {tradeId, amount})