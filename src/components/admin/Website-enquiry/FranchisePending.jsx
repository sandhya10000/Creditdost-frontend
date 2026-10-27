import React from "react";
import ManageFranchises from "../ManageFranchises";

const FranchisePending = () => {
  return (
    <ManageFranchises
      kycStatus="pending"
      registrationSource="admin"
      isPendingPage={true}
    />
  );
};

export default FranchisePending;
