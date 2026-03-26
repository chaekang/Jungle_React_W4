/**
 * Owner: Role 3 - Playground UI
 * Editable only by the Role 3 branch.
 */

export function createAppShell() {
  return `
    <main class="playground-shell" aria-label="Virtual DOM Diff Playground">
      <header class="playground-hero">
        <h1>Virtual DOM Diff Playground</h1>
        <p class="playground-description">
          테스트 영역에서 마크업을 수정하고 Patch를 눌러 실제 영역에 변경 사항이 어떻게 반영되는지 확인해 보세요.
        </p>
      </header>

      <section class="playground-controls" aria-label="Playground controls">
        <div class="playground-actions">
          <button type="button" class="action-button action-button--primary" data-action="patch">Patch</button>
          <button type="button" class="action-button" data-action="undo">되돌리기</button>
          <button type="button" class="action-button" data-action="redo">다시하기</button>
        </div>
        <output class="history-status" data-status="history" aria-live="polite">1 / 1</output>
      </section>

      <section class="surface-grid" aria-label="Playground surfaces">
        <article class="surface-card surface-card--actual">
          <div class="surface-card__header">
            <p class="surface-card__eyebrow">Actual Surface</p>
            <h2>실제 영역</h2>
          </div>
          <div class="surface-card__body" data-surface="actual"></div>
        </article>

        <article class="surface-card surface-card--test">
          <div class="surface-card__header">
            <p class="surface-card__eyebrow">Test Surface</p>
            <h2>테스트 영역</h2>
          </div>
          <textarea
            class="surface-card__source"
            data-surface="test"
            spellcheck="false"
            aria-hidden="true"
            tabindex="-1"
          ></textarea>
          <div
            class="surface-card__body surface-card__body--editable"
            data-surface-preview="test"
            contenteditable="true"
            spellcheck="false"
          ></div>
        </article>
      </section>
    </main>
  `.trim();
}
