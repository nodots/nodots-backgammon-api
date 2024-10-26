import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'

import {
  dbCreatePlayOffer,
  dbGetPlayOffersForPlayerId,
  dbRespondPlayOffer,
} from '../../nodots_modules/@nodots/backgammon/Offer/db'

export interface IOfferRouter extends Router {}

export const OfferRouter = (db: NodePgDatabase): IOfferRouter => {
  const router = Router()

  router.post('/play', async (req, res) => {
    const { offeringPlayerId, offeredPlayerId } = req.body
    const offer = await dbCreatePlayOffer(offeringPlayerId, offeredPlayerId, db)

    offer
      ? res.status(200).json(offer)
      : res.status(500).json({ message: 'Error creating offer' })
  })

  router.get('/play/:playerId', async (req, res) => {
    console.log('GET /offer/play/:playerId')
    const playerId = req.params.playerId
    console.log('playerId:', playerId)
    const offers = await dbGetPlayOffersForPlayerId(playerId, db)
    console.log('offers:', offers)
    offers
      ? res.status(200).json(offers)
      : res.status(500).json({ message: 'Error getting offers' })
  })

  router.post('/play', async (req, res) => {
    const { offeringPlayerId, offeredPlayerId } = req.body
    console.log(
      'POST /offer/play/ offeringPlayerId:',
      offeringPlayerId,
      'offeredPlayerId:',
      offeredPlayerId
    )

    const offer = await dbCreatePlayOffer(offeringPlayerId, offeredPlayerId, db)

    offer
      ? res.status(200).json(offer)
      : res.status(500).json({ message: 'Error creating offer' })
  })

  router.patch('/play/respond/:offerId', async (req, res) => {
    const { offerId } = req.params
    const { accepted } = req.body

    const offer = await dbRespondPlayOffer(offerId, accepted, db)

    offer
      ? res.status(200).json(offer)
      : res.status(500).json({ message: 'Error responding to offer' })
  })

  return router
}
