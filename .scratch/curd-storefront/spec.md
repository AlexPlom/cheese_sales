# CURD. Cheese Shop Prototype Specification

## Purpose

Present a credible selection of familiar cheeses through a distinctive Bulgarian-language design prototype. The prototype demonstrates selection and checkout but does not submit orders or process payment.

## Products

- **Бяло саламурено:** 400 g for EUR 6.
- **Кашкавал Витоша:** 350 g for EUR 8.
- **Гауда:** 300 g for EUR 7.
- **Зрял чедър:** 250 g for EUR 9.
- Quantities range from zero to ten units per product.
- Product copy must not imply unverified origin, weight, ingredients, taste, nutrition, certification, process, or health benefits.

## Journey

The single-page journey moves through hero, product catalog, delivery explanation, persistent cart, editable cart drawer, one-step demo checkout, and simulated completion. Checkout collects a name, Bulgarian phone number, delivery address, delivery window, and optional note.

## Pricing

There is no minimum order. Delivery costs EUR 2 below a EUR 25 subtotal and is free at or above EUR 25.

## Presentation

Use Bulgarian copy and euro prices. The visual language is editorial neo-brutalism: oversized condensed type, mono utility text, hard borders, warm paper, charcoal, acid lime, orange, geometric cheese forms, WebGL color fields, and layered parallax. Motion is progressively enhanced and respects `prefers-reduced-motion`.

## Safety Boundary

Every checkout stage identifies the experience as a demo. Completion sends and stores no customer data. Real commerce, payment, accounts, business registration, food compliance, and delivery operations are outside this specification.

## Acceptance

- Works across desktop and mobile layouts.
- Product quantities and totals update immediately.
- Delivery pricing follows the stated threshold.
- Checkout blocks missing or invalid required information.
- Entered checkout data remains while returning to the cart.
- Completion clearly states that no order or payment occurred.
