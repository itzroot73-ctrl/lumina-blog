'use client';

import { useAppStore, type Comment as CommentType } from '@/lib/store';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { GoogleAdInArticle } from './ads';
import CinematicVideoHero from './CinematicVideoHero';
import ProjectInfoGrid from './ProjectInfoGrid';
import MainChallenges from './MainChallenges';
import {
  Heart,
  MessageCircle,
  Eye,
  Share2,
  ArrowLeft,
  Send,
  Check,
  Trash2,
} from 'lucide-react';

function CommentCard({ comment }: { comment: CommentType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 border border-white/10 shrink-0">
          <AvatarImage src={comment.author.avatar || undefined} alt={comment.author.name} />
          <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-xs">
            {comment.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => {}}
              className="text-sm font-medium text-white/80 hover:text-[#f97316] transition-colors"
            >
              {comment.author.name}
            </button>
            <span className="text-xs text-white/30">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Scroll-triggered section wrapper
function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function PostDetail() {
  const {
    currentPost,
    currentPostComments,
    userLikedCurrentPost,
    isAuthenticated,
    user,
    navigate,
    loadPost,
    loadComments,
    toggleLike,
    addComment,
    deletePost,
    viewParams,
  } = useAppStore();

  const isPremium = user?.isPremium ?? false;
  const isAuthor = user?.id === currentPost?.authorId;

  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [shared, setShared] = useState(false);

  // Split content into paragraph blocks and insert in-article ad after 3rd paragraph
  const contentWithAd = useMemo(() => {
    if (!currentPost?.content || isPremium) return currentPost?.content || '';
    const paragraphs = currentPost.content.split(/\n\n+/);
    if (paragraphs.length <= 3) return currentPost.content;
    const beforeAd = paragraphs.slice(0, 3).join('\n\n');
    const afterAd = paragraphs.slice(3).join('\n\n');
    return `${beforeAd}\n\n<!--AD_INSERT-->\n\n${afterAd}`;
  }, [currentPost?.content, isPremium]);

  useEffect(() => {
    if (viewParams.id) {
      loadPost(viewParams.id);
      loadComments(viewParams.id);
    }
  }, [viewParams.id, loadPost, loadComments]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like posts');
      navigate('login');
      return;
    }
    if (!currentPost) return;
    setLikeAnimating(true);
    await toggleLike(currentPost.id);
    setTimeout(() => setLikeAnimating(false), 500);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please sign in to comment');
      navigate('login');
      return;
    }
    if (!currentPost) return;
    setSubmittingComment(true);
    try {
      await addComment(currentPost.id, commentText);
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setShared(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleDelete = async () => {
    if (!currentPost) return;
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    try {
      await deletePost(currentPost.id);
      toast.success('Post deleted successfully');
      navigate('home');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  if (!currentPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-12">
          <Eye className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Back Button — floating above hero */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-20 left-4 sm:left-8 z-40"
      >
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 glass-control px-3 py-2 rounded-full text-white/50 hover:text-white/80 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-medium hidden sm:inline">Feed</span>
        </button>
      </motion.div>

      {/* ====== CINEMATIC HERO SECTION ====== */}
      <CinematicVideoHero
        title={currentPost.title}
        subtitle={currentPost.excerpt || undefined}
        category={currentPost.category}
        thumbnail={currentPost.thumbnail || undefined}
      />

      {/* ====== PROJECT INFO GRID ====== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <ProjectInfoGrid
          authorName={currentPost.author.name}
          authorUsername={currentPost.author.username}
          authorAvatar={currentPost.author.avatar || undefined}
          publishDate={currentPost.createdAt}
          readingTime={currentPost.readingTime}
          category={currentPost.category}
          views={currentPost.views}
          likesCount={currentPost._count?.likes || 0}
          commentsCount={currentPost._count?.comments || 0}
          onAuthorClick={() => navigate('profile', { username: currentPost.author.username })}
        />
      </div>

      {/* ====== ACTION BAR (floating) ====== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <ScrollReveal>
          <div className="flex items-center gap-3 glass-action-bar px-4 py-2.5 rounded-full w-fit">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`group transition-all rounded-full px-3 ${
                userLikedCurrentPost
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-white/40 hover:text-red-400'
              }`}
            >
              <Heart
                className={`w-4 h-4 mr-1 transition-transform ${
                  likeAnimating ? 'animate-heart-pulse' : ''
                } ${userLikedCurrentPost ? 'fill-current' : ''}`}
              />
              <span className="text-xs">{currentPost._count?.likes || 0}</span>
            </Button>

            <div className="w-px h-4 bg-white/10" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-white/40 hover:text-[#f97316] rounded-full px-3"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">{currentPost._count?.comments || 0}</span>
            </Button>

            <div className="w-px h-4 bg-white/10" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white/40 hover:text-[#10b981] rounded-full px-3"
            >
              {shared ? (
                <Check className="w-4 h-4 mr-1 text-[#10b981]" />
              ) : (
                <Share2 className="w-4 h-4 mr-1" />
              )}
              <span className="text-xs">{shared ? 'Copied!' : 'Share'}</span>
            </Button>

            {isAuthor && (
              <>
                <div className="w-px h-4 bg-white/10" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-white/40 hover:text-red-400 rounded-full px-3"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  <span className="text-xs">Delete</span>
                </Button>
              </>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* ====== MAIN CHALLENGES SECTION ====== */}
      {currentPost.excerpt && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <MainChallenges excerpt={currentPost.excerpt} />
        </div>
      )}

      {/* ====== STORY CONTENT ====== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <ScrollReveal>
          {/* Section label */}
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-5">
            <span className="w-6 h-px bg-[#10b981]/40" />
            The Story
          </h3>

          <div className="glass-story-card p-6 sm:p-10 lg:p-14">
            <div className="prose-cinematic max-w-none">
              {contentWithAd.split('<!--AD_INSERT-->').map((part, i) => (
                <div key={i}>
                  <ReactMarkdown>{part}</ReactMarkdown>
                  {i === 0 && contentWithAd.includes('<!--AD_INSERT-->') && (
                    <GoogleAdInArticle />
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ====== COMMENTS SECTION ====== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12" id="comments-section">
        <ScrollReveal>
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-6">
            <span className="w-6 h-px bg-[#f59e0b]/40" />
            Discussion
            <span className="text-white/15 font-normal normal-case tracking-normal ml-1">
              ({currentPostComments.length})
            </span>
          </h3>

          {/* Comment Input */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-3">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="glass-input flex-1 text-white placeholder:text-white/25 h-11 rounded-xl"
                />
                <Button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="bg-gradient-to-r from-[#f59e0b] to-[#10b981] hover:opacity-90 text-white border-0 shrink-0 rounded-xl h-11 w-11 p-0 flex items-center justify-center"
                >
                  {submittingComment ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="glass-card p-4 mb-8 text-center rounded-xl">
              <p className="text-white/40 text-sm">
                <button
                  onClick={() => navigate('login')}
                  className="text-[#f97316] hover:underline"
                >
                  Sign in
                </button>{' '}
                to join the conversation
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            <AnimatePresence>
              {currentPostComments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </AnimatePresence>

            {currentPostComments.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No comments yet. Start the conversation.</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
