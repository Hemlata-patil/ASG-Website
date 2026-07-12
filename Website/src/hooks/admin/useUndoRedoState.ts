import { useState, useCallback } from "react";

export interface UndoRedoAction {
  undo: () => Promise<void>;
  redo: () => Promise<void>;
}

export function useUndoRedoState() {
  const [past, setPast] = useState<UndoRedoAction[]>([]);
  const [future, setFuture] = useState<UndoRedoAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const pushAction = useCallback((action: UndoRedoAction) => {
    setPast((prev) => [...prev, action]);
    setFuture([]);
  }, []);

  const undo = useCallback(async () => {
    if (past.length === 0 || isProcessing) return;
    setIsProcessing(true);
    const action = past[past.length - 1];
    try {
      await action.undo();
      setPast((prev) => prev.slice(0, prev.length - 1));
      setFuture((prev) => [action, ...prev]);
    } catch (error) {
      console.error("Undo failed", error);
    } finally {
      setIsProcessing(false);
    }
  }, [past, isProcessing]);

  const redo = useCallback(async () => {
    if (future.length === 0 || isProcessing) return;
    setIsProcessing(true);
    const action = future[0];
    try {
      await action.redo();
      setFuture((prev) => prev.slice(1));
      setPast((prev) => [...prev, action]);
    } catch (error) {
      console.error("Redo failed", error);
    } finally {
      setIsProcessing(false);
    }
  }, [future, isProcessing]);

  return { pushAction, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0, isProcessing };
}
