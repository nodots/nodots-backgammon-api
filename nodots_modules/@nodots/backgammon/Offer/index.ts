import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import {
  NodotsOfferPlay,
  NodotsOfferPlayAccepted,
  NodotsOfferPlayRejected,
  NodotsOfferDouble,
  NodotsOfferDoubleAccepted,
  NodotsOfferDoubleRejected,
  NodotsOfferResign,
  NodotsPlayerSeekingGame,
} from '../../backgammon-types'
import { dbCreateOffer } from './db'
// State transitions

export const offerPlay = async (
  offer: NodotsOfferPlay,
  db: NodePgDatabase<Record<string, never>>
) => {
  const offeringPlayer = offer.offeringPlayer
  const offeredPlayer = offer.offeredPlayer

  if (!offeringPlayer || !offeredPlayer) {
    throw new Error('Offering or offered player not found')
  }

  if (!offeringPlayer || !offeredPlayer) {
    throw new Error('Offering or offered player not found')
  }

  return await dbCreateOffer(offer, db)
}

export const acceptOfferPlay = async () => {}

export const rejectOfferPlay = async () => {}

// const game = await getInitializedGameById(gameId, db)
// if (!game) {
//   throw GameStateError('Game not found')
// }
// const _game = game as unknown as GameInitialized
// const activeColor = randomBoolean() ? 'black' : 'white'
// const gameRolling = await dbSetGameRolling(_game, activeColor, db)
// console.log('rollForStart game', gameRolling)
