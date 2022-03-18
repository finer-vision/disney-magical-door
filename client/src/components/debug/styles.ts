import styled from "styled-components";

export const DebugWrapper = styled.div`
  position: absolute;
  top: 1em;
  left: 1em;
  z-index: 1;
  background-color: crimson;
  opacity: 0.7;
  padding: 1em;
  max-height: calc(100% - 2em);
  overflow: auto;
  -webkit-overflow-scrolling: auto;
  animation: move 30s linear infinite;
  white-space: nowrap;

  @keyframes move {
    0%, 100% {
      left: 1em;
      transform: translateX(0%);
    }

    50% {
      left: calc(100% - 1em);
      transform: translateX(-100%);
    }
  }

  h3 {
    text-transform: uppercase;
    font-weight: bold;
    text-decoration: underline;
    margin-bottom: 1em;
  }

  h4 {
    margin-bottom: 0.5em;
  }

  table {
    background-color: #3f3f3f;
    border-collapse: collapse;

    thead {
      font-weight: bold;
      background-color: #2f2f2f;
    }

    td {
      border: 1px solid black;
      padding: 0.5em;
    }
  }
`;
