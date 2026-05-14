import React from "react";
import CreditBureau from "./CreditBureau";
const Equifax = () => {
  return (
    <>
      <CreditBureau
        bureauOptions={[{ value: "equifax", label: "Equifax" }]}
        defaultBureau="equifax"
      />
    </>
  );
};

export default Equifax;
