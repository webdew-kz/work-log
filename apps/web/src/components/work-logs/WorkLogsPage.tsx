import { useState, useEffect, useCallback, memo } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { workLogsApi, workTypesApi, type WorkLog, type WorkType } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { MobileCard } from "./MobileCard";
import { SortHeader, type SortField } from "./SortHeader";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  Calendar,
} from "lucide-react";

const formSchema = z.object({
  date: z.string().min(1, "Дата обязательна"),
  workTypeId: z.string().min(1, "Вид работ обязателен"),
  volume: z.string().min(1, "Объём обязателен").max(100, "Максимум 100 символов"),
  executor: z.string().min(1, "Исполнитель обязателен").max(200, "Максимум 200 символов"),
});

type FormData = z.infer<typeof formSchema>;

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  } catch {
    return dateStr;
  }
}

export function formatVolume(volume: string): string {
  if (!volume) return "—";
  const trimmed = volume.trim();
  if (trimmed.endsWith("м³") || trimmed.endsWith("m3") || trimmed.endsWith("м3")) return trimmed;
  return trimmed + " м³";
}

const DesktopRow = memo(function DesktopRow({
  item,
  onEdit,
  onDelete,
}: {
  item: WorkLog;
  onEdit: (item: WorkLog) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="border-b last:border-0 hover:bg-muted/40">
      <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.date)}</td>
      <td className="px-4 py-3">{item.workType?.name || "—"}</td>
      <td className="px-4 py-3">{formatVolume(item.volume)}</td>
      <td className="px-4 py-3">{item.executor}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  );
});

export function WorkLogsPage() {
  const [items, setItems] = useState<WorkLog[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{
    executor?: string;
    workTypeId?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const [sort, setSort] = useState<SortField>("date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorkLog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = { sort, order };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.executor) params.executor = filters.executor;
      if (filters.workTypeId) params.workTypeId = filters.workTypeId;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const [logs, types] = await Promise.all([
        workLogsApi.list(params),
        workTypesApi.list(),
      ]);
      setItems(logs);
      setWorkTypes(types);
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters, sort, order]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    reset({ date: new Date().toISOString().split("T")[0], workTypeId: "", volume: "", executor: "" });
    setDialogOpen(true);
  };

  const openEdit = (item: WorkLog) => {
    setEditing(item);
    setValue("date", item.date.split("T")[0]);
    setValue("workTypeId", item.workTypeId);
    setValue("volume", item.volume);
    setValue("executor", item.executor);
    setDialogOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await workLogsApi.update(editing.id, data);
      } else {
        await workLogsApi.create(data);
      }
      setDialogOpen(false);
      await load();
    } catch (e: any) {
      setError(e.message || "Ошибка сохранения");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await workLogsApi.remove(deleteId);
      setDeleteId(null);
      await load();
    } catch (e: any) {
      setError(e.message || "Ошибка удаления");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sort === field) {
      setOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setOrder("asc");
    }
  };

  const applyFilters = async () => {
    setShowFilters(false);
    await load();
  };

  return (
    <div className="space-y-4">
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {/* Desktop header */}
      <div className="hidden sm:flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Записи</h2>
        <div className="flex items-center gap-2">
          <div className="relative w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-8 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters((v) => !v)}>
            <Filter className="mr-1 h-4 w-4" />
            Фильтры
          </Button>
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Добавить
          </Button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-8 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => toggleSort("date")}
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            {order === "desc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Добавить
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowFilters((v) => !v)}>
            <Filter className="mr-1 h-4 w-4" />
            Фильтры
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Фильтры</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Исполнитель</Label>
              <Input
                value={filters.executor || ""}
                onChange={(e) => setFilters((f) => ({ ...f, executor: e.target.value || undefined }))}
                placeholder="ФИО"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Вид работ</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm mt-1 appearance-none"
                value={filters.workTypeId || ""}
                onChange={(e) => setFilters((f) => ({ ...f, workTypeId: e.target.value || undefined }))}
              >
                <option value="">Все</option>
                {workTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">С даты</Label>
                <Input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value || undefined }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">По дату</Label>
                <Input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value || undefined }))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" onClick={applyFilters} className="w-full">
              Применить
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({});
                setSearch("");
              }}
              className="w-full"
            >
              Сбросить
            </Button>
          </div>
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Записи не найдены. Нажмите «Добавить» чтобы создать первую запись.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <SortHeader field="date" sort={sort} order={order} onSort={toggleSort}>
                    Дата
                  </SortHeader>
                  <SortHeader field="workType" sort={sort} order={order} onSort={toggleSort}>
                    Вид работ
                  </SortHeader>
                  <SortHeader field="volume" sort={sort} order={order} onSort={toggleSort}>
                    Объём
                  </SortHeader>
                  <SortHeader field="executor" sort={sort} order={order} onSort={toggleSort}>
                    Исполнитель
                  </SortHeader>
                  <th className="px-4 py-3 text-right font-medium w-[120px]">Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <DesktopRow key={item.id} item={item} onEdit={openEdit} onDelete={setDeleteId} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-2">
            {items.map((item) => (
              <MobileCard key={item.id} item={item} onEdit={openEdit} onDelete={setDeleteId} />
            ))}
          </div>
        </>
      )}

      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Редактировать запись" : "Новая запись"}
        description={editing ? "Измените данные записи." : "Заполните поля для новой записи в журнале."}
        submitLabel={editing ? "Сохранить" : "Создать"}
        isSubmitting={submitting}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Дата выполнения</Label>
            <div className="relative mt-1">
              <Input id="date" type="date" {...register("date")} className="pr-10" />
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="workTypeId">Вид работ</Label>
            <select
              id="workTypeId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm mt-1 appearance-none"
              {...register("workTypeId")}
            >
              <option value="">Выберите...</option>
              {workTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.workTypeId && <p className="mt-1 text-xs text-destructive">{errors.workTypeId.message}</p>}
          </div>
          <div>
            <Label htmlFor="volume">Объём</Label>
            <Input id="volume" placeholder="24" {...register("volume")} className="mt-1" />
            {errors.volume && <p className="mt-1 text-xs text-destructive">{errors.volume.message}</p>}
          </div>
          <div>
            <Label htmlFor="executor">Исполнитель</Label>
            <Input id="executor" placeholder="Иванов И.И." {...register("executor")} className="mt-1" />
            {errors.executor && <p className="mt-1 text-xs text-destructive">{errors.executor.message}</p>}
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Подтвердите удаление"
        description="Удалить запись из журнала? Это действие нельзя отменить."
        confirmLabel="Удалить"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
        isSubmitting={submitting}
      />
    </div>
  );
}