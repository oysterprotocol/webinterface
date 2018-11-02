import styled from "styled-components";
import Container from "./container";

const Text = styled(Container)`
  color: ${ (props: any) => props.color || '#778291' };
  font-family: ${ (props: any) => props.fontFamily || 'Open Sans' };
  text-align: ${ (props: any) => props.textAlign || 'justify' };
  line-height: ${ (props: any) => props.lineHeight || '1.5' };
  font-size: ${ (props: any) => props.fontSize || '16px' };
  font-weight: ${ (props: any) => props.fontWeight || '600' };
`;

export default Text;
