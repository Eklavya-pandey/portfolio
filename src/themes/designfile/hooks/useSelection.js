/**
 * useSelection — Click-to-select, multi-select, deselect for canvas objects.
 */
import { useState, useCallback } from 'react';

export default function useSelection() {
  const [selectedIds, setSelectedIds] = useState([]);

  const select = useCallback((id, additive = false) => {
    setSelectedIds(prev => {
      if (additive) {
        return prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      }
      return [id];
    });
  }, []);

  const deselect = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback((id) => {
    return selectedIds.includes(id);
  }, [selectedIds]);

  return { selectedIds, select, deselect, isSelected };
}
