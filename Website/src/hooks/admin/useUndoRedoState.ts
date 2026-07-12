import { useState, useCallback } from "react";

export interface UndoRedoAction {
  undo: () => Promise<void>;
  redo: () => Promise<void>;
}

// Overload signatures
export function useUndoRedoState<T>(initialValue: T): [
  T,
  (val: T) => void,
  () => void,
  () => void,
  boolean,
  boolean,
  (val: T) => void
];
export function useUndoRedoState(): {
  pushAction: (action: UndoRedoAction) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  isProcessing: boolean;
};

// Implementation
export function useUndoRedoState(initialValue?: any): any {
  // If initialValue is provided, run the state-based logic
  if (initialValue !== undefined) {
    const [present, setPresent] = useState<any>(initialValue);
    const [past, setPast] = useState<any[]>([]);
    const [future, setFuture] = useState<any[]>([]);

    const updateState = useCallback((newVal: any) => {
      setPast((prev) => [...prev, present]);
      setPresent(newVal);
      setFuture([]);
    }, [present]);

    const undo = useCallback(() => {
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      setPast(newPast);
      setFuture((prev) => [present, ...prev]);
      setPresent(previous);
    }, [past, present]);

    const redo = useCallback(() => {
      if (future.length === 0) return;
      const next = future[0];
      const newFuture = future.slice(1);

      setFuture(newFuture);
      setPast((prev) => [...prev, present]);
      setPresent(next);
    }, [future, present]);

    const resetState = useCallback((newVal: any) => {
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
    ];
  }

  // Otherwise, run the action-based logic
  const [pastActions, setPastActions] = useState<UndoRedoAction[]>([]);
  const [futureActions, setFutureActions] = useState<UndoRedoAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const pushAction = useCallback((action: UndoRedoAction) => {
    setPastActions((prev) => [...prev, action]);
    setFutureActions([]);
  }, []);

  const undoAction = useCallback(async () => {
    if (pastActions.length === 0 || isProcessing) return;
    setIsProcessing(true);
    const action = pastActions[pastActions.length - 1];
    try {
      await action.undo();
      setPastActions((prev) => prev.slice(0, prev.length - 1));
      setFutureActions((prev) => [action, ...prev]);
    } catch (error) {
      console.error("Undo failed", error);
    } finally {
      setIsProcessing(false);
    }
  }, [pastActions, isProcessing]);

  const redoAction = useCallback(async () => {
    if (futureActions.length === 0 || isProcessing) return;
    setIsProcessing(true);
    const action = futureActions[0];
    try {
      await action.redo();
      setFutureActions((prev) => prev.slice(1));
      setPastActions((prev) => [...prev, action]);
    } catch (error) {
      console.error("Redo failed", error);
    } finally {
      setIsProcessing(false);
    }
  }, [futureActions, isProcessing]);

  return {
    pushAction,
    undo: undoAction,
    redo: redoAction,
    canUndo: pastActions.length > 0,
    canRedo: futureActions.length > 0,
    isProcessing,
  };
}
