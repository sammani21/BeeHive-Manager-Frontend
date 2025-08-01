import {
  Dialog,
  Grid,
  Button,
  DialogTitle,
  DialogContentText,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
} from "@mui/material";
import * as React from "react";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";

// Define interface for Beekeeper
export interface Beekeeper {
  isActive: boolean;
  date: string | number | Date;
  availability: boolean;
  _id?: string;
  no?: string;
  dateOfJoined: Date;
  firstName: string;
  lastName: string;
  nic: string;
  gender: string;
  dob: Date;
  contactNo: string;
  email: string;
}

// Define props interface for NewBeekeeper component
interface NewBeekeeperProps {
  isOpen: boolean;
  no: string;
  firstName: string;
  lastName: string;
  nic: string;
  gender: string;
  dob: Date;
  contactNo: string;
  email: string;
  open: () => void;
  close: () => void;
  getAll: () => void;
  isUpdate: boolean;
  id: string;
}

// Regular expressions for validation
const emailRegex = new RegExp(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
);
const nameRegex = /[A-Za-z.]{3,}/;
const nicRegex = /^(?:19|20)?\d{2}[0-9]{10}|[0-9]{9}[x|X|v|V]$/;
const contactRegex = /^(?:7|0|(?:\+94))[0-9]{9,10}$/;

function NewBeekeeper(props: NewBeekeeperProps) {
  // State variables for form fields
  const [id, setId] = React.useState<string>(props.id);
  const [fName, setFName] = React.useState<string>(props.firstName);
  const [lName, setLName] = React.useState<string>(props.lastName);
  const [dOfBirth, setDOfBirth] = React.useState<Date>(props.dob);
  const [nic, setNIC] = React.useState<string>(props.nic);
  const [email, setEmail] = React.useState<string>(props.email);
  const [contactNo, setContactNo] = React.useState<string>(props.contactNo);
  const [gender, setGender] = React.useState<string>(props.gender);

  // Update state variables when props change
  React.useEffect(() => {
    setId(props.id);
    setFName(props.firstName);
    setLName(props.lastName);
    setDOfBirth(props.dob);
    setNIC(props.nic);
    setEmail(props.email);
    setContactNo(props.contactNo);
    setGender(props.gender);
  }, [
    props.id,
    props.firstName,
    props.lastName,
    props.nic,
    props.email,
    props.contactNo,
    props.gender,
    props.dob,
    props.isUpdate,
  ]);

  // Function to check form field validation
  const checkValidation = (): boolean => {
    if (!nameRegex.test(fName)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Check First Name",
      });
      return false;
    }

    if (!nameRegex.test(lName)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Check Last Name",
      });
      return false;
    }

    if (!nicRegex.test(nic)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Check NIC",
      });
      return false;
    }

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Check Email",
      });
      return false;
    }

    if (!contactRegex.test(contactNo)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Check Contact Number",
      });
      return false;
    }

    if (gender.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gender is required",
      });
      return false;
    }

    if (dOfBirth === null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Date of Birth is required",
      });
      return false;
    }

    return true;
  };

  // Function to handle adding a new beekeeper
  const handleAddBeekeeper = () => {
    if (checkValidation()) {
      const beekeeper = {
        firstName: fName,
        lastName: lName,
        nic: nic,
        gender: gender,
        dob: dOfBirth,
        contactNo: contactNo,
        email: email,
      };

      axios
        .post("http://localhost:3000/api/v1/beekeeper", beekeeper)
        .then((response) => {
          if (response.status === 201) {
            Swal.fire({
              title: "Good job!",
              text: "Bee keeper added successfully!",
              icon: "success",
            });
            props.close();
            clearFields();
            props.getAll();
          }
        })
        .catch(() => {
          Swal.fire({
            title: "Oops...",
            text: "Something went wrong !",
            icon: "error",
          });
        });
    }
  };

  // Function to handle updating a beekeeper
  const handleUpdateBeekeeper = () => {
    if (checkValidation()) {
      const beekeeper = {
        firstName: fName,
        lastName: lName,
        nic: nic,
        gender: gender,
        dob: dOfBirth,
        contactNo: contactNo,
        email: email,
      };
      axios
        .put(`http://localhost:3000/api/v1/beekeeper/${id}`, beekeeper)
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              title: "Good job!",
              text: "Bee keeper updated successfully!",
              icon: "success",
            });
            props.close();
            clearFields();
            props.getAll();
          }
        })
        .catch(() => {
          Swal.fire({
            title: "Oops...",
            text: "Something went wrong !",
            icon: "error",
          });
        });
    }
  };

  // Clear all fields
  const clearFields = () => {
    setId("");
    setFName("");
    setLName("");
    setContactNo("");
    setGender("");
    setNIC("");
    setEmail("");
  };

  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={() => props.close()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{" Bee Keeper"}</DialogTitle>
        <DialogContent>
          <br />
          <DialogContentText id="alert-dialog-description">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={fName}
                  onChange={(event) => setFName(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={lName}
                  onChange={(event) => setLName(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={"Date of Birth"}
                    value={dayjs(dOfBirth)}
                    onChange={(v: any) => setDOfBirth(v)}
                    maxDate={dayjs()}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="NIC"
                  variant="outlined"
                  fullWidth
                  value={nic}
                  placeholder="ex: xxxxxxxxxV or xxxxxxxxxxxx "
                  onChange={(event) => setNIC(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  placeholder="ex: abc@gmail.com"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Number"
                  variant="outlined"
                  fullWidth
                  placeholder="ex: 07xxxxxxxx"
                  value={contactNo}
                  onChange={(event) => setContactNo(event.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                >
                  {["Male", "Female"].map((type, i) => (
                    <MenuItem key={i} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.isUpdate ? handleUpdateBeekeeper : handleAddBeekeeper}
          >
            {props.isUpdate ? "Update" : "Add"}
          </Button>
          <Button onClick={() => props.close()}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewBeekeeper;
