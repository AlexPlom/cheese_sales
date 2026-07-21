# Chart the CURD. Storefront Experience

Label: `wayfinder:map`

## Destination

An implementation-ready Bulgarian design specification and interactive prototype for CURD., presenting familiar cheese varieties through a responsive neo-brutalist storefront with progressive shaders and motion, a demo cart and checkout, and no real order submission.

## Notes

- Consult `/grilling`, `/domain-modeling`, and `/prototype` while resolving relevant tickets.
- Target Customer: budget-conscious adults buying affordable cheese for everyday meals.
- Bulgarian language and euro pricing.
- The catalog contains White Brined Cheese, Kashkaval Vitosha, Gouda, and Mature Cheddar in predefined packages.
- The eventual service concept has no minimum order, a EUR 2 delivery fee waived at EUR 20, next-day delivery windows, and seller-managed stock.
- Visual direction: psychedelic editorial neo-brutalism using charcoal, warm cream, acid color, WebGL fields, and bold condensed typography.
- Motion is progressively enhanced, simplifies on low-powered devices, and respects `prefers-reduced-motion`.
- This map plans and prototypes the experience; it does not launch real commerce.

## Decisions so far

- [Define the Storefront Journey](issues/01-define-storefront-journey.md) — Use one continuous storefront from hero and two-product comparison through cart, one-step demo checkout, review, and simulated completion.
- [Define Truthful Product Presentation](issues/02-define-product-presentation.md) — Differentiate the two fixed demo products by name, price, intended role, and visual treatment while avoiding unsupported food claims.
- [Prototype the Visual and Motion Language](issues/03-prototype-visual-motion-language.md) — Use an editorial neo-brutalist system with acid color, hard borders, geometric cheese forms, progressive motion, and reduced-motion fallbacks.
- [Prototype the Complete Demo Storefront](issues/04-prototype-complete-demo-flow.md) — The responsive prototype now covers selection, cart pricing, validated demo checkout, and simulated completion without real commerce.

## Not yet specified

## Out of scope

- Business registration, food-sale compliance, production, storage, and delivery operations.
- Real payment processing, order submission, customer accounts, and production infrastructure.
- Localization beyond Bulgarian.
