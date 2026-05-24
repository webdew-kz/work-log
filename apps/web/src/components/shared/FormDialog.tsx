import { ReactNode } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  submitLabel: string;
  isSubmitting: boolean;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormDialog({
  open,
  onClose,
  title,
  description,
  submitLabel,
  isSubmitting,
  children,
  onSubmit,
}: FormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
        </div>
      </form>
    </Dialog>
  );
}