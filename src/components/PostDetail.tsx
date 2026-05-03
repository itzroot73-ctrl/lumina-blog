'use client';

import { useAppStore, type Comment as CommentType } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Heart,
  MessageCircle,
  Clock,
  Eye,
  Share2,
  ArrowLeft,
  Send,
  Check,
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
          <AvatarFallback className="bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 text-white text-xs">
            {comment.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => {}}
              className="text-sm font-medium text-white/80 hover:text-[#00f0ff] transition-colors"
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

export default function PostDetail() {
  const {
    currentPost,
    currentPostComments,
    userLikedCurrentPost,
    isAuthenticated,
    navigate,
    loadPost,
    loadComments,
    toggleLike,
    addComment,
    viewParams,
  } = useAppStore();

  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [shared, setShared] = useState(false);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to feed</span>
        </button>
      </motion.div>

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Thumbnail */}
        {currentPost.thumbnail && (
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
            <img
              src={currentPost.thumbnail}
              alt={currentPost.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {currentPost.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Author */}
          <button
            onClick={() => navigate('profile', { username: currentPost.author.username })}
            className="flex items-center gap-2 group"
          >
            <Avatar className="h-9 w-9 border border-white/10">
              <AvatarImage src={currentPost.author.avatar || undefined} alt={currentPost.author.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 text-white text-xs">
                {currentPost.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-white/80 group-hover:text-[#00f0ff] transition-colors">
                {currentPost.author.name}
              </p>
              <p className="text-xs text-white/30">@{currentPost.author.username}</p>
            </div>
          </button>

          <div className="h-6 w-px bg-white/10" />

          {/* Reading Time */}
          <Badge variant="secondary" className="bg-white/5 text-white/50 border-white/10 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {currentPost.readingTime} min read
          </Badge>

          {/* Views */}
          <span className="flex items-center gap-1 text-xs text-white/40">
            <Eye className="w-3.5 h-3.5" />
            {currentPost.views} views
          </span>

          {/* Date */}
          <span className="text-xs text-white/30">
            {new Date(currentPost.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`group transition-all ${
              userLikedCurrentPost
                ? 'text-red-400 hover:text-red-300'
                : 'text-white/40 hover:text-red-400'
            }`}
          >
            <Heart
              className={`w-5 h-5 mr-1.5 transition-transform ${
                likeAnimating ? 'animate-heart-pulse' : ''
              } ${userLikedCurrentPost ? 'fill-current' : ''}`}
            />
            <span className="text-sm">
              {currentPost._count?.likes || 0}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-white/40 hover:text-[#00f0ff]"
          >
            <MessageCircle className="w-5 h-5 mr-1.5" />
            <span className="text-sm">{currentPost._count?.comments || 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-white/40 hover:text-[#10b981]"
          >
            {shared ? (
              <Check className="w-5 h-5 mr-1.5 text-[#10b981]" />
            ) : (
              <Share2 className="w-5 h-5 mr-1.5" />
            )}
            <span className="text-sm">{shared ? 'Copied!' : 'Share'}</span>
          </Button>
        </div>

        {/* Excerpt */}
        {currentPost.excerpt && (
          <p className="text-lg text-white/50 italic mb-8 leading-relaxed">
            {currentPost.excerpt}
          </p>
        )}

        {/* Article Content */}
        <div className="glass-card p-6 sm:p-8 mb-12">
          <div className="prose-dark max-w-none">
            <ReactMarkdown>{currentPost.content}</ReactMarkdown>
          </div>
        </div>

        {/* Comments Section */}
        <div id="comments-section">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#a855f7]" />
            Comments
            <span className="text-sm font-normal text-white/30">
              ({currentPostComments.length})
            </span>
          </h3>

          {/* Comment Input */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-6">
              <div className="flex gap-3">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="glass-input flex-1 text-white placeholder:text-white/25"
                />
                <Button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="bg-gradient-to-r from-[#a855f7] to-[#10b981] hover:opacity-90 text-white border-0 shrink-0"
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
            <div className="glass-card p-4 mb-6 text-center">
              <p className="text-white/40 text-sm">
                <button
                  onClick={() => navigate('login')}
                  className="text-[#00f0ff] hover:underline"
                >
                  Sign in
                </button>{' '}
                to leave a comment
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
              <div className="text-center py-8">
                <MessageCircle className="w-8 h-8 text-white/10 mx-auto mb-2" />
                <p className="text-white/30 text-sm">No comments yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
