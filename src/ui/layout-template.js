/**
 * Owner: Role 3 - Playground UI
 * Editable only by the Role 3 branch.
 */

export function createAppShell() {
  return `
    <main class="playground-shell" aria-label="Virtual DOM Diff Playground">
      <header class="playground-hero">
        <p class="playground-kicker">Role 3 Â· Playground UI</p>
        <h1>Virtual DOM Diff Playground</h1>
        <p class="playground-description">
          ?ŒìŠ¤???ì—­?ì„œ ë§ˆí¬?…ì„ ?˜ì •????Patchë¥??ŒëŸ¬ ?¤ì œ ?ì—­??ë³€ê²½ë¶„ë§?ë°˜ì˜?˜ëŠ” ?ë¦„??ê²€ì¦í•©?ˆë‹¤.
        </p>
      </header>

      <section class="playground-controls" aria-label="Playground controls">
        <div class="playground-actions">
          <button type="button" class="action-button action-button--primary" data-action="patch">Patch</button>
          <button type="button" class="action-button" data-action="undo">?¤ë¡œê°€ê¸?/button>
          <button type="button" class="action-button" data-action="redo">?ìœ¼ë¡œê?ê¸?/button>
        </div>
        <output class="history-status" data-status="history" aria-live="polite">1 / 1</output>
      </section>

      <section class="surface-grid" aria-label="Playground surfaces">
        <article class="surface-card surface-card--actual">
          <div class="surface-card__header">
            <p class="surface-card__eyebrow">Actual Surface</p>
            <h2>?¤ì œ ?ì—­</h2>
          </div>
          <div class="surface-card__body" data-surface="actual"></div>
        </article>

        <article class="surface-card surface-card--test">
          <div class="surface-card__header">
            <p class="surface-card__eyebrow">Test Surface</p>
            <h2>?ŒìŠ¤???ì—­</h2>
            <p class="surface-card__hint">?ìœ ë¡?²Œ ?´ìš©???˜ì •?˜ê³  Patch ?ë¦„???•ì¸?˜ì„¸??</p>
          </div>
          <textarea
            class="surface-card__body surface-card__body--editable"
            data-surface="test"
            spellcheck="false"
          ></textarea>
        </article>
      </section>
    </main>
  `.trim();
}
