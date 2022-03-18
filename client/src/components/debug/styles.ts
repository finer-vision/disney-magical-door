import styled from "styled-components";

export const DebugWrapper = styled.div`
  position: absolute;
  top: 1em;
  right: 1em;
  z-index: 1;
  background-color: crimson;
  opacity: 0.7;
  padding: 1em;
  max-height: calc(100% - 2em);
  overflow: auto;
  -webkit-overflow-scrolling: auto;

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
