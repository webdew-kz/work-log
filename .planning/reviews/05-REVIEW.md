# Code Review — Phase 5: Frontend — Журнал работ

## 🔴 Critical

- **Potential double-load on mount**: `useEffect([load])` with `load` as `useCallback` dependency. `search` is in state but `load` only depends on `search`/`filters`/`sort`/`order`. However, if user types in search and presses Enter, `load()` is called, which is fine. But the `useEffect` also fires on every search/filter change — this is intentional for auto-reload on sort/order change. However, typing in search box without pressing Enter does NOT trigger load (good — debounce missing is a minor issue). Actually: `load` is a `useCallback` with `[search, filters, sort, order]` deps, and `useEffect([load])` fires whenever those change. This means changing search text triggers immediate reload — acceptable for local dev but may cause rapid API calls in production. Consider debounce (300ms).

## 🟡 High

- **No debounce on search input**: User typing "бетон" will trigger 5 API calls (б, бе, бет, беto, бетон). Should debounce `load()` by ~300ms.
- **Missing `workTypeId` validation in filter dropdown**: If a work type is deleted while the filter is active, the filter shows an invalid `workTypeId`. Filter dropdown should refresh work types independently.
- **Date format in table**: `new Date(item.date).toLocaleDateString("ru-RU")` — if `item.date` is invalid, this shows "Invalid Date". Should handle parse errors gracefully.
- **Zod validation missing max length**: Same as Phase 4 — `volume`, `executor` have no max length. Could hit DB limits.

## 🟢 Medium

- **Filter panel state resets on tab switch**: If user switches to WorkTypes and back, filters are preserved (stored in component state) but this is not persisted across page reloads.
- **Missing responsive table design**: On narrow screens, the table overflows horizontally without a scroll container. Should wrap in `overflow-x-auto`.
- **Sort icons do not show active direction**: `ArrowUpDown` icon is static; does not indicate whether current sort is asc/desc.
- **Dialog focus trap missing**: Tab navigation can escape the modal and focus elements behind it.

## ℹ️ Info

- Filter composition UI is clean and intuitive.
- `SortHeader` component is a nice abstraction.
- Including `workTypes` in the same `load` call reduces waterfall requests.