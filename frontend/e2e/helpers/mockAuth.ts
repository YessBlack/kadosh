import { Page } from '@playwright/test'

type AuthScenario = 'logged-out' | 'login-success' | 'login-invalid-credentials'

async function mockAuth(page: Page, scenario: AuthScenario) {
  await page.route('**/api/auth/me', route => {
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized' })
    })
  })

  await page.route('**/api/auth/login', route => {
    const body = JSON.parse(route.request().postData() || '{}')

    if (scenario === 'login-success') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: '1', email: body.email }
        })
      })
      return
    }

    if (scenario === 'login-invalid-credentials') {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' })
      })
      return
    }

    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Invalid credentials' })
    })
  })
}

export { mockAuth, type AuthScenario }
