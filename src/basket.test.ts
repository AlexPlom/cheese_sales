import { describe, expect, it } from 'vitest'
import { catalog, createBasket, quantityInBasket, setBasketQuantity } from './basket'

describe('Basket', () => {
  it('provides complete selected lines and charges delivery below EUR 25', () => {
    const basket = setBasketQuantity(createBasket(), 'gouda', 2)

    expect(basket.lines).toEqual([{ product: { id: 'gouda', name: catalog[2].name, price: 7 }, quantity: 2, total: 14 }])
    expect(basket.count).toBe(2)
    expect(basket.subtotal).toBe(14)
    expect(basket.delivery).toBe(2)
    expect(basket.total).toBe(16)
    expect(basket.freeDelivery).toEqual({ qualified: false, remaining: 11 })
  })

  it('qualifies a mixed Basket for free delivery at exactly EUR 25', () => {
    const withCheddar = setBasketQuantity(createBasket(), 'cheddar', 2)
    const basket = setBasketQuantity(withCheddar, 'gouda', 1)

    expect(basket.subtotal).toBe(25)
    expect(basket.delivery).toBe(0)
    expect(basket.total).toBe(25)
    expect(basket.freeDelivery).toEqual({ qualified: true, remaining: 0 })
  })

  it('clamps quantities without changing the prior Basket', () => {
    const original = setBasketQuantity(createBasket(), 'white', 3)
    const aboveMaximum = setBasketQuantity(original, 'white', 11)
    const belowMinimum = setBasketQuantity(aboveMaximum, 'white', -1)

    expect(quantityInBasket(original, 'white')).toBe(3)
    expect(quantityInBasket(aboveMaximum, 'white')).toBe(10)
    expect(belowMinimum.lines).toEqual([])
    expect(belowMinimum.total).toBe(0)
  })

  it('normalizes fractional quantities and ignores non-finite values', () => {
    const original = setBasketQuantity(createBasket(), 'white', 2)
    const fractional = setBasketQuantity(original, 'white', 3.8)
    const notANumber = setBasketQuantity(fractional, 'white', Number.NaN)

    expect(quantityInBasket(fractional, 'white')).toBe(3)
    expect(quantityInBasket(notANumber, 'white')).toBe(3)
  })
})
