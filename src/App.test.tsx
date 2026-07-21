import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'

afterEach(cleanup)

describe('CURD storefront', () => {
  it('adds products and waives delivery at EUR 25', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Добави Бяло саламурено' }))
    expect(screen.getByRole('button', { name: /Кошница, 1 артикул, общо €8/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Увеличи количество Бяло саламурено' }))
    await user.click(screen.getByRole('button', { name: 'Увеличи количество Бяло саламурено' }))
    await user.click(screen.getByRole('button', { name: 'Увеличи количество Бяло саламурено' }))

    expect(screen.getByRole('button', { name: /Кошница, 4 артикула, общо €26/ })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Увеличи количество Бяло саламурено' }))

    expect(screen.getByRole('button', { name: /Кошница, 5 артикула, общо €30/ })).toBeInTheDocument()
  })

  it('completes the clearly marked demo checkout', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Добави Гауда' }))
    await user.click(screen.getByRole('button', { name: /Кошница, 1 артикул, общо €9/ }))
    await user.click(screen.getByRole('button', { name: /Към демо поръчка/i }))

    await user.type(screen.getByLabelText('Име'), 'Иван Иванов')
    await user.type(screen.getByLabelText('Телефон'), '0888 123 456')
    await user.type(screen.getByLabelText('Адрес за доставка'), 'ул. Хаджи Димитър 1')
    await user.selectOptions(screen.getByLabelText('Час за доставка'), '10:00–13:00')
    await user.click(screen.getByRole('button', { name: /Към проверка/i }))
    expect(screen.getByText((_, element) => element?.tagName === 'SPAN' && element.textContent?.includes('Иван Иванов') === true)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Потвърди демото/i }))

    expect(screen.getByRole('heading', { name: 'Това беше демо.' })).toBeInTheDocument()
    expect(screen.getByText('Нищо не е изпратено и няма плащане.')).toBeInTheDocument()
  })
})
