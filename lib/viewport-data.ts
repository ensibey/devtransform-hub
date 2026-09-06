export interface ViewportDevice {
  slug: string;
  name: string;
  brand: string;
  category: 'smartphone' | 'tablet' | 'laptop' | 'desktop' | 'wearable';
  cssWidth: number;
  cssHeight: number;
  physicalWidth: number;
  physicalHeight: number;
  dpr: number;
  aspectRatio: string;
  screenDiagonal: string;
  releaseYear: number;
  tailwindBreakpoint: string;
  mediaQueryPortrait: string;
  mediaQueryLandscape: string;
  description: string;
  designTips: string[];
  faqs: { question: string; answer: string }[];
}

export const VIEWPORT_DEVICES: ViewportDevice[] = [
  {
    slug: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    brand: 'Apple',
    category: 'smartphone',
    cssWidth: 402,
    cssHeight: 874,
    physicalWidth: 1206,
    physicalHeight: 2622,
    dpr: 3,
    aspectRatio: '19.5:9',
    screenDiagonal: '6.3"',
    releaseYear: 2024,
    tailwindBreakpoint: 'Default Mobile (< 640px)',
    mediaQueryPortrait: '@media screen and (max-width: 402px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (max-height: 402px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape)',
    description: 'The iPhone 16 Pro features a 6.3-inch Super Retina XDR OLED display with a CSS viewport of 402 x 874 logical pixels at a 3x Device Pixel Ratio (DPR).',
    designTips: [
      'Account for Dynamic Island height (approx 54px) and safe area insets: env(safe-area-inset-top).',
      'Use env(safe-area-inset-bottom) for bottom navigation bars to avoid overlapping the home indicator pill.',
      'Test touch targets with a minimum of 44x44 CSS pixels.',
    ],
    faqs: [
      {
        question: 'What is the CSS viewport size of the iPhone 16 Pro?',
        answer: 'The CSS viewport size of the iPhone 16 Pro is 402 x 874 pixels in portrait mode, and 874 x 402 pixels in landscape mode.'
      },
      {
        question: 'What is the Device Pixel Ratio (DPR) for iPhone 16 Pro?',
        answer: 'The iPhone 16 Pro uses a 3x retina scaling factor (DPR = 3), resulting in a native physical resolution of 1206 x 2622 pixels.'
      }
    ]
  },
  {
    slug: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'smartphone',
    cssWidth: 440,
    cssHeight: 956,
    physicalWidth: 1320,
    physicalHeight: 2868,
    dpr: 3,
    aspectRatio: '19.5:9',
    screenDiagonal: '6.9"',
    releaseYear: 2024,
    tailwindBreakpoint: 'Default Mobile (< 640px)',
    mediaQueryPortrait: '@media screen and (max-width: 440px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (max-height: 440px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape)',
    description: 'The iPhone 16 Pro Max boasts the largest iPhone display ever at 6.9 inches, delivering a CSS viewport of 440 x 956 logical pixels at 3x DPR.',
    designTips: [
      'At 440px CSS width, generous padding and 2-column small card layouts are comfortably supported.',
      'Always integrate viewport-fit=cover in your meta tag and leverage CSS safe area environment variables.',
      'Ensure fixed floating action buttons (FABs) sit above the bottom safe area inset.',
    ],
    faqs: [
      {
        question: 'What is the CSS viewport size of the iPhone 16 Pro Max?',
        answer: 'The CSS viewport size of the iPhone 16 Pro Max is 440 x 956 pixels in portrait mode, and 956 x 440 pixels in landscape orientation.'
      },
      {
        question: 'How does the iPhone 16 Pro Max compare to iPhone 15 Pro Max?',
        answer: 'The iPhone 16 Pro Max increases logical CSS width from 430px to 440px, and CSS height from 932px to 956px, due to slimmer bezels and a 6.9-inch panel.'
      }
    ]
  },
  {
    slug: 'iphone-16',
    name: 'iPhone 16',
    brand: 'Apple',
    category: 'smartphone',
    cssWidth: 393,
    cssHeight: 852,
    physicalWidth: 1179,
    physicalHeight: 2556,
    dpr: 3,
    aspectRatio: '19.5:9',
    screenDiagonal: '6.1"',
    releaseYear: 2024,
    tailwindBreakpoint: 'Default Mobile (< 640px)',
    mediaQueryPortrait: '@media screen and (max-width: 393px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (max-height: 393px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape)',
    description: 'The standard iPhone 16 features a 6.1-inch OLED screen with a logical resolution of 393 x 852 CSS pixels at 3x DPR.',
    designTips: [
      'Shares identical CSS logical dimensions with iPhone 15 and iPhone 14 Pro (393 x 852 px).',
      'Accommodates Dynamic Island at top safe area inset.',
      'Use 16px standard body font size to prevent iOS Safari auto-zoom on input focus.',
    ],
    faqs: [
      {
        question: 'What is the CSS resolution of the iPhone 16?',
        answer: 'The iPhone 16 renders at 393 x 852 logical CSS pixels with a 3x device pixel ratio.'
      }
    ]
  },
  {
    slug: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'smartphone',
    cssWidth: 393,
    cssHeight: 852,
    physicalWidth: 1179,
    physicalHeight: 2556,
    dpr: 3,
    aspectRatio: '19.5:9',
    screenDiagonal: '6.1"',
    releaseYear: 2023,
    tailwindBreakpoint: 'Default Mobile (< 640px)',
    mediaQueryPortrait: '@media screen and (max-width: 393px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (max-height: 393px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape)',
    description: 'The iPhone 15 Pro features a 6.1-inch Super Retina display with 393 x 852 CSS viewport pixels and 3x DPR.',
    designTips: [
      'Test layouts with both Dynamic Island expanded and compact states.',
      'Check horizontal scrolling overflows on small cards.',
    ],
    faqs: [
      {
        question: 'What viewport size should I target for iPhone 15 Pro?',
        answer: 'Target 393px width for mobile portrait layouts and 852px width for landscape.'
      }
    ]
  },
  {
    slug: 'iphone-14',
    name: 'iPhone 14 / 13 / 12',
    brand: 'Apple',
    category: 'smartphone',
    cssWidth: 390,
    cssHeight: 844,
    physicalWidth: 1170,
    physicalHeight: 2532,
    dpr: 3,
    aspectRatio: '19.5:9',
    screenDiagonal: '6.1"',
    releaseYear: 2022,
    tailwindBreakpoint: 'Default Mobile (< 640px)',
    mediaQueryPortrait: '@media screen and (max-width: 390px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (max-height: 390px) and (-webkit-min-device-pixel-ratio: 3) and (orientation: landscape)',
    description: 'The iPhone 14, 13, and 12 base models share the classic notch design with a CSS viewport of 390 x 844 pixels at 3x DPR.',
    designTips: [
      'Top notch cutout requires env(safe-area-inset-top) which is typically 47px on notched iPhones.',
      'One of the most common active iOS devices globally; essential for QA testing.',
    ],
    faqs: [
      {
        question: 'What is the viewport of iPhone 14, 13, and 12?',
        answer: 'All three base models share the identical 390 x 844 CSS pixel viewport.'
      }
    ]
  },
  {
    slug: 'iphone-se-3',
    name: 'iPhone SE (3rd Gen)',
    brand: 'Apple',
    category: 'smartphone',
    cssWidth: 375,
    cssHeight: 667,
    physicalWidth: 750,
    physicalHeight: 1334,
    dpr: 2,
    aspectRatio: '16:9',
    screenDiagonal: '4.7"',
    releaseYear: 2022,
    tailwindBreakpoint: 'Default Mobile (< 640px)',
    mediaQueryPortrait: '@media screen and (max-width: 375px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (max-height: 375px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: landscape)',
    description: 'The iPhone SE (3rd Gen) retains the traditional home button form factor with a 375 x 667 CSS viewport and 2x DPR.',
    designTips: [
      'No top notch or dynamic island; standard status bar is 20px.',
      'Critical benchmark for small-screen mobile usability and vertical overflow.',
    ],
    faqs: [
      {
        question: 'What is the viewport size of the iPhone SE?',
        answer: 'The iPhone SE has a CSS viewport of 375 x 667 pixels at 2x DPR.'
      }
    ]
  },
  {
    slug: 'samsung-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphone',
    cssWidth: 384,
    cssHeight: 824,
    physicalWidth: 1440,
    physicalHeight: 3088,
    dpr: 3.75,
    aspectRatio: '19.3:9',
    screenDiagonal: '6.8"',
    releaseYear: 2024,
    tailwindBreakpoint: 'Default Mobile (< 640px)',
    mediaQueryPortrait: '@media screen and (max-width: 384px) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (max-height: 384px) and (orientation: landscape)',
    description: 'The Samsung Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED 2X panel with a default logical viewport of 384 x 824 CSS pixels at 3.75x DPR.',
    designTips: [
      'Android punch-hole camera sits centered at the top; status bar height is approximately 24-32px.',
      'Users can change display zoom in Android settings, which dynamically alters logical viewport width between 360px and 412px.',
    ],
    faqs: [
      {
        question: 'What is the viewport resolution for Samsung Galaxy S24 Ultra?',
        answer: 'The default browser viewport is 384 x 824 CSS pixels at a Device Pixel Ratio of 3.75.'
      }
    ]
  },
  {
    slug: 'samsung-galaxy-s24',
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    category: 'smartphone',
    cssWidth: 360,
    cssHeight: 780,
    physicalWidth: 1080,
    physicalHeight: 2340,
    dpr: 3,
    aspectRatio: '19.5:9',
    screenDiagonal: '6.2"',
    releaseYear: 2024,
    tailwindBreakpoint: 'Default Mobile (< 640px)',
    mediaQueryPortrait: '@media screen and (max-width: 360px) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (max-height: 360px) and (orientation: landscape)',
    description: 'The Samsung Galaxy S24 provides a compact 6.2-inch display rendering at 360 x 780 CSS pixels with 3x DPR.',
    designTips: [
      '360px width is the universal minimum standard for Android responsive design.',
      'Ensure grid columns wrap gracefully without text clipping at 360px.',
    ],
    faqs: [
      {
        question: 'What is the standard CSS width for Samsung Galaxy S24?',
        answer: 'The Galaxy S24 renders at 360 x 780 CSS pixels.'
      }
    ]
  },
  {
    slug: 'google-pixel-8-pro',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    category: 'smartphone',
    cssWidth: 412,
    cssHeight: 892,
    physicalWidth: 1344,
    physicalHeight: 2992,
    dpr: 3.25,
    aspectRatio: '20:9',
    screenDiagonal: '6.7"',
    releaseYear: 2023,
    tailwindBreakpoint: 'Default Mobile (< 640px)',
    mediaQueryPortrait: '@media screen and (max-width: 412px) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (max-height: 412px) and (orientation: landscape)',
    description: 'Google Pixel 8 Pro features a 6.7-inch Super Actua display with 412 x 892 CSS logical pixels at 3.25x DPR.',
    designTips: [
      '412px width is Google Chrome mobile emulator standard default for Android.',
      'Test gesture navigation bars at the bottom with env(safe-area-inset-bottom).',
    ],
    faqs: [
      {
        question: 'What is the CSS viewport of Google Pixel 8 Pro?',
        answer: 'The Pixel 8 Pro renders at 412 x 892 CSS pixels.'
      }
    ]
  },
  {
    slug: 'ipad-pro-12-9',
    name: 'iPad Pro 12.9" (M2 / M4)',
    brand: 'Apple',
    category: 'tablet',
    cssWidth: 1024,
    cssHeight: 1366,
    physicalWidth: 2048,
    physicalHeight: 2732,
    dpr: 2,
    aspectRatio: '4:3',
    screenDiagonal: '12.9"',
    releaseYear: 2023,
    tailwindBreakpoint: 'lg (>= 1024px) in portrait, xl (>= 1280px) in landscape',
    mediaQueryPortrait: '@media screen and (min-width: 1024px) and (max-width: 1024px) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (min-width: 1366px) and (max-width: 1366px) and (orientation: landscape)',
    description: 'The iPad Pro 12.9-inch offers desktop-class canvas space with 1024 x 1366 CSS pixels in portrait and 1366 x 1024 in landscape at 2x DPR.',
    designTips: [
      'Triggers desktop navigation and multi-column grid layouts.',
      'Supports iPadOS Split View and Stage Manager; viewport can be resized to 1/3, 1/2, or 2/3 width.',
      'Touch targets still apply despite desktop-class screen size.',
    ],
    faqs: [
      {
        question: 'What is the viewport of the iPad Pro 12.9 inch?',
        answer: 'The iPad Pro 12.9" has a CSS viewport of 1024 x 1366 pixels in portrait mode and 1366 x 1024 pixels in landscape mode.'
      }
    ]
  },
  {
    slug: 'ipad-pro-11',
    name: 'iPad Pro 11" (M2 / M4)',
    brand: 'Apple',
    category: 'tablet',
    cssWidth: 834,
    cssHeight: 1194,
    physicalWidth: 1668,
    physicalHeight: 2388,
    dpr: 2,
    aspectRatio: '1.43:1',
    screenDiagonal: '11.0"',
    releaseYear: 2024,
    tailwindBreakpoint: 'md (>= 768px) in portrait, lg (>= 1024px) in landscape',
    mediaQueryPortrait: '@media screen and (min-width: 834px) and (max-width: 834px) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (min-width: 1194px) and (max-width: 1194px) and (orientation: landscape)',
    description: 'The iPad Pro 11-inch features an edge-to-edge Liquid Retina display rendering at 834 x 1194 CSS pixels at 2x DPR.',
    designTips: [
      'In portrait mode (834px), falls into Tailwind md breakpoint.',
      'In landscape mode (1194px), falls into Tailwind lg breakpoint.',
      'Check sidebar collapsibility when user enters Split View.',
    ],
    faqs: [
      {
        question: 'What is the CSS viewport size for iPad Pro 11-inch?',
        answer: 'The iPad Pro 11" is 834 x 1194 CSS pixels in portrait and 1194 x 834 in landscape.'
      }
    ]
  },
  {
    slug: 'ipad-air-m2',
    name: 'iPad Air 10.9"',
    brand: 'Apple',
    category: 'tablet',
    cssWidth: 820,
    cssHeight: 1180,
    physicalWidth: 1640,
    physicalHeight: 2360,
    dpr: 2,
    aspectRatio: '1.44:1',
    screenDiagonal: '10.9"',
    releaseYear: 2024,
    tailwindBreakpoint: 'md (>= 768px)',
    mediaQueryPortrait: '@media screen and (min-width: 820px) and (max-width: 820px) and (orientation: portrait)',
    mediaQueryLandscape: '@media screen and (min-width: 1180px) and (max-width: 1180px) and (orientation: landscape)',
    description: 'The 10.9-inch iPad Air has a CSS viewport of 820 x 1180 pixels at 2x DPR.',
    designTips: [
      'Very popular tablet resolution; ideal for responsive tablet testing.',
      'Supports Apple Pencil hover interactions via @media (hover: hover) and (pointer: fine).',
    ],
    faqs: [
      {
        question: 'What is the viewport resolution for iPad Air?',
        answer: 'The iPad Air 10.9" renders at 820 x 1180 CSS pixels.'
      }
    ]
  },
  {
    slug: 'macbook-pro-16',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    category: 'laptop',
    cssWidth: 1728,
    cssHeight: 1117,
    physicalWidth: 3456,
    physicalHeight: 2234,
    dpr: 2,
    aspectRatio: '16:10',
    screenDiagonal: '16.2"',
    releaseYear: 2023,
    tailwindBreakpoint: '2xl (>= 1536px)',
    mediaQueryPortrait: '@media screen and (min-width: 1728px)',
    mediaQueryLandscape: '@media screen and (min-width: 1728px)',
    description: 'Apple MacBook Pro 16-inch Liquid Retina XDR screen renders at a default scaled CSS resolution of 1728 x 1117 pixels with 2x DPR.',
    designTips: [
      'Triggers Tailwind 2xl responsive breakpoint.',
      'Has camera housing notch; in full-screen mode, safe area insets apply.',
      'Check that hero graphics and max-width containers (max-w-7xl) do not look over-stretched.',
    ],
    faqs: [
      {
        question: 'What is the default CSS viewport of MacBook Pro 16"?',
        answer: 'The default scaled CSS viewport is 1728 x 1117 pixels at 2x DPR.'
      }
    ]
  },
  {
    slug: 'macbook-air-13',
    name: 'MacBook Air 13" (M2 / M3)',
    brand: 'Apple',
    category: 'laptop',
    cssWidth: 1470,
    cssHeight: 956,
    physicalWidth: 2560,
    physicalHeight: 1664,
    dpr: 2,
    aspectRatio: '16:10',
    screenDiagonal: '13.6"',
    releaseYear: 2024,
    tailwindBreakpoint: 'xl (>= 1280px)',
    mediaQueryPortrait: '@media screen and (min-width: 1470px)',
    mediaQueryLandscape: '@media screen and (min-width: 1470px)',
    description: 'The MacBook Air 13.6-inch display runs at an effective default CSS viewport of 1470 x 956 pixels at 2x DPR.',
    designTips: [
      'One of the world\'s most widely used laptops by developers and web consumers.',
      'Comfortably sits in the 1280px to 1536px xl breakpoint tier.',
    ],
    faqs: [
      {
        question: 'What is the CSS viewport of the 13-inch MacBook Air?',
        answer: 'The MacBook Air 13" has a default scaled resolution of 1470 x 956 CSS pixels.'
      }
    ]
  },
  {
    slug: 'desktop-1080p-fhd',
    name: 'Desktop Full HD (1080p)',
    brand: 'Standard',
    category: 'desktop',
    cssWidth: 1920,
    cssHeight: 1080,
    physicalWidth: 1920,
    physicalHeight: 1080,
    dpr: 1,
    aspectRatio: '16:9',
    screenDiagonal: '21.5" - 27"',
    releaseYear: 2020,
    tailwindBreakpoint: '2xl (>= 1536px)',
    mediaQueryPortrait: '@media screen and (min-width: 1920px)',
    mediaQueryLandscape: '@media screen and (min-width: 1920px)',
    description: 'Full HD 1920 x 1080 is the global baseline standard for desktop monitors and gaming displays, representing the most common web browsing resolution.',
    designTips: [
      'Use max-w-7xl (1280px) or max-w-6xl (1152px) container constraints to avoid unreadable long text line lengths.',
      'Ensure multi-column tables, dashboards, and sidebars have ample breathing room.',
    ],
    faqs: [
      {
        question: 'Is 1920x1080 still the most popular desktop resolution?',
        answer: 'Yes, 1920 x 1080 remains the most prevalent desktop resolution globally across web analytics.'
      }
    ]
  },
  {
    slug: 'desktop-1440p-qhd',
    name: 'Desktop Quad HD (1440p / 2K)',
    brand: 'Standard',
    category: 'desktop',
    cssWidth: 2560,
    cssHeight: 1440,
    physicalWidth: 2560,
    physicalHeight: 1440,
    dpr: 1,
    aspectRatio: '16:9',
    screenDiagonal: '27" - 32"',
    releaseYear: 2022,
    tailwindBreakpoint: '2xl (>= 1536px)',
    mediaQueryPortrait: '@media screen and (min-width: 2560px)',
    mediaQueryLandscape: '@media screen and (min-width: 2560px)',
    description: 'Quad HD (QHD / 2560 x 1440) is the preferred standard for software developers, productivity monitors, and creative workstations.',
    designTips: [
      'Large horizontal space makes sidebars and 3-to-4 column dashboards look great.',
      'Verify image clarity: non-retina SVGs and WebP assets must remain sharp.',
    ],
    faqs: [
      {
        question: 'What is 1440p viewport resolution?',
        answer: '1440p (QHD) provides 2560 x 1440 CSS pixels at 1x DPR.'
      }
    ]
  },
  {
    slug: 'desktop-4k-uhd',
    name: 'Desktop 4K Ultra HD',
    brand: 'Standard',
    category: 'desktop',
    cssWidth: 3840,
    cssHeight: 2160,
    physicalWidth: 3840,
    physicalHeight: 2160,
    dpr: 1,
    aspectRatio: '16:9',
    screenDiagonal: '27" - 43"',
    releaseYear: 2023,
    tailwindBreakpoint: '2xl (>= 1536px)',
    mediaQueryPortrait: '@media screen and (min-width: 3840px)',
    mediaQueryLandscape: '@media screen and (min-width: 3840px)',
    description: '4K Ultra HD offers 3840 x 2160 native resolution. When run at 150% or 200% OS scaling, effective CSS viewports range between 1920px and 2560px.',
    designTips: [
      'Ensure high-resolution @2x and @3x image assets are served via srcset.',
      'Check that fixed-size elements (e.g. 1px borders) do not vanish or render too thin.',
    ],
    faqs: [
      {
        question: 'How do browsers handle 4K resolution?',
        answer: 'Most operating systems (macOS, Windows) apply 150% or 200% DPI scaling to 4K monitors, translating to 2560x1440 or 1920x1080 effective CSS pixels with DPR 1.5 or 2.0.'
      }
    ]
  },
  {
    slug: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 (49mm)',
    brand: 'Apple',
    category: 'wearable',
    cssWidth: 205,
    cssHeight: 251,
    physicalWidth: 410,
    physicalHeight: 502,
    dpr: 2,
    aspectRatio: '1:1.22',
    screenDiagonal: '1.92"',
    releaseYear: 2023,
    tailwindBreakpoint: 'Micro Wearable (< 320px)',
    mediaQueryPortrait: '@media screen and (max-width: 205px)',
    mediaQueryLandscape: '@media screen and (max-width: 205px)',
    description: 'Apple Watch Ultra 2 has a 49mm case with a 205 x 251 CSS pixel canvas and 2x retina display.',
    designTips: [
      'Single-column layouts with large high-contrast typography.',
      'Minimalist interactive controls and touch targets occupying full width.',
    ],
    faqs: [
      {
        question: 'What is the viewport of Apple Watch Ultra 2?',
        answer: 'The Apple Watch Ultra 2 has a CSS viewport of 205 x 251 pixels at 2x DPR.'
      }
    ]
  }
];

export function getAllViewportDevices(): ViewportDevice[] {
  return VIEWPORT_DEVICES;
}

export function getViewportDeviceBySlug(slug: string): ViewportDevice | undefined {
  return VIEWPORT_DEVICES.find((d) => d.slug === slug);
}
