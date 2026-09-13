You are converting a Google Stitch-generated UI into a production-ready React application.

I will provide you with:
1. The Stitch-generated HTML/Tailwind code
2. The Stitch screenshot/reference
3. The Stitch design information / DESIGN.md if available

Your PRIMARY objective is PIXEL-PERFECT VISUAL FIDELITY.

The Stitch screenshot is the SINGLE SOURCE OF TRUTH for the visual appearance.

Do NOT redesign, simplify, modernize, optimize, or reinterpret the UI.

==================================================
1. TECHNOLOGY
==================================================

Use:
- React
- Vite
- Tailwind CSS
- JavaScript/TypeScript as appropriate for the existing project

Do not introduce unnecessary libraries.

If the project already has a structure, preserve it unless there is a strong technical reason to change it.

==================================================
2. PIXEL-PERFECT REQUIREMENT
==================================================

The final browser rendering must visually match the Stitch screenshot as closely as possible.

Preserve EXACTLY:

- overall page dimensions
- component dimensions
- widths and heights
- spacing
- margins
- padding
- gaps
- alignment
- typography
- font family
- font size
- font weight
- line height
- letter spacing
- text wrapping
- colors
- backgrounds
- borders
- border radius
- shadows
- opacity
- gradients
- icons
- icon sizes
- icon stroke widths
- image dimensions
- image aspect ratios
- image cropping
- image positioning
- button dimensions
- hover states
- active states
- transitions
- animations
- z-index/layering
- positioning
- overflow behavior

DO NOT substitute approximate values when exact values can be obtained
from the Stitch code or screenshot.

For example:

DO NOT change:
p-[13px] -> p-3
gap-[18px] -> gap-4
text-[15px] -> text-sm
rounded-[14px] -> rounded-xl

unless the visual result is demonstrably identical.

Preserve arbitrary Tailwind values when they exist.

==================================================
3. STITCH CODE IS THE STARTING POINT
==================================================

Treat the Stitch-generated HTML/Tailwind code as the initial implementation.

Convert HTML to JSX/TSX carefully.

Preserve the existing Tailwind classes wherever possible.

Do NOT rewrite the styling into your own preferred Tailwind classes merely
for code cleanliness.

If Stitch uses:

class="..."

convert it to:

className="..."

but otherwise preserve the classes.

Only modify styles when required because of:
- React syntax
- componentization
- functionality
- accessibility
- dynamic behavior

==================================================
4. DO NOT INVENT DESIGN
==================================================

If something is unclear from the code, screenshot, or DESIGN.md:

DO NOT invent a different design.

First inspect the available source carefully.

If an exact value cannot be determined, choose the value that produces the
closest visual match to the reference screenshot.

Do not make subjective UI improvements.

==================================================
5. COMPONENTIZATION
==================================================

Break the UI into logical React components, but componentization MUST NOT
change the visual output.

For example:

src/
  components/
    Header/
    SearchBar/
    PropertyGallery/
    PropertyInfo/
    HostSection/
    BookingCard/
    ReviewSection/
    Footer/

Use smaller components where appropriate.

However, do NOT over-componentize simple elements merely for the sake of
having many files.

The rendered output is more important than abstraction.

==================================================
6. IMAGES AND ASSETS
==================================================

Use the exact images/assets supplied by Stitch whenever possible.

Do NOT replace an image with:
- another stock image
- a similar image
- an AI-generated image
- a placeholder

Preserve:

object-fit
object-position
aspect-ratio
width
height
border-radius
overflow

If an image appears cropped in the Stitch screenshot, reproduce the same crop.

If Stitch provides image URLs, use those URLs unless the project requires
local assets.

==================================================
7. ICONS
==================================================

Use the same icons as the Stitch implementation whenever possible.

Do NOT replace an icon with an arbitrary Unicode character.

For example, do not replace:

SVG icon

with:

♡
♥
→
←
⋮

unless that is actually how the Stitch implementation represents it.

Preserve icon:
- dimensions
- stroke width
- fill
- viewBox
- alignment
- spacing

==================================================
8. RESPONSIVENESS
==================================================

The target viewport is the viewport represented by the Stitch screenshot.

Prioritize pixel-perfect rendering at that viewport.

Do not change the desktop layout simply because you prefer a different
responsive strategy.

If responsive behavior is already present in the Stitch code, preserve it.

==================================================
9. INTERACTIONS
==================================================

Where interactions exist in the Stitch design, implement them.

Examples:
- buttons
- tabs
- dropdowns
- modals
- image galleries
- navigation
- hover states
- focus states
- keyboard interactions

Interactions must preserve the visual styling from Stitch.

Do not create fake interactions that visually differ from the reference.

==================================================
10. ACCESSIBILITY
==================================================

Maintain accessibility without changing the visual design.

Use:
- semantic HTML
- appropriate button elements
- alt text
- keyboard navigation
- visible focus states where appropriate
- aria-labels where necessary

Do not sacrifice accessibility for visual accuracy.

==================================================
11. DO NOT USE THE ORIGINAL WEBSITE CODE
==================================================

IMPORTANT:

This is an independently implemented UI based on the provided Stitch design.

Do NOT:
- scrape source code from an existing website
- copy an existing GitHub implementation
- copy CSS from another implementation
- copy React components from another project
- reverse engineer or lift the original website's codebase

Use only the provided Stitch design/code/assets and implement the UI yourself.

==================================================
12. VISUAL VALIDATION
==================================================

After implementing the page:

1. Start the development server.
2. Open the page in a browser.
3. Render it at the same viewport size as the Stitch reference.
4. Compare the implementation against the Stitch screenshot.
5. Identify visual differences.
6. Fix the differences.
7. Repeat until the result is as close as possible.

Pay particular attention to:

HEADER
- height
- logo position
- navigation spacing
- button sizes

LAYOUT
- container width
- left/right margins
- column widths
- gaps
- vertical rhythm

TYPOGRAPHY
- font family
- size
- weight
- line height
- text wrapping

IMAGES
- dimensions
- crop
- object-position
- border radius

BUTTONS
- height
- width
- padding
- border
- radius
- icon alignment

CARDS
- dimensions
- shadow
- border
- internal spacing

==================================================
13. SCREENSHOT COMPARISON
==================================================

Do NOT assume that "looks close enough" is sufficient.

Use this priority when fixing differences:

1. Overall layout
2. Component dimensions
3. Positioning/alignment
4. Typography
5. Images/cropping
6. Spacing
7. Colors
8. Borders/radius
9. Shadows
10. Icons
11. Animations/transitions

Fix the largest visual differences first.

==================================================
14. CODE QUALITY
==================================================

The final code should still be clean and maintainable.

Use:
- reusable components
- meaningful component names
- sensible file organization
- no unnecessary duplication
- no dead code
- no console errors

But NEVER sacrifice pixel accuracy merely to make the code "cleaner."

==================================================
15. FINAL REQUIREMENT
==================================================

Before considering the task complete, verify:

[ ] UI matches Stitch screenshot
[ ] Layout matches
[ ] Spacing matches
[ ] Typography matches
[ ] Colors match
[ ] Images match
[ ] Icons match
[ ] Borders/radius match
[ ] Shadows match
[ ] Component dimensions match
[ ] Interactions work
[ ] Animations/transitions match where applicable
[ ] Keyboard accessibility works
[ ] No console errors
[ ] No unnecessary dependencies
[ ] No copied code from the original/reference website

IMPORTANT:

DO NOT tell me that the implementation is complete until you have actually
checked the rendered UI against the Stitch reference.

When you find a mismatch, fix the implementation rather than explaining why
the mismatch exists.