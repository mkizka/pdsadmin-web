import { expect, test } from "@playwright/test";

test("can generate invite code", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("pds-url-input")).toBeVisible();

  await page.getByTestId("pds-url-input").fill("http://localhost:2583");
  await page.getByTestId("admin-password-input").fill("admin-pass");
  await page.getByTestId("login-button").click();

  await expect(page.getByTestId("pds-info-text")).toBeVisible();

  await page.getByTestId("pds-actions-dropdown").click();
  await page.getByTestId("create-invite-code-button").click();

  await expect(page.getByTestId("invite-code-success-message")).toBeVisible();

  const codeElement = page.getByTestId("invite-code-text");
  await expect(codeElement).toBeVisible();

  const codeText = await codeElement.textContent();
  expect(codeText).toMatch(/^localhost-[a-z0-9]+-[a-z0-9]+$/);
});
