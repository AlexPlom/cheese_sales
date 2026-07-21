import { FormEvent, useEffect, useRef, useState } from 'react'
import { catalog, createBasket, quantityInBasket, setBasketQuantity, type ProductId } from './basket'
import { createDemoCheckout, transitionDemoCheckout, type DeliveryDetails, type DeliveryFailures, type DemoCheckoutAction } from './demoCheckout'

const money = (value: number) => `€${value}`

export function App() {
  const [basket, setBasket] = useState(createBasket)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkout, setCheckout] = useState(createDemoCheckout)
  const [deliveryFailures, setDeliveryFailures] = useState<DeliveryFailures>({})
  const closeButton = useRef<HTMLButtonElement>(null)

  const countLabel = basket.count === 1 ? 'артикул' : 'артикула'

  const setQuantity = (id: ProductId, next: number) => {
    const updated = setBasketQuantity(basket, id, next)
    setBasket(updated)
    setCheckout((current) => transitionDemoCheckout(current, { type: 'basketChanged' }, updated).checkout)
  }

  const transitionCheckout = (action: DemoCheckoutAction) => {
    setCheckout((current) => transitionDemoCheckout(current, action, basket).checkout)
  }

  const editDeliveryDetails = (field: keyof DeliveryDetails, value: string) => {
    transitionCheckout({ type: 'editDetails', field, value })
    setDeliveryFailures((current) => ({ ...current, [field]: undefined }))
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

  const submitDemoCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const outcome = transitionDemoCheckout(checkout, { type: 'advance' }, basket)
    setCheckout(outcome.checkout)
    setDeliveryFailures(outcome.failures)
  }

  const reset = () => {
    const outcome = transitionDemoCheckout(checkout, { type: 'returnToStorefront' }, basket)
    if (outcome.clearBasket) setBasket(createBasket())
    setCheckout(outcome.checkout)
    setCartOpen(false)
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
          disabled={basket.count === 0}
          aria-label={`Кошница, ${basket.count} ${countLabel}, общо ${money(basket.total)}`}
        >
          <span>КОШНИЦА</span><b>{basket.count.toString().padStart(2, '0')}</b>
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
            {catalog.map((product, index) => {
              const quantity = quantityInBasket(basket, product.id)
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
          <div><span>{checkout.stage !== 'basket' ? '02 / ДЕМО ПОРЪЧКА' : '01 / ТВОЯТ ИЗБОР'}</span><h2>{checkout.stage === 'complete' ? 'ГОТОВО.' : checkout.stage === 'review' ? 'ПРОВЕРИ.' : checkout.stage === 'details' ? 'КЪДЕ?' : 'КОШНИЦА.'}</h2></div>
          <button ref={closeButton} onClick={() => setCartOpen(false)} aria-label="Затвори кошницата">×</button>
        </div>

        {checkout.stage === 'complete' ? (
          <div className="success">
            <div className="success-mark">✓</div>
            <h3>Това беше демо.</h3>
            <p>Нищо не е изпратено и няма плащане.</p>
            <strong>CURD-DEMO-2607</strong>
            <button className="checkout-button" onClick={reset}>ОБРАТНО В МАГАЗИНА</button>
          </div>
        ) : checkout.stage === 'review' ? (
          <div className="review-order">
            <p className="prototype-warning">ПРОВЕРКА — НИЩО НЯМА ДА БЪДЕ ИЗПРАТЕНО.</p>
            {basket.lines.map((line) => <p key={line.product.id}><span>{line.quantity} × {line.product.name}</span><b>{money(line.total)}</b></p>)}
            <p><span>Доставка</span><b>{money(basket.delivery)}</b></p><p className="grand"><span>Общо</span><b>{money(basket.total)}</b></p>
            <p><span>{checkout.details.name}<br />{checkout.details.phone}<br />{checkout.details.address}<br />{checkout.details.window}</span></p>
            <div className="form-actions"><button type="button" onClick={() => transitionCheckout({ type: 'back' })}>← НАЗАД</button><button type="button" onClick={() => transitionCheckout({ type: 'advance' })}>ПОТВЪРДИ ДЕМОТО →</button></div>
          </div>
        ) : checkout.stage === 'details' ? (
          <form className="checkout-form" onSubmit={submitDemoCheckout} noValidate>
            <p className="prototype-warning">ДЕМО РЕЖИМ — ДАННИТЕ НЕ СЕ ИЗПРАЩАТ.</p>
            <label>Име<input name="name" aria-required="true" autoComplete="name" value={checkout.details.name} aria-invalid={Boolean(deliveryFailures.name)} onChange={(e) => editDeliveryDetails('name', e.target.value)} />{deliveryFailures.name && <span className="field-error">Името трябва да е поне 2 знака.</span>}</label>
            <label>Телефон<input name="phone" type="tel" aria-required="true" placeholder="0888 123 456" value={checkout.details.phone} aria-invalid={Boolean(deliveryFailures.phone)} onChange={(e) => editDeliveryDetails('phone', e.target.value)} />{deliveryFailures.phone && <span className="field-error">Въведи валиден български мобилен номер.</span>}</label>
            <label>Адрес за доставка<input name="address" aria-required="true" autoComplete="street-address" value={checkout.details.address} aria-invalid={Boolean(deliveryFailures.address)} onChange={(e) => editDeliveryDetails('address', e.target.value)} />{deliveryFailures.address && <span className="field-error">Адресът трябва да е поне 5 знака.</span>}</label>
            <label>Час за доставка<select name="window" aria-required="true" value={checkout.details.window} aria-invalid={Boolean(deliveryFailures.window)} onChange={(e) => editDeliveryDetails('window', e.target.value)}><option value="" disabled>Избери прозорец</option><option>10:00–13:00</option><option>14:00–17:00</option><option>18:00–20:00</option></select>{deliveryFailures.window && <span className="field-error">Избери час за доставка.</span>}</label>
            <label>Бележка (по желание)<textarea name="note" rows={2} value={checkout.details.note} onChange={(e) => editDeliveryDetails('note', e.target.value)} /></label>
            <div className="form-actions"><button type="button" onClick={() => transitionCheckout({ type: 'back' })}>← НАЗАД</button><button type="submit">КЪМ ПРОВЕРКА →</button></div>
          </form>
        ) : (
          <>
            <div className="cart-lines">
              {basket.lines.map((line) => (
                <div className="cart-line" key={line.product.id}>
                  <div><span>{line.product.name}</span><b>{money(line.total)}</b></div>
                  <div className="mini-quantity"><button aria-label={`Намали количество ${line.product.name} в кошницата`} onClick={() => setQuantity(line.product.id, line.quantity - 1)}>−</button><output>{line.quantity}</output><button aria-label={`Увеличи количество ${line.product.name} в кошницата`} onClick={() => setQuantity(line.product.id, line.quantity + 1)} disabled={line.quantity === 10}>＋</button></div>
                </div>
              ))}
            </div>
            <div className="free-delivery"><span>{basket.freeDelivery.qualified ? 'ДОСТАВКАТА Е БЕЗПЛАТНА' : `ОЩЕ ${money(basket.freeDelivery.remaining)} ДО БЕЗПЛАТНА ДОСТАВКА`}</span><div><i style={{ width: `${Math.min(100, basket.subtotal * 4)}%` }} /></div></div>
            <div className="totals"><p><span>Продукти</span><b>{money(basket.subtotal)}</b></p><p><span>Доставка</span><b>{money(basket.delivery)}</b></p><p className="grand"><span>Общо</span><b>{money(basket.total)}</b></p></div>
            <button className="checkout-button" disabled={basket.count === 0} onClick={() => transitionCheckout({ type: 'advance' })}>КЪМ ДЕМО ПОРЪЧКА <span>→</span></button>
          </>
        )}
      </aside>}
    </div>
  )
}
