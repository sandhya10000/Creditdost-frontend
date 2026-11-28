import React from "react";
import CreditBureau from "./CreditBureau";
const Equifax = ({ onCreditsChange }) => {
  return (
    <>
      <CreditBureau
        embedded
        onCreditsChange={onCreditsChange}
        bureauOptions={[{ value: "equifax", label: "Equifax" }]}
        defaultBureau="equifax"
      />
    </>
  );
};

export default Equifax;
