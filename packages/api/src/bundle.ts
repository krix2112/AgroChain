import client from './client'

/** POST /bundle/check — check if a trade qualifies for smart route bundling */
export const checkBundle = (tradeId: number | string) =>
  client.post('/bundle/check', { tradeId })

/** POST /bundle/confirm — confirm bundle: group trades + optionally assign transporter */
export const confirmBundle = (data: {
  tradeIds: (number | string)[]
  fromCity: string
  toCity: string
  deliveryDate: string
  transporterPhone?: string
}) => client.post('/bundle/confirm', data)

/** POST /bundle/reject — opt out of bundling; trade proceeds as solo delivery */
export const rejectBundle = (tradeId: number | string) =>
  client.post('/bundle/reject', { tradeId })

/** GET /bundle/:id — fetch a specific bundle */
export const getBundle = (id: string) =>
  client.get(`/bundle/${id}`)

/** GET /bundle — list all bundles */
export const getBundles = () =>
  client.get('/bundle')
