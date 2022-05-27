## support css-modules, etc.

basic support possible (as style tags), not sure if they can easily be extracted to files using nx

## amp-mode, which warns on script tags and inlines styles:

by doing querySelector on the dom-nodes, everyone could easily do this.

## Timeouts

Just use the AbortController and a setTimeout().
