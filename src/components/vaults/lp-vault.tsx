import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { formatEther } from "ethers";
import { Collapse } from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNetwork, useConnect, useAccount } from "wagmi";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useVaultsContext } from "../../contexts/VaultsContext";
import { useLandshareV2Context } from "../../contexts/LandshareV2Context";
import { useLandshareFunctions } from "../../contexts/LandshareFunctionsProvider";
import abbreviateNumber from "../main/numberAbbreviator";
import Union from "../../assets/img/new/greenlogo.svg";
import UnionDark from "../../assets/img/new/greenlogo.svg";
import book from "../../assets/img/new/book.svg";
import down from "../../assets/img/icons/Down.svg";
import calc from "../../assets/img/new/calculator.svg";
import viewContract from "../../assets/img/new/view-contract.png";
import up from "../../assets/img/new/arrow-up.svg";
import bscIcon from "../../assets/img/new/bsc.svg";
import pcsBunny from "../../assets/img/icons/pancakeswap-cake-logo.svg"
import "./styles.css"
import smallicon from "../../assets/img/new/bnb.png";
import ConnectWallet from "../connect-wallet";

export default function LpVault(props) {
  const { chain } = useNetwork();
  const { connect, connectors } = useConnect();
  const { theme == 'dark' } = useGlobalContext();
  const [details, setDetails] = useState(false)
  const [depositing, setDepositing] = useState(true)
  const [inputValue, setInputValue] = useState("");
  const [isWithdrawable, SetWithdrawable] = useState(true);
  const [isDepositable, SetDepositable] = useState(true);
  const [isApprovedLP, setIsApproved] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [apr, setAPR] = useState(0);
  const [TVL, setTVL] = useState(0);
  const [rewardLP, setReward] = useState(0);
  const [depositBalanceLP, setDepositBalanceLP] = useState(0);
  const [value, setValue] = useState('deposit');
  const [usdValueLP, setUsdValueLP] = useState(0)

  const {
    isVaultsLoading,
  } = useVaultsContext();

  const {
    account,
    isConnected,
    balance,
    bnbPrice,
    landTokenV2Contract,
    price,
    WBNBContract,
    updateLPTokenV2Balance,
    updateLandTokenV2Balance,
    notifyError,
    totalLANDinLPContract
  } = useGlobalContext();

  const {
    contract: { lpTokenV2Contract, masterchefContract },
  } = useLandshareV2Context();

  const {
    startTransaction,
    endTransaction,
    transactionResult
  } = useLandshareFunctions();

  useEffect(() => {
    updateLPFarm();
  }, [bnbPrice])

  useEffect(() => {
    setIsLoading(true);
    updateLPFarm();
  }, [isConnected, TVL]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setDepositing(newValue === "deposit" ? true : false)
  };

  async function updateStatus() {
    SetWithdrawable(
      inputValue !== "0" &&
      inputValue !== "0.0" &&
      Number(inputValue) <= Number(formatEther(depositBalanceLP))
    );
    SetDepositable(
      inputValue !== "0" &&
      inputValue !== "0.0" &&
      Number(formatEther(balance.lpTokenV2)) >=
      Number(inputValue)
    );
    if (isConnected && account) {
      const approvedLAND = await lpTokenV2Contract.allowance(
        account,
        process.env.REACT_APP_MASTERCHEF
      );
      const approvedLANDETH = formatEther(approvedLAND);
      setIsApproved(inputValue > 0 && Number(approvedLANDETH) >= Number(inputValue))
    }
  }

  useEffect(async () => {
    updateStatus()
  }, [inputValue]);

  function handlePercents(percent) {
    if (depositing) {
      const bal = balance.lpTokenV2.mul(percent).div(100)
      setInputValue(formatEther(bal))
    } else {
      const bal = depositBalanceLP.mul(percent).div(100)
      setInputValue(formatEther(bal))
    }
  }

  const handleNetworkSwitch = async (chainId) => {
    try {
      const connector = connectors.find((c) => c.chains.some((chain) => chain.id === chainId));

      if (connector) {
        if (!isConnected) {
          await connect({ connector });
        } else {
          console.log('Connector already connected, switching network...');
          await connector.switchChain(chainId);
        }
      } else {
        console.error(`Unsupported chain ID: ${chainId}`);
      }
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  const approveHandler = async () => {
    startTransaction();
    let balance = await lpTokenV2Contract.balanceOf(account);
    try {
      const tx = await lpTokenV2Contract.approve(
        process.env.REACT_APP_MASTERCHEF,
        balance
      );

      tx.wait().then(() => {
        setIsLoading(true);
        updateLPFarm();
        updateStatus()
        endTransaction("Transaction Complete.");
      });
    } catch (e) {
      endTransaction("Transaction Failed.");
      console.log(e);
    }
  };

  const depositHandler = () => {
    let amountLS = inputValue;
    if (!amountLS || amountLS == 0 || amountLS == 0.0) {
      notifyError("Please enter an amount");
      return;
    }
    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    amountLS = parseEther(amountLS).toString(); //convert to wei

    depositLP(amountLS);
  };

  async function depositLP(amount) {
    startTransaction();

    let balance = await lpTokenV2Contract.balanceOf(account);
    if (isConnected == true) {
      if (Number(amount) > Number(balance)) {
        endTransaction();
        notifyError("Insufficient Balance");

        return;
      }

      try {
        const tx = await masterchefContract.deposit(1, amount.toString());
        tx.wait().then(() => {
          setIsLoading(true);
          updateLPFarm();
          updateLandTokenV2Balance();
          updateLPTokenV2Balance();
          transactionResult("Transaction Completed.");
        });
      } catch (e) {
        transactionResult("Transaction Failed.");
        console.log(e);
      }
    } else {
      endTransaction();
      notifyError("Please connect your wallet to BSC");
    }
  }

  const withdrawHandler = () => {
    let amountLS = inputValue;
    if (!amountLS || amountLS == 0 || amountLS == 0.0) {
      notifyError("Please enter an amount");
      return;
    }
    // SETTING INPUT VALUE EMPTY
    setInputValue("");
    amountLS = parseEther(amountLS).toString(); //convert to wei

    withdrawLP(amountLS);
  };

  async function withdrawLP(amount) {
    if (isConnected == true) {
      if (Number(depositBalanceLP) === 0) {
        notifyError("No enough balance");
        return;
      }
      if (Number(depositBalanceLP) < amount) {
        notifyError("Insufficient deposit amount");
        return;
      }

      if (Number(depositBalanceLP) === 0) {
        notifyError("No deposit found");
        return;
      }

      startTransaction();
      try {
        const tx = await masterchefContract.withdraw(1, amount);
        tx.wait().then(() => {
          updateLPFarm();
          updateLandTokenV2Balance();
          updateLPTokenV2Balance();
          transactionResult("Transaction Complete.", false);
        });
      } catch (e) {
        transactionResult("Transaction Failed.", false);
        console.log("Error, withdraw: ", e);
      }
    }
  }

  async function updateLPFarm() {
    if (lpTokenV2Contract && masterchefContract) {
      const totalLPSupply = await lpTokenV2Contract.totalSupply();
      const totalBNBinLPContract = await WBNBContract.balanceOf(
        process.env.REACT_APP_LP2_TOKEN
      );
      const totalBNBValueinLPContract =
        Number(formatEther(totalBNBinLPContract)) *
        Number(bnbPrice);

      // let totalLANDinLPContract;
      // if (landTokenV2Contract) {
      //   totalLANDinLPContract = await landTokenV2Contract.balanceOf(
      //     process.env.REACT_APP_LP2_TOKEN
      //   );
      // }

      // const totalLANDValueinLPContract =
      //   Number(formatEther(totalLANDinLPContract?.toString())) *
      //   Number(price);
      let totalLANDValueinLPContract = 0;

      try {
        totalLANDValueinLPContract =
          Number(formatEther(totalLANDinLPContract?.toString() || '0')) *
          Number(price);
      } catch (error) {
        console.warn('Error calculating LAND value, defaulting to 0:', error.message);
        totalLANDValueinLPContract = 0;
      }
      const totalUSDValue =
        Number(totalLANDValueinLPContract) +
        Number(totalBNBValueinLPContract);

      const usdValueLPToken = Number(totalUSDValue) / Number(formatEther(totalLPSupply))
      setUsdValueLP(usdValueLPToken)
      const allocPoints = await masterchefContract
        .poolInfo(1)
        .then((data) => {
          return data[1];
        });

      const totalLPInVault = await lpTokenV2Contract.balanceOf(
        process.env.REACT_APP_MASTERCHEF)

      const percentageOfLPInVault = totalLPInVault / totalLPSupply;
      const USDValueinVault = percentageOfLPInVault * totalUSDValue;
      setTVL(USDValueinVault);
      const totalMoneyAnnual = 365 * allocPoints.toNumber() * Number(price);
      const farmAPR = (totalMoneyAnnual / USDValueinVault) * 100;

      setAPR(farmAPR);



      if (isConnected) {
        const depositBalance = await masterchefContract
          .userInfo(1, account)
          .then((data) => {
            return data[0];
          });
        setDepositBalanceLP(depositBalance);
        const rewardsLP = await masterchefContract.pendingLand(1, account);
        setReward(rewardsLP);
      } else {
        setDepositBalanceLP(0);
        setReward(0)
      }
    }
    setIsLoading(false);
  }
  const openCalcModal = async () => {

    const tokenPriceData = await axios(gameSetting.landshareCostApi);
    let tokenPriceUSD = numeral(
      Number(tokenPriceData.data.landshare.usd)
    ).format("0.[000]");
    props.setTokenUsdPrice(tokenPriceUSD)
    props.setShowModal(true)
    props.setShowModalApy(apr.toString().substr(0, 4))
    props.setIsLPVault(false)
    props.setIsRUSD(false)
  }

  return (
    <div className="w-full mlg:max-w-[880px]">
      <div className="w-full">
        <div className={`p-[12px] flex flex-col md:p-[24px] w-full rounded-[24px] bg-tw-third`}>
          {isVaultsLoading ? (
            <SkeletonTheme baseColor={`${theme == 'dark' ? "#31333b" : "#dbdde0"}`} highlightColor={`${theme == 'dark' ? "#52545e" : "#f6f7f9"}`}>
              <div className="flex justify-center items-center m-auto flex-col w-full">
                <div className="flex flex-col justify-center p-0 gap-[16px] w-full">
                  <div className="flex items-center py-[6px] justify-start h-[100px] gap-[16px]">
                    <div className="w-[100px] h-[100px] shrink-0 rounded-[1000px] md:relative">
                      <Skeleton circle={true} width={90} height={90} />
                    </div>
                    <div className="flex flex-col justify-center items-start p-0 gap-[8px] w-full">
                      <div className={`w-full overflow-hidden text-ellipsis leading-[28px] ${BOLD_INTER_TIGHT.className}`}>
                        <Skeleton height={28} />
                      </div>
                      <div className="w-full">
                        <Skeleton height={26} />
                      </div>
                    </div>

                  </div>
                  <div className="apr-container">
                    <div className="md:w-1/4 w-full">
                      <Skeleton height={46} />
                    </div>
                    <div className="md:w-1/4 w-full">
                      <Skeleton height={46} />
                    </div>
                    <div className="md:w-1/4 w-full">
                      <Skeleton height={46} />
                    </div>
                    <div className="md:w-1/4 w-full">
                      <Skeleton height={46} />
                    </div>
                  </div>
                </div>
              </div>
            </SkeletonTheme>
          ) : (
            <>
              <div className="flex flex-col justify-center p-0 gap-[16px]">
                <div className="flex flex-row gap-[8px] hidden">
                  <div className="coin-icon" style={{ flexShrink: 0 }}>
                    <img src={theme == 'dark' ? UnionDark : Union} alt="token pair" />
                    <img src={smallicon} />
                  </div>
                  <div className="title-text text-tw-text-primary flex flex-row whitespace-nowrap items-center gap-2">
                    {props.title}
                  </div>
                  <div className="vault-type" style={{ flexShrink: 0 }}>
                    <div className="type-btn">
                      <img src={book} alt="book" className="book" />
                      <span>Manual</span>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                      <img
                        src={bscIcon}
                        className="w-8 h-8"
                      />
                    </div>
                  </div>
                  <button className="div show-details-btn" style={{ marginLeft: "auto" }} onClick={() => setDetails(!details)}>
                    <img src={details ? up : down}></img>
                  </button>

                </div>
                <div className="flex items-center py-[6px] justify-start h-[100px] gap-[16px]" onClick={() => setDetails(!details)}>
                  <div className="w-[100px] h-[100px] shrink-0 rounded-[1000px] md:relative">
                    <img src={theme == 'dark' ? UnionDark : Union} className="border-tw-primary border-[6px]" alt="token pair" />
                    <img src={smallicon} className="border-tw-primary border-[6px]" />
                  </div>
                  <div className="flex flex-col justify-center items-start p-0 gap-[8px]">
                    <div className={`w-full overflow-hidden text-ellipsis leading-[28px] text-tw-text-primary flex flex-row whitespace-nowrap items-center gap-2 ${BOLD_INTER_TIGHT.className}`}>
                      {props.title}
                      <button className="div show-details-btn collapse-desktop" onClick={() => setDetails(!details)}
                      // disabled={chain?.id != 56 || chain?.id != 97}
                      >
                        <img src={details ? up : down}></img>
                      </button>
                    </div>
                    <div className="vault-type">
                      <div className="type-btn mr-2">
                        <img src={book} alt="book" className="book" />
                        <span>Manual</span>
                      </div>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors duration-200 mr-2">
                        <img
                          src={bscIcon}
                          className="w-8 h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="apr-container">
                  <div className="apr-button bg-tw-vault-input">
                    <span className="light-font">TVL</span>
                    <span className="bold-font text-tw-text-primary">{"$" + abbreviateNumber(TVL.toString().substr(0, 8))}</span>
                  </div>
                  <div className="apr-button bg-tw-vault-input">
                    <span className="light-font">APR</span>
                    <div className="calculator-container">
                      <span className="bold-font text-tw-text-primary">{isNaN(apr) ? "—" : abbreviateNumber(Number(apr).toFixed(0)) + "%"}</span>
                      <button onClick={() => {
                        props.setShowModal(true)
                        props.setShowModalApy(abbreviateNumber(apr.toString().substr(0, 4)))
                        props.setTokenUsdPrice(usdValueLP)
                        props.setIsLPVault(true)
                      }}>
                        <img src={calc} alt="" />
                      </button>
                    </div>
                  </div>
                  <div className="apr-button bg-tw-vault-input">
                    <span className="light-font">Deposit</span>
                    <span className="bold-font text-tw-text-primary">{ethers.utils
                      .formatEther(depositBalanceLP.toString())
                      .substr(0, 7)}</span>
                  </div>
                  <div className="apr-button bg-tw-vault-input">
                    <span className="light-font">Rewards</span>
                    <span className="bold-font text-tw-text-primary">{formatEther(rewardLP.toString()).substr(0, 5)}</span>
                  </div>
                </div>
              </div>
              <div className="collapse-mobile">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  TabIndicatorProps={{
                    sx: {
                      bgcolor: "#61CD81",
                      height: "1px"
                    }
                  }}
                  className="deposit-withdraw"
                  aria-label="secondary tabs example"
                  style={{ width: "100%", marginTop: 20 }}
                >
                  <Tab style={{ flex: 1, color: theme == 'dark' ? "#cacaca" : "#0A1339", width: "100%", maxWidth: "1000px" }} value="deposit" label="Deposit" />
                  <Tab style={{ flex: 1, color: theme == 'dark' ? "#cacaca" : "#0A1339", width: "100%", maxWidth: "1000px" }} value="withdraw" label="Withdraw" />
                </Tabs>
                <div className="input-section">
                  <span className="set-amount">Set Amount</span>
                  <div className="input-bar-section">
                    <input className="input-bar bg-tw-vault-input text-tw-button-text-primary" placeholder="0.00 LAND" type="text"
                      value={inputValue}
                      onChange={(e) =>
                        setInputValue(
                          e.target.value
                            .replace(/[^.\d]/g, "")
                            .replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2")
                            .replace(/[^\d.]/g, "")
                            .replace(/(\..*)\./g, "$1")
                            .replace(/^(\d+\.\d{18})\d+$/g, "$1")
                        )
                      } />
                    <div className="percent-buttons">
                      <button className="percent-btn" onClick={() => handlePercents(10)}>10%</button>
                      <button className="percent-btn" onClick={() => handlePercents(25)}>25%</button>
                      <button className="percent-btn" onClick={() => handlePercents(50)}>50%</button>
                      <button className="percent-btn" onClick={() => handlePercents(75)}>75%</button>
                      <button className="percent-btn" onClick={() => handlePercents(100)} > 100%</button>
                    </div>
                  </div>
                </div>
                <div className="vault-bottom-container">
                  <div className="btn-container">
                    {account == 'Not Connected' ? (
                      <div className="d-flex flex-column align-items-center">
                        <ConnectWallet style={{ width: "300px" }} />
                      </div>
                    ) : (
                      <>
                        <button
                          className="enable-btn  text-tw-button-text-secondary"
                          onClick={() => {
                            if (chain?.id == 56) {
                              if (inputValue && Number(inputValue) > Number(0)) {
                                depositing ? isApprovedLP ? depositHandler() : approveHandler() : withdrawHandler()
                              } else {
                                notifyError('Please enter an amount')
                              }
                            } else {
                              handleNetworkSwitch(56)
                            }
                          }}
                          disabled={depositing && !isDepositable || !depositing && !isWithdrawable}
                        >
                          {
                            chain?.id != 56 ? 'Switch to BSC' : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLP ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"
                          }
                        </button>
                        {chain?.id == 56 && (
                          <button
                            className="harvest-btn text-tw-text-primary"
                            onClick={() => withdrawLP(0)}
                            disabled={chain?.id != 56}
                          >
                            Harvest
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <button className="div show-details-btn" onClick={() => setDetails(!details)}>
                    {details ? 'Hide' : 'Show'} Details
                    <img src={details ? up : down} />
                  </button>
                </div>
              </div>
              <div className="w-full">
                <Collapse in={details}>

                  <div className="apr-container-mobile" style={{ marginTop: "20px" }}>
                    <div className="apr-button bg-tw-vault-input">
                      <span className="light-font">TVL</span>
                      <span className="bold-font text-tw-text-primary">{"$" + abbreviateNumber(TVL.toString().substr(0, 8))}</span>
                    </div>
                    <div className="apr-button bg-tw-vault-input">
                      <span className="light-font">APR</span>
                      <div className="calculator-container">
                        <span className="bold-font text-tw-text-primary">{abbreviateNumber(Number(apr).toFixed(0)) + "%"}</span>
                        <button onClick={() => {
                          props.setShowModal(true)
                          props.setShowModalApy(abbreviateNumber(apr.toString().substr(0, 4)))
                          props.setTokenUsdPrice(usdValueLP)
                          props.setIsLPVault(true)
                        }}>
                          <img src={calc} alt="" />
                        </button>
                      </div>
                    </div>
                    <div className="apr-button bg-tw-vault-input">
                      <span className="light-font">Deposit</span>
                      <span className="bold-font text-tw-text-primary">{ethers.utils
                        .formatEther(depositBalanceLP.toString())
                        .substr(0, 7)}</span>
                    </div>
                    <div className="apr-button bg-tw-vault-input">
                      <span className="light-font">Rewards</span>
                      <span className="bold-font text-tw-text-primary">{formatEther(rewardLP.toString()).substr(0, 5)}</span>
                    </div>
                  </div>
                  <div className="collapse-desktop">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      textColor="secondary"
                      TabIndicatorProps={{
                        sx: {
                          bgcolor: "#61CD81",
                          height: "1px"
                        }
                      }}
                      className="deposit-withdraw"
                      aria-label="secondary tabs example"
                      style={{ width: "100%", marginTop: 20 }}
                    >
                      <Tab style={{ flex: 1, color: theme == 'dark' ? "#cacaca" : "#0A1339", width: "100%", maxWidth: "1000px" }} value="deposit" label="Deposit" />
                      <Tab style={{ flex: 1, color: theme == 'dark' ? "#cacaca" : "#0A1339", width: "100%", maxWidth: "1000px" }} value="withdraw" label="Withdraw" />
                    </Tabs>
                    <div className="input-section">
                      <span className="set-amount">Set Amount</span>
                      <div className="input-bar-section">
                        <input
                          className="input-bar bg-tw-vault-input text-tw-button-text-primary"
                          placeholder="0.00 LAND"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                        <div className="percent-buttons">
                          <button className="percent-btn" onClick={() => handlePercents(10)}>10%</button>
                          <button className="percent-btn" onClick={() => handlePercents(25)}>25%</button>
                          <button className="percent-btn" onClick={() => handlePercents(50)}>50%</button>
                          <button className="percent-btn" onClick={() => handlePercents(75)}>75%</button>
                          <button className="percent-btn" onClick={() => handlePercents(100)}>100%</button>
                        </div>
                      </div>
                    </div>
                    <div className="vault-bottom-container">
                      <div className="btn-container justify-content-center">
                        {account == 'Not Connected' ? (
                          <ConnectWallet style={{ width: "300px" }} />
                        ) : (
                          <>
                            <button
                              className="enable-btn  text-tw-button-text-secondary"
                              onClick={() => {
                                if (chain?.id == 56) {
                                  if (inputValue && Number(inputValue) > Number(0)) {
                                    depositing ? isApprovedLP ? depositHandler() : approveHandler() : withdrawHandler()
                                  } else {
                                    notifyError('Please enter an amount')
                                  }
                                } else {
                                  handleNetworkSwitch(56)
                                }
                              }}
                              disabled={depositing && !isDepositable || !depositing && !isWithdrawable}
                            >
                              {
                                chain?.id != 56 ? 'Switch to BSC' : inputValue && Number(inputValue) > Number(0) ? (depositing ? (!isDepositable ? "Insufficient Balance" : (isApprovedLP ? "Deposit" : "Approve")) : "Withdraw") : "Enter Amount"
                              }
                            </button>
                            {chain?.id == 56 && (
                              <button
                                className="harvest-btn text-tw-text-primary"
                                onClick={() => withdrawLP(0)}
                                disabled={chain?.id != 56}
                              >
                                Harvest
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="details-container bg-tw-primary dark:bg-tw-secondary" style={{ marginTop: "24px" }}>
                    <div className="sub-container">
                      <div className="w-8 h-8 rounded-full bg-tw-third">
                        <a href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens"><img className="sub-container-image" src={viewContract} alt="" /></a>
                      </div>
                      <div className="sub-container-description text-tw-text-primary">
                        <span><a href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens">Vault Guide</a></span>
                        <a
                          style={{ display: "inline" }}
                          href="https://docs.landshare.io/quickstart-guides/how-to-stake-land-bnb-lp-tokens"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                    <div className="sub-container">
                      <div className="w-8 h-8 rounded-full bg-tw-third">
                        <a href="https://pancakeswap.finance/swap?outputCurrency=0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C"><img className="sub-container-image" src={pcsBunny} alt="" /></a>

                      </div>
                      <div className="sub-container-description text-tw-text-primary">
                        <span><a href="https://pancakeswap.finance/v2/add/0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C/BNB">Get LAND-BNB LP</a></span>
                        <a
                          style={{ display: "inline" }}
                          href="https://pancakeswap.finance/v2/add/0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C/BNB"
                        >
                          Pancakeswap
                        </a>
                      </div>
                    </div>
                  </div>
                </Collapse>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
