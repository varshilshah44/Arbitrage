import { ToastContainer } from 'react-toastify';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const routing = useRoutes(routes());
  console.log("routing", routing)
  return (
    <>
      {routing}
      <ToastContainer />
    </>  
  );
}

export default App;
