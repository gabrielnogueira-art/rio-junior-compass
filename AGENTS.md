# Architecture rules

- Store free content-grid pages as a JSON workbook per calendar event in `grades_livres`; keep structured moments and VPNeg sales separate so custom editing never changes commercial records implicitly.
- Use react-spreadsheet for cell navigation, selection, clipboard and formula evaluation; workbook operations are pure helpers with focused tests so custom pages remain independent.
- Author remote MCP tools in src/lib/mcp with the SDK Vite plugin; require verified OAuth and a server-read approved profile before caller-scoped queries to preserve approval independently of permissive legacy RLS.
- Keep browser agent tools in the component owning visible controls and wrap executions with the shared fail-open telemetry helper; browser actions must retain the same validation and permissions as UI actions.
- Validate local OAuth return paths once at login and preserve consent through every sign-in and signup method so delegated authorization can resume safely.