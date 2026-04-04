- use Bun for the project
- use Tailwind CSS for styling
- frontend performance principle:
  keep high-frequency state updates scoped to the smallest necessary subtree, and isolate expensive UI subtrees from unrelated updates
- prefer this order:
  first remove unnecessary re-renders with state placement, component boundaries, or memoization; then consider virtualization or heavier optimizations if rendering is still expensive
- when analyzing rendering performance:
  optimize update paths before optimizing component internals; focus on which state changes cause which subtrees to re-render
