import { memo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortField = "date" | "workType" | "volume" | "executor";

interface SortHeaderProps {
  field: SortField;
  sort: SortField;
  order: "asc" | "desc";
  children: React.ReactNode;
  onSort: (field: SortField) => void;
}

export const SortHeader = memo(function SortHeader({
  field,
  sort,
  order,
  children,
  onSort,
}: SortHeaderProps) {
  const isActive = sort === field;
  return (
    <th
      className="cursor-pointer select-none px-4 py-3 text-left font-medium hover:bg-muted/80 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {isActive ? (
          order === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-primary" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5 text-primary" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
    </th>
  );
});