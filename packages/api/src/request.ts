import client from './client'

export interface CreateRequestData {
  cropName: string
  quantity: number
  preferredPrice: number
  deliveryCity: string
  deliveryState: string
  deliveryDate: string // ISO date string
}

/** POST /request/create — trader posts a reverse crop request */
export const createRequest = (data: CreateRequestData) =>
  client.post('/request/create', data)

/** GET /request/open — public list of all OPEN requests (no auth needed) */
export const getOpenRequests = (crop?: string) =>
  client.get('/request/open', { params: crop ? { crop } : undefined })

/** POST /request/:id/accept — farmer accepts a crop request → creates a trade */
export const acceptRequest = (id: string) =>
  client.post(`/request/${id}/accept`)

/** GET /request/my/all — trader's own requests */
export const getMyRequests = () =>
  client.get('/request/my/all')
