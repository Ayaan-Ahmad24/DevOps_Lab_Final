# Selenium Automated Testing - IrtazaFoods

## Section E: Selenium Automated Testing

This directory contains 3 focused Selenium test cases for the IrtazaFoods application.

## Test Cases (All Homepage Focused)

1. **Test 1: Verify Homepage Loads**
   - Navigates to homepage
   - Verifies page loads successfully
   - Checks for key content (About Us section)

2. **Test 2: Validate Homepage Navigation**
   - Tests navigation links on homepage
   - Verifies menu page navigation works
   - Tests return to homepage

3. **Test 3: Check Homepage API Data Loading**
   - Verifies homepage loads menu data from API
   - Checks Featured Products section displays
   - Validates API integration on homepage

4. **Test 4: Verify Homepage Header**
   - Checks header/navigation bar is present
   - Verifies header is visible

5. **Test 5: Verify Homepage Footer**
   - Checks footer is present on homepage
   - Verifies footer is visible

6. **Test 6: Verify Homepage Images Load**
   - Checks images on homepage load correctly
   - Verifies image sources are present

## Prerequisites

1. **Python 3.8+** installed
2. **Docker and Docker Compose** installed
3. **Application running** (use Docker Compose)

## Installation

```bash
cd selenium_tests
pip install -r requirements.txt
```

**Important:** Make sure `pytest-html` is installed for HTML reports:
```bash
pip install pytest-html
```

## Running Tests

### Step 1: Start Application
```bash
# From project root
docker compose up -d

# Verify services are running
docker compose ps
```

### Step 2: Install pytest-html (for HTML reports)
```bash
pip install pytest-html
```

### Step 3: Run Tests

**Option 1: With HTML report**
```bash
cd selenium_tests
pytest test_irtazafoods.py -v -s --html=test_report.html --self-contained-html
```

**Option 2: Without HTML report (simpler)**
```bash
cd selenium_tests
pytest test_irtazafoods.py -v -s
```

**Option 3: Simple version (if ChromeDriverManager fails)**
```bash
cd selenium_tests
pytest test_irtazafoods_simple.py -v -s
```

**Option 4: Using Python directly**
```bash
cd selenium_tests
python test_irtazafoods.py
```

### Step 3: View Results
- Check terminal output
- Open `test_report.html` for detailed report
- Take screenshot of test execution

### Step 4: Stop Application
```bash
# From project root
docker compose down
```

## Test Report

After running tests, check `test_report.html` for detailed results.

## Troubleshooting

### ChromeDriver Error: "WinError 193"
If you get `OSError: [WinError 193] %1 is not a valid Win32 application`:

1. **Use simple version:**
   ```bash
   pytest test_irtazafoods_simple.py -v -s
   ```

2. **Or install ChromeDriver manually:**
   - See `INSTALL_CHROMEDRIVER.md` for detailed instructions
   - Download chromedriver.exe matching your Chrome version
   - Place in `selenium_tests/` folder or add to PATH

## Notes

- Tests wait for elements to load (handles React rendering)
- Make sure your application is running before executing tests
- Update `BASE_URL` in test file if your app runs on different port
- All tests focus on homepage functionality (one type as required)
