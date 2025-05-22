import { test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/");

  const pdsUrl = process.env.TEST_PDS_URL || "http://localhost:2583";
  const adminPassword = process.env.TEST_ADMIN_PASSWORD || "admin-pass";

  await page.fill('input[placeholder="例: bsky.social"]', pdsUrl);
  await page.fill('input[placeholder="管理者パスワードを入力"]', adminPassword);
  await page.click('button:has-text("ログイン")');

  await page.waitForSelector("text=アカウント一覧", { timeout: 5000 });

  await page.context().storageState({ path: authFile });
});
