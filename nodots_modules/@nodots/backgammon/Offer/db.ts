import {
  pgEnum,
  pgTable,
  uuid,
  timestamp,
  PgTimestamp,
} from 'drizzle-orm/pg-core'
import { eq, and, or, ne } from 'drizzle-orm'
import { NodotsOfferPlay } from '../../backgammon-types'

const offerKinds = ['play', 'double', 'resign'] as const

export const OfferTypeEnum = pgEnum('offer-kind', offerKinds)

export interface OfferRecord {
  id: string
  kind: 'play' | 'double' | 'resign'
  offeringPlayerId: string
  offeredPlayerId: string
  createdAt: string
  updatedAt: string
}

export const OffersTable = pgTable('offers', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  kind: OfferTypeEnum('kind').notNull(),
  offeringPlayerId: uuid('offering_player_id').notNull(),
  offeredPlayerId: uuid('offered_player_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

const dbCreateOffer = async (offer: any, db: any) => {
  const result = await db.insert(OffersTable).values(offer).returning()
  return result
}

export const dbCreatePlayOffer = async (
  offeringPlayer: any,
  offeredPlayer: any,
  db: any
) => {
  const offer = {
    kind: 'play',
    offeringPlayerId: offeringPlayer.id,
    offeredPlayerId: offeredPlayer.id,
  }
  return await dbCreateOffer(offer, db)
}

export const dbGetPlayOffers = async (
  playerId: string,
  db: any
): Promise<OfferRecord[]> => {
  const offers = await db
    .select()
    .from(OffersTable)
    .where(ne(OffersTable.offeredPlayerId, playerId))
  return offers
}
