import client from './client'

export const createTrade = (data) => client.post('/trade/create', data)
export const getTrade = (id) => client.get(`/trade/${id}`)
export const getMyTrades = () => client.get('/trade/my/all')
export const agreeTrade = (id) => client.post(`/trade/${id}/agree`)
export const assignTransporter = (id, transporterPhone) => 
  client.post(`/trade/${id}/assign-transporter`, {transporterPhone})
export const markPickedUp = (id) => client.post(`/trade/${id}/pickup`)
export const markDelivered = (id) => client.post(`/trade/${id}/deliver`)
export const addPaymentProof = (id, utrHash) => 
  client.post(`/trade/${id}/payment-proof`, {utrHash})
export const completeTrade = (id) => client.post(`/trade/${id}/complete`)