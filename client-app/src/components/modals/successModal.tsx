import { FC } from 'react';
import styled from 'styled-components';

interface SuccessModalProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  message: string;
  id: string;
}

const Modal = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: fixed; 
  top: 0;
  right: 0; 
  bottom: 0;
  left: 0; 
  background-color: blue;
  z-index: 9999; 
`;

const ModalDialog = styled.div`

`;

const ModalContent = styled.div`

`;

const ModalTitle = styled.h1`
  // Add your styles here
`;

const ModalBody = styled.div`
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
`;

const ModalMessage = styled.p`
  // Add your styles here
`;

const ContinueButton = styled.button`
  // Add your styles here
`;
const SuccessModal: FC<SuccessModalProps> = ({ show, handleClose, title, message, id }) => {
    return (
        <Modal show={show} tabIndex={-1} id={String(id)}>
          <ModalDialog className="modal-dialog modal-dialog-centered modal-fullscreen">
            <ModalContent className="modal-content">
              <ModalBody className="modal-body">
              <ModalTitle className="modal-title">{title}</ModalTitle>
                <ModalMessage>{message}</ModalMessage>
                <ContinueButton type="button" className="btn btn-primary" onClick={handleClose}>Continue</ContinueButton>
              </ModalBody>
            </ModalContent>
          </ModalDialog>
        </Modal>
      );
//     <div className={`modal ${show ? 'show d-block' : 'd-none'}`} tabIndex={-1} id={String(id)} style={{display: show ? 'block' : 'none'}}>
//         <div className="modal-dialog modal-dialog-centered modal-fullscreen">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h1 className="modal-title">{title}</h1>
//                 </div>
//                 <div className="modal-body">
//                      <p>{message}</p>
//                      <button type="button" className="btn btn-primary" onClick={handleClose}>Continue</button>
//                 </div>
//             </div>
//         </div>
//     </div>
// );
};

export default SuccessModal;