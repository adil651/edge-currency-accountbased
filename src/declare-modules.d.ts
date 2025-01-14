declare module '@fioprotocol/fiosdk' {
  // This module not only has exported methods,
  // but also works as a constructor, which requires a deeper type definition:
  export class FIOSDK {
    constructor(...args: any[])

    executePreparedTrx: any
    genericAction: any
    getAbi: any
    transactions: any

    static createPrivateKey: any
    static createPrivateKeyMnemonic: any
    static derivedPublicKey: any
    static isFioAddressValid: any
    static isFioDomainValid: any
  }
}

declare module '@fioprotocol/fiosdk/lib/entities/EndPoint'
declare module '@fioprotocol/fiosdk/lib/transactions/Transactions'
declare module '@fioprotocol/fiosdk/lib/utils/constants'
declare module '@tronscan/client'
declare module '@tronscan/client/src/lib/code' {
  export const hexStr2byteArray: (address: string) => Uint8Array
}
declare module '@tronscan/client/src/utils/bytes' {
  export const byteArray2hexStr: (bytes: Uint8Array) => string
}
declare module '@tronscan/client/src/utils/crypto' {
  export const decode58Check: (address: string) => Uint8Array
  export const isAddressValid: (address: string) => boolean
  export const getBase58CheckAddress: (bytes: Uint8Array) => string
  export const pkToAddress: (privateKey: string) => string
}
declare module '@tronscan/client/src/utils/tronWeb' {
  export const contractJsonToProtobuf: (json: Object) => any
}
declare module 'eosjs-api'
declare module 'eosjs-ecc'
declare module 'ethereumjs-abi'
declare module 'ethereumjs-util'
declare module 'ethereumjs-wallet'
declare module 'ethereumjs-wallet/hdkey'
declare module 'eztz.js'

declare module 'react-native' {
  interface EdgeCurrencyAccountbasedModule {
    getConstants: () => {
      sourceUri: string
    }
  }

  declare const NativeModules: {
    EdgeCurrencyAccountbasedModule: EdgeCurrencyAccountbasedModule
  }
}

declare module 'stellar-sdk'
