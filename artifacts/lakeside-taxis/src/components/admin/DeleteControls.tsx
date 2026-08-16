import { useState, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  deleteAdminRecord,
  bulkDeleteAdminRecords,
  DELETE_CONSEQUENCE,
  type DeletableEntity,
} from "@/lib/adminDeleteApi";

/**
 * Row selection for an admin table.
 *
 * Selection is keyed by record id rather than row index, so it survives the
 * list being refetched or reordered underneath it.
 */
export function useTableSelection(visibleIds: number[]) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // "Select all" deliberately means all rows on this page, not every record
  // matching the filter — selecting rows you cannot see is how accidents happen.
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      const next = new Set(prev);
      const everySelected = visibleIds.every((id) => next.has(id));
      visibleIds.forEach((id) => (everySelected ? next.delete(id) : next.add(id)));
      return next;
    });
  }, [visibleIds]);

  const clear = useCallback(() => setSelected(new Set()), []);

  const selectedIds = useMemo(() => [...selected], [selected]);

  return { selected, selectedIds, toggle, toggleAll, allVisibleSelected, clear };
}

interface SelectCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function SelectCheckbox({ checked, onChange, label }: SelectCheckboxProps) {
  return (
    <span
      // The checkbox lives inside a row that is itself clickable, so stop the
      // click here rather than navigating away the moment you try to select.
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center"
    >
      <Checkbox checked={checked} onCheckedChange={onChange} aria-label={label} />
    </span>
  );
}

interface DeleteDialogProps {
  entity: DeletableEntity;
  /** Records to remove. A single id renders the singular wording. */
  ids: number[];
  noun: string;
  nounPlural: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Query keys to invalidate once the delete lands. */
  invalidateKeys: unknown[][];
  onDeleted?: () => void;
}

export function DeleteDialog({
  entity,
  ids,
  noun,
  nounPlural,
  open,
  onOpenChange,
  invalidateKeys,
  onDeleted,
}: DeleteDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const count = ids.length;
  const subject = count === 1 ? `this ${noun}` : `${count} ${nounPlural}`;
  const consequence = DELETE_CONSEQUENCE[entity];

  /**
   * Runs after the dialog has already begun closing, so the ids are captured
   * by the caller before state resets. The outcome is reported by toast.
   */
  async function runDelete(target: number[]) {
    try {
      const deleted =
        target.length === 1
          ? (await deleteAdminRecord(entity, target[0]), 1)
          : await bulkDeleteAdminRecords(entity, target);

      invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      onDeleted?.();
      toast({
        title: deleted === 1 ? `${noun} deleted` : `${deleted} ${nounPlural} deleted`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not delete",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {subject}?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone.
            {consequence ? ` ${consequence}` : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              // Deliberately NOT preventDefault: Radix needs its own close to
              // run, otherwise the dialog stays mounted in a closed state and
              // never releases the `pointer-events: none` it puts on <body> —
              // which leaves the whole admin panel unclickable until reload.
              // The ids are copied first because closing resets them.
              void runDelete([...ids]);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete {count === 1 ? "" : count}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface BulkDeleteBarProps {
  count: number;
  nounPlural: string;
  onClear: () => void;
  onDelete: () => void;
}

export function BulkDeleteBar({ count, nounPlural, onClear, onDelete }: BulkDeleteBarProps) {
  if (count === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
      <span className="text-sm text-foreground">
        <strong>{count}</strong> {count === 1 ? nounPlural.replace(/s$/, "") : nounPlural}{" "}
        selected
      </span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete selected
        </Button>
      </div>
    </div>
  );
}

interface RowDeleteButtonProps {
  onClick: () => void;
  label: string;
}

export function RowDeleteButton({ onClick, label }: RowDeleteButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="text-muted-foreground hover:text-destructive transition-colors p-1"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
