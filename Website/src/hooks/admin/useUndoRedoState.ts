import { useState, useCallback } from "react";

export function useUndoRedoState<T>(initialState: T | (() => T)) {
  const [present, setPresent] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setPast(newPast);
    setFuture([present, ...future]);
    setPresent(previous);
  }, [past, future, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast([...past, present]);
    setFuture(newFuture);
    setPresent(next);
  }, [past, future, present]);

  const updateState = useCallback((newVal: T | ((prev: T) => T)) => {
    setPresent((prev) => {
      const resolved = typeof newVal === "function" ? (newVal as Function)(prev) : newVal;
      setPast((p) => [...p, prev]);
      setFuture([]);
      return resolved;
    });
  }, []);

  const resetState = useCallback((newVal: T) => {
    setPresent(newVal);
    setPast([]);
    setFuture([]);
  }, []);

  return [
    present,
    updateState,
    undo,
    redo,
    past.length > 0,
    future.length > 0,
    resetState,
  ] as const;
}
