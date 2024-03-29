// material-ui
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Button, Stack } from "@mui/material";
import AxiosInstance from "helper/Server";

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
  const handleLoginWithAxiom = async (e) => {
    try {
      const response = await AxiosInstance.get(
        `${REACT_APP_BASE_URL}/oidc/getOidcClient?id=${REACT_APP_OIDC_CLIENT_ID}&appId=${REACT_APP_APPLICATION_ID}`,
        {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
          },
        }
      );

      console.log(response);

      if (response?.data?.resultCode === 0) {
        console.log(response);
        const resultDataObject = JSON.parse(response?.data?.resultData);

        const initialState = {
          client_id: resultDataObject?.clientId,
          scope: "openid",
          response_type: "code",
          redirect_uri: resultDataObject?.redirectUris,
          state: "GNY5iOXMMjIAjIMibUGbVae5nuT8Zc9sjhZ2qMT1alc",
          code_challenge: "N-L4bpfwB4hxVEWRWac6TcUU2dU3dcS3LjJySUxG1Xo",
        };

        // setProviderData(initialState);

        // auth.signinRedirect();

        const client_id = resultDataObject?.clientId;
        const scope = "openid profile";
        const response_type = "code";
        const redirect_uri = resultDataObject?.redirectUris;
        const state = "GNY5iOXMMjIAjIMibUGbVae5nuT8Zc9sjhZ2qMT1alc";
        const code_challenge = "N-L4bpfwB4hxVEWRWac6TcUU2dU3dcS3LjJySUxG1Xo";
        const code_challenge_method = "S256";
        //const resource = "https://access.axiomprotect.com:6653/face/,https://bb-v177tp.axiomprotect.com:6651/AxiomProtect/Applications/OpenIdApp/_FW4VV1gDLlFMRUKTmxaC"

        // const iframe = document.createElement("iframe");
        // iframe.src = `https://openid.axiomprotect.com/oidc/authorize?client_id=${client_id}&scope=${scope}&response_type=${response_type}&redirect_uri=https://openid.axiomprotect.com/callback`;
        // document.body.appendChild(iframe);

        // const formData = new FormData();
        // formData.append('client_id',resultDataObject?.clientId);
        // formData.append('scope',"openid");
        // formData.append('response_type',"code");
        // formData.append('redirect_uri',resultDataObject?.redirectUris);
        // const form = document.createElement("form");
        // const client_id = document.createElement("input");
        // client_id.name="client_id";
        // client_id.value= resultDataObject?.clientId;

        // const scope = document.createElement("input");
        // scope.name="scope";
        // scope.value="scope";

        // const response_type = document.createElement("input");
        // response_type.name ="response_type";
        // response_type.value = "code";

        // const redirect_uri = document.createElement("input");
        // redirect_uri.name= "redirect_uri";
        // redirect_uri.value= "https://openid.axiomprotect.com/callback";

        // form.method = "get";
        // form.action = "`https://openid.axiomprotect.com/oidc/authorize"
        // form.appendChild(client_id);
        // form.appendChild(scope);
        // form.appendChild(response_type);
        // form.appendChild(redirect_uri);

        // const submitButton = document.createElement("input")
        // submitButton.type="submit"
        // form.appendChild(submitButton);
        // document.body.appendChild(form);
        // form.submit();
        const anchorTg = document.createElement("a");
        anchorTg.href = `${process.env.REACT_APP_OIDC_URL}/oidc/authorize?client_id=${client_id}&scope=${scope}&response_type=${response_type}&response_mode=query&redirect_uri= ${window.location.protocol}//${window.location.host}/`;
        document.body.appendChild(anchorTg);
        anchorTg.click();
        // const fetchThirdPartyAPISData = async () => {

        //   await fetch(`https://openid.axiomprotect.com/oidc/authorize?client_id=${client_id}&scope=${scope}&response_type=${response_type}&response_mode=query&redirect_uri=https://openid.axiomprotect.com/callback`,{redirect: "follow"},
        //     // {
        //     //   headers: {
        //     //     "content-type": "application/mul",

        //     //     // "Access-Control-Allow-Origin": "*",
        //     //     // "Access-Control-Allow-Methods": "*",
        //     //   },
        //     // }
        //   )
        //     .then((response) => {
        //       console.log(response.data);

        //       if (response.data.resultCode === 0) {
        //         console.log(response);
        //       }
        //     })
        //     .catch((err) => {
        //       console.log(err);

        //     });
        // };
        // fetchThirdPartyAPISData();

        console.log(resultDataObject);

        // Handle success
      } else {
        // Handle failure
      }
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
        startIcon={
          <img src="/public/axiom.png" width={20} height={20} alt="logo" />
        }
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
