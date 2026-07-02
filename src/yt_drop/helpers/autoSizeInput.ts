export function autoSizeInput(element: HTMLInputElement | HTMLTextAreaElement) {
  const el = element;
  if (!el) return;

  el.addEventListener("input", () => {
    el.style.height = el.scrollHeight + "px";
  });

  el.addEventListener("blur", () => {
    if (el.value === '') {
      el.style.height = 70 + "px";
    }
  });

  el.addEventListener("paste", () => {
    el.style.height = el.scrollHeight + "px";
  });
}