import { expect, type Page, test } from "@playwright/test";

const signIn = async (
  page: Page,
  options?: {
    rememberLogin: boolean;
  },
) => {
  await test.step("PDSにログイン", async () => {
    await page.goto("/");
    await page.getByTestId("pds-url-input").fill("http://localhost:2583");
    await page.getByTestId("admin-password-input").fill("admin-pass");
    if (options?.rememberLogin) {
      await page.getByTestId("remember-login-checkbox").check();
    } else {
      await page.getByTestId("remember-login-checkbox").uncheck();
    }
    await page.getByTestId("login-button").click();
  });
};

test("招待コードを生成できる", async ({ page }) => {
  await signIn(page);

  await test.step("招待コード作成ボタンをクリック", async () => {
    await page.getByTestId("create-invite-code-button").click();
  });

  await test.step("招待コードが生成されたことを確認", async () => {
    await expect(page.getByTestId("invite-code-success-message")).toBeVisible();
    await expect(page.getByTestId("invite-code-text")).toHaveText(
      /^localhost-[a-z0-9]+-[a-z0-9]+$/,
    );
  });
});

test("アカウントのTakedownと解除ができる", async ({ page }) => {
  await signIn(page);
  const bobAccount = page
    .locator("[data-testid=account-list-row]")
    .filter({ has: page.locator("text=@bob.test") });

  await test.step("@bob.testアカウントを確認", async () => {
    await expect(bobAccount).toBeVisible();
  });

  await test.step("アカウントをTakedown", async () => {
    await bobAccount.getByTestId("account-dropdown-button").click();
    await bobAccount.getByTestId("takedown-account-button").click();
    await page.getByTestId("takedown-account-confirm-button").click();
  });

  await test.step("Takedownバッジが表示されていることを確認", async () => {
    await expect(
      bobAccount.getByTestId("account-list-row__takedown-badge"),
    ).toBeVisible();
  });

  await test.step("アカウントのTakedownを解除する", async () => {
    await bobAccount.getByTestId("account-dropdown-button").click();
    await bobAccount.getByTestId("untakedown-account-button").click();
    await page.getByTestId("untakedown-account-confirm-button").click();
  });

  await test.step("Takedownバッジが非表示になっていることを確認", async () => {
    await expect(
      bobAccount.getByTestId("account-list-row__takedown-badge"),
    ).not.toBeVisible();
  });
});

test("新規アカウントの作成と削除ができる", async ({ page }) => {
  await signIn(page);

  const uniqueId = `test${Date.now().toString().slice(-6)}`;
  const email = `${uniqueId}@example.com`;
  const password = "password123";
  const handle = `${uniqueId}.test`;

  await test.step("アカウント作成ボタンをクリック", async () => {
    await page.getByTestId("create-account-button").click();
  });

  await test.step("アカウント作成フォームに入力", async () => {
    await page.getByTestId("create-account-handle-input").fill(handle);
    await page.getByTestId("create-account-email-input").fill(email);
    await page.getByTestId("create-account-password-input").fill(password);
    await page.getByTestId("create-account-submit-button").click();
    await expect(page.getByText("Account created successfully")).toBeVisible();
  });

  const newAccount = page
    .locator("[data-testid=account-list-row]")
    .filter({ has: page.locator(`text=@${handle}`) });

  await test.step("作成したアカウントを確認", async () => {
    await page.mouse.wheel(0, 1000);
    await expect(newAccount).toBeVisible();
  });

  await test.step("アカウントを削除", async () => {
    await newAccount.getByTestId("account-dropdown-button").click();
    await newAccount.getByTestId("delete-account-button").click();
    await page.getByTestId("delete-account-confirm-button").click();
  });

  await test.step("アカウントが削除されたことを確認", async () => {
    await page.waitForTimeout(2000);
    await expect(page.getByText(`@${handle}`)).not.toBeVisible();
  });
});

test("ログイン時に入力値をLocalStorageに保存してログイン出来る", async ({
  page,
}) => {
  await test.step("入力値保存を有効にしてログイン", async () => {
    await signIn(page, { rememberLogin: true });
  });

  await test.step("ログインが成功してアカウントリストが表示されることを確認", async () => {
    await expect(page.getByTestId("account-list")).toBeVisible();
  });

  await test.step("ページをリロードしてもログイン状態が維持されていることを確認", async () => {
    await page.reload();
    await expect(page.getByTestId("account-list")).toBeVisible();
  });
});

test("ログイン時に入力値をLocalStorageに保存せずログイン出来る", async ({
  page,
}) => {
  await test.step("ログインページでログイン情報保存を無効にする", async () => {
    await signIn(page, { rememberLogin: false });
  });

  await test.step("ログインが成功してアカウントリストが表示されることを確認", async () => {
    await expect(page.getByTestId("account-list")).toBeVisible();
  });

  await test.step("ページをリロードするとログインフォームに戻ることを確認", async () => {
    await page.reload();
    await expect(page.getByTestId("signin-form")).toBeVisible();
  });
});

test("ログイン失敗時にエラーメッセージが表示される", async ({ page }) => {
  await test.step("ログインページにアクセス", async () => {
    await page.goto("/");
  });

  await test.step("間違った認証情報でログインを試行", async () => {
    await page.getByTestId("pds-url-input").fill("http://localhost:2583");
    await page.getByTestId("admin-password-input").fill("wrong-password");
    await page.getByTestId("login-button").click();
  });

  await test.step("ログイン失敗のエラーメッセージが表示されることを確認", async () => {
    await expect(page.getByTestId("signin-error")).toBeVisible();
    await expect(page.getByTestId("signin-error")).toContainText(
      "Sign in failed",
    );
  });
});
