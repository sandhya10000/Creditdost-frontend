import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";

import DetailsTab from "../../components/admin/crm/DetailsTab";
import ReportsTab from "../../components/admin/crm/ReportsTab";
import BureauTab from "../../components/admin/crm/BureauTab";
import RemarksTab from "../../components/admin/crm/RemarksTab";
import DocumentTab from "../../components/admin/crm/DocumentTab";
import { useParams } from "react-router-dom";
import { adminAPI } from "../../services/api";

const CustomerCRM = () => {
  const [tab, setTab] = useState(0);
  const { customerId } = useParams();

  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creditReports, setCreditReports] = useState([]);
  console.log(creditReports, "creditReports");

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const res = await adminAPI.getSinglebusinessform(customerId);
      console.log(res, "response-----crm");
      setCustomerInfo(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card
            sx={{
              borderRadius: 3,
            }}
          >
            <CardContent>
              {/* TABS */}

              <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                <Tab label="Details" />

                <Tab label="Reports" />

                <Tab label="Bureau" />

                <Tab label="Remarks" />
                <Tab label="Documents" />
              </Tabs>

              <Box mt={3}>
                {tab === 0 && (
                  <DetailsTab
                    customer={customerInfo?.customerData}
                    creditReport={customerInfo?.report[0]?.score || "NA"}
                    ifscDeatails={customerInfo?.bankInfo?.ifsc_details}
                  />
                )}

                {/* {tab === 1 && (
                  <ReportsTab
                    customerReport={customerInfo?.report}
                    creditReports={creditReports}
                  />
                )} */}
                {tab === 1 && (
                  <ReportsTab
                    customerReport={
                      Array.isArray(customerInfo?.report)
                        ? customerInfo.report
                        : customerInfo?.report
                          ? [customerInfo.report]
                          : []
                    }
                  />
                )}

                {tab === 2 && (
                  <BureauTab
                    customerBureau={customerInfo?.customerData}
                    setCreditReports={setCreditReports}
                    onSearchSucess={() => {
                      fetchCustomer;
                    }}
                    customer={customerInfo?.customerData}
                  />
                )}

                {tab === 3 && (
                  <RemarksTab customerRemark={customerInfo?.customerData} />
                )}
                {tab === 4 && (
                  <DocumentTab
                    customerDocument={customerInfo?.customerDocument}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerCRM;
