import puppeteer from "puppeteer";
import path from "path";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

  const heroEl = await page.$("#hero");
  if (heroEl) {
    await heroEl.screenshot({ path: "shots/hero-aligned-verified.png" });
    console.log("Screenshot saved to shots/hero-aligned-verified.png");
  } else {
    console.log("Could not find #hero element");
  }
  await browser.close();
})();
