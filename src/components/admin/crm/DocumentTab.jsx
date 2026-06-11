import React from "react";
import { Box, Typography, Link, Stack, Divider } from "@mui/material";

const documentFields = [
  { label: "PAN Card", key: "panCard" },
  { label: "Aadhar Front", key: "aadharFront" },
  { label: "Aadhar Back", key: "aadharBack" },
  { label: "Cancel Cheque", key: "cancelCheque" },
  { label: "Bank Proof (Settlement letter)", key: "bankProof" },
  { label: "Extra Bank Document", key: "extraBankDoc" },
];

const DocumentTab = ({ documents = {} }) => {
  const getDocumentUrl = (path) => {
    if (!path) return "";

    const normalizedPath = path.replace(/\\/g, "/");

    const baseUrl = import.meta.env.VITE_REACT_APP_API_URL
      ? import.meta.env.VITE_REACT_APP_API_URL.replace("/api", "")
      : "https://reactbackend.creditdost.co.in";

    return `${baseUrl}/${normalizedPath}`;
  };
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Documents
      </Typography>

      <Stack spacing={1}>
        {documentFields.map((doc) => (
          <Box key={doc.key}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={1}
            >
              <Typography variant="body2">{doc.label}</Typography>

              {documents?.[doc.key] ? (
                <Link
                  href={getDocumentUrl(documents[doc.key])}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </Link>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Not Uploaded
                </Typography>
              )}
            </Box>

            <Divider />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default DocumentTab;
