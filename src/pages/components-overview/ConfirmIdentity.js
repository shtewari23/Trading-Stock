import React, { useEffect, useState, useRef } from "react";
import Server from "../authentication/auth-forms/APIUrl";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// import axiom_protect_logo from "../../Assets/axiom_protect_logo.png";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MdDone } from "react-icons/md";
import { MdStayCurrentPortrait } from "react-icons/md";
import Container from "@mui/material/Container";
import { useLocation, Navigator } from "react-router-dom";
import Countdown from "react-countdown";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Backdrop, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { MdEmail } from "react-icons/md";
import Swal from "sweetalert2";
import { useRes } from 'Context';
interface LocationState {
  pathname: string;
  search: string;
  hash: string;
  state?: any; // You can define a specific type for state if needed
}

const Alert = React.forwardRef(function Alert(props, ref) {
  const myRef = useRef<HTMLDivElement>(null);
  return <MuiAlert elevation={6} ref={myRef} variant="filled" {...props} />;
});

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        style={{ height: 100, width: 100 }}
        variant="indeterminate"
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          style={{ padding: 8, margin: 8, fontSize: "1.2rem" }}
        >
          {`${Math.round(props.value)} sec`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

const useStyles = makeStyles({
  tableFields: {
    fontSize: "0.9em",
  },
  tableFieldsTitle: {
    fontSize: "1.0rem",
    fontWeight: "bold",
  },

  countdownFirstChildDiv: {
    background: "rgb(170,72,294)",
    margin: "auto",
    width: 38,
    height: 38,
    textAlign: "center",
    paddingTop: 7,
  },
  countdownChildDiv: {
    borderRight: "1px solid ",
    margin: "auto",
    width: 35,
    height: 25,
    textAlign: "center",
  },
  countdownLastChildDiv: {
    margin: "auto",
    width: 35,
    height: 25,
    textAlign: "center",
  },
  countDownDaysFont: {
    fontSize: "1.0rem",
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  countDownText: {
    fontSize: "0.7rem",
    color: "#000",
    textAlign: "center",
    position: "relative",
    top: 9,
  },
  countDownTimerFont: {
    textAlign: "center",
    fontSize: "1.0rem",
    fontWeight: "bold",
  },
});

const requestTimess = new Date()
  .toISOString()
  .replaceAll("T", " ")
  .replaceAll("Z", "");
const requestTime = escape(requestTimess);
console.log(requestTime)
const label = { inputProps: { "aria-label": "Checkbox demo" } };

// const nav = navigator.userAgent;

function Confirmidentity(setOpenModal) {
  const location = useLocation();

  const {res,setRes} = useRes();
  
  // const location: LocationState = useLocation();
  //const [loginForm, setloginForm] = React.useState()
  const classes = useStyles();
  // console.log(location);
  //creating IP state
  const [ip, setIP] = useState("");
  const [deviced, setDeviceDetails] = useState("");
  const [isMobileVerification, setISMobileVerification] = useState(null);
  const [isMobileotp, setISMobileotp] = useState(null);
  const [isPushSend, setIsPushSend] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
const navigate =useNavigate('')
  const category= "3";
  const type = "1";

  const authToken = sessionStorage.getItem("jwtToken");
  const userId = sessionStorage.getItem("userId");
  const accountId= sessionStorage.getItem("accountId");
  const name = sessionStorage.getItem("name");
  const emailId = sessionStorage.getItem("emailId");
  const phone = sessionStorage.getItem("phoneNo");
  const [domainCount, setDomainCount] = useState("");

  console.log({ accountId, userId, name, emailId, phone, authToken });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  useEffect(() => {
    const checkDomainCount = async () => {
      await Server.get(`/account/getDomainCount`, {
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          console.log(response.data);
          setDomainCount(response?.data);

        })
        .catch((err) => {
          console.log(err);
        });
    };
    checkDomainCount();
  }, []);

  useEffect(() => {
    const getJwtToken = async () => {
      await Server.post(`adaptivetoken/getJWTToken?userId=${sessionStorage?.getItem("userId")}&requestTime=${requestTime}`,

      
      {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",

        },
      })
        .then((response) => {
          console.log(response.data.resultData,"888");
          sessionStorage.setItem("jwtToken", response.data.resultData);

        })
        .catch((err) => {
          console.log(err);
        });
    };
    getJwtToken();
  }, []);

  const handleChangeOTPField = (
    e,
    index
  ) => {
    console.log("event", e.target.id);
    if (isNaN(Number(e.target.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? e.target.value : d))]);
    if (otp.length >= index) {
      const inputField = document.getElementById(`otp-${index + 1}`);
      console.log(inputField);
      if (inputField) {
        inputField.focus();
      }
    }
  };

  const body = {
    //"appId": "",
    expirytimeInMins: 0,
    requestType: 1,
    device: "",
    ip: "",
  };

  const [ipAddress, setIPAddress] = useState("");
  useEffect(() => {
    fetch("https://geolocation-db.com/json/")
      .then((res) => res.json())
      .then((result) => {
        console.log("location", result.IPv4);
        setIPAddress(result.IPv4.toString());
      });
  }, []);

  const handleSubmitSendPush = (e) => {
    e.preventDefault();
    console.log("login push detail : ", body);
    Server.post(
      `/authenticator/sendPush?userId=${sessionStorage?.getItem("userId")}&requestTime=${requestTime}`,
      body,
      {
        headers: {
          "content-type": "application/json",
          'authToken':  authToken,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
      }
    )
      .then(async (response) => {
        // console.log(JSON.parse(response.data));
        if (response.data.resultCode === 0) {
            setRes(0)
            console.log("101")
          setIsPushSend(true);
          sessionStorage.setItem("pushId",response.data.resultData)

          console.log("111",response)
        } else {
          console.log("error");
          console.log("112",response)

        }
      })
      .catch((err) => {
        console.log(err);
        setISMobileVerification(false);

      });
  };

  const [browserName, setBrowserName] = useState("");
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const browserName = getBrowserName(userAgent);
    setBrowserName(browserName);
  }, []);

  const getBrowserName = (userAgent) => {
    // Check for specific browser keywords in the user agent string
    if (userAgent.includes("Chrome")) {
      return "Chrome";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Safari")) {
      return "Safari";
    } else if (userAgent.includes("Edge")) {
      return "Edge";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      return "Opera";
    } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
      return "Internet Explorer";
    } else {
      return "Unknown";
    }
  };

  console.log(browserName);
  console.log(res,"222")


  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          console.log(position.coords.latitude,"1111");
          console.log(position.coords.longitude,"12222");
        },

        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const [platform, setPlatform] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent;

    setPlatform(userAgent);
    console.log(userAgent);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log();
    setIsLoading(true);
    setISMobileotp(false);
    Server.post(
      `/token/sendOTPWithDetails?accountId=${sessionStorage?.getItem("accountId")}&userId=${sessionStorage?.getItem("userId")}&category=${category}&type=${type}&latitude= 3.3488896&longitude=6.5568768&ipAddress=${ipAddress}&browser=${browserName}&OS=${platform}&requestTime=${requestTime}`,
      {},
      {
        headers: {
          "content-type": "application/json",
          'authToken':  authToken,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);
        setISMobileVerification(false);
        console.log(response);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handleSubmit_moblie = (e) => {
    e.preventDefault();
    console.log();
    // setIsLoading(true)
    setISMobileotp(true);
    setISMobileVerification(true);
  };

  const [isVerifed, setIsVerifed] = useState(false);
  const [otpForm, setOtpForm] = useState("");

  const handleOTPVerifcation = async (e) => {
    e.preventDefault();
    console.log(otpForm);
    setIsLoading(true);
    await Server.post(
      `/token/verifyOTP?accountId=${sessionStorage?.getItem("accountId")}&userId=${sessionStorage?.getItem(
        "userId"
      )}&OTP=${otp.join("")}&category=${category}&requestTime=${requestTime}`,
      {},
      {
        headers: {
          "content-type": "application/json",
          'authToken':  authToken,

          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);

        setISMobileVerification(false);
        console.log(response.data,"909")
        if (response.data.resultCode == 0) {
            setRes(0)

            console.log(response.data,"910")

          console.log("res data handleOTPVerifcation", response?.data);
        } else {
          setISMobileVerification(false);

          setRes(1)
          Swal.fire({
            title: "Error",
            text: response.data.resultMessage,
            icon: "error",
            showCancelButton: true,
          });
          console.log("909")
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        setRes(1)

        setISMobileVerification(false);
      });
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleMobileOTPVerifcation = async (
    e
  ) => {
    e.preventDefault();
    console.log(otpForm);
    setIsLoading(true);
    Server.post(
      `/absolute/verifyOneTimePassword?userId=${sessionStorage?.getItem("userId")}&otp=${otp.join("")}`,
      {},
      {
        headers: {
          "content-type": "application/json",
          'authToken':  authToken,

          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);

        if (response.data.resultCode === 0) {
            console.log("101")

            setRes(0)

          console.log("res data handleMobileOTPVerifcation", response?.data);
        } else {
          setRes(1)

          Swal.fire({
            title: "OTP is Incorrect",
            text: "The OTP You Entered is Not Correct!!!",
            icon: "error",
            showCancelButton: true,
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);

        console.log(err);
      });
      console.log(res,"222")
      console.log(res,"222222")

  };
  console.log(res,"222222")

  // Random component
  const Completionist = () => (
    <React.Fragment>
      <Box display="flex" flexGrow={1} alignItems="center">
        <FiberManualRecordIcon sx={{ color: "green" }} />

        <Typography
          variant="body2"
          component="span"
          className={classes.tableFieldsTitle}
          style={{ marginLeft: 3 }}
        >
          Time Expired
        </Typography>
      </Box>
    </React.Fragment>
  );

  // Renderer callback with condition
  const renderer = ({
    seconds,
    completed,
  }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else if (seconds % 2 === 0) {
      Server.post(
        `/authenticator/checkPushTransactionStatus?userId=${sessionStorage?.getItem("userId")}&pushId=${sessionStorage?.getItem("pushId")}&requestTime=${requestTime}`,
        {},
        {
          headers: {
            "content-type": "application/json",
            'authToken':  authToken,

            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
          },
        }
      )
        .then(async (response) => {
          console.log(response.data);
          if (response.data.resultCode === 0) {
            setRes(0)

console.log("333")
            setIsPushSend(false);
            console.log("res data checkPushTransactionStatus", response?.data);
          }
        })
        .catch((err) => {
          console.log(err);
          setISMobileVerification(null);
        });

      return (
        <React.Fragment>
          <Backdrop open={true}>
            <CircularProgressWithLabel value={seconds} />
          </Backdrop>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Backdrop open={true}>
            <CircularProgressWithLabel value={seconds} />
          </Backdrop>
        </React.Fragment>
      );
    }
  };

  const handleCloseSnackbar = (
    event,
    reason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsError(false);
  };


  return (
    <div>
      <Snackbar
        open={isError}
        autoHideDuration={6000}
        onClose={() => handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={"error"}
          sx={{ width: "100%" }}
        >
          {"InCorrect OTP"}
        </Alert>
      </Snackbar>

      <Backdrop sx={{ color: "#fff" }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={3} justifyContent={"center"}>
        <Grid item xs={12}>
          <center>
            <h3 className="page_title">Axiom Protect 2.0</h3>
          </center>
          <Card
            className=""
            variant="outlined"
            style={{ width: 800, borderRadius: 30 }}
          >
            <CardContent>
              <center>
                <h3>Confirm Your Identity</h3>
              </center>
              <br />
              <center>
                <Grid container spacing={3}>
                  <Grid item xs={3} md={4}>
                    <div
                      onClick={(
                        e
                      ) => handleSubmitSendPush(e)}
                    >
                      <Card
                        className=""
                        variant="outlined"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right top, #0d4990, #566ba9, #8790c3, #b4b8de, #e1e1f9)",
                          width: 135,
                          height: 135,
                          cursor: "pointer",
                          border: 0,
                        }}
                      >
                        <CardContent>
                          <center>
                            <MdDone
                              className="check"
                              style={{ color: "#FFFFFF" }}
                            />

                            <p
                              className="send_push"
                              style={{ textAlign: "center", color: "#FFFFFF" }}
                            >
                              <b>Send Push</b>
                            </p>
                          </center>
                        </CardContent>
                      </Card>
                    </div>
                  </Grid>

                  <Grid item xs={3} md={4}>
                    <div
                      onClick={(
                        e
                      ) => handleSubmit(e)}
                    >
                      <Card
                        className=""
                        variant="outlined"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right top, #0d4990, #566ba9, #8790c3, #b4b8de, #e1e1f9)",
                          width: 135,
                          height: 135,
                          cursor: "pointer",
                          border: 0,
                        }}
                      >
                        <CardContent>
                          <center>
                            <MdEmail
                              className="check"
                              style={{ color: "#FFFFFF" }}
                            />
                          </center>
                          <p
                            className="send_push"
                            style={{ textAlign: "center", color: "#FFFFFF" }}
                          >
                            <b>Email Me</b>
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </Grid>

                  <Grid item xs={3} md={4}>
                    <div
                      onClick={(
                        e
                      ) => handleSubmit_moblie(e)}
                    >
                      <Card
                        className=""
                        variant="outlined"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right top, #0d4990, #566ba9, #8790c3, #b4b8de, #e1e1f9)",
                          width: 135,
                          height: 135,
                          cursor: "pointer",
                          border: 0,
                        }}
                      >
                        <CardContent>
                          <center>
                            <MdStayCurrentPortrait
                              className="check"
                              style={{ color: "#FFFFFF" }}
                            />

                            <p
                              className="send_push"
                              style={{ textAlign: "center", color: "#FFFFFF" }}
                            >
                              <b>Enter OTP</b>
                            </p>
                          </center>
                        </CardContent>
                      </Card>
                    </div>
                  </Grid>
                </Grid>
              </center>
              <br />
              <br />
              {isMobileVerification == false && (
                <Container>
                  <form onSubmit={handleOTPVerifcation}>
                    <center>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                          {otp.map((data, index) => {
                            return (
                              <TextField
                                style={{
                                  width: "50px",
                                  marginRight: "10px",
                                  paddingLeft: "12px",
                                }}
                                className="otp-field"
                                type="text"
                                name="otp"
                                id={`otp-${index}`}
                                inputProps={{ maxLength: 1 }}
                                key={index}
                                value={data}
                                onChange={(
                                  e
                                ) => handleChangeOTPField(e, index)}
                                onFocus={(e) => e.target.select}
                              />
                            );
                          })}
                          <br />
                          <br />
                        </Grid>
                      </Grid>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                          <center>
                            <Button
                              disabled={
                                isMobileVerification == null ? true : false
                              }
                              variant="contained"
                              style={{
                                marginTop: 10,
                                backgroundImage:
                                  "linear-gradient(to right top, #0d4990, #566ba9, #8790c3, #b4b8de, #e1e1f9)",
                              }}
                              type="submit"
                            >
                              Verify OTP
                            </Button>
                          </center>
                        </Grid>
                      </Grid>
                    </center>
                  </form>
                </Container>
              )}

              {isMobileotp == true && (
                <Container>
                  <form onSubmit={handleMobileOTPVerifcation}>
                    <center>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                          {otp.map((data, index) => {
                            return (
                              <TextField
                                style={{
                                  width: "50px",
                                  marginRight: "10px",
                                  paddingLeft: "12px",
                                }}
                                className="otp-field"
                                type="text"
                                name="otp"
                                id={`otp-${index}`}
                                inputProps={{ maxLength: 1 }}
                                key={index}
                                value={data}
                                onChange={(
                                  e
                                ) => handleChangeOTPField(e, index)}
                                onFocus={(e) => e.target.select()}
                              />
                            );
                          })}
                          <br />
                          <br />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                          <center>
                            <Button
                              variant="contained"
                              style={{
                                marginTop: 10,
                                backgroundImage:
                                  "linear-gradient(to right top, #0d4990, #566ba9, #8790c3, #b4b8de, #e1e1f9)",
                              }}
                              type="submit"
                            >
                              Verify OTP
                            </Button>
                          </center>
                        </Grid>
                      </Grid>
                    </center>
                  </form>
                </Container>
              )}

              {isPushSend && (
                <>
                  <Countdown date={Date.now() + 60000} renderer={renderer} />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Confirmidentity;
