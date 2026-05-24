import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: "default" | "destructive";
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  confirmVariant = "default",
  onConfirm,
  isSubmitting = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
          {confirmLabel}
        </Button>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Отмена
        </Button>
      </div>
    </Dialog>
  );
}