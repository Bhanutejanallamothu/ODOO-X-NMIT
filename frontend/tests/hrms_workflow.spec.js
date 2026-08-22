const { test, expect } = require('@playwright/test');

test.describe('Dayflow HRMS End-to-End Workflows', () => {

  test('E2E Complete Employee & Admin Walkthrough', async ({ page }) => {
    // 1. SIGN IN AS EMPLOYEE
    await page.goto('/signin');
    await expect(page.locator('h2')).toContainText('Welcome to Dayflow');
    
    await page.fill('#email', 'john.doe@dayflow.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    // Verify Redirect to Dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome back');

    // 2. TEST CLOCK IN / OUT
    const clockButton = page.locator('button:has-text("Clock In"), button:has-text("Clock Out")');
    if (await clockButton.isVisible()) {
      const buttonText = await clockButton.innerText();
      await clockButton.click();
      // Wait for async changes to settle
      await page.waitForTimeout(2000);
      
      const newButton = page.locator('button:has-text("Clock In"), button:has-text("Clock Out")');
      if (await newButton.isVisible()) {
        const newText = await newButton.innerText();
        expect(newText).not.toBe(buttonText);
      }
    }

    // 3. APPLY FOR LEAVE
    await page.click('nav a[href="/leaves"]');
    await expect(page).toHaveURL(/.*leaves/);
    await page.click('button:has-text("Apply for Leave")');
    
    // Fill in dates for next month
    await page.fill('input[name="startDate"]', '2026-09-10');
    await page.fill('input[name="endDate"]', '2026-09-12');
    await page.fill('input[name="remarks"]', 'Playwright automated E2E test leave request');
    await page.click('button:has-text("Submit Request")');
    
    // Verify it appears in the table
    await page.waitForTimeout(1000);
    await expect(page.locator('table')).toContainText('Playwright automated E2E test leave request');

    // 4. EDIT PROFILE
    await page.click('nav a[href="/profile"]');
    await expect(page).toHaveURL(/.*profile/);
    await page.click('button:has-text("Edit Profile")');
    await page.fill('input[name="phone"]', '+1 555-8888');
    await page.fill('textarea[name="address"]', 'Playwright Test Blvd 10');
    await page.click('button:has-text("Save Changes")');
    
    // Verify changes
    await expect(page.locator('body')).toContainText('+1 555-8888');

    // 5. LOGOUT
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/.*signin/);

    // 6. SIGN IN AS ADMIN
    await page.fill('#email', 'admin@dayflow.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome back, Alice');

    // 7. APPROVE LEAVE REQUEST
    await page.click('nav a[href="/leave-requests"]');
    await expect(page).toHaveURL(/.*leave-requests/);
    
    // Look for pending request
    await expect(page.locator('table')).toContainText('john.doe@dayflow.com');
    const actionButton = page.locator('table button:has-text("Action")').first();
    await actionButton.click();
    
    await page.fill('input[placeholder="Add admin review comments..."]', 'Approved via Playwright spec');
    await page.click('button:has-text("Approve")');
    
    // Wait for update
    await page.waitForTimeout(2000);
    
    // 8. UPDATE PAYROLL
    await page.click('nav a[href="/payroll-sheet"]');
    await expect(page).toHaveURL(/.*payroll-sheet/);
    
    // Click edit on John Doe's row (user_id 2)
    const editPayrollButton = page.locator('table button:has-text("Edit")').first();
    await editPayrollButton.click();
    
    await page.fill('input[name="allowances"]', '550');
    await page.fill('input[name="deductions"]', '120');
    await page.click('button:has-text("Save Record")');
    await page.waitForTimeout(1000);

    // 9. VIEW AUDIT TRAIL LEDGER
    await page.click('nav a[href="/audit-logs"]');
    await expect(page).toHaveURL(/.*audit-logs/);
    
    // Confirm audit logs list our actions
    await expect(page.locator('table')).toContainText('APPROVE_LEAVE');
    await expect(page.locator('table')).toContainText('UPDATE_PAYROLL');

    // 10. LOGOUT
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/.*signin/);
  });
});
