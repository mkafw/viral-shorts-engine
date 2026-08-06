import { chromium } from 'playwright-core';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = browser.contexts()[0].pages().find(p => p.url().includes('generate-speech'));

if (!page) { console.log('AI Studio page not found'); await browser.close(); process.exit(1); }

// Check for Dashboard link
const dashboardLinks = await page.evaluate(() => {
  const links = [];
  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    const text = el.textContent?.trim() || '';
    const href = el.getAttribute('href') || '';
    const ariaLabel = el.getAttribute('aria-label') || '';
    if (text.toLowerCase().includes('dashboard') || text.toLowerCase().includes('settings') || text.toLowerCase().includes('api key') || text.toLowerCase().includes('支出上限') || text.toLowerCase().includes('spend')) {
      links.push({ text: text.substring(0, 80), href: href.substring(0, 120), ariaLabel });
    }
  });
  return links;
});

console.log('=== Dashboard/Settings/API key links in page:');
dashboardLinks.forEach(l => console.log(`  text="${l.text}" href="${l.href}" aria="${l.ariaLabel}"`));

// Also check what the "key_off" button does - click it and see
const keyBtn = page.locator('ms-paid-api-key-button button').first();
if (await keyBtn.count() > 0) {
  console.log('\n=== API Key button HTML:');
  const html = await keyBtn.evaluate(el => el.outerHTML.substring(0, 500));
  console.log(html);
  
  // Check if there's a clickable dialog
  console.log('\n=== Clicking API key button...');
  await keyBtn.click({ timeout: 3000 });
  await page.waitForTimeout(1000);
  
  // Check what appeared
  const dialogs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="dialog"], [role="menu"], .cdk-overlay-pane, mat-dialog-container'))
      .map(el => ({ text: el.textContent?.trim().substring(0, 500), class: el.className.substring(0, 100) }));
  });
  console.log('Dialogs opened:', JSON.stringify(dialogs, null, 2));
  
  // Press Escape to close
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

// Find the "Dashboard" link in sidebar
console.log('\n=== Sidebar navigation links:');
const navLinks = await page.evaluate(() => {
  const nav = document.querySelector('ms-navbar-v2, .navbar, nav');
  if (!nav) return 'no nav found';
  return Array.from(nav.querySelectorAll('a, button'))
    .map(el => ({ text: el.textContent?.trim().substring(0, 80), href: el.getAttribute('href') || '', ariaLabel: el.getAttribute('aria-label') || '' }));
});
console.log(JSON.stringify(navLinks, null, 2));

await browser.close();
