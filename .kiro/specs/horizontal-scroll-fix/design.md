# Horizontal Scroll Fix Bugfix Design

## Overview

The program detail page (`/programs/$slug`) displays a horizontal scrollbar due to content exceeding the viewport width. The primary causes are: (1) the wide aspect-ratio cover image container (`aspect-[21/9]`) that lacks proper viewport constraints, (2) potential grid layout overflow from the syllabus section (`grid-cols-[60px_1fr_auto]`), and (3) excessive padding on container elements combined with full-width elements. The fix will constrain content to viewport width using proper overflow handling, responsive padding, and grid layout adjustments while preserving all existing functionality on other pages.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when the program detail page renders content that exceeds viewport width causing horizontal scroll
- **Property (P)**: The desired behavior - all content should be constrained to viewport width without horizontal scrollbar
- **Preservation**: Existing program listing page layout, responsive breakpoints, image aspect ratios, sticky sidebar positioning, header/footer display, and hover effects that must remain unchanged by the fix
- **`programs.$slug.tsx`**: The program detail page component in `src/routes/programs.$slug.tsx` that contains the wide cover image and syllabus grid
- **`aspect-[21/9]`**: Tailwind CSS class creating an ultra-wide 21:9 aspect ratio for the cover image, which extends beyond viewport on standard screens
- **`grid-cols-[60px_1fr_auto]`**: CSS grid template defining the syllabus item layout with fixed 60px first column, flexible middle column, and auto-sized last column
- **Viewport Width**: The visible area of the browser window, which content should not exceed horizontally

## Bug Details

### Bug Condition

The bug manifests when the program detail page (`/programs/$slug`) is loaded and rendered. The page contains elements that extend beyond the viewport width, causing a horizontal scrollbar to appear. The primary culprits are: (1) the cover image section with `aspect-[21/9]` class that creates an ultra-wide container, (2) the full-width image wrapper that lacks proper viewport constraints, and (3) the combination of `max-w-[1400px]` containers with `px-6` padding that may not prevent child elements from overflowing.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type PageRenderState
  OUTPUT: boolean
  
  RETURN input.route == "/programs/$slug"
         AND input.documentWidth > input.viewportWidth
         AND (input.coverImageWidth > input.viewportWidth 
              OR input.syllabusGridWidth > input.viewportWidth
              OR input.containerPadding + input.contentWidth > input.viewportWidth)
END FUNCTION
```

### Examples

- **Example 1**: User navigates to `/programs/video-editing-mastery` on a 1920px wide desktop screen. The page loads with a horizontal scrollbar appearing at the bottom. The cover image section with `aspect-[21/9]` extends beyond the viewport, requiring horizontal scroll to view the entire image.
  - **Expected**: Page should fit within 1920px viewport with no horizontal scroll
  - **Actual**: Page width exceeds viewport, horizontal scrollbar present

- **Example 2**: User views the program detail page on a 1366px laptop screen. The syllabus grid with `grid-cols-[60px_1fr_auto]` combined with the container's padding causes the content area to extend beyond the viewport width.
  - **Expected**: Syllabus grid should adapt to available space within viewport
  - **Actual**: Content overflows horizontally with visible scrollbar

- **Example 3**: User loads the page on a tablet (768px width). The cover image wrapper doesn't properly constrain the `aspect-[21/9]` content, causing horizontal overflow even on smaller screens.
  - **Expected**: Cover image should be constrained to tablet viewport width
  - **Actual**: Image container exceeds viewport boundaries

- **Edge Case**: User with ultra-wide monitor (3440px) views the page. The `max-w-[1400px]` container properly centers content, but the full-width cover image section outside the container still causes issues on standard screens.
  - **Expected**: Content properly centered with no overflow on any screen size

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- The program listing page (`/programs`) grid layout must continue to display correctly without horizontal scroll
- Responsive layouts for mobile (< 768px) and tablet (768px - 1023px) viewports must continue to apply proper breakpoint styles
- Images throughout the programs section must maintain their aspect ratios and visual quality (grayscale to color transitions, object-fit behavior)
- The sticky sidebar (`lg:sticky lg:top-32`) on the program detail page must continue to position correctly without affecting page width
- Header and footer components must continue to display correctly without layout shifts or width changes
- Syllabus item hover effects (`hover:bg-card/50`, `group-hover:italic`) must continue to work as expected

**Scope:**
All inputs that do NOT involve the program detail page route (`/programs/$slug`) should be completely unaffected by this fix. This includes:
- Program listing page (`/programs`) layout and interactions
- Header and footer navigation functionality
- Mouse clicks and hover states on all interactive elements
- Other routes and pages in the application
- Mobile and tablet responsive behaviors on non-buggy pages

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Unconstrained Cover Image Wrapper**: The cover image section uses `aspect-[21/9]` which creates an ultra-wide aspect ratio (2.33:1). This is wrapped in a `ScrollReveal` component without viewport constraints, allowing it to extend beyond the screen width. The section appears outside any `max-w-[1400px]` container, making it full viewport width plus any overflow.

2. **Missing Overflow Control on Parent Containers**: The cover image wrapper has `overflow-hidden` on itself but the parent `ScrollReveal` may not have proper constraints. The full-width nature of this section (outside the padded container) means it can exceed viewport boundaries.

3. **Grid Layout Column Width Calculation**: The syllabus grid uses `grid-cols-[60px_1fr_auto]` which should be responsive, but combined with padding (`px-6`) and the `max-w-[1400px]` container, the middle flexible column (`1fr`) may not be constraining properly when content is long.

4. **Container Padding Accumulation**: The page uses `px-6` (24px on each side) on multiple nested containers. When combined with `max-w-[1400px]` and full-width child elements, this padding may push content beyond viewport boundaries on smaller screens.

## Correctness Properties

Property 1: Bug Condition - No Horizontal Scroll on Program Detail Page

_For any_ viewport width where the program detail page is rendered, the fixed layout SHALL constrain all content (cover image, syllabus grid, and containers) to fit within the viewport width without requiring horizontal scrolling, ensuring `document.body.scrollWidth <= window.innerWidth`.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Program Listing and Other Pages Layout

_For any_ page route that is NOT the program detail page (`/programs/$slug`), the fixed CSS SHALL produce exactly the same layout, spacing, and visual behavior as the original code, preserving the program listing grid, responsive breakpoints, image displays, header/footer positioning, and all interactive hover effects.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `src/routes/programs.$slug.tsx`

**Function/Component**: `CoursePage` component

**Specific Changes**:

1. **Constrain Cover Image Section to Viewport**: Wrap the cover image `ScrollReveal` section in a container with `overflow-hidden` and `max-w-full` to prevent horizontal overflow
   - Add `max-w-full overflow-hidden` classes to the cover image wrapper
   - Consider changing `aspect-[21/9]` to a less extreme ratio like `aspect-[16/9]` or `aspect-video` for better viewport fit
   - Alternative: Keep the aspect ratio but ensure the parent container prevents overflow with proper `w-full` constraint

2. **Add Viewport Constraints to Full-Width Sections**: Ensure all full-width sections outside the `max-w-[1400px]` container have proper overflow handling
   - Add `overflow-x-hidden` to the main `<main>` element or wrapping div
   - Ensure the cover image section has `w-full` and `max-w-full` to respect viewport boundaries

3. **Review and Adjust Grid Layout**: Verify the syllabus grid doesn't cause overflow
   - The `grid-cols-[60px_1fr_auto]` should be fine as `1fr` is flexible, but ensure no fixed-width content in the middle column exceeds available space
   - Add `min-w-0` to grid items if text overflow is occurring (allows text truncation)

4. **Optimize Container Padding for Smaller Viewports**: Adjust padding to be more responsive
   - Consider reducing `px-6` to `px-4` on mobile breakpoints: `px-4 md:px-6`
   - Ensure the `max-w-[1400px]` containers have appropriate horizontal constraints

5. **Add Global Overflow Prevention**: Add `overflow-x-hidden` to the root page container to prevent any child from causing horizontal scroll
   - Apply to the outermost `<div className="min-h-screen bg-background">` or add to `<body>` via global styles

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the horizontal scroll bug on unfixed code at various viewport widths, then verify the fix eliminates horizontal scroll while preserving all existing layout and functionality on other pages.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the horizontal scroll bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Manually test the program detail page at various viewport widths and use browser DevTools to measure `document.body.scrollWidth` vs `window.innerWidth`. Run automated tests that load the page in different viewport sizes and assert no horizontal overflow exists. Run these tests on the UNFIXED code to observe failures.

**Test Cases**:
1. **Desktop Viewport Test (1920px)**: Load `/programs/$slug` at 1920px width, measure document width vs viewport width (will fail on unfixed code - horizontal scrollbar present)
2. **Laptop Viewport Test (1366px)**: Load page at 1366px width, verify cover image and syllabus don't overflow (will fail on unfixed code)
3. **Tablet Viewport Test (768px)**: Load page at tablet width, check for horizontal scroll (may fail on unfixed code)
4. **Mobile Viewport Test (375px)**: Load page at mobile width, verify all content fits (should pass if mobile already works, but verify)
5. **Ultra-wide Monitor Test (3440px)**: Load page at ultra-wide resolution, verify centered content doesn't cause issues (may pass as `max-w-[1400px]` centers content)

**Expected Counterexamples**:
- `document.body.scrollWidth > window.innerWidth` on desktop and laptop viewports
- Visible horizontal scrollbar when inspecting the page
- Cover image section extending beyond viewport boundaries
- Possible causes: missing `max-w-full` on cover section, lack of `overflow-hidden` on parent, extreme `aspect-[21/9]` ratio

### Fix Checking

**Goal**: Verify that for all viewport widths where the bug condition holds, the fixed layout produces no horizontal scroll.

**Pseudocode:**
```
FOR ALL viewportWidth IN [375, 768, 1024, 1366, 1920, 2560, 3440] DO
  page := loadProgramDetailPage(viewportWidth)
  ASSERT page.documentWidth <= viewportWidth
  ASSERT page.hasHorizontalScrollbar == false
END FOR
```

**Testing Approach**: Use Playwright or Cypress to load the program detail page at various viewport widths and measure the document width. Assert that `document.body.scrollWidth <= window.innerWidth` for all tested widths.

### Preservation Checking

**Goal**: Verify that for all pages where the bug condition does NOT hold (non-program-detail pages), the fixed CSS produces the same layout as the original code.

**Pseudocode:**
```
FOR ALL route IN ["/programs", "/", "/pricing", "/about"] DO
  ASSERT layoutAfterFix(route) == layoutBeforeFix(route)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across different viewport widths
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that layout is unchanged for all non-buggy routes

**Test Plan**: Take screenshots of the program listing page (`/programs`) on UNFIXED code at various viewport widths, then compare with screenshots after the fix to ensure pixel-perfect preservation. Write visual regression tests or DOM structure comparison tests.

**Test Cases**:
1. **Program Listing Layout Preservation**: Load `/programs` before and after fix, verify grid layout, spacing, and no horizontal scroll remains identical
2. **Image Aspect Ratio Preservation**: Verify program card images on listing page maintain `aspect-[4/5]` ratio and grayscale hover effects work correctly
3. **Responsive Breakpoint Preservation**: Test that `md:grid-cols-2` and `lg:grid-cols-3` breakpoints still apply correctly on listing page
4. **Header and Footer Preservation**: Verify header and footer render identically on all pages after fix
5. **Syllabus Hover Effects Preservation**: Verify syllabus item hover effects (`hover:bg-card/50`, `group-hover:italic`) still work on program detail page

### Unit Tests

- Test that cover image section renders without exceeding viewport width at 1920px, 1366px, 768px viewports
- Test that syllabus grid layout renders correctly without overflow
- Test edge case: program with no cover image (fallback gradient div) doesn't cause overflow
- Test edge case: program with very long lesson titles in syllabus grid handles text overflow properly

### Property-Based Tests

- Generate random viewport widths (300px to 4000px) and verify program detail page never exceeds viewport width
- Generate random program data (with/without cover images, varying lesson counts) and verify no horizontal scroll occurs
- Test that all routes except `/programs/$slug` produce identical layout before and after fix across many viewport sizes

### Integration Tests

- Test full user flow: navigate from `/programs` to `/programs/$slug`, verify no horizontal scroll on detail page, navigate back, verify listing page unchanged
- Test responsive behavior: resize browser window from desktop to mobile while on program detail page, verify no horizontal scroll at any size
- Test visual feedback: hover over syllabus items, verify hover effects work correctly without layout shifts
- Test sticky sidebar: scroll down program detail page, verify sidebar sticks correctly without affecting page width
