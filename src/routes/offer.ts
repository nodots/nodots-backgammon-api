import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Router } from 'express'

import {
  dbCreatePlayOffer,
  dbGetPlayOffers,
  OfferRecord,
} from '../../nodots_modules/@nodots/backgammon/Offer/db'
import {
  NodotsOfferPlay,
  NodotsPlayerSeekingGame,
} from '../../nodots_modules/@nodots/backgammon-types'
import { dbGetPlayerById } from '../../nodots_modules/@nodots/backgammon/Player/db'

export interface EncodedPlayOffer {
  offeringPlayer: NodotsPlayerSeekingGame
  offeredPlayer: NodotsPlayerSeekingGame
  kind: 'play'
}

const encodePlayOffer = async (
  offeringPlayerId: string,
  offeredPlayerId: string,
  db: NodePgDatabase
): Promise<EncodedPlayOffer> => {
  const offeringPlayer = (await dbGetPlayerById(
    offeringPlayerId,
    db
  )) as unknown as NodotsPlayerSeekingGame
  const offeredPlayer = (await dbGetPlayerById(
    offeredPlayerId,
    db
  )) as unknown as NodotsPlayerSeekingGame

  const encodedOffer: EncodedPlayOffer = {
    offeringPlayer,
    offeredPlayer,
    kind: 'play',
  }

  return encodedOffer
}

export const encodePlayOffers = async (
  offers: OfferRecord[],
  db: NodePgDatabase
) => {
  const encodedPlayOffers: EncodedPlayOffer[] = []
  offers.map(async (offer: OfferRecord) => {
    const encodedOffer = await encodePlayOffer(
      offer.offeringPlayerId,
      offer.offeredPlayerId,
      db
    )
    encodedPlayOffers.push(encodedOffer)
  })
  return encodedPlayOffers
}

export interface IOfferRouter extends Router {}

export const OfferRouter = (db: NodePgDatabase): IOfferRouter => {
  const router = Router()

  router.get('/play/:playerId', async (req, res) => {
    const playerId = req.params.playerId
    const offers = await dbGetPlayOffers(playerId, db)
    console.log(offers)
    const encodedPlayOffers = await encodePlayOffers(offers, db)

    console.log(encodedPlayOffers)

    encodedPlayOffers.length > 0
      ? res.status(200).json(encodedPlayOffers)
      : res.status(404).json({ message: 'No offers found' })
  })

  router.post('/play', async (req, res) => {
    const { offeringPlayer, offeredPlayer } = req.body

    const offer = await dbCreatePlayOffer(offeringPlayer, offeredPlayer, db)

    offer
      ? res.status(200).json(offer)
      : res.status(500).json({ message: 'Error creating offer' })
  })

  return router
}
