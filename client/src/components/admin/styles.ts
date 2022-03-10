import styled, { createGlobalStyle } from "styled-components";

export const AdminReset = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root, main {
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

export const AdminWinTimes = styled.table`
  //
`;

export const AdminLastScan = styled.table`
  //
`;

export const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1em;
  place-content: flex-start;
  place-items: flex-start;
`;

export const AdminWrapper = styled.main`
  padding: 1em;

  h3 {
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
