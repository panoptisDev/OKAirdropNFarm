import { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { ethers } from 'ethers';
import ok_airdrop from '../assets/images/ok_airdrop.png';
import ADDRESSES from '../utils/constants/ADDRESSES.json';
import { StyledButton, StyledWrapper } from './StyledComponent';
import ConnectWallet from './blocknative/ConnectWallet';
import { getAirdropContract } from './ConnectContract';
import ErroModal from './ErroModal';
import Loading from './Loading';
import CAlert from './CAlert';

const AirdropO3E = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertFlag, setAlertFlag] = useState(false);
    const [type, setType] = useState("info");
    const [aContent, setAContent] = useState("Success");
    const [airdropInfo, setAirdropInfo] = useState({
        contractBalance: '0',
        walletBalance: '0',
        totalAirdropped: '0'
    });
    const [account, setAccount] = useState(null);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorContent, setErrorContent] = useState("");
    const [showConnectWallet, setShowConnectWallet] = useState(true); // Trạng thái ẩn/hiện

    useEffect(() => {
        if (account) {
            const walletAdd = account.address;
            setWalletAddress(walletAdd);
            fetchBalances(walletAdd);
            setShowConnectWallet(false); // Ẩn nút ConnectWallet khi đã kết nối
        }
    }, [account]);

    const fetchBalances = async (walletAdd) => {
        try {
            const airdropContract = getAirdropContract();
            const [contractBalance, walletBalance, totalAirdropped] = await Promise.all([
                airdropContract.getContractO3EBalance(),
                airdropContract.getWalletO3EBalance(walletAdd),
                airdropContract.getAirdroppedAmount(walletAdd)
            ]);
            setAirdropInfo({
                contractBalance: ethers.utils.formatUnits(contractBalance, 18),
                walletBalance: ethers.utils.formatUnits(walletBalance, 18),
                totalAirdropped: ethers.utils.formatUnits(totalAirdropped, 18),
            });
        } catch (err) {
            console.error("Error fetching balances", err);
        }
    };

    const handleAirdropClick = async () => {
        setLoading(true);
        try {
            const airdropContract = getAirdropContract();
            const airdropTx = await airdropContract.airdrop();
            await airdropTx.wait();
            setAContent("Airdrop Success!");
            setAlertFlag(true);
            setType("info");
            fetchBalances(walletAddress);
        } catch (err) {
            setErrorContent("Airdrop issue! Click button to get more stO3E Token");
            setErrorFlag(true);
        } finally {
            setLoading(false);
        }
    };

    const addO3EToMetamask = async () => {
        const tokenAddress = ADDRESSES.TOKEN_ADDRESS;
        const tokenSymbol = 'stO3E';
        const tokenDecimals = 18;

        try {
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: tokenDecimals,
                    },
                },
            });
        } catch (error) {
            console.error('Error adding O3E to Metamask:', error);
        }
    };

    const getMoreO3EToken = async () => {
        window.open('https://ok-swap-altcoin.vercel.app/', '_blank');
    }

    return (
        <div className='farming d-flex align-items-center justify-content-center'>
            <div style={{flexDirection: "row"}} >
                <CAlert alertFlag={alertFlag} type={type} aContent={aContent} onDismiss={() => setAlertFlag(false)} />
                <StyledWrapper className='p-3'>
                    <div className='col-12 d-flex justify-content-between my-2'>
                        <img src={ok_airdrop} alt="ok_airdrop" style={{ height: 40 }} />
                        {/* Hiển thị ConnectWallet nếu showConnectWallet là true */}
                        {showConnectWallet && (
                            <ConnectWallet 
                                setErrorFlag={setErrorFlag} 
                                setErrorContent={setErrorContent} 
                                setAccount={setAccount}
                                account={account} 
                            />
                        )}
                    </div>
                    
                    <Row>
                        <Col className="d-flex flex-wrap col-12 text-white">
                            <span className='col-12 fs-4 fw-semibold'>
                                stO3E AIRDROP
                            </span>
                        </Col>
                    </Row>
                    <div className='d-flex align-items-center flex-column w-100 text-white fs-6 py-2'>
                        <div className='col-12 d-flex align-items-center justify-content-between pt-1'>
                            <div>Contract Balance</div>
                            <div>{airdropInfo.contractBalance}</div>
                        </div>
                        <div className='col-12 d-flex align-items-center justify-content-between pt-1'>
                            <div>stO3E in Wallet</div>
                            <div>{airdropInfo.walletBalance}</div>
                        </div>
                        <div className='col-12 d-flex align-items-center justify-content-between pt-1'>
                            <div>stO3E Airdropped</div>
                            <div>{airdropInfo.totalAirdropped}</div>
                        </div>
                    </div>

                    <StyledButton className='active w-100 mt-2' onClick={handleAirdropClick}>
                        Airdrop Now
                    </StyledButton>

                    <StyledButton className='w-100 mt-2' onClick={addO3EToMetamask}>
                        Add stO3E Token to Metamask
                    </StyledButton>

                    <StyledButton className='w-100 mt-2' onClick={getMoreO3EToken}>
                        Get more stO3E Token
                    </StyledButton>
                </StyledWrapper>
            </div>
            <Loading loading={loading} />
            <ErroModal errorFlag={errorFlag} toggle={() => setErrorFlag(!errorFlag)} errorContent={errorContent} onDismiss={() => setErrorFlag(false)} />
        </div>
    );
};

export default AirdropO3E;
