import styled from "styled-components";
import Container from "./container";

const Flexbox = styled(Container)`
  display: flex;
  align-items: ${ (props : any) => props.alignItems || 'flex-start' };
  align-content: ${ (props : any) => props.alignContent || 'flex-start' };
  justify-content: ${ (props : any) => props.justifyContent || 'flex-start' };
  flex-direction: ${ (props : any) => props.flexDirection || 'auto' };
  flex-basis: ${ (props : any) => props.flexBasis || 'auto' };
  flex-grow: ${ (props : any) => props.flexGrow || '0' };
  flex-shrink: ${ (props : any) => props.flexShrink || '0' };
`;

export default Flexbox;
