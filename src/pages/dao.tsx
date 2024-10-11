import React from "react";
import "./DAO.css";
import DAO from "../components/dao";
import { useGlobalContext } from "../context/GlobalContext";

const DAOPage = () => {
  const { theme } = useGlobalContext();

  return (
    <div className={`${theme == 'dark' ? "dark" : ""}`}>
      <DAO />
    </div>
  );
};

export default DAOPage;
