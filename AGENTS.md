# Architecture rules

- Store free content-grid pages as a JSON workbook per calendar event in `grades_livres`; keep structured moments and VPNeg sales separate so custom editing never changes commercial records implicitly.
- Use react-spreadsheet for cell navigation, selection, clipboard and formula evaluation; workbook operations are pure helpers with focused tests so custom pages remain independent.
- Author remote MCP tools in src/lib/mcp with the SDK Vite plugin; require verified OAuth and a server-read approved profile before caller-scoped queries to preserve approval independently of permissive legacy RLS.
- Keep browser agent tools in the component owning visible controls and wrap executions with the shared fail-open telemetry helper; browser actions must retain the same validation and permissions as UI actions.
- Validate local OAuth return paths once at login and preserve consent through every sign-in and signup method so delegated authorization can resume safely.
- Keep the single AI conversation user-owned in ai_conversations, using caller-scoped auth and approved-user RLS; stream through the AI SDK and retain complete server-held history across pages and devices.
- The assistant reads only rendered page content and proposes financial imports; explicit human confirmation reuses the existing local movement service, never silently migrates browser-only finances or lets model tools mutate them.
- Derive financial summary changes against the bundled baseline with a tested cent-based delta; projections combine local income/expense movements and nonduplicate stored records without treating transfers as expenses.- Keep each assistant reply to a single model step with page content in the instructions and only recent history; multi-step tool follow-ups stalled at the AI gateway past the 150s function limit.
