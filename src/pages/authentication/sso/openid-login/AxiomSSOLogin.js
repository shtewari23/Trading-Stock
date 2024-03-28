import Swal from "sweetalert2";

import Axios from "helper/Server";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import {
  forwardRef,
  useState
} from "react";



const Alert = forwardRef(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

function AxiomSSOLogin() {
  const urlSearchParam = new URLSearchParams(window.location.search);

  const requestId = urlSearchParam.get("requestId");
  const idpId = urlSearchParam.get("idpId");
  const loginType = urlSearchParam.get("1");

  const host = window.location.origin;
  const appId = window.location.host.split(".")[0];
  const [passwordShown, setPasswordShown] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    isLoading: false,
    isSuccess: false,
    isError: false,
    isSnackbarOpen: false,
  });
  const [accountArray, setAccountArray] = useState({});
  const [accountId, setAccountId] = useState(" ");
  const [loginTypeMethod, setLoginTypeMethod] = useState("1");

  const handleOIDC = (data) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${process.env.REACT_APP_OIDC_SERVER_URL}/authenticate/${requestId}/login`;
    form.innerHTML = Object.keys(data)
      .map((key) => {
        return `<input type="hidden" name="${key}" value="${data[key]}">`;
      })
      .join("");
    document.body.appendChild(form);
    form.submit();
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();
    setLoginForm({ ...loginForm, isLoading: true });


    if (loginForm.email && loginForm.password) {
      try {
        const response = await Axios.post(
          `/oidc/userLogin?email=${loginForm.email.toLowerCase()}&password=${loginForm.password}&appId=${appId}`,
          {},
          {
            headers: {
              "content-type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "*",
            },
          },
        );

        if (response.data.resultCode === 0) {
          handleOIDC(response.data.resultData);
          setLoginForm({
            email: "",
            password: "",
            isLoading: false,
            isSuccess: false,
            isError: false,
            isSnackbarOpen: false,
          });
        } else if (response.data.resultData == null) {
          Swal.fire("Error", response.data.resultMessage, "error");
          setLoginForm({ ...loginForm, isLoading: false });
        } else if (
          response.data.resultCode === -11 ||
          response.data.resultData != null
        ) {
          setAccountArray(response.data.resultData);
          setAccountId(Object.keys(response?.data?.resultData)[0]);
          setLoginForm({ ...loginForm, isLoading: false });
        } else {
          Swal.fire({
            title: "Error!",
            text: response.data.resultMessage,
            icon: "error",
            confirmButtonText: "OK",
          });
          setLoginForm({ ...loginForm, isLoading: false });
        }
      } catch (err) {
        console.error(err);
        setLoginForm({
          email: "",
          password: "",
          isLoading: false,
          isSuccess: false,
          isError: false,
          isSnackbarOpen: false,
        });
        Swal.fire({
          title: "Error",
          text: err.message,
          icon: "error",
          showCancelButton: true,
        });
      }
    } else {
      setLoginForm({ ...loginForm, isLoading: false });
      Swal.fire({
        title: "Please Fill The Details ",
        text: "Some fields are missing!...",
        icon: "error",
        showCancelButton: true,
      });
    }
  };

 

  const handleCloseSnackbar = (
    event,
    reason,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setLoginForm({ ...loginForm, isSnackbarOpen: false });
  };
  return (
    <div>
      <Snackbar
        open={loginForm.isSnackbarOpen}
        autoHideDuration={6000}
        onClick={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            loginForm.isSuccess
              ? "success"
              : loginForm.isError
                ? "error"
                : loginForm.isCheckboxNeeded
                  ? "info"
                  : "info"
          }
          sx={{ width: "100%" }}
        >
          {loginForm.isSuccess
            ? " Registration successfull Please Check Your Mail!!!"
            : loginForm.isCheckboxNeeded
              ? "Check box not select3ed"
              : "Error in backend"}
        </Alert>
      </Snackbar>

      {loginForm.isLoading ? (
        <Backdrop
          sx={{ color: "green", zIndex: 3, backgroundColor: "transparent" }}
          open={loginForm.isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Grid container spacing={3} style={{ marginTop: 50 }}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <center>
              <img
                src={'assets/axiom.png'}
                style={{ width: 50, height: 50 }}
                alt="logo"
              />
            </center>
            <center>
              <h3 className="page_title">Axiom Protect 2.0</h3>
            </center>
          </Grid>
          <Grid item xs={12}>
            <center>
              <Paper
                sx={{ width: 400, margin: "0 auto", p: 4 }}
                variant="outlined"
              >
                <center>
                  <h3>OIDC Login</h3>
                </center>
                <center>
                  <p>Please enter your User credentials</p>
                </center>
                <br />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                    <TextField
                      required
                      fullWidth
                      size="small"
                      type="text"
                      name="email"
                      id="email"
                      //label="Email Address"
                      variant="outlined"
                      placeholder="Enter your mail..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          email: e.target.value,
                        })
                      }
                    />
                    <br />

                    <br />

                    <TextField
                      required
                      fullWidth
                      size="small"
                      type={passwordShown ? "text" : "password"}
                      name="password"
                      id="password"
                      //label="Password"
                      placeholder="Enter your password..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        })
                      }
                    />
                    {/* } */}

                    {Object.keys(accountArray).length > 0 ? (
                      <>
                        <div
                          style={{
                            textAlign: "center",
                            margin: "0.4rem 0",
                          }}
                        >
                          Please select the account to login
                        </div>

                        <FormControl fullWidth size="small">
                          <InputLabel>
                            Associate account with this emailId
                          </InputLabel>
                          <Select
                            value={accountId}
                            label=" Associate account with this emailId"
                            onChange={(e) => setAccountId(e.target.value)}
                          >
                            {accountArray &&
                              Object.keys(accountArray)?.map((key) => (
                                <MenuItem value={key}>
                                  {accountArray[key]}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>

                <br />
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={3}></Grid>

                    <Grid item xs={6}>
                      <center>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ backgroundColor: "rgb(135, 144, 195)" }}
                          onClick={(e) => handleSubmit(e)}
                        >
                          Login
                        </Button>
                      </center>
                    </Grid>

                    <Grid item xs={3}></Grid>
                  </Grid>
                </Box>
              </Paper>
            </center>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      )}
    </div>
  );
}

export default AxiomSSOLogin;
