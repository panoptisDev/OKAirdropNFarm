import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import ADDRESSES from '../utils/constants/ADDRESSES.json';

const SelectChainModal = (props) => {
  const chainOptions = {
      chainId: ADDRESSES.CHAINID,
      rpcUrl: `https://public-en.kairos.node.kaia.io`,
      label: 'Kaia Testnet Kairos',
      token: 'KAIA'
  }
    return (
    <div>
      <Modal isOpen={props.showChainModal} contentClassName='chain-body-modal' className='select-chain-modal' size='sm' toggle={props.mToggle} >
        <ModalHeader toggle={props.mToggle}>
          Switch Network
        </ModalHeader>
        <ModalBody>
          <div onClick={() => props.setChain(chainOptions)}>
            <img src="/klaytn-logo.svg" class="icon-class"/>
            Kaia Testnet Kairos
          </div>
          <hr/>
          <div onClick={() => props.disconnect()}>
            <img src="/logout.svg" class="icon-class"/>
             &nbsp;Disconnect
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default SelectChainModal;
