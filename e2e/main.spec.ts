import { expect, type Page, test } from "@playwright/test";

const signIn = async (page: Page) => {
  await page.goto("/");
  await page.getByTestId("pds-url-input").fill("http://localhost:2583");
  await page.getByTestId("admin-password-input").fill("admin-pass");
  await page.getByTestId("login-button").click();
};

test("can generate invite code", async ({ page }) => {
  await signIn(page);

  await page.getByTestId("pds-actions-dropdown").click();
  await page.getByTestId("create-invite-code-button").click();

  await expect(page.getByTestId("invite-code-success-message")).toBeVisible();
  await expect(page.getByTestId("invite-code-text")).toHaveText(
    /^localhost-[a-z0-9]+-[a-z0-9]+$/,
  );
});

test("can delete account", async ({ page }) => {
  await signIn(page);

  const accountToDelete = page
    .locator("[data-testid=account-list-row]")
    .first();
  const handleToDelete = await accountToDelete
    .getByTestId("account-list-row__handle")
    .textContent();
  await accountToDelete.getByTestId("account-dropdown-button").click();
  await accountToDelete.getByTestId("delete-account-button").click();
  await page.getByTestId("delete-account-confirm-button").click();

  await page.waitForTimeout(2000);
  await expect(page.getByText(`text=${handleToDelete}`)).not.toBeVisible();
});
