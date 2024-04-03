// material-ui
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Button, Stack } from "@mui/material";
import AxiosInstance from "helper/Server";
import axiomImage from "../.././../assets/axiom.png";

// assets

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

const FirebaseSocial = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const width = 600; // Width of the popup window
  const height = 700; // Height of the popup window
  const left = (window.innerWidth - width) / 2; // Center the popup horizontally
  const top = (window.innerHeight - height) / 2;

  const {
    REACT_APP_OIDC_CLIENT_ID,
    REACT_APP_CLIENT_SECRET,
    REACT_APP_BASE_URL,
    REACT_APP_APPLICATION_ID,
  } = process.env;

  function generateToken() {
    const arr = new Uint8Array(12);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (v) => v.toString(16).padStart(2, "0")).join("");
  }

  const handleLoginWithAxiom = async (e) => {
    try {
      const client_id = process.env.REACT_APP_OIDC_CLIENT_ID;
      const scope = "openid profile";
      const response_type = "code";
      const anchorTg = document.createElement("a");
      anchorTg.href = `https://openid.axiomprotect.com/oidc/authorize?client_id=${client_id}&scope=${scope}&response_type=${response_type}&response_mode=query&redirect_uri=${window.location.protocol}//${window.location.host}/dashboard/default`;
      document.body.appendChild(anchorTg);
      anchorTg.click();

      const token = generateToken();
      localStorage.setItem("custom-auth-token", token);
      // Handle success
    } catch (err) {
      console.error(err);
      // Handle error
    }
  };

  return (
    <Stack
      direction="row"
      spacing={matchDownSM ? 1 : 2}
      justifyContent={matchDownSM ? "space-around" : "space-between"}
      sx={{
        "& .MuiButton-startIcon": {
          mr: matchDownSM ? 0 : 1,
          ml: matchDownSM ? 0 : -0.5,
        },
      }}
    >
      <Button
        startIcon={<img src={axiomImage} width={20} height={20} alt="logo" />}
        variant="outlined"
        color="primary"
        fullWidth={!matchDownSM}
        onClick={(e) =>
          // window.open(
          //   "/auth/sso/openid-login",
          //   "_blank",
          //   `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`,
          // )

          handleLoginWithAxiom(e)
        }
      >
        Login with Axiom{" "}
      </Button>
    </Stack>
  );
};

export default FirebaseSocial;
