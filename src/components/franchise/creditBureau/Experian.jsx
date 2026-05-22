import React from "react";
import CreditBureau from "./CreditBureau";
const Experian = () => {
  return (
    <>
      <CreditBureau
        bureauOptions={[{ value: "experian", label: "Experian" }]}
        defaultBureau="experian"
      />
    </>
  );
};

export default Experian;
