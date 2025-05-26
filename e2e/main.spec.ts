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

test("can create a new account and then delete it", async ({ page }) => {
  await signIn(page);

  const uniqueId = `test${Date.now().toString().slice(-6)}`;
  const email = `${uniqueId}@example.com`;
  const password = "password123";
  const handle = `${uniqueId}.test`;

  await test.step("Click create account button", async () => {
    await page.getByTestId("create-account-button").click();
  });

  await test.step("Fill in account creation form", async () => {
    await page.getByTestId("create-account-handle-input").fill(handle);
    await page.getByTestId("create-account-email-input").fill(email);
    await page.getByTestId("create-account-password-input").fill(password);
    await page.getByTestId("create-account-submit-button").click();
    await expect(page.getByText("Account created successfully")).toBeVisible();
  });

  await test.step("Find newly created account", async () => {
    await page.mouse.wheel(0, 1000);
    const newAccount = page
      .locator("[data-testid=account-list-row]")
      .filter({ has: page.locator(`text=@${handle}`) });
    await expect(newAccount).toBeVisible();
  });

  await test.step("Open account dropdown menu", async () => {
    const newAccount = page
      .locator("[data-testid=account-list-row]")
      .filter({ has: page.locator(`text=@${handle}`) });
    await newAccount.getByTestId("account-dropdown-button").click();
  });

  await test.step("Click delete account button", async () => {
    const newAccount = page
      .locator("[data-testid=account-list-row]")
      .filter({ has: page.locator(`text=@${handle}`) });
    await newAccount.getByTestId("delete-account-button").click();
  });

  await test.step("Confirm account deletion", async () => {
    await page.getByTestId("delete-account-confirm-button").click();
    await page.waitForTimeout(2000);
  });

  await test.step("Verify account is deleted", async () => {
    await expect(page.getByText(`@${handle}`)).not.toBeVisible();
  });
});

test("password saving preference with checkbox ON keeps session after reload", async ({
  page,
}) => {
  await test.step("Go to login page", async () => {
    await page.goto("/");
  });

  await test.step("Fill login form with save password checkbox ON", async () => {
    await page.getByTestId("pds-url-input").fill("http://localhost:2583");
    await page.getByTestId("admin-password-input").fill("admin-pass");
    await expect(page.getByTestId("save-password-checkbox")).toBeChecked();
    await page.getByTestId("login-button").click();
  });

  await test.step("Verify login success and account list is visible", async () => {
    await expect(page.getByTestId("account-list-row")).toBeVisible();
  });

  await test.step("Reload page", async () => {
    await page.reload();
  });

  await test.step("Verify account list is still visible after reload", async () => {
    await expect(page.getByTestId("account-list-row")).toBeVisible();
  });
});

test("password saving preference with checkbox OFF requires re-login after reload", async ({
  page,
}) => {
  await test.step("Go to login page", async () => {
    await page.goto("/");
  });

  await test.step("Fill login form with save password checkbox OFF", async () => {
    await page.getByTestId("pds-url-input").fill("http://localhost:2583");
    await page.getByTestId("admin-password-input").fill("admin-pass");
    await page.getByTestId("save-password-checkbox").uncheck();
    await expect(page.getByTestId("save-password-checkbox")).not.toBeChecked();
    await page.getByTestId("login-button").click();
  });

  await test.step("Verify login success and account list is visible", async () => {
    await expect(page.getByTestId("account-list-row")).toBeVisible();
  });

  await test.step("Reload page", async () => {
    await page.reload();
  });

  await test.step("Verify login form is displayed after reload", async () => {
    await expect(page.getByTestId("pds-url-input")).toBeVisible();
    await expect(page.getByTestId("admin-password-input")).toBeVisible();
    await expect(page.getByTestId("login-button")).toBeVisible();
  });
});
