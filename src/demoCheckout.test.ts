import { describe, expect, it } from 'vitest'
import { createBasket, setBasketQuantity } from './basket'
import { createDemoCheckout, transitionDemoCheckout } from './demoCheckout'

const basket = setBasketQuantity(createBasket(), 'gouda', 1)

const validDetails = {
  name: 'Иван Иванов',
  phone: '0888 123 456',
  address: 'ул. Хаджи Димитър 1',
  window: '10:00–13:00',
  note: '',
}

const enterDetails = () => {
  let checkout = transitionDemoCheckout(createDemoCheckout(), { type: 'advance' }, basket).checkout
  for (const [field, value] of Object.entries(validDetails)) {
    checkout = transitionDemoCheckout(checkout, { type: 'editDetails', field: field as keyof typeof validDetails, value }, basket).checkout
  }
  return checkout
}

describe('Demo Checkout', () => {
  it('retains Delivery Details while moving backward and forward', () => {
    let checkout = transitionDemoCheckout(createDemoCheckout(), { type: 'advance' }, basket).checkout
    checkout = transitionDemoCheckout(checkout, { type: 'editDetails', field: 'name', value: 'Иван Иванов' }, basket).checkout
    checkout = transitionDemoCheckout(checkout, { type: 'back' }, basket).checkout
    checkout = transitionDemoCheckout(checkout, { type: 'advance' }, basket).checkout

    expect(checkout).toMatchObject({ stage: 'details', details: { name: 'Иван Иванов' } })
  })

  it('rejects invalid Delivery Details with field-specific failures', () => {
    let checkout = transitionDemoCheckout(createDemoCheckout(), { type: 'advance' }, basket).checkout
    checkout = transitionDemoCheckout(checkout, { type: 'editDetails', field: 'name', value: 'И' }, basket).checkout
    checkout = transitionDemoCheckout(checkout, { type: 'editDetails', field: 'phone', value: '123' }, basket).checkout
    checkout = transitionDemoCheckout(checkout, { type: 'editDetails', field: 'address', value: 'ул.' }, basket).checkout

    const outcome = transitionDemoCheckout(checkout, { type: 'advance' }, basket)

    expect(outcome.checkout.stage).toBe('details')
    expect(outcome.failures).toEqual({ name: 'invalid', phone: 'invalid', address: 'invalid', window: 'required' })
  })

  it('returns to Basket review if the live Basket becomes empty', () => {
    const outcome = transitionDemoCheckout(enterDetails(), { type: 'basketChanged' }, createBasket())

    expect(outcome.checkout).toMatchObject({ stage: 'basket', details: validDetails })
  })

  it('cannot advance with an empty live Basket even without a reconciliation action', () => {
    const outcome = transitionDemoCheckout(enterDetails(), { type: 'advance' }, createBasket())

    expect(outcome.checkout).toMatchObject({ stage: 'basket', details: validDetails })
  })

  it('discards Delivery Details immediately on completion', () => {
    const review = transitionDemoCheckout(enterDetails(), { type: 'advance' }, basket).checkout
    const outcome = transitionDemoCheckout(review, { type: 'advance' }, basket)

    expect(outcome.checkout).toEqual({ stage: 'complete' })
  })

  it('starts fresh and requests Basket clearing on return to the storefront', () => {
    const review = transitionDemoCheckout(enterDetails(), { type: 'advance' }, basket).checkout
    const complete = transitionDemoCheckout(review, { type: 'advance' }, basket).checkout
    const outcome = transitionDemoCheckout(complete, { type: 'returnToStorefront' }, basket)

    expect(outcome.checkout).toEqual(createDemoCheckout())
    expect(outcome.clearBasket).toBe(true)
  })
})
