import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(salt + password).digest('hex');
  return `${salt}:${hash}`;
}

export async function GET() {
  try {
    // Always delete and re-seed
    await db.like.deleteMany();
    await db.comment.deleteMany();
    await db.post.deleteMany();
    await db.user.deleteMany();

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
          isPremium: true,
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
          isPremium: false,
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
          isPremium: false,
        },
      }),
    ]);

    const samplePosts = [
      { title: 'The Art of Glassmorphism in Modern Web Design', excerpt: 'Exploring how frosted glass effects are transforming digital interfaces and creating depth in flat design.', category: 'Design', thumbnail: 'https://picsum.photos/seed/glass1/800/400', readingTime: 6 },
      { title: 'Building Real-Time Applications with WebSockets', excerpt: 'A deep dive into creating responsive, real-time features using WebSocket technology and modern frameworks.', category: 'Tech', thumbnail: 'https://picsum.photos/seed/websocket1/800/400', readingTime: 8 },
      { title: 'Neon Aesthetics: Designing for the Digital Frontier', excerpt: 'How neon colors and glowing effects are defining the next generation of digital experiences.', category: 'Design', thumbnail: 'https://picsum.photos/seed/neon1/800/400', readingTime: 5 },
      { title: 'Mastering Framer Motion for Fluid Interfaces', excerpt: 'Creating smooth, physics-based animations that make your applications feel alive and responsive.', category: 'Tech', thumbnail: 'https://picsum.photos/seed/framer1/800/400', readingTime: 7 },
      { title: 'The Rise of Edge Computing in Web Applications', excerpt: 'How moving computation closer to users is revolutionizing web performance and user experience.', category: 'Tech', thumbnail: 'https://picsum.photos/seed/edge1/800/400', readingTime: 6 },
      { title: 'Dark Mode Design: Beyond Inverting Colors', excerpt: 'Creating thoughtful dark interfaces that reduce eye strain while maintaining visual hierarchy and aesthetics.', category: 'Design', thumbnail: 'https://picsum.photos/seed/dark1/800/400', readingTime: 5 },
      { title: 'TypeScript Patterns for Scalable Applications', excerpt: 'Advanced TypeScript techniques that make your codebase more maintainable, type-safe, and developer-friendly.', category: 'Tech', thumbnail: 'https://picsum.photos/seed/typescript1/800/400', readingTime: 7 },
      { title: 'Creative Coding: When Art Meets Algorithms', excerpt: 'Exploring the intersection of programming and visual art through generative design and creative algorithms.', category: 'Art', thumbnail: 'https://picsum.photos/seed/creative1/800/400', readingTime: 6 },
    ];

    const defaultContent = `# Placeholder Content\n\nThis is sample content for demonstration purposes. In a real application, this would contain the full article text with markdown formatting, code examples, and rich media.\n\n## Key Points\n\n- First important point about the topic\n- Second insight that readers should know\n- Third takeaway for practical application\n\n## Conclusion\n\nThe field continues to evolve and there's always more to learn. Stay curious and keep experimenting.`;

    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const authorIndex = i % artists.length;
      const slug = postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36) + i;

      const post = await db.post.create({
        data: {
          title: postData.title,
          slug,
          excerpt: postData.excerpt,
          content: defaultContent,
          thumbnail: postData.thumbnail,
          category: postData.category,
          published: true,
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
      { content: "I've been implementing this pattern in my projects and the results are amazing.", postIndex: 0, authorIndex: 2 },
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
      message: 'Database re-seeded successfully',
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
