import client from './client'

export const createTrade = (data: any) => client.post('/trade/create', data)
export const getTrade = (id: string) => client.get(`/trade/${id}`)
export const getMyTrades = () => client.get('/trade/my/all')
export const agreeTrade = (id: string) => client.post(`/trade/${id}/agree`)
export const assignTransporter = (id: string, transporterPhone: string) => 
  client.post(`/trade/${id}/assign-transporter`, {transporterPhone})
export const markPickedUp = (id: string) => client.post(`/trade/${id}/pickup`)
export const markDelivered = (id: string) => client.post(`/trade/${id}/deliver`)
export const addPaymentProof = (id: string, utrHash: string) => 
  client.post(`/trade/${id}/payment-proof`, {utrHash})
export const completeTrade = (id: string) => client.post(`/trade/${id}/complete`)