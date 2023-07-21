import { ToastContainer } from 'react-toastify';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { SocketContextProvider } from './context/socket';

function App() {
  const routing = useRoutes(routes());
  // console.log("routing", routing);
  return (
    <>
     <SocketContextProvider>
        {routing}
        <ToastContainer />
      </SocketContextProvider>
    </>  
  );
}

export default App;
