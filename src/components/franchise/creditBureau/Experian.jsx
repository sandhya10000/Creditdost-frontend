import React from "react";
import CreditBureau from "./CreditBureau";
const Experian = ({ onCreditsChange }) => {
  return (
    <>
      <CreditBureau
        embedded
        onCreditsChange={onCreditsChange}
        bureauOptions={[{ value: "experian", label: "Experian" }]}
        defaultBureau="experian"
      />
    </>
  );
};

export default Experian;
