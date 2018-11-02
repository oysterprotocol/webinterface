import styled from "styled-components";

const Button = styled.button`
  background-color: ${ (props : any) => props.backgroundColor || 'rgba(8, 143, 252)' };
  color: ${ (props : any) => props.color || 'white' };
  border: ${ (props : any) => props.border || 'none' };
  border-radius: ${ (props : any) => props.borderRadius || '12px' };
  cursor: ${ (props : any) => props.cursor || 'pointer' };
  font: ${ (props : any) => props.font || '600 23px Poppins' };
  height: ${ (props : any) => props.height || '50px' };
  margin: ${ (props : any) => props.margin || '15px' };
  min-width: ${ (props : any) => props.minWidth || '300px' };
  outline: ${ (props : any) => props.outline || 'none' };
  padding: ${ (props : any) => props.padding || 0 };
  width: ${ (props : any) => props.width || '100%' };
  @media (max-width: 1200px) {
    border-radius: 8px;
    font-size: 16px;
    height: 40px;
    margin: 5px;
    min-width: 180px;
  }
`;

export default Button;
