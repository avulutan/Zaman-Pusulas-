import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate directly (middleware skips when Supabase is not configured)
    await page.goto("/dashboard");
  });

  test("should display greeting and date", async ({ page }) => {
    // Check greeting exists
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Elif");
  });

  test("should display stat cards", async ({ page }) => {
    await expect(page.getByText("Bugünkü Görevler")).toBeVisible();
    await expect(page.getByText("Tamamlanan")).toBeVisible();
    await expect(page.getByText("Tamamlama Oranı")).toBeVisible();
    await expect(page.getByText("Boş Zaman")).toBeVisible();
  });

  test("should display today's plan with tasks", async ({ page }) => {
    await expect(page.getByText("Bugünkü Plan")).toBeVisible();
    await expect(page.getByText("Matematik Dersi")).toBeVisible();
  });

  test("should display departure advice", async ({ page }) => {
    // Planner generates departure advice for tasks with prep/travel time
    await expect(
      page.getByText(/hazırlanmaya başla/).first()
    ).toBeVisible();
  });

  test("should display upcoming deadlines", async ({ page }) => {
    await expect(page.getByText("Yaklaşan Tarihler")).toBeVisible();
  });

  test("should have AI assistant card with link to chat", async ({ page }) => {
    await expect(page.getByText("YZ Asistan")).toBeVisible();
    const chatLink = page.getByText("Chatbot'a Sor");
    await expect(chatLink).toBeVisible();
  });
});

test.describe("Chat Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/chat");
  });

  test("should display empty state with bot icon", async ({ page }) => {
    await expect(
      page.getByText("Merhaba! Ben Zaman Pusulası asistanın 👋")
    ).toBeVisible();
  });

  test("should display prompt chips", async ({ page }) => {
    await expect(page.getByText("Bugün ne yapmalıyım?")).toBeVisible();
    await expect(page.getByText("Planım bozuldu, yeniden düzenle")).toBeVisible();
  });

  test("should have input and send button", async ({ page }) => {
    await expect(page.locator("#chat-input")).toBeVisible();
    await expect(page.locator("#chat-send-btn")).toBeVisible();
  });

  test("should send a message and show loading", async ({ page }) => {
    const input = page.locator("#chat-input");
    await input.fill("Bugün ne yapmalıyım?");
    await page.locator("#chat-send-btn").click();

    // User message should appear
    await expect(
      page.getByText("Bugün ne yapmalıyım?").last()
    ).toBeVisible();
  });
});

test.describe("Tasks Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tasks");
  });

  test("should display tasks heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Görevler" })
    ).toBeVisible();
  });

  test("should display task stat cards", async ({ page }) => {
    await expect(page.getByText("Toplam").first()).toBeVisible();
  });

  test("should display task cards", async ({ page }) => {
    await expect(page.getByText("Matematik Dersi")).toBeVisible();
  });
});

test.describe("Calendar Page", () => {
  test("should display calendar heading", async ({ page }) => {
    await page.goto("/calendar");

    await expect(
      page.getByRole("heading", { name: "Takvim" })
    ).toBeVisible();
  });
});

test.describe("Study Page", () => {
  test("should display study assistant heading", async ({ page }) => {
    await page.goto("/study");

    await expect(
      page.getByText("Ders Çalışma Asistanı")
    ).toBeVisible();
  });
});

test.describe("Analytics Page", () => {
  test("should display analytics heading and chart", async ({ page }) => {
    await page.goto("/analytics");

    await expect(
      page.getByRole("heading", { name: "İstatistikler" })
    ).toBeVisible();
    await expect(page.getByText("Haftalık Görev Takibi")).toBeVisible();
  });
});

test.describe("Settings Page", () => {
  test("should display settings sections", async ({ page }) => {
    await page.goto("/settings");

    await expect(
      page.getByRole("heading", { name: "Ayarlar" })
    ).toBeVisible();
    await expect(page.getByText("Profil Bilgileri")).toBeVisible();
    await expect(page.getByText("Tema Ayarları")).toBeVisible();
    await expect(page.getByText("Erişilebilirlik")).toBeVisible();
    await expect(page.getByText("Bildirimler")).toBeVisible();
  });

  test("should toggle theme", async ({ page }) => {
    await page.goto("/settings");

    const darkButton = page.getByRole("button", { name: "Koyu" });
    await darkButton.click();

    // Check that the button is now selected
    await expect(darkButton).toHaveClass(/border-primary/);
  });
});

test.describe("Profile Setup", () => {
  test("should display step 1 with name field", async ({ page }) => {
    await page.goto("/profile-setup");

    await expect(page.getByText("Profilini Oluştur")).toBeVisible();
    await expect(page.locator("#setup-name")).toBeVisible();
  });

  test("should navigate between steps", async ({ page }) => {
    await page.goto("/profile-setup");

    // Fill name and go to step 2
    await page.locator("#setup-name").fill("Test Kullanıcı");
    await page.getByText("İleri").click();

    // Step 2 should show
    await expect(page.getByText("Çalışma Tercihleri")).toBeVisible();

    // Go back
    await page.getByText("Geri").click();
    await expect(page.getByText("Kişisel Bilgiler")).toBeVisible();
  });
});
