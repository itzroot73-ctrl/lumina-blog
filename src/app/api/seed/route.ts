import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(salt + password).digest('hex');
  return `${salt}:${hash}`;
}

const samplePosts = [
  {
    title: 'The Art of Glassmorphism in Modern Web Design',
    excerpt: 'Exploring how frosted glass effects are transforming digital interfaces and creating depth in flat design.',
    content: `# The Art of Glassmorphism in Modern Web Design

Glassmorphism has become one of the most influential design trends in recent years. This style, characterized by frosted-glass-like elements with translucent backgrounds and subtle borders, creates a sense of depth and hierarchy that flat design alone cannot achieve.

## What Makes Glassmorphism Work?

The key ingredients of glassmorphism are:

- **Transparency**: Semi-transparent backgrounds that let underlying elements show through
- **Blur**: Backdrop-filter blur creates the frosted glass effect
- **Subtle borders**: Thin, semi-transparent borders that define edges
- **Layered depth**: Multiple layers creating a sense of spatial hierarchy

## The Science Behind the Aesthetic

Our brains are wired to understand transparent materials. When we see a frosted glass element, we instinctively understand that it's floating above other content. This creates a natural sense of depth without requiring shadows or 3D transforms.

## Implementation Tips

\`\`\`css
.glass-element {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
\`\`\`

## Accessibility Considerations

While glassmorphism is beautiful, it's important to ensure sufficient contrast for readability. Always test your designs with accessibility tools and provide fallbacks for browsers that don't support backdrop-filter.

The future of interface design lies in finding the balance between aesthetic appeal and functional clarity. Glassmorphism, when used thoughtfully, can achieve both.`,
    thumbnail: 'https://picsum.photos/seed/glass1/800/400',
    published: true,
    readingTime: 6,
  },
  {
    title: 'Building Real-Time Applications with WebSockets',
    excerpt: 'A deep dive into creating responsive, real-time features using WebSocket technology and modern frameworks.',
    content: `# Building Real-Time Applications with WebSockets

Real-time features are no longer a luxury—they're an expectation. From chat applications to collaborative editing tools, users expect instant feedback and live updates.

## Why WebSockets?

Traditional HTTP requests follow a request-response pattern. The client asks, the server answers. But many modern applications need the server to push data to the client without being asked.

WebSockets provide a persistent, full-duplex connection between client and server, enabling:

- **Instant messaging**: Messages appear in real-time
- **Live collaboration**: Multiple users can edit simultaneously
- **Real-time dashboards**: Data updates as it changes
- **Gaming**: Low-latency multiplayer experiences

## Architecture Patterns

### Pub/Sub Pattern
The publish-subscribe pattern is fundamental to real-time applications. Clients subscribe to "channels" or "rooms," and messages published to those channels are immediately delivered to all subscribers.

### State Synchronization
For collaborative applications, you need a strategy for synchronizing state across clients. Operational Transform (OT) and Conflict-free Replicated Data Types (CRDTs) are two popular approaches.

## Performance Considerations

- Keep WebSocket messages small
- Implement heartbeat mechanisms
- Handle reconnection gracefully
- Use message batching for high-frequency updates

Real-time doesn't have to be complex. With the right patterns and tools, you can build responsive applications that feel magical to users.`,
    thumbnail: 'https://picsum.photos/seed/websocket1/800/400',
    published: true,
    readingTime: 8,
  },
  {
    title: 'Neon Aesthetics: Designing for the Digital Frontier',
    excerpt: 'How neon colors and glowing effects are defining the next generation of digital experiences.',
    content: `# Neon Aesthetics: Designing for the Digital Frontier

Neon design draws inspiration from cyberpunk, synthwave, and the glowing signage of urban nightlife. In digital interfaces, neon accents create focus, energy, and a futuristic feel.

## The Psychology of Neon

Neon colors—cyan, magenta, electric purple—naturally draw attention. They're high-energy, high-saturation colors that our visual system prioritizes. When used sparingly, they create powerful focal points.

## Color Palettes

The most effective neon palettes combine:

- **Cyan (#00f0ff)**: Technology, clarity, digital precision
- **Purple (#a855f7)**: Creativity, mystery, imagination  
- **Emerald (#10b981)**: Growth, success, nature-tech fusion
- **Magenta (#ff00ff)**: Boldness, innovation, edge

## Glow Effects

The glow effect is achieved through box-shadow with spread:

\`\`\`css
.neon-glow {
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3),
              0 0 30px rgba(0, 240, 255, 0.1);
}
\`\`\`

## When to Use Neon

Neon works best as an accent, not a foundation. Use it for:
- Call-to-action buttons
- Active states and indicators
- Highlights and emphasis
- Brand elements

Avoid using neon for large areas of text or backgrounds—it causes eye strain and reduces readability.

The key to mastering neon aesthetics is restraint. A single neon accent on a dark background is more powerful than a fully saturated neon interface.`,
    thumbnail: 'https://picsum.photos/seed/neon1/800/400',
    published: true,
    readingTime: 5,
  },
  {
    title: 'Mastering Framer Motion for Fluid Interfaces',
    excerpt: 'Creating smooth, physics-based animations that make your applications feel alive and responsive.',
    content: `# Mastering Framer Motion for Fluid Interfaces

Animation is not decoration—it's communication. When elements move naturally, users understand relationships, hierarchy, and cause-and-effect intuitively.

## Why Framer Motion?

Framer Motion is React's most popular animation library for good reason:

- **Declarative API**: Describe what should happen, not how
- **Layout animations**: Elements automatically animate when their position changes
- **Gesture support**: Drag, tap, hover, and more
- **Orchestration**: Coordinate complex animation sequences

## Key Concepts

### Variants
Variants let you define animation states and transition between them:

\`\`\`tsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
\`\`\`

### Stagger Children
One of the most powerful patterns—staggering children animations creates a cascading reveal effect:

\`\`\`tsx
const container = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
}
\`\`\`

### AnimatePresence
For exit animations, AnimatePresence keeps elements in the DOM long enough to animate out:

\`\`\`tsx
<AnimatePresence>
  {isVisible && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>
\`\`\`

## Performance Tips

- Use \`transform\` properties (x, y, scale, rotate) instead of layout properties
- Set \`will-change\` sparingly
- Use \`layoutId\` for shared element transitions
- Prefer CSS animations for simple hover effects

Animation should serve the user's understanding, not just their entertainment. Every motion should have meaning.`,
    thumbnail: 'https://picsum.photos/seed/framer1/800/400',
    published: true,
    readingTime: 7,
  },
  {
    title: 'The Rise of Edge Computing in Web Applications',
    excerpt: 'How moving computation closer to users is revolutionizing web performance and user experience.',
    content: `# The Rise of Edge Computing in Web Applications

Edge computing represents a fundamental shift in how we architect web applications. Instead of processing everything in centralized data centers, we distribute computation to nodes closer to users.

## What is Edge Computing?

Edge computing runs your application logic on servers distributed across the globe—closer to where your users actually are. This reduces latency dramatically.

## Benefits for Web Applications

### Reduced Latency
A request that travels 50ms to a central server and 50ms back has 100ms of network latency alone. Edge computing can reduce this to under 10ms.

### Better Personalization
With edge functions, you can personalize content without client-side JavaScript, improving both performance and SEO.

### Improved Reliability
Distributed computation means no single point of failure. If one edge node goes down, others seamlessly take over.

## Real-World Applications

- **A/B testing at the edge**: Serve different variants without client-side flickering
- **Geographic personalization**: Adjust content, currency, and language based on location
- **Authentication at the edge**: Validate tokens before reaching origin servers
- **CDN logic**: Custom caching strategies per route and user

The edge is not replacing traditional servers—it's complementing them. Use the edge for latency-sensitive operations and origin servers for heavy computation.`,
    thumbnail: 'https://picsum.photos/seed/edge1/800/400',
    published: true,
    readingTime: 6,
  },
  {
    title: 'Dark Mode Design: Beyond Inverting Colors',
    excerpt: 'Creating thoughtful dark interfaces that reduce eye strain while maintaining visual hierarchy and aesthetics.',
    content: `# Dark Mode Design: Beyond Inverting Colors

Dark mode is more than just swapping white backgrounds for black. A well-designed dark interface requires rethinking color, contrast, and visual hierarchy entirely.

## Common Mistakes

### Pure Black Backgrounds
Pure black (#000000) creates too much contrast with white text, causing eye strain. Instead, use dark grays (#0a0a14, #12121e) that feel rich without being harsh.

### Desaturated Colors
Colors that look great on light backgrounds can feel neon-harsh on dark backgrounds. Reduce saturation by 10-20% for dark mode palettes.

### Forgetting Elevation
On dark surfaces, shadows don't work well. Use subtle background color differences to indicate elevation instead.

## Building a Dark Design System

### Background Layers
- **Base**: #0a0a14 (deepest)
- **Surface**: #12121e (cards)
- **Elevated**: #1a1a2e (modals, popovers)

### Text Hierarchy
- **Primary**: rgba(255, 255, 255, 0.95)
- **Secondary**: rgba(255, 255, 255, 0.7)
- **Muted**: rgba(255, 255, 255, 0.45)

### Accent Colors
Neon accents work beautifully on dark backgrounds—use them for interactive elements and important information.

Dark mode isn't just aesthetic preference—it's about creating comfortable, accessible experiences for users in any environment.`,
    thumbnail: 'https://picsum.photos/seed/dark1/800/400',
    published: true,
    readingTime: 5,
  },
  {
    title: 'TypeScript Patterns for Scalable Applications',
    excerpt: 'Advanced TypeScript techniques that make your codebase more maintainable, type-safe, and developer-friendly.',
    content: `# TypeScript Patterns for Scalable Applications

As applications grow, TypeScript's type system becomes your most powerful tool for maintaining code quality and developer productivity.

## Discriminated Unions

One of TypeScript's most powerful patterns for modeling state:

\`\`\`typescript
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
\`\`\`

The \`status\` discriminant ensures TypeScript knows exactly which properties are available in each state.

## Builder Pattern with Types

Create type-safe APIs using the builder pattern:

\`\`\`typescript
class QueryBuilder<T> {
  private filters: Filter[] = [];
  
  where(field: keyof T, value: T[keyof T]): this {
    this.filters.push({ field, value });
    return this;
  }
}
\`\`\`

## Branded Types

Prevent mixing up similar types (like userId and postId) with branded types:

\`\`\`typescript
type UserId = string & { readonly brand: unique symbol }
type PostId = string & { readonly brand: unique symbol }
\`\`\`

## The key to scalable TypeScript is thinking in types first. Design your types to make invalid states unrepresentable, and the rest follows naturally.`,
    thumbnail: 'https://picsum.photos/seed/typescript1/800/400',
    published: true,
    readingTime: 7,
  },
  {
    title: 'Creative Coding: When Art Meets Algorithms',
    excerpt: 'Exploring the intersection of programming and visual art through generative design and creative algorithms.',
    content: `# Creative Coding: When Art Meets Algorithms

Creative coding transforms algorithms into art. It's where the precision of programming meets the expressiveness of visual creation.

## What is Creative Coding?

Creative coding is programming with the primary goal of creating something expressive rather than functional. It includes:

- **Generative art**: Algorithms that produce unique visual outputs
- **Interactive installations**: Software that responds to physical input
- **Data visualization**: Making information beautiful as well as informative
- **Audio visualization**: Translating sound into visual experiences

## Getting Started

### Processing and p5.js
p5.js is the most accessible creative coding environment:

\`\`\`javascript
function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(10, 10, 20);
  const x = noise(frameCount * 0.01) * width;
  const y = noise(frameCount * 0.01 + 100) * height;
  circle(x, y, 50);
}
\`\`\`

### GLSL Shaders
For GPU-accelerated visuals, GLSL shaders provide incredible power:

\`\`\`glsl
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float d = length(uv - 0.5);
  gl_FragColor = vec4(vec3(smoothstep(0.5, 0.0, d)), 1.0);
}
\`\`\`

## Principles of Creative Coding

1. **Embrace randomness**: Controlled chaos creates organic beauty
2. **Iterate rapidly**: Small changes, many variations
3. **Observe nature**: The best algorithms mimic natural phenomena
4. **Share generously**: Creative coding thrives on community

The beauty of creative coding is that there are no wrong answers—only discoveries waiting to be made.`,
    thumbnail: 'https://picsum.photos/seed/creative1/800/400',
    published: true,
    readingTime: 6,
  },
];

export async function GET() {
  try {
    // Check if already seeded
    const existingUsers = await db.user.count();
    if (existingUsers > 0) {
      return NextResponse.json({ message: 'Database already seeded', count: existingUsers });
    }

    // Create sample artists
    const artists = await Promise.all([
      db.user.create({
        data: {
          email: 'luna@artisan.dev',
          name: 'Luna Chen',
          username: 'lunachen',
          password: hashPassword('password123'),
          bio: 'Digital artist and UI designer exploring the intersection of technology and aesthetics. Creating interfaces that feel alive.',
          avatar: 'https://i.pravatar.cc/150?u=luna',
          role: 'artist',
        },
      }),
      db.user.create({
        data: {
          email: 'kai@artisan.dev',
          name: 'Kai Nakamura',
          username: 'kainakamura',
          password: hashPassword('password123'),
          bio: 'Full-stack developer with a passion for real-time applications and creative coding. Building the future, one pixel at a time.',
          avatar: 'https://i.pravatar.cc/150?u=kai',
          role: 'artist',
        },
      }),
      db.user.create({
        data: {
          email: 'aria@artisan.dev',
          name: 'Aria Patel',
          username: 'ariapatel',
          password: hashPassword('password123'),
          bio: 'TypeScript enthusiast and open-source contributor. Writing code that scales and designs that inspire.',
          avatar: 'https://i.pravatar.cc/150?u=aria',
          role: 'artist',
        },
      }),
    ]);

    // Create posts
    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const authorIndex = i % artists.length;
      const slug =
        postData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
        '-' +
        Date.now().toString(36) +
        i;

      const post = await db.post.create({
        data: {
          title: postData.title,
          slug,
          excerpt: postData.excerpt,
          content: postData.content,
          thumbnail: postData.thumbnail,
          published: postData.published,
          readingTime: postData.readingTime,
          views: Math.floor(Math.random() * 500) + 50,
          authorId: artists[authorIndex].id,
        },
      });
      createdPosts.push(post);
    }

    // Add some comments
    const comments = [
      { content: 'This is incredibly well-written! The examples really helped me understand the concepts.', postIndex: 0, authorIndex: 1 },
      { content: 'I\'ve been implementing this pattern in my projects and the results are amazing.', postIndex: 0, authorIndex: 2 },
      { content: 'The section on performance optimization was exactly what I needed. Thanks!', postIndex: 1, authorIndex: 0 },
      { content: 'Beautiful explanation of a complex topic. Bookmarked!', postIndex: 2, authorIndex: 1 },
      { content: 'Would love to see a follow-up article on advanced animation techniques.', postIndex: 3, authorIndex: 2 },
      { content: 'This changed how I think about dark mode design. Great insights!', postIndex: 5, authorIndex: 0 },
    ];

    for (const comment of comments) {
      await db.comment.create({
        data: {
          content: comment.content,
          postId: createdPosts[comment.postIndex].id,
          authorId: artists[comment.authorIndex].id,
        },
      });
    }

    // Add some likes
    const likePairs = [
      [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1],
      [3, 0], [3, 2], [4, 0], [4, 1], [5, 0], [5, 1], [5, 2],
      [6, 0], [6, 1], [7, 0], [7, 1], [7, 2],
    ];

    for (const [postIdx, authorIdx] of likePairs) {
      await db.like.create({
        data: {
          postId: createdPosts[postIdx].id,
          userId: artists[authorIdx].id,
        },
      });
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      users: artists.length,
      posts: createdPosts.length,
      comments: comments.length,
      likes: likePairs.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
