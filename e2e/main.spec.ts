import { expect, type Page, test } from "@playwright/test";

const signIn = async (page: Page) => {
  await test.step("Sign in", async () => {
    await page.goto("/");
    await page.getByTestId("pds-url-input").fill("http://localhost:2583");
    await page.getByTestId("admin-password-input").fill("admin-pass");
    await page.getByTestId("login-button").click();
  });
};

test("can generate invite code", async ({ page }) => {
  await signIn(page);

  await test.step("Open PDS actions dropdown", async () => {
    await page.getByTestId("pds-actions-dropdown").click();
  });

  await test.step("Click create invite code button", async () => {
    await page.getByTestId("create-invite-code-button").click();
  });

  await test.step("Verify invite code is generated", async () => {
    await expect(page.getByTestId("invite-code-success-message")).toBeVisible();
    await expect(page.getByTestId("invite-code-text")).toHaveText(
      /^localhost-[a-z0-9]+-[a-z0-9]+$/,
    );
  });
});

test("can delete account", async ({ page }) => {
  await signIn(page);

  const accountToDelete = page
    .locator("[data-testid=account-list-row]")
    .first();

  let handleToDelete: string | null = null;
  await test.step("Get account handle to delete", async () => {
    handleToDelete = await accountToDelete
      .getByTestId("account-list-row__handle")
      .textContent();
  });

  await test.step("Open account dropdown", async () => {
    await accountToDelete.getByTestId("account-dropdown-button").click();
  });

  await test.step("Click delete account button", async () => {
    await accountToDelete.getByTestId("delete-account-button").click();
  });

  await test.step("Confirm account deletion", async () => {
    await page.getByTestId("delete-account-confirm-button").click();
  });

  await test.step("Verify account is deleted", async () => {
    await page.waitForTimeout(2000);
    await expect(page.getByText(`text=${handleToDelete}`)).not.toBeVisible();
  });
});

test("can takedown and untakedown account", async ({ page }) => {
  await signIn(page);
  const firstAccountRow = page
    .locator("[data-testid=account-list-row]")
    .first();

  await test.step("Takedown account", async () => {
    await firstAccountRow.getByTestId("account-dropdown-button").click();
    await firstAccountRow.getByTestId("takedown-account-button").click();
    await page.getByTestId("takedown-account-confirm-button").click();
    await page.waitForTimeout(2000);
  });

  await test.step("Verify untakedown button is visible", async () => {
    await firstAccountRow.getByTestId("account-dropdown-button").click();
    await expect(
      firstAccountRow.getByTestId("untakedown-account-button"),
    ).toBeVisible();
  });

  await test.step("Untakedown account", async () => {
    await firstAccountRow.getByTestId("untakedown-account-button").click();
    await page.getByTestId("untakedown-account-confirm-button").click();
    await page.waitForTimeout(2000);
  });

  await test.step("Verify takedown button is visible again", async () => {
    await firstAccountRow.getByTestId("account-dropdown-button").click();
    await expect(
      firstAccountRow.getByTestId("takedown-account-button"),
    ).toBeVisible();
  });
});
