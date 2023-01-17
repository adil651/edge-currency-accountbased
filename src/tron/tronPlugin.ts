import { isAddressValid, pkToAddress } from '@tronscan/client/src/utils/crypto'
import { div } from 'biggystring'
import { entropyToMnemonic, mnemonicToSeed, validateMnemonic } from 'bip39'
import {
  EdgeCurrencyInfo,
  EdgeCurrencyTools,
  EdgeEncodeUri,
  EdgeIo,
  EdgeLog,
  EdgeMetaToken,
  EdgeParsedUri,
  EdgeToken,
  EdgeWalletInfo
} from 'edge-core-js/types'
import EthereumUtil from 'ethereumjs-util'
import hdKey from 'ethereumjs-wallet/hdkey'

import { PluginEnvironment } from '../common/innerPlugin'
import { encodeUriCommon, parseUriCommon } from '../common/uriHelpers'
import { getDenomInfo } from '../common/utils'
import { TronNetworkInfo } from './tronTypes'

export class TronTools implements EdgeCurrencyTools {
  io: EdgeIo
  currencyInfo: EdgeCurrencyInfo
  log: EdgeLog

  constructor(env: PluginEnvironment<TronNetworkInfo>) {
    const { currencyInfo, io, log } = env
    this.io = io
    this.currencyInfo = currencyInfo
    this.log = log
  }

  async importPrivateKey(userInput: string): Promise<Object> {
    if (/^(0x)?[0-9a-fA-F]{64}$/.test(userInput)) {
      // It looks like a private key, so validate the hex:
      const tronKeyBuffer = Buffer.from(userInput.replace(/^0x/, ''), 'hex')
      if (EthereumUtil.isValidPrivate(tronKeyBuffer) === true) {
        throw new Error('Invalid private key')
      }
      const tronKey = tronKeyBuffer.toString('hex')
      return { tronKey }
    } else {
      // it looks like a mnemonic, so validate that way:
      if (!validateMnemonic(userInput)) {
        throw new Error('Invalid input')
      }
      const tronKey = await this._mnemonicToTronKey(userInput)
      return {
        tronMnemonic: userInput,
        tronKey
      }
    }
  }

  async createPrivateKey(walletType: string): Promise<Object> {
    if (walletType !== this.currencyInfo.walletType) {
      throw new Error('InvalidWalletType')
    }

    const entropy = Buffer.from(this.io.random(32)).toString('hex')
    const tronMnemonic = entropyToMnemonic(entropy)
    const tronKey = await this._mnemonicToTronKey(tronMnemonic)
    return { tronMnemonic, tronKey }
  }

  async _mnemonicToTronKey(mnemonic: string): Promise<string> {
    const myMnemonicToSeed = await mnemonicToSeed(mnemonic)
    const hdwallet = hdKey.fromMasterSeed(myMnemonicToSeed)
    const walletHDpath = "m/44'/195'/0'/0" // 195 = Tron
    const wallet = hdwallet.derivePath(walletHDpath).getWallet()
    const tronKey = wallet.getPrivateKeyString().replace('0x', '')
    return tronKey
  }

  async derivePublicKey(walletInfo: EdgeWalletInfo): Promise<Object> {
    if (walletInfo.type !== this.currencyInfo.walletType) {
      throw new Error('InvalidWalletType')
    }

    const publicKey = pkToAddress(walletInfo.keys.tronKey)
    return { publicKey }
  }

  async parseUri(
    uri: string,
    currencyCode?: string,
    customTokens?: EdgeMetaToken[]
  ): Promise<EdgeParsedUri> {
    const networks = { [this.currencyInfo.pluginId]: true }

    const { parsedUri, edgeParsedUri } = parseUriCommon(
      this.currencyInfo,
      uri,
      networks,
      currencyCode ?? this.currencyInfo.currencyCode,
      customTokens
    )
    const address = edgeParsedUri.publicAddress ?? ''

    if (!isAddressValid(address)) {
      throw new Error('InvalidPublicAddressError')
    }

    edgeParsedUri.uniqueIdentifier = parsedUri.query.memo
    return edgeParsedUri
  }

  async encodeUri(
    obj: EdgeEncodeUri,
    customTokens?: EdgeMetaToken[]
  ): Promise<string> {
    const { publicAddress, nativeAmount, currencyCode } = obj

    if (!isAddressValid(publicAddress)) {
      throw new Error('InvalidPublicAddressError')
    }
    let amount
    if (typeof nativeAmount === 'string') {
      const denom = getDenomInfo(
        this.currencyInfo,
        currencyCode ?? this.currencyInfo.currencyCode,
        customTokens
      )
      if (denom == null) {
        throw new Error('InternalErrorInvalidCurrencyCode')
      }
      amount = div(nativeAmount, denom.multiplier, 18)
    }
    const encodedUri = encodeUriCommon(obj, this.currencyInfo.pluginId, amount)
    return encodedUri
  }

  async getTokenId(token: EdgeToken): Promise<string> {
    const contractAddress: string | undefined =
      token?.networkLocation?.contractAddress
    if (contractAddress == null || !isAddressValid(contractAddress)) {
      throw new Error('ErrorInvalidContractAddress')
    }
    return contractAddress
  }
}

export async function makeCurrencyTools(
  env: PluginEnvironment<TronNetworkInfo>
): Promise<TronTools> {
  return new TronTools(env)
}

export { makeCurrencyEngine } from './tronEngine'