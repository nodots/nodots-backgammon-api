import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { NodotsOfferPlay } from '../../backgammon-types'
import { dbCreatePlayOffer } from './db'
// State transitions

export const offerPlay = async (
  offer: NodotsOfferPlay,
  db: NodePgDatabase<Record<string, never>>
) => await dbCreatePlayOffer(offer.offeringPlayerId, offer.offeredPlayerId, db)

export const acceptOfferPlay = async () => {}

export const rejectOfferPlay = async () => {}
