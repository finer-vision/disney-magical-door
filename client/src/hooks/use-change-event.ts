import React from "react";

export default function useChangeEvent<Element>(
  fn: (event: React.ChangeEvent<Element>) => void,
  deps: any[]
) {
  return React.useCallback(fn, deps);
}
