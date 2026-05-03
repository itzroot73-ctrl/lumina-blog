---
Task ID: 3
Agent: main
Task: Implement Professional Google Ads Integration with Cookie Consent & Performance Optimization

Work Log:
- Created AdSenseProvider component (src/components/ads/AdSenseProvider.tsx) with:
  - Conditional AdSense script loading (NOT loaded if isPremium=true for page speed)
  - NOT loaded if cookieConsent=false (GDPR compliance)
  - Lazy script injection using requestIdleCallback / setTimeout fallback
  - Automatic cleanup of AdSense scripts when user activates premium
  - React Context for sharing ad state across components
- Created GoogleAdInFeed component (src/components/ads/GoogleAdInFeed.tsx):
  - Google "In-feed" ad format between blog cards on home page
  - IntersectionObserver-based lazy loading (200px rootMargin)
  - Glassmorphic styling with Sponsored label
  - Skeleton placeholder while loading
  - Auto-pushes adsbygoogle when visible and script loaded
- Created GoogleAdInArticle component (src/components/ads/GoogleAdInArticle.tsx):
  - Google "In-article" ad format inserted after 3rd paragraph in PostDetail
  - IntersectionObserver lazy loading (300px rootMargin)
  - Elegant "Advertisement" divider label
  - Hidden for premium users and without cookie consent
- Created GoogleAdSidebar component (src/components/ads/GoogleAdSidebar.tsx):
  - Google Display Ad format for sticky sidebar on large screens
  - Glassmorphic sidebar styling with backdrop-filter blur
  - Responsive auto-format with data-full-width-responsive
  - Lazy loaded via IntersectionObserver
- Created CookieConsentBanner component (src/components/CookieConsentBanner.tsx):
  - Glassmorphic banner at bottom of page with blur effects
  - Cookie + Shield icons for privacy messaging
  - Accept / Decline / Dismiss buttons
  - Animated entrance/exit via Framer Motion
  - Persistent consent in localStorage
- Created ads.txt placeholder in public/ root directory
- Updated Zustand store (src/lib/store.ts):
  - Added cookieConsent boolean state
  - Added setCookieConsent action with localStorage persistence
  - Restores consent from localStorage on checkAuth()
- Updated HomeFeed (src/components/HomeFeed.tsx):
  - Replaced mock AdSlot with GoogleAdInFeed between every 4 posts
  - Replaced sidebar AdSlot with GoogleAdSidebar (2 instances)
  - Sidebar with ads hidden for premium users
- Updated PostDetail (src/components/PostDetail.tsx):
  - Added contentWithAd useMemo that splits markdown content by paragraphs
  - Inserts <!--AD_INSERT--> marker after 3rd paragraph
  - Renders GoogleAdInArticle at the split point
  - Ad only shown for non-premium users
- Updated page.tsx:
  - Wrapped entire app in AdSenseProvider with cookieConsent prop
  - Added CookieConsentBanner with Accept/Decline/Dismiss handlers
- Updated globals.css:
  - Added .glass-ad-card styles (subtle border, purple hover glow)
  - Added .glass-ad-inarticle styles (top/bottom border divider)
  - Added .glass-ad-sidebar styles (dark glassmorphic with blur)
  - Added .glass-cookie-banner styles (heavy blur, shadow)
- Verified build succeeds (npx next build - 0 errors)
- Verified dev server runs and page renders HTTP 200
- Verified /ads.txt returns 200
- Verified /api/posts returns data correctly

Stage Summary:
- Full Google AdSense integration with 3 ad formats: In-Feed, In-Article, Sidebar Display
- isPremium gate: AdSense script NOT loaded for premium users (page speed optimization)
- Cookie consent gate: AdSense script NOT loaded without consent (GDPR compliance)
- Lazy loading for all ad units via IntersectionObserver
- Cookie Consent Banner with glassmorphic design
- ads.txt placeholder file in public root
- All components use glassmorphic styling matching the platform theme
