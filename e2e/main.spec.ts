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

  const aliceAccount = page
    .locator("[data-testid=account-list-row]")
    .filter({ has: page.locator("text=@alice.test") });

  await test.step("Find and select @alice.test account", async () => {
    await expect(aliceAccount).toBeVisible();
  });

  await test.step("Open account dropdown", async () => {
    await aliceAccount.getByTestId("account-dropdown-button").click();
  });

  await test.step("Click delete account button", async () => {
    await aliceAccount.getByTestId("delete-account-button").click();
  });

  await test.step("Confirm account deletion", async () => {
    await page.getByTestId("delete-account-confirm-button").click();
  });

  await test.step("Verify account is deleted", async () => {
    await page.waitForTimeout(2000);
    await expect(page.getByText("@alice.test")).not.toBeVisible();
  });
});

test("can takedown and untakedown account", async ({ page }) => {
  await signIn(page);
  const bobAccount = page
    .locator("[data-testid=account-list-row]")
    .filter({ has: page.locator("text=@bob.test") });

  await test.step("Find and select @bob.test account", async () => {
    await expect(bobAccount).toBeVisible();
  });

  await test.step("Takedown account", async () => {
    await bobAccount.getByTestId("account-dropdown-button").click();
    await bobAccount.getByTestId("takedown-account-button").click();
    await page.getByTestId("takedown-account-confirm-button").click();
    await page.waitForTimeout(2000);
  });

  await test.step("Verify untakedown button is visible", async () => {
    await bobAccount.getByTestId("account-dropdown-button").click();
    await expect(
      bobAccount.getByTestId("untakedown-account-button"),
    ).toBeVisible();
  });

  await test.step("Untakedown account", async () => {
    await bobAccount.getByTestId("untakedown-account-button").click();
    await page.getByTestId("untakedown-account-confirm-button").click();
    await page.waitForTimeout(2000);
  });

  await test.step("Verify takedown button is visible again", async () => {
    await bobAccount.getByTestId("account-dropdown-button").click();
    await expect(
      bobAccount.getByTestId("takedown-account-button"),
    ).toBeVisible();
  });
});

test("can create account", async ({ page }) => {
  await signIn(page);

  await test.step("Click create account button", async () => {
    await page.getByTestId("create-account-button").click();
  });

  await test.step("Fill in account creation form", async () => {
    await page.getByTestId("create-account-handle-input").fill("e2e-test.test");
    await page
      .getByTestId("create-account-email-input")
      .fill("test@example.com");
    await page
      .getByTestId("create-account-password-input")
      .fill("e2e-test-pass");
  });

  await test.step("Submit account creation", async () => {
    await page.getByTestId("create-account-submit-button").click();
  });

  await test.step("Verify account appears in list", async () => {
    await page.waitForTimeout(2000);
    // Scroll down to load more accounts
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(1000);
    await expect(page.getByText("@e2e-test.test")).toBeVisible();
  });
});
