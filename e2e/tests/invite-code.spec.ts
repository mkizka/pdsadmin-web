import { expect, test } from "@playwright/test";

test.use({ storageState: "e2e/.auth/user.json" });

test.describe("Invite Code Generation", () => {
  test("should generate an invite code when clicking the button", async ({
    page,
  }) => {
    await page.goto("/");

    await page.click('button:has-text("Create Invite Code")');

    await expect(
      page.locator("text=Invite code has been created!"),
    ).toBeVisible();

    const codeElement = page.locator("pre.font-bold");
    await expect(codeElement).toBeVisible();

    const codeText = await codeElement.textContent();
    expect(codeText).toBeTruthy();
    expect(codeText?.trim().length).toBeGreaterThan(0);

    await expect(page.locator("button.btn-square")).toBeVisible();
  });
});
