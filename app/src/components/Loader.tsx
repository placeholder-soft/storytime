import styled, { keyframes } from "styled-components";

const firstAnimation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`;

const secondAnimation = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(220deg);
    }
`;

const thirdAnimation = keyframes`
    0% {
      transform: rotate(-140deg);
    }
    50% {
      transform: rotate(-160deg);
    }
    100% {
      transform: rotate(140deg);
    }
`;

const LoaderContainer = styled.div<{ $size: number }>`
  height: ${(props) => `${props.$size}px`};
  width: ${(props) => `${props.$size}px`};
  animation: ${firstAnimation} 4.8s linear infinite;
`;

const LoaderBody = styled.span<{ $size: number }>`
  display: block;
  position: absolute;
  z-index: 9;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  height: ${(props) => `${props.$size}px`};
  width: ${(props) => `${props.$size}px`};
  clip: ${(props) =>
    `rect(0, ${props.$size}px, ${props.$size}px, ${props.$size / 2}px)`};
  animation: ${secondAnimation} 1.2s linear infinite;
  &::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: ${(props) => `${props.$size}px`};
    width: ${(props) => `${props.$size}px`};
    clip: ${(props) =>
      `rect(0, ${props.$size}px, ${props.$size}px, ${props.$size / 2}px)`};
    border: ${(props) => `${props.$size / 8}`}px solid rgba(105, 121, 248, 1);
    border-radius: 50%;
    animation: ${thirdAnimation} 1.2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
  }
`;

const Loader: React.FC<{ size?: number; className?: string }> = ({
  className,
  size = 32,
}) => {
  return (
    <LoaderContainer $size={size} className={className}>
      <LoaderBody $size={size} />
    </LoaderContainer>
  );
};

export default Loader;
