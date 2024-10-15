import stringPadder from "./string-padder"

export default function ProposalBuilder(proposalType: string, proposalValues: any, hash: string, completeHash: Function, batchData: Function) {

  if (proposalType === "Burn Tokens") {
    const burnAmount = stringPadder(proposalValues.amountToBurn, proposalType)

    return (
        JSON.stringify({
          "safeSnap": {
              "safes": [
                {
                    "network": process.env.REACT_APP_NET_ID,
                    "realityAddress": process.env.REACT_APP_REALITY_MODULE,
                    "txs": [
                      {
                          "hash": hash,
                          "nonce": 0,
                          "mainTransaction": {
                            "to": process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
                            "data": "0xa9059cbb000000000000000000000000000000000000000000000000000000000000dead" + burnAmount,
                            "nonce": "0",
                            "operation": "0",
                            "type": "contractInteraction",
                            "value": "0",
                            "abi": [
                                "function transfer(address to, uint256 amount) returns (bool)"
                            ]
                          },
                          "transactions": [
                            {
                                "to": process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
                                "data": "0xa9059cbb000000000000000000000000000000000000000000000000000000000000dead" + burnAmount,
                                "nonce": 0,
                                "operation": "0",
                                "type": "contractInteraction",
                                "value": "0",
                                "abi": [
                                  "function transfer(address recipient, uint256 amount) returns (bool)"
                                ]
                            }
                          ]
                      }
                    ],
                    "multiSendAddress": process.env.REACT_APP_MULTISEND_ADDRESS,
                    "hash": completeHash
                }
              ],
              "valid": true
          }
        })
    )
  }

  if (proposalType === "Change Auto LAND Fee") {
    const newFee = stringPadder(proposalValues.autoLandFee, proposalType)

    return (
      JSON.stringify({
        "safeSnap":{
          "safes":[
              {
                "network": process.env.REACT_APP_NET_ID,
                "realityAddress": process.env.REACT_APP_REALITY_MODULE,
                "txs":[
                  {
                    "hash": hash,
                    "nonce": 0,
                    "mainTransaction": {
                      "to": process.env.REACT_APP_AUTOLANDV3,
                      "data": "0x70897b23" + newFee,
                      "nonce": "0",
                      "operation": "0",
                      "type": "contractInteraction",
                      "value": "0",
                      "abi":[
                        "function setPerformanceFee(uint256 _performanceFee)"
                      ]
                    },
                    "transactions":[
                      {
                        "to": process.env.REACT_APP_AUTOLANDV3,
                        "data": "0x70897b23" + newFee,
                        "nonce": 0,
                        "operation": "0",
                        "type": "contractInteraction",
                        "value": "0",
                        "abi": [
                          "function setPerformanceFee(uint256 _performanceFee)"
                        ]
                      }
                    ]
                  }
                ],
                "multiSendAddress": process.env.REACT_APP_MULTISEND_ADDRESS,
                "hash": completeHash
              }
          ],
          "valid": true
        }
      })
    )
  }

  if (proposalType === "Add to Marketing Fund") {
    const bountyAmount = stringPadder(proposalValues.amountToMarketing, proposalType)

    return (
      JSON.stringify({
        "safeSnap": {
          "safes": [
            {
              "network": process.env.REACT_APP_NET_ID,
              "realityAddress": process.env.REACT_APP_REALITY_MODULE,
              "txs": [
                {
                  "hash": hash,
                  "nonce": 0,
                  "mainTransaction": {
                    "to": process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
                    "data": "0xa9059cbb000000000000000000000000ee39392eCAc26a321D22bAfAE79b6e923a3ad413" + bountyAmount,
                    "nonce": "0",
                    "operation": "0",
                    "type": "contractInteraction",
                    "value": "0",
                    "abi": [
                      "function transfer(address to, uint256 amount) returns (bool)"
                    ]
                  },
                  "transactions": [
                    {
                        "to": process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
                        "data": "0xa9059cbb000000000000000000000000ee39392eCAc26a321D22bAfAE79b6e923a3ad413" + bountyAmount,
                        "nonce": 0,
                        "operation": "0",
                        "type": "contractInteraction",
                        "value": "0",
                        "abi": [
                          "function transfer(address to, uint256 amount) returns (bool)"
                        ]
                    }
                  ]
                }
              ],
              "multiSendAddress": process.env.REACT_APP_MULTISEND_ADDRESS,
              "hash": completeHash
            }
          ],
          "valid":true
        }
      })
    )
  }

  if (proposalType === "Change Vault Allocation") {
    const burnPoolAmount = stringPadder(proposalValues.allocPointsBurn, proposalType)
    const stakePoolAmount = stringPadder(proposalValues.allocPointsStake, proposalType)
    const LPPoolAmount = stringPadder(proposalValues.allocPointsLP, proposalType)
    const LSRWAPoolAmount = stringPadder(proposalValues.allocLSRWA, proposalType)

    return (
      JSON.stringify({
        "safeSnap": {
            "safes": [
              {
                "network": process.env.REACT_APP_NET_ID,
                "realityAddress": process.env.REACT_APP_REALITY_MODULE,
                "txs": [
                  {
                    "hash": hash,
                    "nonce": 0,
                    "mainTransaction": {
                      "to": process.env.REACT_APP_MULTISEND_ADDRESS,
                      "operation": "1",
                      "value": "0",
                      "nonce": "0",
                      "data": batchData
                    },
                    "transactions": [
                      {
                        "to": process.env.REACT_APP_MASTERCHEF,
                        "data":"0x64482f790000000000000000000000000000000000000000000000000000000000000000" + stakePoolAmount + "0000000000000000000000000000000000000000000000000000000000000001",
                        "nonce": 0,
                        "operation": "0",
                        "type": "contractInteraction",
                        "value": "0",
                        "abi": [
                          "function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate)"
                        ]
                      },
                      {
                        "to": process.env.REACT_APP_MASTERCHEF,
                        "data": "0x64482f790000000000000000000000000000000000000000000000000000000000000001"+ LPPoolAmount + "0000000000000000000000000000000000000000000000000000000000000001",
                        "nonce": 1,
                        "operation": "0",
                        "type": "contractInteraction",
                        "value": "0",
                        "abi": [
                          "function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate)"
                        ]
                      },
                      {
                        "to": process.env.REACT_APP_MASTERCHEF,
                        "data": "0x64482f790000000000000000000000000000000000000000000000000000000000000002" + burnPoolAmount + "0000000000000000000000000000000000000000000000000000000000000001",
                        "nonce": 2,
                        "operation": "0",
                        "type": "contractInteraction",
                        "value": "0",
                        "abi": [
                          "function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate)"
                        ]
                      },
                      {
                        "to": process.env.REACT_APP_MASTERCHEF,
                        "data": "0x64482f790000000000000000000000000000000000000000000000000000000000000004" + LSRWAPoolAmount + "0000000000000000000000000000000000000000000000000000000000000001",
                        "nonce": 3,
                        "operation": "0",
                        "type": "contractInteraction",
                        "value": "0",
                        "abi": [
                          "function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate)"
                        ]
                      }
                    ]
                  }
                ],
                "multiSendAddress":process.env.REACT_APP_MULTISEND_ADDRESS,
                "hash": completeHash
              }
            ],
            "valid":true
        }
      })
    )
  }

  if (proposalType === "Request Grant") {
      const grantAmount = stringPadder(proposalValues.grantAmount, proposalType)

      return (
        JSON.stringify({
          "safeSnap": {
            "safes": [
              {
                "network": process.env.REACT_APP_NET_ID,
                "realityAddress": process.env.REACT_APP_REALITY_MODULE,
                "txs": [
                  {
                    "hash": hash,
                    "nonce": 0,
                    "mainTransaction": {
                      "to": process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
                      "data": "0xa9059cbb0000000000000000000000009c28db9FAA2ae0fF5985d12067b83C7FaC43907B" + grantAmount,
                      "nonce": "0",
                      "operation": "0",
                      "type": "contractInteraction",
                      "value": "0",
                      "abi": [
                        "function transfer(address to, uint256 amount) returns (bool)"
                      ]
                    },
                    "transactions": [
                      {
                        "to": process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
                        "data": "0xa9059cbb0000000000000000000000009c28db9FAA2ae0fF5985d12067b83C7FaC43907B" + grantAmount,
                        "nonce": 0,
                        "operation": "0",
                        "type": "contractInteraction",
                        "value": "0",
                        "abi": [
                          "function transfer(address to, uint256 amount) returns (bool)"
                        ]
                      }
                    ]
                  }
                ],
                "multiSendAddress": process.env.REACT_APP_MULTISEND_ADDRESS,
                "hash": completeHash
              }
            ],
            "valid":true
          }
        })
      )
  }
}
