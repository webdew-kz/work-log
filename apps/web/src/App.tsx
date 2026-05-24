import { useState } from "react";
import { WorkLogsPage } from "@/components/work-logs/WorkLogsPage";
import { WorkTypesPage } from "@/components/work-types/WorkTypesPage";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { HardHat } from "lucide-react";

function App() {
  const [tab, setTab] = useState<"logs" | "types">("logs");

  return (
    <div className="min-h-screen bg-background px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-5xl">
        <div className="relative text-center mb-6 sm:mb-8">
          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <HardHat className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Журнал работ
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Учёт выполненных работ на строительном объекте
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="inline-flex rounded-lg border bg-card overflow-hidden">
            <button
              className={`px-5 sm:px-6 py-2.5 text-sm sm:text-base font-medium transition-colors ${
                tab === "logs"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => setTab("logs")}
            >
              Журнал работ
            </button>
            <div className="w-px bg-border" />
            <button
              className={`px-5 sm:px-6 py-2.5 text-sm sm:text-base font-medium transition-colors ${
                tab === "types"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => setTab("types")}
            >
              Справочник
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-3 sm:p-6 text-card-foreground">
          {tab === "logs" ? <WorkLogsPage /> : <WorkTypesPage />}
        </div>
      </div>
    </div>
  );
}

export default App;