# Prototype the Visual and Motion Language

Type: `prototype`
Status: `resolved`
Blocked by: 01, 02

## Question

Which concrete combination of neo-brutalist layout, typography, color, shader treatment, transitions, responsive behavior, and reduced-motion fallbacks best expresses the PIKO “Sliven night market” direction while keeping shopping usable?

## Answer

Use an editorial neo-brutalist system with hard two-pixel borders, oversized condensed display type, utilitarian mono labels, acid-lime and orange accents, warm paper, and charcoal fields. Regular Cheese uses solid yellow geometry; Crystal Cheese uses an iridescent conic-gradient crystal. A floating cheese block, orbit lines, ticker, product hover transforms, and sliding cart provide motion, while CSS-generated texture supplies depth without media assets.

The layout collapses from split-screen hero, paired product cards, and three-column delivery information into a single mobile flow. All looping animation and transitions are effectively disabled under `prefers-reduced-motion` while product selection and checkout remain usable.

## Comments

Implemented in `src/App.tsx` and `src/styles.css` under the user's instruction to continue autonomously.
