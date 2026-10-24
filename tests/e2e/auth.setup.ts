import { expect, test as setup } from "@playwright/test";
import { E2E_PASSWORD } from "./constants";

export const STORAGE_STATE = "test-results/.auth/state.json";

setup("sign in once and save the session", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Preview password").fill(E2E_PASSWORD);
  await page.getByRole("button", { name: /enter the preview/i }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("learn to think");
  await page.context().storageState({ path: STORAGE_STATE });
});
