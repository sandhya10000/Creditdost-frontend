import React, { useState } from "react";
import { adminAPI } from "../../services/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

const AdminReward = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    validityDays: "",
  });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("validityDays", form.validityDays);
    formData.append("file", file);
    try {
      const res = await adminAPI.createReward(formData);
      setMsg(res.data.message);

      //  RESET FORM
      setForm({
        title: "",
        description: "",
        validityDays: "",
      });
      setFile(null);
      //Resef file input UI
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Card sx={{ maxWidth: 500, m: "auto", mt: 4 }}>
        <CardContent>
          <Typography textAlign="center" variant="h6">
            Upload Reward
          </Typography>

          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <TextField
            fullWidth
            value={form.description}
            label="Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ my: 2 }}
          />

          <TextField
            fullWidth
            label="Validity (days)"
            value={form.validityDays}
            type="number"
            onChange={(e) => setForm({ ...form, validityDays: e.target.value })}
          />

          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }}>
            Upload
          </Button>

          {msg && <Alert sx={{ mt: 2 }}>{msg}</Alert>}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminReward;
