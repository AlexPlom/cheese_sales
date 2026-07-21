# PIKO Storefront Prototype Specification

## Purpose

Present two affordable cheese products to budget-conscious adults in Sliven through a distinctive Bulgarian-language design prototype. The prototype demonstrates selection and checkout but does not submit orders or process payment.

## Products

- **Обикновено сирене:** one predefined unit for EUR 5.
- **Crystal сирене:** one predefined unit for EUR 10.
- Quantities range from zero to ten units per product.
- Product copy must not imply unverified origin, weight, ingredients, taste, nutrition, certification, process, or health benefits.

## Journey

The single-page journey moves through hero, product comparison, delivery explanation, persistent cart, editable cart drawer, one-step demo checkout, and simulated completion. Checkout collects a name, Bulgarian phone number, Sliven address, next-day delivery window, and optional note.

## Pricing

There is no minimum order. Delivery costs EUR 2 below a EUR 20 subtotal and is free at or above EUR 20.

## Presentation

Use Bulgarian copy and euro prices. The visual language is editorial neo-brutalism: oversized condensed type, mono utility text, hard borders, warm paper, charcoal, acid lime, orange, geometric cheese forms, and an iridescent Crystal treatment. Motion is progressively enhanced and respects `prefers-reduced-motion`.

## Safety Boundary

Every checkout stage identifies the experience as a demo. Completion sends and stores no customer data. Real commerce, payment, accounts, business registration, food compliance, and delivery operations are outside this specification.

## Acceptance

- Works across desktop and mobile layouts.
- Product quantities and totals update immediately.
- Delivery pricing follows the stated threshold.
- Checkout blocks missing or invalid required information.
- Entered checkout data remains while returning to the cart.
- Completion clearly states that no order or payment occurred.
