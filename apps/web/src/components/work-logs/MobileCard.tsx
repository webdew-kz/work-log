import { memo } from "react";
import { Calendar, HardHat, Box, Wrench, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkLog } from "@/api/client";
import { formatVolume } from "./WorkLogsPage";

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  } catch {
    return dateStr;
  }
};

interface MobileCardProps {
  item: WorkLog;
  onEdit: (item: WorkLog) => void;
  onDelete: (id: string) => void;
}

export const MobileCard = memo(function MobileCard({ item, onEdit, onDelete }: MobileCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium text-sm">{formatDate(item.date)}</span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 ml-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(item)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      </div>
      <div className="mt-1.5 space-y-0.5 text-sm">
        <div className="flex items-center gap-1.5 min-w-0">
          <Wrench className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{item.workType?.name || "—"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Box className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>{formatVolume(item.volume)}</span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <HardHat className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="truncate">{item.executor}</span>
        </div>
      </div>
    </div>
  );
});