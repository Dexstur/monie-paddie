// import styled from "styled-components";
// import { useState } from "react";

// const DropdownContainer = styled.div`
//   display: inline-block;
//   position: relative;
// `;

// const DropdownButton = styled.button`
//   background-color: #4caf50;
//   color: white;
//   padding: 10px;
//   font-size: 16px;
//   border: none;
//   cursor: pointer;
// `;

// import { HTMLAttributes } from "react";

// type DropdownContentProps = {
//   isVisible: boolean;
// } & HTMLAttributes<HTMLDivElement>;

// const DropdownContent = styled.div<DropdownContentProps>`
//   display: ${(props) => (props.isVisible ? "block" : "none")};
//   position: absolute;
//   background-color: #f9f9f9;
//   min-width: 160px;
//   box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
//   z-index: 1;
// `;

// const DropdownItem = styled.div`
//   color: black;
//   padding: 12px 16px;
//   text-decoration: none;
//   display: block;
//   &:hover {
//     background-color: #f1f1f1;
//   }
// `;

// const Dropdown = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   const toggleDropdown = () => {
//     setIsVisible(!isVisible);
//   };

//   return (
//     <DropdownContainer>
//       <DropdownButton onClick={toggleDropdown}>Dropdown</DropdownButton>
//       <DropdownContent isVisible={isVisible}>
//         <DropdownItem>Option 1</DropdownItem>
//         <DropdownItem>Option 2</DropdownItem>
//         <DropdownItem>Option 3</DropdownItem>
//       </DropdownContent>
//     </DropdownContainer>
//   );
// };

// export default Dropdown;
