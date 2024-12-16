import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { bsc } from "viem/chains";
import Input from "../common/input";
import usePoolInfo from "../../hooks/contract/MasterchefContract/usePoolInfo";

interface ChangeVaultAllocationProps {
  errorBurn: string;
  setErrorBurn: Function;
  errorStake: string;
  setErrorStake: Function;
  errorLp: string;
  setErrorLp: Function;
  errorLSRWA: string;
  setErrorLSRWA: Function;
  allocPointsBurn: string;
  setAllocPointsBurn: Function;
  allocPointsStake: string;
  setAllocPointsStake: Function;
  allocPointsLP: string;
  setAllocPointsLP: Function;
  allocLSRWA: string;
  setAllocLSRWA: Function;
}

export default function ChangeVaultAllocation ({
  errorBurn,
  setErrorBurn,
  errorStake,
  setErrorStake,
  errorLp,
  setErrorLp,
  errorLSRWA,
  setErrorLSRWA,
  allocPointsBurn,
  setAllocPointsBurn,
  allocPointsStake,
  setAllocPointsStake,
  allocPointsLP,
  setAllocPointsLP,
  allocLSRWA,
  setAllocLSRWA,
}: ChangeVaultAllocationProps) {
  const { data: allocBurnData, isLoading: isLoadingAllocBurn } = usePoolInfo(bsc.id, 2) as { data: any[], isLoading: boolean }
  const allocBurn = allocBurnData[1]
  const { data: allocStakeData, isLoading: isLoadingAllocStake } = usePoolInfo(bsc.id, 0) as { data: any[], isLoading: boolean }
  const allocStake = allocStakeData[1]
  const { data: allocLPData, isLoading: isLoadingAllocLp } = usePoolInfo(bsc.id, 1) as { data: any[], isLoading: boolean }
  const allocLP = allocLPData[1]
  const { data: allocLSRData, isLoading: isLoadingAllocLsr } = usePoolInfo(bsc.id, 4) as { data: any[], isLoading: boolean }
  const allocUsdt = allocLSRData[1]

  const isLoading = isLoadingAllocBurn || isLoadingAllocStake || isLoadingAllocLp || isLoadingAllocLsr

  return isLoading ? (
    <div className="w-full flex justify-center my-auto">
      <ReactLoading type="cylon" color="#61cd81" />
    </div>
  ) : (
    <div>
      <table className="border-collapse my-[25px] mx-0 text-[0.9em] rounded-[10px] shadow-lg" cellSpacing="0" cellPadding="0">
        <thead className="text-button-text-secondary">
          <tr className="bg-[#61cd81] text-center">
            <th className="py-[12px] px-[15px] text-center">LAND/day</th>
            <th className="py-[12px] px-[15px] text-center">New</th>
            <th className="py-[12px] px-[15px] text-center">Current</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-secondary text-text-primary text-center border-b-[1px] border-[#dddddd]">
            <td width="40% ">Unallocated</td>
            <td width="30%">
              <Input
                containerClassName="w=full mb-[8px]"
                proposal={"Change Vault Allocation"}
                value={allocPointsBurn}
                setValue={setAllocPointsBurn}
                error={errorBurn}
                setError={setErrorBurn}
                labelClassName="mb-2"
              />
            </td>
            <td width="30%">{allocBurn.toString()}</td>
          </tr>
          <tr className="vault-allocation-bg bg-primary dark:bg-third text-text-primary text-center border-b-[1px] border-[#dddddd]">
            <td width="40%">LAND Staking</td>
            <td width="30%">
              <Input
                containerClassName="w=full mb-[8px]"
                proposal={"Change Vault Allocation"}
                value={allocPointsStake}
                setValue={setAllocPointsStake}
                error={errorStake}
                setError={setErrorStake}
                labelClassName="mb-2"
              />
            </td>
            <td width="30%">{allocStake.toString()}</td>
          </tr>
          <tr className="bg-secondary text-text-primary text-center border-b-[1px] border-[#dddddd]">
            <td width="40%">LP Staking</td>
            <td width="30%">
              <Input
                containerClassName="w=full mb-[8px]"
                proposal={"Change Vault Allocation"}
                value={allocPointsLP}
                setValue={setAllocPointsLP}
                error={errorLp}
                setError={setErrorLp}
                labelClassName="mb-2"
              />
            </td>
            <td width="30%">{allocLP.toString()}</td>
          </tr>
          <tr className="bg-secondary text-text-primary text-center border-b-[1px] border-[#dddddd]">
            <td width="40%">LSRWA-USDT</td>
            <td width="30%">
              <Input
                containerClassName="w=full mb-[8px]"
                proposal={"Change Vault Allocation"}
                value={allocLSRWA}
                setValue={setAllocLSRWA}
                error={errorLSRWA}
                setError={setErrorLSRWA}
                labelClassName="mb-2"
              />
            </td>
            <td width="30%">{allocUsdt.toString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
