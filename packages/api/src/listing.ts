import client from './client'

export interface ListingFilters {
  crop?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  from?: string
  page?: number
  limit?: number
}

/** GET /listing/all — browse open listings with optional filters */
export const getListings = (filters: ListingFilters = {}) =>
  client.get('/listing/all', { params: filters })

/** POST /listing/create — farmer posts a listing (multipart form with optional photo) */
export const createListing = (data: FormData) =>
  client.post('/listing/create', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

/** GET /listing/:id — single listing detail */
export const getListing = (id: string) =>
  client.get(`/listing/${id}`)

/** POST /listing/:id/buy — trader purchases a listing → creates a trade */
export const buyListing = (id: string) =>
  client.post(`/listing/${id}/buy`)
