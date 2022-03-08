import styled from "styled-components";

export const VideoWrapper = styled.div`
  aspect-ratio: 1080 / 1920;
  width: auto;
  height: 100%;

  @media (orientation: portrait) {
    width: 100%;
    height: auto;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
