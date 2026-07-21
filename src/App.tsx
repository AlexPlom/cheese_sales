import { FormEvent, useEffect, useRef, useState } from 'react'

type Product = {
  id: 'white' | 'kashkaval' | 'gouda' | 'cheddar'
  name: string
  price: number
  eyebrow: string
  description: string
  image: string
}

const products: Product[] = [
  { id: 'white', name: 'Бяло саламурено', price: 6, eyebrow: 'БЯЛО СИРЕНЕ / 400 Г', description: 'Класическа категория за салати, печива и ежедневната трапеза.', image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=900&q=85' },
  { id: 'kashkaval', name: 'Кашкавал Витоша', price: 8, eyebrow: 'КАШКАВАЛ / 350 Г', description: 'Популярна полутвърда категория за сандвичи, запичане и директно сервиране.', image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=85' },
  { id: 'gouda', name: 'Гауда', price: 7, eyebrow: 'ГАУДА / 300 Г', description: 'Разпознаваем избор за плато, сандвичи и топли ястия.', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=85' },
  { id: 'cheddar', name: 'Зрял чедър', price: 9, eyebrow: 'ЧЕДЪР / 250 Г', description: 'Позната категория за бургери, сосове и плато със сирена.', image: 'https://images.unsplash.com/photo-1589881133595-a3c085cb731d?auto=format&fit=crop&w=900&q=85' },
]

const money = (value: number) => `€${value}`

export function App() {
  const [quantities, setQuantities] = useState<Record<Product['id'], number>>({ white: 0, kashkaval: 0, gouda: 0, cheddar: 0 })
  const [cartOpen, setCartOpen] = useState(false)
  const [checkout, setCheckout] = useState<'cart' | 'details' | 'review'>('cart')
  const [complete, setComplete] = useState(false)
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', window: '', note: '' })
  const closeButton = useRef<HTMLButtonElement>(null)

  const count = products.reduce((sum, product) => sum + quantities[product.id], 0)
  const subtotal = products.reduce((sum, product) => sum + quantities[product.id] * product.price, 0)
  const delivery = subtotal > 0 && subtotal < 25 ? 2 : 0
  const total = subtotal + delivery
  const countLabel = count === 1 ? 'артикул' : 'артикула'

  const setQuantity = (id: Product['id'], next: number) => {
    setQuantities((current) => ({ ...current, [id]: Math.max(0, Math.min(10, next)) }))
  }

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    if (cartOpen) closeButton.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCartOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [cartOpen])

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) return
    setCheckout('review')
  }

  const reset = () => {
    setQuantities({ white: 0, kashkaval: 0, gouda: 0, cheddar: 0 })
    setCartOpen(false)
    setCheckout('cart')
    setComplete(false)
    setCustomer({ name: '', phone: '', address: '', window: '', note: '' })
  }

  return (
    <div className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="nav">
        <a className="logo" href="#top" aria-label="CURD начало">CURD<span>●</span></a>
        <nav aria-label="Основна навигация">
          <a href="#cheese">Сирената</a>
          <a href="#delivery">Доставка</a>
        </nav>
        <button
          className="cart-trigger"
          onClick={() => setCartOpen(true)}
          disabled={count === 0}
          aria-label={`Кошница, ${count} ${countLabel}, общо ${money(total)}`}
        >
          <span>КОШНИЦА</span><b>{count.toString().padStart(2, '0')}</b>
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="kicker">ПОЗНАТИ ВИДОВЕ / ЯСНИ ЦЕНИ / ДЕМО МАГАЗИН</p>
            <h1>СИРЕНЕ<br /><i>БЕЗ</i><br />ПОЗА.</h1>
            <a className="primary-link" href="#cheese">ИЗБЕРИ СИРЕНЕ <span>↘</span></a>
          </div>
          <div className="cheese-stage">
            <img src="/generated/curd-funky-cheese-hero.png" alt="Графична нео-бруталистична илюстрация на голямо парче сирене" />
            <div className="image-stamp" aria-hidden="true">CURD.<br />SELECTED<br />CHEESE</div>
            <span className="stage-label">ИСТИНСКО СИРЕНЕ<br />ЯСНА СЕЛЕКЦИЯ</span>
          </div>
          <div className="hero-ticker" aria-hidden="true">
            <span>БЯЛО СИРЕНЕ ✦ КАШКАВАЛ ✦ ГАУДА ✦ ЧЕДЪР ✦ </span>
            <span>БЯЛО СИРЕНЕ ✦ КАШКАВАЛ ✦ ГАУДА ✦ ЧЕДЪР ✦ </span>
          </div>
        </section>

        <section className="products" id="cheese">
          <div className="section-heading">
            <span>01 / ИЗБОРЪТ</span>
            <h2>ЧЕТИРИ<br />ХАРАКТЕРА.</h2>
            <p>Познати сирена.<br />Ясни разфасовки и цени.</p>
          </div>
          <div className="product-grid">
            {products.map((product, index) => {
              const quantity = quantities[product.id]
              return (
                <article className={`product-card ${product.id}`} key={product.id}>
                  <div className="product-visual">
                    <span>{product.eyebrow}</span>
                    <img src={product.image} alt={`${product.name}, примерна продуктова фотография`} loading="lazy" />
                    <b className="image-number" aria-hidden="true">{product.price.toString().padStart(2, '0')}</b>
                  </div>
                  <div className="product-info">
                    <p>0{index + 1} / ПОДБРАНО СИРЕНЕ</p>
                    <span className="availability">● НАЛИЧНО В ДЕМОТО</span>
                    <h3>{product.name}</h3>
                    <div className="price">{money(product.price)}</div>
                    <p className="description">{product.description}</p>
                    {quantity === 0 ? (
                      <button className="add-button" onClick={() => setQuantity(product.id, 1)} aria-label={`Добави ${product.name}`}>
                        ДОБАВИ <span>＋</span>
                      </button>
                    ) : (
                      <div className="quantity">
                        <button onClick={() => setQuantity(product.id, quantity - 1)} aria-label={`Намали количество ${product.name}`}>−</button>
                        <output aria-label={`Количество ${product.name}`}>{quantity}</output>
                        <button onClick={() => setQuantity(product.id, quantity + 1)} disabled={quantity === 10} aria-label={`Увеличи количество ${product.name}`}>＋</button>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="delivery" id="delivery">
          <div className="delivery-title"><span>02 / ДОСТАВКАТА</span><h2>УТРЕ Е<br />ДОСТАТЪЧНО<br />СКОРО.</h2></div>
          <div className="delivery-grid">
            <div><b>01</b><h3>Демо опаковка</h3><p>Показваме как би изглеждала защитена пратка.</p></div>
            <div><b>02</b><h3>Примерна доставка</h3><p>Часовите прозорци са част от демонстрацията.</p></div>
            <div><b>03</b><h3>€2 доставка</h3><p>Без минимум. Безплатно при поръчка от €25.</p></div>
          </div>
          <p className="demo-note">CURD. В МОМЕНТА Е ДИЗАЙН ПРОТОТИП. НЕ СЕ ПРИЕМАТ РЕАЛНИ ПОРЪЧКИ.</p>
        </section>
      </main>

      <footer><a className="logo" href="#top">CURD<span>●</span></a><p>СЕЛЕКЦИЯ ОТ ПОЗНАТИ СИРЕНА<br />ПРОТОТИП / 2026</p><a href="#top">НАГОРЕ ↑</a></footer>

      {cartOpen && <div className="scrim" onClick={() => setCartOpen(false)} aria-hidden="true" />}
      {cartOpen && <aside className="cart-panel open" role="dialog" aria-modal="true" aria-label="Кошница">
        <div className="panel-head">
          <div><span>{checkout !== 'cart' ? '02 / ДЕМО ПОРЪЧКА' : '01 / ТВОЯТ ИЗБОР'}</span><h2>{complete ? 'ГОТОВО.' : checkout === 'review' ? 'ПРОВЕРИ.' : checkout === 'details' ? 'КЪДЕ?' : 'КОШНИЦА.'}</h2></div>
          <button ref={closeButton} onClick={() => setCartOpen(false)} aria-label="Затвори кошницата">×</button>
        </div>

        {complete ? (
          <div className="success">
            <div className="success-mark">✓</div>
            <h3>Това беше демо.</h3>
            <p>Нищо не е изпратено и няма плащане.</p>
            <strong>CURD-DEMO-2607</strong>
            <button className="checkout-button" onClick={reset}>ОБРАТНО В МАГАЗИНА</button>
          </div>
        ) : checkout === 'review' ? (
          <div className="review-order">
            <p className="prototype-warning">ПРОВЕРКА — НИЩО НЯМА ДА БЪДЕ ИЗПРАТЕНО.</p>
            {products.filter((p) => quantities[p.id] > 0).map((product) => <p key={product.id}><span>{quantities[product.id]} × {product.name}</span><b>{money(quantities[product.id] * product.price)}</b></p>)}
            <p><span>Доставка</span><b>{money(delivery)}</b></p><p className="grand"><span>Общо</span><b>{money(total)}</b></p>
            <p><span>{customer.name}<br />{customer.phone}<br />{customer.address}<br />{customer.window}</span></p>
            <div className="form-actions"><button type="button" onClick={() => setCheckout('details')}>← НАЗАД</button><button type="button" onClick={() => setComplete(true)}>ПОТВЪРДИ ДЕМОТО →</button></div>
          </div>
        ) : checkout === 'details' ? (
          <form className="checkout-form" onSubmit={submitOrder}>
            <p className="prototype-warning">ДЕМО РЕЖИМ — ДАННИТЕ НЕ СЕ ИЗПРАЩАТ.</p>
            <label>Име<input name="name" required minLength={2} autoComplete="name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /></label>
            <label>Телефон<input name="phone" type="tel" required pattern="(?:\+359|0)8[7-9][0-9 ]{7,9}" placeholder="0888 123 456" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} /></label>
            <label>Адрес за доставка<input name="address" required minLength={5} autoComplete="street-address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} /></label>
            <label>Час за доставка<select name="window" required value={customer.window} onChange={(e) => setCustomer({ ...customer, window: e.target.value })}><option value="" disabled>Избери прозорец</option><option>10:00–13:00</option><option>14:00–17:00</option><option>18:00–20:00</option></select></label>
            <label>Бележка (по желание)<textarea name="note" rows={2} value={customer.note} onChange={(e) => setCustomer({ ...customer, note: e.target.value })} /></label>
            <div className="form-actions"><button type="button" onClick={() => setCheckout('cart')}>← НАЗАД</button><button type="submit">КЪМ ПРОВЕРКА →</button></div>
          </form>
        ) : (
          <>
            <div className="cart-lines">
              {products.filter((p) => quantities[p.id] > 0).map((product) => (
                <div className="cart-line" key={product.id}>
                  <div><span>{product.name}</span><b>{money(product.price * quantities[product.id])}</b></div>
                  <div className="mini-quantity"><button aria-label={`Намали количество ${product.name} в кошницата`} onClick={() => setQuantity(product.id, quantities[product.id] - 1)}>−</button><output>{quantities[product.id]}</output><button aria-label={`Увеличи количество ${product.name} в кошницата`} onClick={() => setQuantity(product.id, quantities[product.id] + 1)} disabled={quantities[product.id] === 10}>＋</button></div>
                </div>
              ))}
            </div>
            <div className="free-delivery"><span>{subtotal >= 25 ? 'ДОСТАВКАТА Е БЕЗПЛАТНА' : `ОЩЕ ${money(25 - subtotal)} ДО БЕЗПЛАТНА ДОСТАВКА`}</span><div><i style={{ width: `${Math.min(100, subtotal * 4)}%` }} /></div></div>
            <div className="totals"><p><span>Продукти</span><b>{money(subtotal)}</b></p><p><span>Доставка</span><b>{delivery === 0 ? '€0' : money(delivery)}</b></p><p className="grand"><span>Общо</span><b>{money(total)}</b></p></div>
            <button className="checkout-button" disabled={count === 0} onClick={() => setCheckout('details')}>КЪМ ДЕМО ПОРЪЧКА <span>→</span></button>
          </>
        )}
      </aside>}
    </div>
  )
}
