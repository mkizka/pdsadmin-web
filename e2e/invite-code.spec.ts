import { expect, test } from "@playwright/test";

test("can generate invite code", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("pds-url-input").fill("http://localhost:2583");
  await page.getByTestId("admin-password-input").fill("admin-pass");
  await page.getByTestId("login-button").click();

  await page.getByTestId("pds-actions-dropdown").click();
  await page.getByTestId("create-invite-code-button").click();

  await expect(page.getByTestId("invite-code-success-message")).toBeVisible();
  await expect(page.getByTestId("invite-code-text")).toHaveText(
    /^localhost-[a-z0-9]+-[a-z0-9]+$/,
  );
});
