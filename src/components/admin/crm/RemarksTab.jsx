import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const RemarksTab = ({ customer }) => {
  const remarks = customer?.remarks || [];

  return (
    <Box>
      {remarks.map((item, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography>{item.remark}</Typography>

            <Typography variant="caption">{item.addedBy}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default RemarksTab;
