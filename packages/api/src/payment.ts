import client from './client'

export const createOrder = (tradeId, amount) =>
  client.post('/payment/create-order', {tradeId, amount})