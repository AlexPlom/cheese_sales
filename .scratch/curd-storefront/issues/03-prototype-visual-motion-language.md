# Prototype the Visual and Motion Language

Type: `prototype`
Status: `resolved`
Blocked by: 01, 02

## Question

Which concrete combination of neo-brutalist layout, typography, restrained color, traditional imagery, responsive behavior, and reduced-motion fallbacks best expresses CURD. while keeping shopping usable?

## Answer

Use a clean editorial neo-brutalist system with hard two-pixel borders, oversized condensed display type, utilitarian mono labels, restrained acid-lime and orange accents, warm paper, charcoal fields, and traditional cheese photography. Keep motion to a ticker, subtle image hover, and the functional sliding cart.

The layout collapses from split-screen hero, paired product cards, and three-column delivery information into a single mobile flow. All looping animation and transitions are effectively disabled under `prefers-reduced-motion` while product selection and checkout remain usable.

## Comments

Implemented in `src/App.tsx` and `src/styles.css` under the user's instruction to continue autonomously.
