import { test, expect } from '@playwright/test';
import fc from 'fast-check';

/**
 * Bug Condition Exploration Test
 * 
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 * 
 * This test explores the horizontal scroll bug on the program detail page.
 * It verifies that at various viewport widths, the page content does not exceed
 * the viewport width, and no horizontal scrollbar appears.
 * 
 * EXPECTED OUTCOME on UNFIXED code: TEST FAILS
 * This failure confirms the bug exists - the page displays content wider than viewport.
 * 
 * Counterexamples should show viewport widths where scrollWidth > innerWidth,
 * proving horizontal scroll bug exists.
 */

// Test viewport widths covering all major device sizes
const VIEWPORT_WIDTHS = [375, 768, 1024, 1366, 1920, 2560, 3440];

// Use a real program slug for testing (assumes at least one course exists)
// In a real scenario, this could be parameterized from test data
const TEST_PROGRAM_SLUG = 'video-editing-mastery';

test.describe('Program Detail Page - Horizontal Scroll Bug Exploration', () => {
  test.describe('Bug Condition: Viewport Constraint Violations', () => {
    // Property-based test using fast-check to generate viewport widths
    // and verify no horizontal scroll at each size
    VIEWPORT_WIDTHS.forEach((viewportWidth) => {
      test(`should not have horizontal scroll at ${viewportWidth}px viewport width`, async ({ page }) => {
        // Set viewport to specific width
        await page.setViewportSize({ width: viewportWidth, height: 1080 });

        // Navigate to program detail page
        await page.goto(`/programs/${TEST_PROGRAM_SLUG}`);

        // Wait for content to load
        await page.waitForLoadState('networkidle');

        // Get viewport and document dimensions
        const measurements = await page.evaluate(() => {
          const body = document.body;
          const html = document.documentElement;

          return {
            windowInnerWidth: window.innerWidth,
            documentScrollWidth: body.scrollWidth,
            htmlScrollWidth: html.scrollWidth,
            maxScrollWidth: Math.max(body.scrollWidth, html.scrollWidth),
            hasHorizontalScrollbar: body.scrollWidth > window.innerWidth,
            bodyClientWidth: body.clientWidth,
            htmlClientWidth: html.clientWidth,
          };
        });

        // Get cover image dimensions if present
        const coverImageMeasurements = await page.evaluate(() => {
          const coverDiv = document.querySelector('.aspect-\\[21\\/9\\]');
          if (!coverDiv) return null;

          const rect = coverDiv.getBoundingClientRect();
          return {
            coverWidth: rect.width,
            coverLeft: rect.left,
            coverRight: rect.right,
            exceeds: rect.right > window.innerWidth,
          };
        });

        // Get syllabus grid measurements
        const syllabusMeasurements = await page.evaluate(() => {
          const syllabusGrid = document.querySelector('ol');
          if (!syllabusGrid) return null;

          const rect = syllabusGrid.getBoundingClientRect();
          return {
            gridWidth: rect.width,
            gridLeft: rect.left,
            gridRight: rect.right,
            exceeds: rect.right > window.innerWidth,
          };
        });

        // Check for actual scrollbar presence
        const hasScrollbar = measurements.maxScrollWidth > measurements.windowInnerWidth;

        console.log(`\n=== Viewport ${viewportWidth}px ===`);
        console.log('Measurements:', measurements);
        console.log('Cover Image:', coverImageMeasurements);
        console.log('Syllabus Grid:', syllabusMeasurements);

        // CRITICAL ASSERTION: No horizontal scroll should occur
        // This assertion MUST FAIL on unfixed code, proving the bug exists
        expect(
          measurements.maxScrollWidth,
          `Document width (${measurements.maxScrollWidth}px) should not exceed viewport width (${measurements.windowInnerWidth}px) at ${viewportWidth}px viewport`
        ).toBeLessThanOrEqual(measurements.windowInnerWidth);

        // CRITICAL ASSERTION: No horizontal scrollbar should be visible
        // This assertion MUST FAIL on unfixed code
        expect(
          hasScrollbar,
          `Horizontal scrollbar should not appear at ${viewportWidth}px viewport`
        ).toBe(false);

        // Document the violation for analysis
        if (measurements.maxScrollWidth > measurements.windowInnerWidth) {
          const overflow = measurements.maxScrollWidth - measurements.windowInnerWidth;
          console.log(`OVERFLOW DETECTED: ${overflow}px exceeds viewport at ${viewportWidth}px`);
        }
      });
    });
  });

  test.describe('Bug Manifestation Analysis', () => {
    test('should measure and document cover image section width at critical viewport sizes', async ({ page }) => {
      // Test the most critical viewport where bug is likely (desktop)
      const criticalViewports = [1366, 1920];

      for (const viewportWidth of criticalViewports) {
        await page.setViewportSize({ width: viewportWidth, height: 1080 });
        await page.goto(`/programs/${TEST_PROGRAM_SLUG}`);
        await page.waitForLoadState('networkidle');

        const analysis = await page.evaluate(() => {
          const coverSection = document.querySelector('.aspect-\\[21\\/9\\]');
          const mainElement = document.querySelector('main');
          const body = document.body;

          if (!coverSection) return { coverFound: false };

          const coverRect = coverSection.getBoundingClientRect();
          const mainRect = mainElement?.getBoundingClientRect();

          return {
            coverFound: true,
            viewportWidth: window.innerWidth,
            documentScrollWidth: body.scrollWidth,
            coverWidth: coverRect.width,
            coverExceedsViewport: coverRect.width > window.innerWidth,
            mainWidth: mainRect?.width || 'unknown',
            overflow: Math.max(0, body.scrollWidth - window.innerWidth),
          };
        });

        console.log(`\nCover Image Analysis at ${viewportWidth}px:`, analysis);

        // Document if cover image exceeds viewport
        if (analysis.coverFound && analysis.coverExceedsViewport) {
          expect(analysis.coverExceedsViewport).toBe(false);
        }
      }
    });

    test('should measure syllabus grid contribution to page width', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`/programs/${TEST_PROGRAM_SLUG}`);
      await page.waitForLoadState('networkidle');

      const gridAnalysis = await page.evaluate(() => {
        const syllabusOl = document.querySelector('ol');
        if (!syllabusOl) return { gridFound: false };

        const gridRect = syllabusOl.getBoundingClientRect();
        const body = document.body;
        
        // Get grid item widths
        const gridItems = Array.from(syllabusOl.querySelectorAll('li'));
        const itemWidths = gridItems.map(item => {
          const rect = item.getBoundingClientRect();
          return {
            width: rect.width,
            left: rect.left,
            right: rect.right,
            exceedsViewport: rect.right > window.innerWidth,
          };
        });

        return {
          gridFound: true,
          gridWidth: gridRect.width,
          gridExceedsViewport: gridRect.right > window.innerWidth,
          documentWidth: body.scrollWidth,
          viewportWidth: window.innerWidth,
          itemCount: gridItems.length,
          itemWidths: itemWidths.slice(0, 2), // Show first 2 items as sample
        };
      });

      console.log('\nSyllabus Grid Analysis:', gridAnalysis);
    });
  });
});
