import { useState } from 'react';
import _logo from '../assets/images/_logo.png';
import ConnectWallet from './blocknative/ConnectWallet';
import ErroModal from './ErroModal';
import Loading from './Loading';

const OKConnectWallet = () => {
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorContent, setErrorContent] = useState("");
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggle = () => setErrorFlag(!errorFlag);

    return (
        <div className='staking d-flex align-items-center justify-content-center'>
            <div style={{ flexDirection: "row" }}>
                <div className='col-12 d-flex justify-content-between my-2'>
                    <img src={_logo} alt="logo" style={{ height: 40 }} />
                    <ConnectWallet 
                        setErrorFlag={setErrorFlag} 
                        setErrorContent={setErrorContent} 
                        setAccount={setAccount}
                        account={account} 
                    />
                </div>
            </div>
            <Loading loading={loading} />  
            <ErroModal errorFlag={errorFlag} toggle={toggle} errorContent={errorContent} />
        </div>
    );
}

export default OKConnectWallet;
