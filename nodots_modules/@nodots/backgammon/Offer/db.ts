import {
  pgEnum,
  pgTable,
  uuid,
  timestamp,
  PgTimestamp,
} from 'drizzle-orm/pg-core'
import { eq, and, or, ne } from 'drizzle-orm'
import { NodotsOfferPlay } from '../../backgammon-types'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export type OfferKind = 'play' | 'double' | 'resign'

const offerKinds = ['play', 'double', 'resign'] as const

export const OfferTypeEnum = pgEnum('offer-kind', offerKinds)

export interface OfferRecord {
  id: string
  kind: OfferKind
  offeringPlayerId: string
  offeredPlayerId: string
}

export const OffersTable = pgTable('offers', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  kind: OfferTypeEnum('kind').notNull(),
  offeringPlayerId: uuid('offering_player_id').notNull(),
  offeredPlayerId: uuid('offered_player_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const dbCreatePlayOffer = async (
  offeringPlayerId: string,
  offeredPlayerId: string,
  db: NodePgDatabase<Record<string, never>>
) => {
  const offer = {
    kind: 'play' as OfferKind,
    offeringPlayerId: offeringPlayerId,
    offeredPlayerId: offeredPlayerId,
  }
  return await db.insert(OffersTable).values(offer).returning()
}

export const dbGetPlayOffers = async (
  playerId: string,
  db: any
): Promise<OfferRecord[]> => {
  const offers = await db
    .select()
    .from(OffersTable)
    .where(ne(OffersTable.offeredPlayerId, playerId))
  console.log(offers)
  return offers
}
