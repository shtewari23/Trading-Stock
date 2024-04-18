// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { ResProvider } from './Context';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => (
  <ResProvider>
  <ThemeCustomization>
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
  </ResProvider>
);

export default App;
