import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";

const deck = new Reveal({
  plugins: [Markdown, RevealNotes, RevealHighlight],
});

deck.initialize({
  controls: false,
  progress: false,
  navigationMode: "linear",
  transition: "none",
});
