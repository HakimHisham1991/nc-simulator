console.log('✅ loaded: ' + new URL(import.meta.url).pathname.split('/').pop());

let isSyncing = false;
let observer = null;

export function updateLineNumbers() {
  const contentDiv = document.getElementById('contentDiv');
  const lineNumbersDiv = document.getElementById('lineNumbers');
  if (!contentDiv || !lineNumbersDiv) return;

  // Get line count
  const lines = contentDiv.textContent.split('\n');
  const lineCount = lines.length;

  // Generate line numbers
  let html = '';
  for (let i = 1; i <= lineCount; i++) {
    html += `<div class="line-number">${i}</div>`;
  }
  lineNumbersDiv.innerHTML = html;

  // Match heights exactly
  lineNumbersDiv.style.height = `${contentDiv.scrollHeight}px`;
}

function syncScroll(source, target) {
  if (isSyncing) return;
  isSyncing = true;
  
  // Direct pixel-perfect sync
  target.scrollTop = source.scrollTop;
  
  // Use setTimeout to break potential sync loops
  setTimeout(() => { isSyncing = false; }, 0);
}

export function initLineNumbers() {
  const contentDiv = document.getElementById('contentDiv');
  const lineNumbersDiv = document.getElementById('lineNumbers');
  if (!contentDiv || !lineNumbersDiv) return;

  // Initial setup
  updateLineNumbers();

  // Mutation observer for content changes
  observer = new MutationObserver(() => {
    updateLineNumbers();
    syncScroll(contentDiv, lineNumbersDiv);
  });
  observer.observe(contentDiv, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Scroll event - direct sync
  contentDiv.addEventListener('scroll', () => {
    syncScroll(contentDiv, lineNumbersDiv);
  });

  // Handle wheel events on line numbers
  lineNumbersDiv.addEventListener('wheel', (e) => {
    contentDiv.scrollTop += e.deltaY;
    e.preventDefault();
  });

  // Resize observer
  new ResizeObserver(() => {
    updateLineNumbers();
    syncScroll(contentDiv, lineNumbersDiv);
  }).observe(contentDiv);
}