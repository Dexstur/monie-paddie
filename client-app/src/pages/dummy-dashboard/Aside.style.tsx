import { styled } from "styled-components";

export const SearchBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 78%;
  max-width: 364px;
  height: 72px;
  padding: 0px 12px;
  border-radius: 4px;
  background-color: #fff;
`;
export const HoldIcon = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  height: 24px;
  width: 24px;
`;

export const SearchField = styled.input`
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 400;
  width: 100%;

  &:focus {
    border: none;
    outline: none;
  }

  &::placeholder {
    color: #a3a3a3;
  }
`;

export const FilterContainer = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
`;

export const FilterLabel = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fff;
  border-radius: 4px;
  color: var(--Pri-Color);
`;

export const FilterOptions = styled.div<{ show: boolean }>`
  width: 72px;
  display: ${({ show }) => (show ? "flex" : "none")};
  flex-direction: column;
  gap: 8px;
  background-color: #fff;
`;

export const FilterOption = styled.span<{ highlight: boolean }>`
  background-color: ${({ highlight }) => (highlight ? "#00afb9" : "#fff")};
  padding: 0px 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
