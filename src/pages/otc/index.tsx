import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import type { NextPage } from 'next';
import { db } from "../../utils/firebase";
import {
  doc,
  where,
  query,
  getDocs,
  collection,
  setDoc,
} from "firebase/firestore/lite";
import FullPageLoading from "../../components/common/full-page-loading";
import WalletNotConnected from "../../components/common/wallet-not-connet";
import WhiteFooter from "../../components/common/white-footer";
import RequestsCard from "../../components/otc/request-card";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

const OTC: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otcRequests, setOTCRequests] = useState<any>({});
  const { isConnected, address } = useAccount()

  useEffect(() => {
    if (address) {
      setIsLoading(true);
      getOTCData();

    }
  }, [address]);

  const getOTCData = async () => {
    const docRef = collection(db, "otcRequests");
    const docQuery = query(docRef, where("walletAddress", "==", address));
    const docSnap = await getDocs(docQuery);
    setIsLoading(false);

    if (docSnap.docs.length > 0) {
      setOTCRequests(docSnap.docs[0].data());
    }
  };

  const completeRequest = async (requestIdx: string | number) => {
    setIsLoading(true);

    const docRef = collection(db, "otcRequests");
    const docQuery = query(docRef, where("walletAddress", "==", address));
    const docSnapshots = await getDocs(docQuery);
    const prevDocData = docSnapshots.docs[0].data();

    prevDocData.requests[requestIdx].status = "completed";

    await setDoc(
      doc(collection(db, "otcRequests"), docSnapshots.docs[0].id),
      prevDocData,
      {
        merge: true,
      }
    );

    getOTCData();
  };

  const rejectRequest = async (requestIdx: string | number) => {
    setIsLoading(true);

    const docRef = collection(db, "otcRequests");
    const docQuery = query(docRef, where("walletAddress", "==", address));
    const docSnapshots = await getDocs(docQuery);
    const prevDocData = docSnapshots.docs[0].data();

    prevDocData.requests[requestIdx].status = "rejected_by_user";

    await setDoc(
      doc(collection(db, "otcRequests"), docSnapshots.docs[0].id),
      prevDocData,
      {
        merge: true,
      }
    );

    setIsLoading(false);

    router.push(`/otc/${requestIdx}`);
  };

  if (!isConnected) {
    return <WalletNotConnected />;
  }

  return (
    <>
      <div className="max-w-[1200px] my-2 mt-5">
        <div className={`flex justify-between w-full border-[2px] border-[#c2c1c1] mb-[10px] ${BOLD_INTER_TIGHT.className}`}>
          <span className="text-[25px] my-2">OTC Requests</span>
        </div>
        <div className="flex w-full">
          {isLoading && <FullPageLoading />}
          {Object.keys(otcRequests).length > 0 && (
            <>
              {otcRequests.requests.map((req: any, i: number) => (
                <RequestsCard
                  key={i}
                  requestData={req}
                  completeRequest={() => completeRequest(i)}
                  rejectRequest={() => rejectRequest(i)}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <WhiteFooter />
    </>
  );
}

export default OTC
