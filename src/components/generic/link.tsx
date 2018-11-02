import styled from "styled-components";

const Link = styled.a`
  color: ${ (props: any) => props.color || '#778291' };
  font-weight: ${ (props: any) => props.fontWeight || '600' };
`;

export default Link;
