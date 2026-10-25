# Architecture rules

- Store free content-grid pages as a JSON workbook per calendar event in `grades_livres`; keep structured moments and VPNeg sales separate so custom editing never changes commercial records implicitly.
- Use react-spreadsheet for cell navigation, selection, clipboard and formula evaluation; workbook operations are pure helpers with focused tests so custom pages remain independent.