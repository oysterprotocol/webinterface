import styled from "styled-components";

const Image = styled.img`
  width: ${ (props : any) => props.width || 'auto' };
  height: ${ (props : any) => props.height || '100px' };
  margin-top: ${ (props : any) => props.marginTop || 0 };
  margin-left: ${ (props : any) => props.marginLeft || 0 };
  margin-right: ${ (props : any) => props.marginRight || 0 };
  margin-bottom: ${ (props : any) => props.marginBottom || 0 };
`;

export default Image;
