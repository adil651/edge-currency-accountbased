import {
  ApiPromise,
  Keyring,
  utilCrypto,
  WsProvider
  // @ts-expect-error
} from './polkadot-sdk-bundle'

const { ed25519PairFromSeed, isAddress, mnemonicToMiniSecret } = utilCrypto

export {
  ApiPromise,
  WsProvider,
  Keyring,
  ed25519PairFromSeed,
  isAddress,
  mnemonicToMiniSecret
}