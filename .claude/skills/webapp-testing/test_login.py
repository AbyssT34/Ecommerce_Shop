from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console logs
    console_logs = []
    page.on("console", lambda msg: console_logs.append(f"{msg.type}: {msg.text}"))

    # Capture network errors
    network_errors = []
    page.on("requestfailed", lambda request: network_errors.append(f"{request.method} {request.url}: {request.failure}"))

    # Capture all responses
    responses = []
    def handle_response(response):
        if '/api/' in response.url:
            responses.append(f"{response.status} {response.url}")
    page.on("response", handle_response)

    print("Navigating to login page...")
    page.goto('http://localhost:5173/login')
    page.wait_for_load_state('networkidle')

    # Take screenshot of login page
    page.screenshot(path='d:/Vibe_code/Ecommerce_Shop/.claude/skills/webapp-testing/login_page.png', full_page=True)
    print("Screenshot saved: login_page.png")

    # Find and fill form
    print("\nLooking for form elements...")

    # Get all inputs
    inputs = page.locator('input').all()
    print(f"Found {len(inputs)} input elements")

    for i, inp in enumerate(inputs):
        input_type = inp.get_attribute('type')
        input_placeholder = inp.get_attribute('placeholder')
        print(f"  Input {i}: type={input_type}, placeholder={input_placeholder}")

    # Fill email
    email_input = page.locator('input[type="email"]')
    if email_input.count() > 0:
        email_input.fill('user@shop.com')
        print("Filled email: user@shop.com")
    else:
        print("Email input not found!")

    # Fill password
    password_input = page.locator('input[type="password"]')
    if password_input.count() > 0:
        password_input.fill('user123')
        print("Filled password: user123")
    else:
        print("Password input not found!")

    # Take screenshot before submit
    page.screenshot(path='d:/Vibe_code/Ecommerce_Shop/.claude/skills/webapp-testing/before_submit.png', full_page=True)

    # Find and click submit button
    submit_button = page.locator('button[type="submit"]')
    if submit_button.count() > 0:
        print("\nClicking submit button...")
        submit_button.click()

        # Wait for response
        page.wait_for_timeout(3000)

        # Take screenshot after submit
        page.screenshot(path='d:/Vibe_code/Ecommerce_Shop/.claude/skills/webapp-testing/after_submit.png', full_page=True)
        print("Screenshot saved: after_submit.png")

        # Check current URL
        print(f"\nCurrent URL: {page.url}")

        # Check for error messages
        error_elements = page.locator('.text-error, [class*="error"]').all()
        if error_elements:
            print("\nError elements found:")
            for el in error_elements:
                text = el.text_content()
                if text and text.strip():
                    print(f"  - {text.strip()}")
    else:
        print("Submit button not found!")

    print("\n--- Console Logs ---")
    for log in console_logs:
        print(log)

    print("\n--- Network Errors ---")
    for err in network_errors:
        print(err)

    print("\n--- API Responses ---")
    for resp in responses:
        print(resp)

    # Check localStorage
    token = page.evaluate("() => localStorage.getItem('accessToken')")
    print(f"\n--- LocalStorage ---")
    print(f"accessToken: {token[:50] + '...' if token else 'None'}")

    browser.close()
