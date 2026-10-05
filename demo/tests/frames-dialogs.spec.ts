import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Lesson 09 - Frames, Dialogs, Tabs, Upload/Download
 * Goal: everything painful in Selenium in ~5 lines each.
 * Practice site (when online): https://the-internet.herokuapp.com
 *   /iframe, /javascript_alerts, /windows, /download, /upload
 * NOTE: self-contained inline pages so tests pass even when the
 * practice site is slow/down. Each test maps to the real page.
 * Run: npx playwright test tests/frames-dialogs.spec.ts --headed
 */

test.describe('Lesson 09 - Frames, Dialogs, Popups, Upload/Download', () => {
  test('1 - iframe via frameLocator (no driver.switchTo)', async ({ page }) => {
    // Real page: the-internet.herokuapp.com/iframe
    //   const editor = page.frameLocator('#mce_0_ifr');
    //   await editor.locator('#tinymce').fill('Hello');
    await page.setContent(`
      <h3>Outer page</h3>
      <iframe id="editor-frame" srcdoc="<body id='tinymce' contenteditable='true'>Your content goes here.</body>"></iframe>
    `);
    const editor = page.frameLocator('#editor-frame');
    const body = editor.locator('#tinymce');
    await expect(body).toBeVisible();
    await body.click();
    await page.keyboard.press('ControlOrMeta+A');
    await body.pressSequentially('Hello Playwright iframes!', { delay: 20 });
    await expect(body).toHaveText('Hello Playwright iframes!');
  });

  test('2 - JS alert: dialog handler BEFORE the click', async ({ page }) => {
    // Real page: the-internet.herokuapp.com/javascript_alerts
    await page.setContent(`
      <button onclick="alert('I am a JS Alert')">Click for JS Alert</button>
      <p id="result"></p>
      <script>
        window.alert = ((orig) => (msg) => { document.getElementById('result').textContent = 'You successfully clicked an alert'; return orig(msg); })(window.alert);
      </script>
    `);
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toContain('I am a JS Alert');
      await dialog.accept();
    });
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });

  test('3 - JS confirm + prompt: dismiss vs accept with text', async ({ page }) => {
    // Real page: the-internet.herokuapp.com/javascript_alerts
    await page.setContent(`
      <button onclick="if (confirm('I am a JS Confirm')) document.getElementById('result').textContent = 'You clicked: Ok'; else document.getElementById('result').textContent = 'You clicked: Cancel'">Click for JS Confirm</button>
      <button onclick="const v = prompt('I am a JS prompt'); document.getElementById('result').textContent = 'You entered: ' + v">Click for JS Prompt</button>
      <p id="result"></p>
    `);
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      await dialog.dismiss();
    });
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');

    page.removeAllListeners('dialog');
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('Playwright course');
    });
    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    await expect(page.locator('#result')).toHaveText('You entered: Playwright course');
  });

  test('4 - new tab via context.waitForEvent(page)', async ({ page, context }) => {
    // Real page: the-internet.herokuapp.com/windows (Click Here -> /windows/new)
    // Use a blob URL popup (data: URLs don't fire context 'page' in all browsers).
    await page.setContent(`
      <h3>Opening a new window</h3>
      <a href="#" id="open">Click Here</a>
      <script>
        const html = '<h3>New Window</h3>';
        const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
        document.getElementById('open').addEventListener('click', (e) => {
          e.preventDefault();
          window.open(url, "_blank");
        });
      </script>
    `);
    await expect(page.getByRole('heading', { name: 'Opening a new window' })).toBeVisible();
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Click Here' }).click(),
    ]);
    await newPage.waitForLoadState();
    await expect(newPage.getByRole('heading', { name: 'New Window' })).toBeVisible();
    await newPage.close();
  });

  test('5 - download + upload: saveAs + setInputFiles', async ({ page }) => {
    // Real pages: the-internet.herokuapp.com/download + /upload
    const downloadDir = path.join(process.cwd(), 'downloads');
    fs.mkdirSync(downloadDir, { recursive: true });
    await page.setContent(
      `<a id="dl" href="data:text/plain,Playwright download content" download="report.txt">Download file</a>`,
    );
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link', { name: 'Download file' }).click(),
    ]);
    const savePath = path.join(downloadDir, 'report.txt');
    await download.saveAs(savePath);
    expect(fs.existsSync(savePath)).toBeTruthy();
    expect(fs.readFileSync(savePath, 'utf-8')).toContain('Playwright download content');

    await page.setContent(`
      <input type="file" id="file-upload" />
      <button id="file-submit">Upload</button>
      <div id="uploaded-files"></div>
      <script>
        document.getElementById('file-submit').addEventListener('click', () => {
          const input = document.getElementById('file-upload');
          document.getElementById('uploaded-files').textContent = input.files[0].name;
        });
      </script>
    `);
    await page.locator('#file-upload').setInputFiles('fixtures/file.txt');
    await page.locator('#file-submit').click();
    await expect(page.locator('#uploaded-files')).toHaveText('file.txt');
  });
});
