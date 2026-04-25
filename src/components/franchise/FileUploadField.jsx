import { TextField, Button, InputAdornment } from "@mui/material";

const FileUploadField = ({ label, name, value, onChange }) => {
  return (
    <TextField
      fullWidth
      label={label}
      value={value ? value.name : ""}
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <Button variant="outlined" component="label">
              {value ? "Replace" : "Upload"}
              <input type="file" hidden name={name} onChange={onChange} />
            </Button>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default FileUploadField;
