export function readVisiblePage() {
  const root = document.querySelector('[data-assistant-page]');
  if (!(root instanceof HTMLElement)) return '';
  const fragments: string[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!parent || parent.closest('[aria-hidden="true"], [hidden], script, style, [data-private], [data-assistant-panel]')) continue;
    if (parent.getClientRects().length === 0 || getComputedStyle(parent).visibility === 'hidden') continue;
    const text = node.textContent?.trim();
    if (text) fragments.push(text);
  }
  for (const input of root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input:not([type="password"]):not([type="hidden"]),textarea,select')) {
    if (input.getClientRects().length && !input.closest('[data-private], [aria-hidden="true"]')) fragments.push(`${input.getAttribute('aria-label') ?? input.getAttribute('placeholder') ?? 'Campo'}: ${input.value}`);
  }
  return fragments.join('\n').slice(0, 60000);
}