import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { workTypesApi, type WorkType } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { FormDialog } from "@/components/shared/FormDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Plus, Pencil, Trash2, Loader2, Wrench } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Название обязательно").max(100, "Максимум 100 символов"),
});

type FormData = z.infer<typeof formSchema>;

interface DesktopRowProps {
  item: WorkType;
  onEdit: (item: WorkType) => void;
  onDelete: (id: string) => void;
}

function DesktopRow({ item, onEdit, onDelete }: DesktopRowProps) {
  return (
    <tr className="border-b last:border-0 hover:bg-muted/40">
      <td className="px-4 py-3">{item.name}</td>
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
}

export function WorkTypesPage() {
  const [items, setItems] = useState<WorkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorkType | null>(null);
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
      const data = await workTypesApi.list();
      setItems(data);
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    reset({ name: "" });
    setDialogOpen(true);
  };

  const openEdit = (item: WorkType) => {
    setEditing(item);
    setValue("name", item.name);
    setDialogOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await workTypesApi.update(editing.id, data);
      } else {
        await workTypesApi.create(data);
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
      await workTypesApi.remove(deleteId);
      setDeleteId(null);
      await load();
    } catch (e: any) {
      setError(e.message || "Ошибка удаления");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="hidden sm:flex items-center justify-between">
        <h2 className="text-lg font-semibold">Виды работ</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Добавить
        </Button>
      </div>

      <div className="sm:hidden">
        <Button onClick={openCreate} className="w-full">
          <Plus className="mr-1 h-4 w-4" />
          Добавить
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Виды работ не добавлены. Нажмите «Добавить» чтобы создать первую запись.
        </div>
      ) : (
        <>
          <div className="hidden sm:block overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Название</th>
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

          <div className="sm:hidden space-y-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-lg border bg-card p-3 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(item.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <FormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Редактировать вид работ" : "Новый вид работ"}
        description={editing ? "Измените название вида работ." : "Введите название нового вида работ."}
        submitLabel={editing ? "Сохранить" : "Создать"}
        isSubmitting={submitting}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Label htmlFor="name">Название</Label>
          <Input id="name" {...register("name")} className="mt-1" />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
      </FormDialog>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Подтвердите удаление"
        description="Удалить вид работ? Это невозможно, если он используется в журнале."
        confirmLabel="Удалить"
        confirmVariant="destructive"
        onConfirm={confirmDelete}
        isSubmitting={submitting}
      />
    </div>
  );
}