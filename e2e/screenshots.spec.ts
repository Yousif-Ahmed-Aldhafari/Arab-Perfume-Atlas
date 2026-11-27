import { test } from "@playwright/test";

test("capture production views", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Canonical screenshots use Chromium");

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("./");
  await page.screenshot({
    path: "docs/screenshots/home-desktop.png",
    fullPage: true,
  });

  await page.goto("./#/catalog");
  await page.screenshot({
    path: "docs/screenshots/catalog-desktop.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#/catalog");
  await page.screenshot({
    path: "docs/screenshots/catalog-mobile.png",
    fullPage: true,
  });
});
