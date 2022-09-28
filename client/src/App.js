import { useSelector } from 'react-redux';

import Layout from './components/Layout/Layout';
import Auth from './components/Auth/Auth';
import MainPage from './components/MainPage/MainPage';

const App = () => {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  return (
    <Layout>
      {isLoggedIn ? <MainPage/> : <Auth/>}
    </Layout>
  );
}

export default App;
