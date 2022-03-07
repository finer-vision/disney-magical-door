import styled, { createGlobalStyle } from "styled-components";

export const AppReset = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  html {
    font-size: 20px;
    font-family: system-ui, Arial, sans-serif;
    color: #f0f0f0;
    background-color: #1e1e1e;
  }
`;

export const AppWrapper = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  place-items: center;
  place-content: center;
  position: relative;

  input[type="text"] {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
  }

  video {
    aspect-ratio: 1080 / 1920;
    width: auto;
    height: 100%;
    object-fit: cover;

    @media (orientation: portrait) {
      width: 100%;
      height: auto;
    }
  }
`;
