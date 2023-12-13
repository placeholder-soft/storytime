import styled from "styled-components";
import { Button } from "@radix-ui/themes";

export default styled(Button)`
  display: inline-flex;
  padding: 4px 25px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 10px;
  background: #000;
  cursor: pointer;
  &:hover {
    background: #363636;
  }
`;
