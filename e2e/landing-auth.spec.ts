import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should display landing page with title and CTA", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/Zaman Pusulası/);

    // Check hero section
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toBeVisible();

    // Check CTA button exists
    await expect(page.getByText("Hemen Başla")).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Giriş Yap").first().click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("#login-card")).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Kayıt Ol").first().click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator("#register-card")).toBeVisible();
  });
});

test.describe("Auth Pages", () => {
  test("login form should have required fields", async ({ page }) => {
    await page.goto("/login");

    const emailInput = page.locator("#email");
    const passwordInput = page.locator("#password");
    const submitButton = page.locator("#login-submit");

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // Check email input attributes
    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(emailInput).toHaveAttribute("required", "");
  });

  test("register form should have all fields", async ({ page }) => {
    await page.goto("/register");

    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#password-confirm")).toBeVisible();
    await expect(page.locator("#register-submit")).toBeVisible();
  });

  test("login page should link to register", async ({ page }) => {
    await page.goto("/login");

    await page.locator("#register-link").click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("register page should link to login", async ({ page }) => {
    await page.goto("/register");

    await page.locator("#login-link").click();
    await expect(page).toHaveURL(/\/login/);
  });
});
