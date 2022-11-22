import {
  asArray,
  asBoolean,
  asMaybe,
  asNumber,
  asObject,
  asOptional,
  asString,
  asTuple,
  asUnknown,
  asValue,
  Cleaner
} from 'cleaners'

export interface TronSettings {
  tronApiServers: string[]
  tronNodeServers: string[]
  defaultFeeLimit: number
}

export interface TxQueryCache {
  txid: string
  timestamp: number
}

export interface ReferenceBlock {
  hash: string
  number: number
  timestamp: number
}

export interface TronAccountResources {
  bandwidth: number
  energy: number
}

export interface TronOtherdata {
  lastAddressQueryHeight: number
  mostRecentTxid: string
  txQueryCache: {
    mainnet: TxQueryCache
    trc20: TxQueryCache
  }
}

export const asTronBlockHeight = asObject({
  blockID: asString, // "0000000002bcfcd64f36c254e7161b145f25f1e84e874d213cc36b223c830966"
  block_header: asObject({
    raw_data: asObject({
      number: asNumber,
      timestamp: asNumber
    })
  })
})

export const asAccountResources = asObject({
  freeNetUsed: asMaybe(asNumber, 0), // 983,
  freeNetLimit: asNumber, // 1500,
  EnergyLimit: asMaybe(asNumber, 0) // 474699462,
})

export const asTRXBalance = asObject({
  // latest_opration_time: asNumber, // 1667960226000
  // owner_permission: asObject({
  //   keys: asArray(
  //     asObject({
  //       address: asString, // 'TVLGjurAk9iYb1HUzHTt9VWS343xWnwGjm'
  //       weight: asNumber // 1
  //     })
  //   ),
  //   threshold: asNumber, // 1,
  //   permission_name: asValue('owner')
  // }),
  // free_asset_net_usageV2: asArray(
  //   asObject({
  //     value: asNumber, // 0
  //     key: asString // '1004801'
  //   })
  // ),
  // free_net_usage: asMaybe(asNumber, 0), // 1362
  // account_resource: asObject({
  //   latest_consume_time_for_energy: asNumber // 1667960226000
  // }),
  // active_permission: asArray(
  //   asObject({
  //     operations: asString, // '7fff1fc0033e0300000000000000000000000000000000000000000000000000'
  //     keys: asArray(
  //       asObject({
  //         address: asString, // 'TVLGjurAk9iYb1HUzHTt9VWS343xWnwGjm'
  //         weight: asNumber // 1
  //       })
  //     ),
  //     threshold: asNumber, // 1
  //     id: asNumber, // 2
  //     type: asString, // 'Active'
  //     permission_name: asString // 'active'
  //   })
  // ),
  // assetV2: asArray(
  //   asObject({
  //     value: asNumber, // 3330
  //     key: asString // '1001611'
  //   })
  // ),
  // address: asString, // '41d4663f01b208b180015ec840b5228df7e69150f0'
  balance: asMaybe(asNumber, 0) // 102213111
  // create_time: asNumber, // 1654096560000
  // trc20: asArray(
  //   asObject(asString) // [{ TJ7C9ajLYi5TD6zcuHWxGsLXLHfEpQV1m4: '1499997888000000000000000' }]
  // )
  // latest_consume_free_time: asNumber // 1667957493000
})

export const asTRC20Balance = asObject({
  // "result": {
  //     "result": true
  // },
  // "energy_used": 935,
  constant_result: asTuple(asString) // '0000000000000000000000000000000000000000000000000000001013d707c7'
  // "transaction": {
  //     "ret": [
  //         {}
  //     ],
  //     "visible": false,
  //     "txID": "b35e43b18a152c2ed7b8c03cf8d67ae97ebf37d810cf68330e5dadb8b104db8d",
  //     "raw_data": {
  //         "contract": [
  //             {
  //                 "parameter": {
  //                     "value": {
  //                         "data": "70a08231000000000000000000000041d0944e8407299d9e2bdc4917cfd33f221f1349e7",
  //                         "owner_address": "41d0944e8407299d9e2bdc4917cfd33f221f1349e7",
  //                         "contract_address": "41a614f803b6fd780986a42c78ec9c7f77e6ded13c"
  //                     },
  //                     "type_url": "type.googleapis.com/protocol.TriggerSmartContract"
  //                 },
  //                 "type": "TriggerSmartContract"
  //             }
  //         ],
  //         "ref_block_bytes": "92b0",
  //         "ref_block_hash": "20482bcd5c141696",
  //         "expiration": 1668123789000,
  //         "timestamp": 1668123729781
  //     },
  //     "raw_data_hex": "0a0292b0220820482bcd5c14169640c88db49fc6305a8e01081f1289010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412540a1541d0944e8407299d9e2bdc4917cfd33f221f1349e7121541a614f803b6fd780986a42c78ec9c7f77e6ded13c222470a08231000000000000000000000041d0944e8407299d9e2bdc4917cfd33f221f1349e770f5beb09fc630"
  // }
})

export const asTransaction = asObject({
  ret: asArray(
    asObject({
      contractRet: asString, // 'SUCCESS'
      fee: asNumber // 1100000
    })
  ),
  // signature: "02e36d63f2f05ea1a25b207eaf2ef2ff56be90dc8a4eaa0cac87206ce05ea61f44e894ee04add31504297cdafb539d2d999e1a56c3bce58b6e2c9a25340bf49101",
  txID: asString, // 877db44a4aca5ae71cc5fe7d53a3316ad05ed35cdcc2d7f642061a3900aa5c1d
  // "net_usage": 0,
  // "raw_data_hex": "0a0230292208cf53f47765aeb93840c8c0b5c9b6305a66080112620a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412310a15413282aad9080d202829c8facad65a2affa26781f0121541c17c2daa0e750051c4c109e01fa54da97a06805d18e807709d83b2c9b630",
  // "net_fee": 100000,
  // "energy_usage": 0,
  blockNumber: asNumber, // 44445757
  block_timestamp: asNumber, // 1663916871000
  // energy_fee: asNumber, // 0
  // energy_usage_total: asNumber // 0
  raw_data: asObject({
    contract: asArray(asUnknown)
    // ref_block_bytes: "302exp9",
    // ref_block_hash: "cf53f47765aeb938",
    // expiration: 1663916925000,
    // timestamp: 1663916867997
  })
  // "internal_transactions": []
})

export const asTRC20Transaction = asObject({
  transaction_id: asString, // "e4d81b00b274b7b5b309fc993964bd12ff38087526d68ab76705f9e5ada2005d",
  token_info: asObject({
    // symbol: asString, // "SUNOLD",
    address: asString // "TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9",
    // decimals: asNumber, // 18,
    // name: asString // "SUNOLD"
  }),
  block_timestamp: asNumber, // 1601020668000,
  from: asString, // "TJmmqjb1DK9TTZbQXzRQ2AuA94z4gKAPFh",
  to: asString, // "TUEYcyPAqc4hTg1fSuBCPc18vGWcJDECVw",
  type: asString, // "Transfer",
  value: asString // "1000"
})

export const asTRC20TransactionInfo = asObject({
  // id: asString, // 'd0807adb3c5412aa150787b944c96ee898c997debdc27e2f6a643c771edb5933',
  fee: asNumber, // 2790,
  blockNumber: asNumber // 5467102,
  // blockTimeStamp: 1546455621000,
  // contractResult: [''],
  // receipt: { net_fee: 2790 }
})

export const asTRXTransferContract = asObject({
  parameter: asObject({
    value: asObject({
      amount: asNumber, // 1000
      owner_address: asString, // "413282aad9080d202829c8facad65a2affa26781f0",
      to_address: asString // "41c17c2daa0e750051c4c109e01fa54da97a06805d"
    })
  }),
  type: asValue('TransferContract')
})

export const asTriggerSmartContract = asObject({
  parameter: asObject({
    value: asObject({
      data: asString,
      owner_address: asString,
      contract_address: asString
    })
    // type_url: 'type.googleapis.com/protocol.TriggerSmartContract'
  }),
  type: asValue('TriggerSmartContract')
})

export interface TronGridQuery<T> {
  data: T[]
  success: boolean
  meta: {
    links?: {
      next: string
    }
    page_size: number
  }
}

export const asTronQuery = <T>(
  cleaner: Cleaner<T>
): Cleaner<TronGridQuery<T>> =>
  asObject({
    data: asArray(cleaner),
    success: asBoolean,
    meta: asObject({
      links: asOptional(
        asObject({
          next: asString // https://api.trongrid.io/v1/accounts/TTcGB9V76XyQUUFoU731mXsYhurrCTfSYy/transactions/?limit=200&min_timestamp=0&order_by=block_timestamp,asc&fingerprint=3wmN1yM3f1BnUF1W2s76jXwZG1cHT81ymdUTHjjhYytpdv4jJ5wzX9LVFPzzPj1nAewD3nmxwkUPK4E4M6cHtMVQeyTaycEgRqBj
        })
      ),
      page_size: asNumber // 200
    })
  })
