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
    overflow: hidden;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #root {
    width: 100vh;
    height: 100vw;
    transform: rotate(90deg);
  }

  html {
    font-size: 20px;
    font-family: system-ui, Arial, sans-serif;
    color: #f0f0f0;
    background-color: #1e1e1e;
  }
`;

export const AppWrapper = styled.main`
  width: 100vh;
  height: 100vw;
  display: flex;
  place-items: center;
  place-content: center;
  position: relative;
  overflow: hidden;

  audio {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    top: 0;
    left: 0;
  }
`;
