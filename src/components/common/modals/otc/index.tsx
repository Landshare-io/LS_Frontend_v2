import Modal from "react-modal";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ReactComponent as OTCCheck } from "../../../assets/img/icons/OTC_check.svg";
import {
  collection,
  addDoc,
  doc,
  where,
  query,
  getDocs,
  setDoc,
} from "firebase/firestore/lite";
import { db } from "../../../lib/firebase";
import { useLandshareFunctions } from "../../../contexts/LandshareFunctionsProvider";
import Loader from "../../common/Loader";
import { CrossIcon } from "../../Icons";
import axios from "axios";
import { useAccount } from "wagmi";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "450px",
  },
};

export default function OTCModal({ isOpen, closeModal }) {
  const { address } = useAccount()
  const {
    tokenBalance,
  } = useLandshareFunctions();
  const balanceWarningText =
    "You can only request up to your maximum token balance.";
  const existingRequestWarningText =
    "You already have an existing request submitted.";

  const [isSuccessfull, setIsSuccessfull] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(false);
  const [warningText, setWarningText] = useState("");
  const { houseId } = useParams();
  const [tokentype, setTokenType] = useState("");

  const LSNFToken = "LSNF";
  const LSMDToken = "LSMD";

  useEffect(() => {
    if (houseId === "0") {
      setTokenType(LSNFToken);
    } else if (houseId === "1") {
      setTokenType(LSMDToken);
    }
  }, [houseId]);

  const countTotalBalance = function () {
    let value = +0;
    tokenBalance.map(
      (obj) => (value = parseInt(value) + parseInt(obj.balance))
    );
    return value;
  };

  // HANDLE FORM SUBMIT
  const formSubmitHandler = async (e, data) => {
    e.preventDefault();
    if (countTotalBalance() < data.amount) {
      setWarningText(balanceWarningText);
      setFormError(true);
      return;
    } else {
      setFormError(false);
    }

    setIsLoading(true);
    try {
      // FORMAT OF THE DATA IN FIRESTORE COLLECTION

      // FIND DOC WITH PARTICULAR WALLET ADDRESS

      const docRef = collection(db, "otcRequests");
      const docQuery = query(docRef, where("walletAddress", "==", address));
      const docSnapshots = await getDocs(docQuery);

      const otcRawData = {
        email: data.email,
        walletAddress: address,
        amount: data.amount,
        type: data.requestOption,
        status: "new",
        token: tokentype,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // IF DOC IS ALREADY EXIST THEN PUSH DATA IN REQUEST ARRAY
      if (docSnapshots.docs.length > 0) {
        const prevDocData = docSnapshots.docs[0].data();

        // DON'T CREATE ANOTHER REQUEST IF PENDING REQUEST TO RESOLVE
        if (
          prevDocData.requests.filter((obj) => obj.status === "new").length > 0
        ) {
          setWarningText(existingRequestWarningText);
          setFormError(true);
          setIsLoading(false);
          return;
        }
        // CALL
        prevDocData.requests.push(otcRawData);
        await setDoc(
          doc(collection(db, "otcRequests"), docSnapshots.docs[0].id),
          prevDocData,
          {
            merge: true,
          }
        );

        const sendEmailToUserAndAdmin =
          "https://us-central1-landshare-28977.cloudfunctions.net/sendEmailToUserAndAdmin";

        // Call Firebase Functions to send email
        // To admin & user
        await axios.post(sendEmailToUserAndAdmin, {
          email: otcRawData.email,
          amount: otcRawData.amount,
          type: otcRawData.type,
          date: otcRawData.createdAt.toUTCString(),
        });

        // Update the State
        setIsLoading(false);
        setIsSuccessfull(true);
      } else {
        // ELSE WE ADDED NEW DOC TO FIREBASE
        const otcData = {
          createdAt: new Date(),
          updatedAt: new Date(),
          walletAddress: address,
          requests: [otcRawData],
        };

        // CALL
        await addDoc(collection(db, "otcRequests"), otcData);
        setIsLoading(false);
        setIsSuccessfull(true);
      }
      // ADDING DATA TO COLLECTION
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="OTC Modal"
    >
      {isSuccessfull ? (
        <OTCSuccessFull
          closeModal={closeModal}
          setIsSuccessfull={setIsSuccessfull}
        />
      ) : (
        <OTCForm
          formSubmitHandler={formSubmitHandler}
          isLoading={isLoading}
          account={address}
          warningText={warningText}
          formError={formError}
        />
      )}
    </Modal>
  );
}

function OTCForm({
  formSubmitHandler,
  isLoading,
  account,
  warningText,
  formError,
}) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [requestOption, setRequestOption] = useState("");
  function requestOptionHandler(text) {
    if (text === requestOption) {
      setRequestOption("");
    } else {
      setRequestOption(text);
    }
  }
  const buy = "buy";
  const sell = "sell";
  if (account === null || account === undefined || account === "") {
    return (
      <p className="text-danger mb-0">
        Please connect your wallet to make a request!
      </p>
    );
  }
  return (
    <>
      <h2 className="heading mb-3">OTC Request Form</h2>
      <form
        onSubmit={(e) => {
          formSubmitHandler(e, { email, amount, requestOption });
        }}
      >
        <Form.Group className="mb-3 fs-16">
          <Form.Control
            className="otc-form-control"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </Form.Group>
        <Form.Group className="mb-3 fs-16">
          <Form.Control
            className="otc-form-control"
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
          />
        </Form.Group>
        <Form.Group className="mb-3 fs-16 text-center">
          <Form.Text className="mb-2 d-inline-block ">
            What do you want to do?
          </Form.Text>
          <br />
          <Button
            className={`otc-btn me-3  ${requestOption === buy && "active"}`}
            onClick={() => requestOptionHandler(buy)}
            variant="light"
            disabled={true}
          >
            Buy
          </Button>
          <Button
            className={`otc-btn ${requestOption === sell && "active"}`}
            onClick={() => requestOptionHandler(sell)}
          >
            Sell
          </Button>
        </Form.Group>
        {requestOption !== "" && (
          <>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <button
                  className="w-100 apply-for-white-btn mt-3"
                  type="submit"
                  style={{ height: "56px" }}
                >
                  Submit
                </button>
                {formError && (
                  <p className="text-danger mb-0 mt-1">{warningText}</p>
                )}
              </>
            )}
          </>
        )}
      </form>
    </>
  );
}

function OTCSuccessFull({ closeModal, setIsSuccessfull }) {
  return (
    <div className="text-center d-flex flex-column my-3">
      <span
        className="position-absolute right-10 top-10 pointer"
        onClick={() => {
          setIsSuccessfull(false);
          closeModal();
        }}
      >
        <CrossIcon />
      </span>
      <span
        className="d-inline-block mx-auto"
        style={{ width: "130px", height: "130px", marginBottom: "40px" }}
      >
        <OTCCheck />
      </span>
      <h2 className="heading mb-3">OTC Request Sent</h2>
      <p style={{ color: "#656565" }}>
        Your request has been received. A member of the team will be in touch
        soon.
      </p>
    </div>
  );
}
