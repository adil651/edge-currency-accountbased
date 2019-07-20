/**
 * Created by paul on 8/8/17.
 */
// @flow

import { Buffer } from 'buffer'

import BnbApiClient from '@binance-chain/javascript-sdk'
import { bns } from 'biggystring'
import { entropyToMnemonic } from 'bip39'
import {
  type EdgeCorePluginOptions,
  type EdgeCurrencyEngine,
  type EdgeCurrencyEngineOptions,
  type EdgeCurrencyPlugin,
  type EdgeEncodeUri,
  type EdgeIo,
  type EdgeMetaToken,
  type EdgeParsedUri,
  type EdgeWalletInfo
} from 'edge-core-js/types'

import { CurrencyPlugin } from '../common/plugin.js'
import { getDenomInfo } from '../common/utils.js'
import { BinanceEngine } from './bnbEngine.js'
import { currencyInfo } from './bnbInfo.js'

// export { calcMiningFee } from './ethMiningFees.js'

const bnbCrypto = BnbApiClient.crypto

// const defaultNetworkFees = {
//   default: {
//     gasLimit: {
//       regularTransaction: '21000',
//       tokenTransaction: '200000'
//     },
//     gasPrice: {
//       lowFee: '1000000001',
//       standardFeeLow: '40000000001',
//       standardFeeHigh: '300000000001',
//       standardFeeLowAmount: '100000000000000000',
//       standardFeeHighAmount: '10000000000000000000',
//       highFee: '40000000001'
//     }
//   },
//   '1983987abc9837fbabc0982347ad828': {
//     gasLimit: {
//       regularTransaction: '21002',
//       tokenTransaction: '37124'
//     },
//     gasPrice: {
//       lowFee: '1000000002',
//       standardFeeLow: '40000000002',
//       standardFeeHigh: '300000000002',
//       standardFeeLowAmount: '200000000000000000',
//       standardFeeHighAmount: '20000000000000000000',
//       highFee: '40000000002'
//     }
//   },
//   '2983987abc9837fbabc0982347ad828': {
//     gasLimit: {
//       regularTransaction: '21002',
//       tokenTransaction: '37124'
//     }
//   }
// }

export class BinancePlugin extends CurrencyPlugin {
  constructor (io: EdgeIo) {
    super(io, 'binance', currencyInfo)
  }

  // async importPrivateKey (passPhrase: string): Promise<Object> {
  //   const strippedPassPhrase = passPhrase.replace('0x', '').replace(/ /g, '')
  //   const buffer = Buffer.from(strippedPassPhrase, 'hex')
  //   if (buffer.length !== 32) throw new Error('Private key wrong length')
  //   const ethereumKey = buffer.toString('hex')
  //   return {
  //     ethereumKey
  //   }
  // }

  async createPrivateKey (walletType: string): Promise<Object> {
    const type = walletType.replace('wallet:', '')

    if (type === 'binance') {
      const entropy = Buffer.from(this.io.random(32)).toString('hex')
      const binanceMnemonic = entropyToMnemonic(entropy)
      const binanceKey = bnbCrypto.getPrivateKeyFromMnemonic(binanceMnemonic)

      return { binanceMnemonic, binanceKey }
    } else {
      throw new Error('InvalidWalletType')
    }
  }

  async derivePublicKey (walletInfo: EdgeWalletInfo): Promise<Object> {
    const type = walletInfo.type.replace('wallet:', '')
    if (type === 'binance') {
      let publicKey = ''
      let privateKey = walletInfo.keys.binanceKey
      if (typeof privateKey !== 'string') {
        privateKey = bnbCrypto.getPrivateKeyFromMnemonic(
          walletInfo.keys.binanceMnemonic
        )
      }
      publicKey = bnbCrypto.getAddressFromPrivateKey(privateKey, 'bnb')
      return { publicKey }
    } else {
      throw new Error('InvalidWalletType')
    }
  }

  async parseUri (
    uri: string,
    currencyCode?: string,
    customTokens?: Array<EdgeMetaToken>
  ): Promise<EdgeParsedUri> {
    const networks = { binance: true }

    const { parsedUri, edgeParsedUri } = this.parseUriCommon(
      currencyInfo,
      uri,
      networks,
      currencyCode || 'BNB',
      customTokens
    )
    let address = ''
    if (edgeParsedUri.publicAddress) {
      address = edgeParsedUri.publicAddress
    }

    const valid = bnbCrypto.checkAddress(address || '', 'bnb')
    if (!valid) {
      throw new Error('InvalidPublicAddressError')
    }

    edgeParsedUri.uniqueIdentifier = parsedUri.query.memo || undefined
    return edgeParsedUri
  }

  async encodeUri (
    obj: EdgeEncodeUri,
    customTokens?: Array<EdgeMetaToken>
  ): Promise<string> {
    const { publicAddress, nativeAmount, currencyCode } = obj
    const valid = bnbCrypto.checkAddress(publicAddress, 'bnb')
    if (!valid) {
      throw new Error('InvalidPublicAddressError')
    }
    let amount
    if (typeof nativeAmount === 'string') {
      const denom = getDenomInfo(
        currencyInfo,
        currencyCode || 'BNB',
        customTokens
      )
      if (!denom) {
        throw new Error('InternalErrorInvalidCurrencyCode')
      }
      amount = bns.div(nativeAmount, denom.multiplier, 18)
    }
    const encodedUri = this.encodeUriCommon(obj, 'binance', amount)
    return encodedUri
  }
}

export function makeBinancePlugin (
  opts: EdgeCorePluginOptions
): EdgeCurrencyPlugin {
  const { io, initOptions } = opts

  let toolsPromise: Promise<BinancePlugin>
  function makeCurrencyTools (): Promise<BinancePlugin> {
    if (toolsPromise != null) return toolsPromise
    toolsPromise = Promise.resolve(new BinancePlugin(io))
    return toolsPromise
  }

  async function makeCurrencyEngine (
    walletInfo: EdgeWalletInfo,
    opts: EdgeCurrencyEngineOptions
  ): Promise<EdgeCurrencyEngine> {
    const tools = await makeCurrencyTools()
    const currencyEngine = new BinanceEngine(
      tools,
      walletInfo,
      initOptions,
      opts
    )

    // Do any async initialization necessary for the engine
    await currencyEngine.loadEngine(tools, walletInfo, opts)

    // This is just to make sure otherData is Flow type checked
    currencyEngine.otherData = currencyEngine.walletLocalData.otherData

    // Initialize otherData defaults if they weren't on disk
    // if (!currencyEngine.otherData.nextNonce) {
    //   currencyEngine.otherData.nextNonce = '0'
    // }
    // if (!currencyEngine.otherData.unconfirmedNextNonce) {
    //   currencyEngine.otherData.unconfirmedNextNonce = '0'
    // }
    // if (!currencyEngine.otherData.networkFees) {
    //   currencyEngine.otherData.networkFees = defaultNetworkFees
    // }

    const out: EdgeCurrencyEngine = currencyEngine

    return out
  }

  return {
    currencyInfo,
    makeCurrencyEngine,
    makeCurrencyTools
  }
}
