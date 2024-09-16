import { BrowserRouter } from "react-router-dom";
import OKConnectWallet from './Components/OKConnectWallet';
import Farming from './Components/Farming';
import AirdropO3E from './Components/Airdrop';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="h-100 flex-column-custom">
          <OKConnectWallet /> 
          <AirdropO3E />
          <Farming />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
