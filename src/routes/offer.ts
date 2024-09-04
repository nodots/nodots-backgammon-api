import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'

import {
  dbCreatePlayOffer,
  dbGetPlayOffers,
} from '../../nodots_modules/@nodots/backgammon/Offer/db'

export interface IOfferRouter extends Router {}

export const OfferRouter = (db: NodePgDatabase): IOfferRouter => {
  const router = Router()

  router.get('/play/:playerId', async (req, res) => {
    const playerId = req.params.playerId
    const offers = await dbGetPlayOffers(playerId, db)
    offers
      ? res.status(200).json(offers)
      : res.status(500).json({ message: 'Error getting offers' })
  })

  router.post('/play', async (req, res) => {
    const { offeringPlayerId, offeredPlayerId } = req.body

    const offer = await dbCreatePlayOffer(offeringPlayerId, offeredPlayerId, db)

    offer
      ? res.status(200).json(offer)
      : res.status(500).json({ message: 'Error creating offer' })
  })

  return router
}
