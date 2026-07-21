export type ProductId = 'white' | 'kashkaval' | 'gouda' | 'cheddar'

export type CheeseProduct = {
  readonly id: ProductId
  readonly name: string
  readonly price: number
  readonly eyebrow: string
  readonly description: string
  readonly image: string
}

export const catalog: readonly CheeseProduct[] = [
  { id: 'white', name: 'Бяло саламурено', price: 6, eyebrow: 'БЯЛО СИРЕНЕ / 400 Г', description: 'Класическа категория за салати, печива и ежедневната трапеза.', image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=900&q=85' },
  { id: 'kashkaval', name: 'Кашкавал Витоша', price: 8, eyebrow: 'КАШКАВАЛ / 350 Г', description: 'Популярна полутвърда категория за сандвичи, запичане и директно сервиране.', image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=85' },
  { id: 'gouda', name: 'Гауда', price: 7, eyebrow: 'ГАУДА / 300 Г', description: 'Разпознаваем избор за плато, сандвичи и топли ястия.', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=85' },
  { id: 'cheddar', name: 'Зрял чедър', price: 9, eyebrow: 'ЧЕДЪР / 250 Г', description: 'Позната категория за бургери, сосове и плато със сирена.', image: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?auto=format&fit=crop&w=900&q=85' },
]

export type BasketLine = {
  readonly product: Pick<CheeseProduct, 'id' | 'name' | 'price'>
  readonly quantity: number
  readonly total: number
}

const basketQuantities = Symbol('basketQuantities')

export type Basket = {
  readonly [basketQuantities]: Readonly<Record<ProductId, number>>
  readonly lines: readonly BasketLine[]
  readonly count: number
  readonly subtotal: number
  readonly delivery: number
  readonly total: number
  readonly freeDelivery: Readonly<{ qualified: boolean; remaining: number }>
}

const summarize = (quantities: Basket[typeof basketQuantities]): Basket => {
  const lines = catalog
    .filter((product) => quantities[product.id] > 0)
    .map((product) => ({
      product: { id: product.id, name: product.name, price: product.price },
      quantity: quantities[product.id],
      total: quantities[product.id] * product.price,
    }))
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0)
  const delivery = subtotal > 0 && subtotal < 25 ? 2 : 0

  return {
    [basketQuantities]: quantities,
    lines,
    count,
    subtotal,
    delivery,
    total: subtotal + delivery,
    freeDelivery: { qualified: subtotal >= 25, remaining: Math.max(0, 25 - subtotal) },
  }
}

export const createBasket = (): Basket => summarize({ white: 0, kashkaval: 0, gouda: 0, cheddar: 0 })

export const setBasketQuantity = (basket: Basket, id: ProductId, quantity: number): Basket => {
  const normalized = Number.isFinite(quantity)
    ? Math.max(0, Math.min(10, Math.trunc(quantity)))
    : basket[basketQuantities][id]
  return summarize({ ...basket[basketQuantities], [id]: normalized })
}

export const quantityInBasket = (basket: Basket, id: ProductId) => basket[basketQuantities][id]
