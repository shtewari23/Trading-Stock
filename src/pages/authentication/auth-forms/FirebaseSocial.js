// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Button, Stack } from '@mui/material';

// assets

// ==============================|| FIREBASE - SOCIAL BUTTON ||============================== //

const FirebaseSocial = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const width = 600; // Width of the popup window
  const height = 700; // Height of the popup window
  const left = (window.innerWidth - width) / 2; // Center the popup horizontally
  const top = (window.innerHeight - height) / 2;
  return (
    <Stack
      direction="row"
      spacing={matchDownSM ? 1 : 2}
      justifyContent={matchDownSM ? 'space-around' : 'space-between'}
      sx={{ '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
    >
      <Button
        startIcon={<img src="/public/axiom.png" width={20} height={20} alt="logo" />}
        variant="outlined"
        color="primary"
        fullWidth={!matchDownSM}
        onClick={() =>
          window.open(
            "/auth/sso/openid-login",
            "_blank",
            `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`,
          )
        }
      >
        Login with Axiom{' '}
      </Button>
    </Stack>
  );
};

export default FirebaseSocial;
