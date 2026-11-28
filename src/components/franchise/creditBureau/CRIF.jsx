import React from "react";
import CreditBureau from "./CreditBureau";
const Crif = ({ onCreditsChange }) => {
  return (
    <>
      <CreditBureau
        embedded
        onCreditsChange={onCreditsChange}
        bureauOptions={[{ value: "crif", label: "Crif" }]}
        defaultBureau="crif"
      />
    </>
  );
};

export default Crif;
