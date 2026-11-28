import React, { lazy } from "react";
import {
  BusinessCenterOutlined,
  EventRepeatOutlined,
  PendingActionsOutlined,
  PeopleOutline,
} from "@mui/icons-material";
import TabbedPage from "./TabbedPage";
import { useInboxUnreadCounts } from "./useInboxUnreadCounts";

const BusinessForms = lazy(() => import("./BusinessForms"));
const AmcCustomers = lazy(() => import("./AmcCustomers"));

// /admin/business-mis?tab=individual|business|amc|pending
const BusinessMisTabs = () => {
  const counts = useInboxUnreadCounts();

  return (
    <TabbedPage
      title="Business MIS"
      subtitle="Individual and business customers, AMC renewals and pending forms."
      tabs={[
        {
          key: "individual",
          label: "Individual Customers",
          icon: <PeopleOutline fontSize="small" />,
          permission: "business",
          badge: counts.business.individual,
          render: () => (
            <BusinessForms embedded key="paid-individual" status="paid" customerType="individual" />
          ),
        },
        {
          key: "business",
          label: "Business Customers",
          icon: <BusinessCenterOutlined fontSize="small" />,
          permission: "business",
          badge: counts.business.business,
          render: () => (
            <BusinessForms embedded key="paid-business" status="paid" customerType="business" />
          ),
        },
        {
          key: "amc",
          label: "AMC",
          icon: <EventRepeatOutlined fontSize="small" />,
          permission: "business",
          render: () => <AmcCustomers embedded />,
        },
        {
          key: "pending",
          label: "Pending",
          icon: <PendingActionsOutlined fontSize="small" />,
          permission: "business",
          render: () => <BusinessForms embedded key="pending" status="pending" />,
        },
      ]}
    />
  );
};

export default BusinessMisTabs;
