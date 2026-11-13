import { useEffect, useMemo, useRef, useState } from "preact/hooks";

import loadSearchIndex from "./load-search-index.ts";
import createNoteFinder, { type NoteFinder } from "./create-note-finder.ts";

import type { JSX } from "preact";
import type { SearchDocument } from "../../../app/notes/search-document.ts";

/**
 * Where the search index stands, once the reader has opened search.
 */
type IndexState = IdleIndex | LoadingIndex | ReadyIndex | FailedIndex;

/**
 * Search has not been opened yet, so nothing has been fetched.
 */
interface IdleIndex {
  /**
   * The state's name.
   */
  readonly status: "idle";
}

/**
 * The index is on its way.
 */
interface LoadingIndex {
  /**
   * The state's name.
   */
  readonly status: "loading";
}

/**
 * The index has arrived and can be searched.
 */
interface ReadyIndex {
  /**
   * The state's name.
   */
  readonly status: "ready";

  /**
   * Searches the loaded index.
   */
  readonly finder: NoteFinder;
}

/**
 * The index could not be fetched. Opening search again retries.
 */
interface FailedIndex {
  /**
   * The state's name.
   */
  readonly status: "failed";
}

/**
 * How much of a note's text a result shows.
 */
const SNIPPET_LENGTH = 140;

/**
 * The search button and its dialog. ⌘K, Ctrl+K or `/` opens it; arrows move through results,
 * Enter opens one and Escape closes. The index loads the first time the dialog opens.
 *
 * @returns The search button, and the dialog while open.
 */
export default function Search(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indexState, setIndexState] = useState<IndexState>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => (indexState.status === "ready" ? indexState.finder.find(query) : []),
    [indexState, query],
  );

  /**
   * Close the dialog and forget the query.
   */
  const close = (): void => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  };

  useEffect(() => {
    /**
     * Open on ⌘K, Ctrl+K, or `/` outside a text field.
     *
     * @param event The key press.
     */
    const handleShortcut = (event: KeyboardEvent): void => {
      const isModifierK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isSlash = event.key === "/" && !isTyping(event.target);

      if (!isModifierK && !isSlash) {
        return;
      }

      event.preventDefault();
      setIsOpen(true);
    };

    document.addEventListener("keydown", handleShortcut);

    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();

    if (indexState.status !== "idle" && indexState.status !== "failed") {
      return;
    }

    setIndexState({ status: "loading" });

    loadSearchIndex()
      .then((documents) => setIndexState({ status: "ready", finder: createNoteFinder(documents) }))
      .catch(() => setIndexState({ status: "failed" }));
  }, [isOpen]);

  /**
   * Move through the results, open one, or close the dialog.
   *
   * @param event The key press inside the dialog.
   */
  const handleDialogKeys = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      close();

      return;
    }

    if (results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      const step = event.key === "ArrowDown" ? 1 : -1;

      setSelectedIndex((current) => (current + step + results.length) % results.length);

      return;
    }

    const selected = results[selectedIndex];

    if (event.key === "Enter" && selected) {
      event.preventDefault();
      window.location.assign(selected.url);
    }
  };

  return (
    <>
      <button
        type="button"
        class="search-button"
        aria-label="Search notes"
        title="Search notes"
        onClick={() => setIsOpen(true)}
      >
        ⌘K
      </button>

      {isOpen && (
        <div class="search-backdrop" onClick={close}>
          <div
            class="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Search notes"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleDialogKeys}
          >
            <input
              ref={inputRef}
              type="search"
              class="search-input"
              placeholder="Search notes, or #tag"
              aria-label="Search notes"
              value={query}
              onInput={(event) => {
                setQuery(event.currentTarget.value);
                setSelectedIndex(0);
              }}
            />

            <SearchStatus indexState={indexState} query={query} resultCount={results.length} />

            {results.length > 0 && (
              <ol class="search-results">
                {results.map((result, index) => (
                  <SearchResult
                    key={result.url}
                    document={result}
                    isSelected={index === selectedIndex}
                    onHover={() => setSelectedIndex(index)}
                  />
                ))}
              </ol>
            )}

            <footer class="search-footer">
              <span>↑↓ move</span>
              <span>↵ open</span>
              <span>esc close</span>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * The properties of {@link SearchStatus}.
 */
interface SearchStatusProps {
  /**
   * Where the index stands.
   */
  readonly indexState: IndexState;

  /**
   * What the reader typed.
   */
  readonly query: string;

  /**
   * How many results the query found.
   */
  readonly resultCount: number;
}

/**
 * A one-line message when there are no results to show: loading, failed, or nothing found.
 *
 * @param props The index state, query and result count.
 *
 * @returns The message, or nothing.
 */
function SearchStatus(props: SearchStatusProps): JSX.Element | null {
  if (props.indexState.status === "loading") {
    return <p class="search-status">Loading notes…</p>;
  }

  if (props.indexState.status === "failed") {
    return <p class="search-status">Search is unavailable right now. Close it and try again.</p>;
  }

  if (props.query.trim() !== "" && props.resultCount === 0) {
    return <p class="search-status">Nothing matches “{props.query.trim()}”.</p>;
  }

  return null;
}

/**
 * The properties of {@link SearchResult}.
 */
interface SearchResultProps {
  /**
   * The matching note.
   */
  readonly document: SearchDocument;

  /**
   * Whether the keyboard selection is on this result.
   */
  readonly isSelected: boolean;

  /**
   * Called when the pointer moves over the result.
   */
  readonly onHover: () => void;
}

/**
 * One result: the note's title, day, tags and the start of its text.
 *
 * @param props The note and its selection state.
 *
 * @returns The result row.
 */
function SearchResult(props: SearchResultProps): JSX.Element {
  const { document } = props;

  return (
    <li>
      <a
        href={document.url}
        class={props.isSelected ? "search-result selected" : "search-result"}
        aria-current={props.isSelected ? "true" : undefined}
        onMouseEnter={props.onHover}
      >
        <span class="search-result-title">{document.title}</span>
        <span class="search-result-meta">
          {document.date}{" "}
          <span class="search-result-tags">{document.tags.map((tag) => `#${tag}`).join(" ")}</span>
        </span>
        <span class="search-result-snippet">{snippetOf(document.text)}</span>
      </a>
    </li>
  );
}

/**
 * The start of a note's text, cut at a word where it runs long.
 *
 * @param text The note's plain text.
 *
 * @returns The snippet.
 */
function snippetOf(text: string): string {
  if (text.length <= SNIPPET_LENGTH) {
    return text;
  }

  const cut = text.slice(0, SNIPPET_LENGTH);

  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * Whether a key press landed in a text field, where `/` is just a character.
 *
 * @param target The element the key press was sent to.
 *
 * @returns True inside inputs, text areas and editable content.
 */
function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}
