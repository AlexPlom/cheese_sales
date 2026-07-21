import type { Basket } from './basket'

export type DeliveryDetails = {
  readonly name: string
  readonly phone: string
  readonly address: string
  readonly window: string
  readonly note: string
}

type DeliveryField = keyof DeliveryDetails

type ActiveDemoCheckout = {
  readonly stage: 'basket' | 'details' | 'review'
  readonly details: DeliveryDetails
}

export type DemoCheckout = ActiveDemoCheckout | { readonly stage: 'complete' }

export type DemoCheckoutAction =
  | { readonly type: 'advance' }
  | { readonly type: 'back' }
  | { readonly type: 'basketChanged' }
  | { readonly type: 'returnToStorefront' }
  | { readonly type: 'editDetails'; readonly field: DeliveryField; readonly value: string }

export type DeliveryFailures = Partial<Record<Exclude<DeliveryField, 'note'>, 'required' | 'invalid'>>

export type DemoCheckoutResult = {
  readonly checkout: DemoCheckout
  readonly failures: DeliveryFailures
  readonly clearBasket: boolean
}

const emptyDetails = (): DeliveryDetails => ({ name: '', phone: '', address: '', window: '', note: '' })

export const createDemoCheckout = (): DemoCheckout => ({ stage: 'basket', details: emptyDetails() })

const result = (checkout: DemoCheckout, failures: DeliveryFailures = {}, clearBasket = false): DemoCheckoutResult => ({ checkout, failures, clearBasket })

const validate = (details: DeliveryDetails): DeliveryFailures => {
  const failures: DeliveryFailures = {}
  if (details.name.length < 2) failures.name = details.name ? 'invalid' : 'required'
  if (!/^(?:\+359|0)8[7-9][0-9 ]{7,9}$/.test(details.phone)) failures.phone = details.phone ? 'invalid' : 'required'
  if (details.address.length < 5) failures.address = details.address ? 'invalid' : 'required'
  if (!details.window) failures.window = 'required'
  return failures
}

export const transitionDemoCheckout = (checkout: DemoCheckout, action: DemoCheckoutAction, basket: Basket): DemoCheckoutResult => {
  if (action.type === 'returnToStorefront') return result(createDemoCheckout(), {}, true)
  if (checkout.stage === 'complete') return result(checkout)

  if (action.type === 'editDetails') {
    return result({ ...checkout, details: { ...checkout.details, [action.field]: action.value } })
  }

  if (action.type === 'basketChanged') {
    return basket.count === 0 && checkout.stage !== 'basket'
      ? result({ stage: 'basket', details: checkout.details })
      : result(checkout)
  }

  if (action.type === 'back') {
    if (checkout.stage === 'review') return result({ stage: 'details', details: checkout.details })
    if (checkout.stage === 'details') return result({ stage: 'basket', details: checkout.details })
    return result(checkout)
  }

  if (basket.count === 0 && checkout.stage !== 'basket') {
    return result({ stage: 'basket', details: checkout.details })
  }

  if (checkout.stage === 'basket') {
    return basket.count > 0 ? result({ stage: 'details', details: checkout.details }) : result(checkout)
  }

  if (checkout.stage === 'details') {
    const failures = validate(checkout.details)
    return Object.keys(failures).length > 0
      ? result(checkout, failures)
      : result({ stage: 'review', details: checkout.details })
  }

  return result({ stage: 'complete' })
}
