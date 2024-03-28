import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));
const AxiomSSOLogin = Loadable(lazy(() => import('pages/authentication/sso/openid-login/AxiomSSOLogin')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'auth/sso/openid-login',
      element: <AxiomSSOLogin />
    },
    {
      path: 'register',
      element: <AuthRegister />
    }
  ]
};

export default LoginRoutes;
