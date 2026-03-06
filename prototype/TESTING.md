# Testing Guide

## Overview

This project uses Playwright for end-to-end testing. We have two test suites:

1. **Local Development Tests** (`farmer-dashboard.spec.js`) - Tests against local dev server
2. **Production Tests** (`production.spec.js`) - Tests against live deployments

## Test Results

✅ **All 23 production tests passing** (as of March 6, 2026)

## Running Tests

### Production Tests (Recommended)

Test against live deployments (CloudFront and Netlify):

```bash
npm run test:production
```

View HTML report:

```bash
npm run test:production:report
```

### Local Development Tests

Start dev server and run tests:

```bash
npm test
```

Interactive UI mode:

```bash
npm run test:ui
```

## Test Coverage

### Production Tests (23 tests)

**Deployment Tests** (16 tests across 2 URLs):
- ✅ Site loading and visibility
- ✅ Meta tags and SEO
- ✅ Asset loading (JS, CSS)
- ✅ Navigation between views
- ✅ Dashboard sections display
- ✅ AI recommendations form
- ✅ Mobile responsiveness
- ✅ Performance (< 5s load time)

**API Integration Tests** (2 tests):
- ✅ Orchestrator API calls
- ✅ API response data display

**SEO & Accessibility** (3 tests):
- ✅ Heading hierarchy (h1, h2)
- ✅ Image alt text
- ✅ Form input accessibility

**Error Handling** (2 tests):
- ✅ Network error handling
- ✅ Slow API response handling

### Local Development Tests (20+ tests)

- Dashboard loading and structure
- Farmer profile display
- Metrics cards (4 cards)
- Charts (pie chart, line chart)
- Crop-level carbon footprint
- Sustainability premium section
- Carbon credits section
- AI recommendations form
- Form validation
- API error handling
- Navigation between views
- Responsive design (mobile, tablet)
- Performance checks
- Console error detection

## Test Configuration

### Production Config (`playwright.config.production.js`)

- Tests only `production.spec.js`
- No local web server required
- Tests against live URLs
- Single browser (Chromium) for speed

### Development Config (`playwright.config.js`)

- Tests all spec files
- Starts local dev server automatically
- Multiple browsers (Chromium, Firefox, WebKit)
- Mobile device testing (Pixel 5, iPhone 12)

## Continuous Integration

To run tests in CI/CD:

```bash
# Install Playwright browsers
npx playwright install --with-deps

# Run production tests
npm run test:production
```

## Troubleshooting

### Dev server timeout

If local tests fail with "Timed out waiting for webServer":
- Check if port 5173 is already in use
- Try running `npm run dev` manually first
- Use production tests instead: `npm run test:production`

### Test failures

View detailed reports:
```bash
npx playwright show-report
```

View screenshots and videos in `test-results/` directory.

## URLs Tested

- **CloudFront**: https://d3uo8fexy7y0mo.cloudfront.net
- **Netlify**: https://ai4bharat.netlify.app
- **Local**: http://localhost:5173

## Next Steps

- [ ] Add visual regression tests
- [ ] Add API mocking for consistent results
- [ ] Set up CI/CD integration (GitHub Actions)
- [ ] Add performance budgets
- [ ] Add accessibility audits (axe-core)
