# Code Review — Phase 4: Frontend — Справочник видов работ

## 🔴 Critical

- **Missing `key` prop on table rows**: `items.map((item) => <tr key={item.id} ...)` — actually correct, `key` is present. ✓
- **No error boundary**: Unhandled React errors will crash the entire app, not just this page.

## 🟡 High

- **Zod schema only checks `min(1)` but not max length**: Backend has `@MinLength(1)` but no max. A very long name could be sent and accepted by frontend but rejected by DB VARCHAR limit (default 191/255 depending on DB version). Should add `.max(100)` to match business expectations.
- **Error state is global to page**: `setError` shows at top of page but does not auto-dismiss. User must click «Скрыть» manually. Toast auto-dismiss after 5s would be better UX.
- **No loading state on table body**: `loading && items.length === 0` shows spinner, but if items exist and user triggers reload, there is no visual feedback.

## 🟢 Medium

- **Missing focus management**: After closing dialog, focus should return to the trigger button. Currently focus is lost.
- **Dialog has no escape key handler**: Pressing Escape does not close dialog. Should add `useEffect` keydown listener.
- **Dialog overlay click does not close**: Clicking outside dialog overlay should close it.
- **No empty state illustration**: Could benefit from a simple illustration or icon for empty state.

## ℹ️ Info

- `useCallback` with `load` dependency array is correct.
- React Hook Form + Zod integration is clean.
- `workTypesApi` is well-abstracted.