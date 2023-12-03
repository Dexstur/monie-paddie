import { styled } from "styled-components";
import { MdEdit } from "react-icons/md";

export const Top = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  text-align: center;
`;

export const HoldImg = styled.div`
  width: 72px;
  position: relative;
`;

export const ProfileImg = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
`;

export const EditIcon = styled(MdEdit)`
  font-size: 24px;
  color: var(--Pri-Color);
`;

export const PicForm = styled.form`
  width: 80px;
  position: absolute;
  right: 0;
  top: 48px;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PicLabel = styled.label`
  cursor: pointer;
`;

export const PicInput = styled.input`
  width: 100%;
  display: none;
`;

export const UploadBtn = styled.button<{ show: boolean }>`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  color: #fff;
  background-color: var(--Pri-Color);
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: ${({ show }) => (show ? "block" : "none")};
`;
