import test, { expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('should show validation errors with empty fields', async ({ page }) => {
    await page.goto('/login')
     const button = page.getByRole('button', { name: /ingresar/i })
    await expect(button).toBeDisabled()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'invalid-email@mail.com')
    await page.fill('input[name="password"]', 'password123')

    const button = page.getByRole('button', { name: /ingresar/i })
    await button.click()

    const emailError = page.getByText('Credenciales incorrectas')
    await expect(emailError).toBeVisible()
  })

  test('should navigate to dashboard on successful login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')

    const button = page.getByRole('button', { name: /ingresar/i })
    await button.click()

    await expect(page).toHaveURL('/dashboard')
  })
})
