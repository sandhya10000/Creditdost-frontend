import React from "react";
import ManageFranchises from "../ManageFranchises";

const FranchisePending = () => {
  return <ManageFranchises kycStatus="pending" isPendingPage={true} />;
};

export default FranchisePending;
