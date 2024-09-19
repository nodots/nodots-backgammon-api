import { NodotsPlayerReady } from './player'

interface Offer {
  offeringPlayerId: string
  offeredPlayerId: string
  kind: 'play' | 'double' | 'resign'
}

export interface NodotsOfferPlay extends Offer {
  kind: 'play'
}

export interface NodotsOfferPlayAccepted extends NodotsOfferPlay {
  accepted: true
}

export interface NodotsOfferPlayRejected extends NodotsOfferPlay {
  accepted: true
}

export interface NodotsOfferDouble extends Offer {
  kind: 'double'
}

export interface NodotsOfferDoubleAccepted extends NodotsOfferDouble {
  accepted: true
}

export interface NodotsOfferDoubleRejected extends NodotsOfferDouble {
  accepted: false
}

export interface NodotsOfferResign extends Offer {
  kind: 'resign'
}

export interface NodotsOfferResignAccepted extends NodotsOfferResign {
  accepted: true
}

export interface NodotsOfferResignRejected extends NodotsOfferResign {
  accepted: false
}

export type NodotsOffer =
  | NodotsOfferPlay
  | NodotsOfferPlayAccepted
  | NodotsOfferPlayRejected
  | NodotsOfferResign
  | NodotsOfferResignAccepted
  | NodotsOfferResignRejected
