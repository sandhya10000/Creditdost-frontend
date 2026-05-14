import React from "react";
import CreditBureau from "./CreditBureau";
const Crif = () => {
  return (
    <>
      <CreditBureau
        bureauOptions={[{ value: "crif", label: "Crif" }]}
        defaultBureau="crif"
      />
    </>
  );
};

export default Crif;
