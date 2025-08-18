
import { ethers, parseUnits, formatUnits } from "ethers";
import { useWallet } from "@/hooks/lsrwa/useWallet";
import { usePerformance } from "@/hooks/lsrwa/usePerformance";
import vaultAbi from '@/abis/Vault.json';
import usdcAbi from "@/abis/ERC20.json";
import { useChainId } from "wagmi";
import { LSRWA_VAULT_ADDRESS, USDC_ADDRESS } from "@/config/constants/environments";
import { Address } from "viem";

export function useRequests() {

  const { address } = useWallet();
  const { fetchTotalValue, collateralValue } = usePerformance();
  const chainId = useChainId()
  const VAULT_ADDRESS: Address = LSRWA_VAULT_ADDRESS[chainId];

  // type 0:all, 1:deposit, 2:withdraw
  const fetchRequests = async (signer: any, type = 0, processed = false, page = 1, limit = 10, owner = '', isAdmin = true) => {

    const vault = new ethers.Contract(VAULT_ADDRESS, vaultAbi, signer);
    const [data, ids, total] = await vault.getRequests(type, processed, page, limit, address, isAdmin);
    let requests = [];
    requests = data.map((item: any, index: number) => ({
      requestId: parseInt(ids[index]),
      user: item[0],
      amount: formatUnits(item[1], 6),
      timestamp: parseInt(item[2]),
      isWithdraw: item[3],
      processed: item[4],
      executed: item[5]
    }));
    return { data: requests, total: parseInt(total) };
  }

  async function processRequests(signer: any) {

    const vault = new ethers.Contract(VAULT_ADDRESS, vaultAbi, signer);
    const usdc = new ethers.Contract(USDC_ADDRESS[chainId], usdcAbi, signer);
    const poolUSDC = await usdc.balanceOf(VAULT_ADDRESS);

    let liquidityRemaining = poolUSDC;
    // uint kind[all, deposit, withdraw], bool processed, uint page, uint limit, address owner, bool isAdmin
    const [data, ids, total] = await vault.getRequests(0, false, 0, 0, VAULT_ADDRESS, true);
    console.log('data', data);
    let requests = [];
    let approvedRequests = [];

    requests = data.map((item: any, index: number) => ({
      user: item[0],
      requestId: parseInt(ids[index]),
      amount: formatUnits(item[1], 6),
      timestamp: item[2],
      isWithdraw: item[3],
    }));

    let withdrawRequests = requests.filter((item: any) => item.isWithdraw);

    for (const item of withdrawRequests) {
      const { requestId, user, amount, timestamp } = item;
      let parsedAmount = parseUnits(amount.toString(), 6);
      const approvedAmount = liquidityRemaining >= parsedAmount ? parsedAmount : liquidityRemaining;
      liquidityRemaining -= approvedAmount;

      approvedRequests.push({
        user,
        requestId,
        amount: approvedAmount,
        timestamp,
        isWithdraw: true,
      });

      if (liquidityRemaining == "0") break;
    }
    let totalDepositValue = await fetchTotalValue(signer);
    const tcollateralValue = await collateralValue();
    console.log('collateralValue', tcollateralValue);
    let depositRequests = requests.filter((item: any) => !item.isWithdraw);

    for (const item of depositRequests) {
      const { requestId, user, amount, timestamp } = item;
      if (totalDepositValue + amount < tcollateralValue) {
        approvedRequests.push({
          user,
          requestId,
          amount: parseUnits(amount.toString(), 6),
          timestamp,
          isWithdraw: false,
        });
        totalDepositValue += amount;
        console.log('total', totalDepositValue);

      }
    }

    let borrowers: any = [];
    const borrowEvents = await vault.queryFilter("BorrowRequested", 0, "latest");

    for (const event of borrowEvents) {
      const { originator, amount } = (event as any).args;
      if (!borrowers.includes(originator)) {
        borrowers.push(originator);
      }
    }

    let unpaidBorrowers = [];
    if (borrowers.length > 0) {
      const pending = true;
      const [borrowList, borrowerList] = await vault.getUnpaidBorrowList(borrowers, pending);
      for (let i = 0; i < borrowList.length; i++) {
        const [amount, repaid, approved] = borrowList[i];
        if (liquidityRemaining > amount) {
          liquidityRemaining -= amount;
          unpaidBorrowers.push(borrowerList[i]);
        }

      }
      console.log('unpaidBorrowers', unpaidBorrowers);
    }

    if (approvedRequests.length != 0 || unpaidBorrowers.length != 0) {
      const tx = await vault.processRequests(approvedRequests, unpaidBorrowers);
      await tx.wait();
    }
    compound(vault);
    return true;

  }

  async function compound(vault: any) {
    let users: any = [];
    const depsoitEvents = await vault.queryFilter("DepositApproved", 0, "latest");

    for (const event of depsoitEvents) {
      const { requestId, user, amount } = event.args;
      if (!users.includes(user)) {
        users.push(user);
      }
    }
    const activeUsers = await vault.getAutoCompoundActiveUserList(users);
    console.log('activeUsers', [...activeUsers]);
    if (activeUsers.length > 0) {
      const tx = await vault.adminCompound([...activeUsers]);
      await tx.wait();
    }
  }

  return {
    fetchRequests,
    processRequests
  };
}
