import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  flex: 1;
`;

const Preview: React.FC<{ data: Blob }> = ({ data }) => {
  return (
    <Container>
      <img src={URL.createObjectURL(data)} />
    </Container>
  );
};

export default Preview;
