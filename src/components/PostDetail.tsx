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
import ArticleJsonLd from './ArticleJsonLd';
import {
  Heart, MessageCircle, Eye, Share2, ArrowLeft, Send, Check, Trash2,
  DollarSign, Clock, User, Calendar, Tag, BookOpen, Play, Info, Zap, Video,
} from 'lucide-react';

function CommentCard({ comment }: { comment: CommentType }) {
  return (
    <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-3 sm:p-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-white/10 shrink-0">
          <AvatarImage src={comment.author.avatar || undefined} alt={`${comment.author.name}'s avatar`} />
          <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-xs">
            {comment.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button className="text-xs sm:text-sm font-medium text-white/80 hover:text-[#f97316] transition-colors">{comment.author.name}</button>
            <time className="text-[10px] sm:text-xs text-white/30" dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time>
          </div>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </motion.article>
  );
}

function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function PostDetail() {
  const {
    currentPost, currentPostComments, currentPostTotalDonated, userLikedCurrentPost,
    isAuthenticated, user, navigate, loadPost, loadComments, loadDonations,
    toggleLike, addComment, deletePost, viewParams,
    setShowDonationModal, setDonationPostId, setShowSponsorModal, setSponsorPostId,
  } = useAppStore();

  const isPremium = user?.isPremium ?? false;
  const isAuthor = user?.id === currentPost?.authorId;
  const isVideo = currentPost?.postType === 'video' || !!currentPost?.videoUrl || currentPost?.category === 'Video';

  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [shared, setShared] = useState(false);

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
      loadDonations(viewParams.id);
    }
  }, [viewParams.id, loadPost, loadComments, loadDonations]);

  const handleLike = async () => {
    if (!isAuthenticated) { toast.error('Please sign in to like posts'); navigate('login'); return; }
    if (!currentPost) return;
    setLikeAnimating(true);
    await toggleLike(currentPost.id);
    setTimeout(() => setLikeAnimating(false), 500);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) { toast.error('Please sign in to comment'); navigate('login'); return; }
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
      toast.success('Link copied!');
      setTimeout(() => setShared(false), 2000);
    } catch { toast.error('Failed to copy link'); }
  };

  const handleDelete = async () => {
    if (!currentPost) return;
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(currentPost.id);
      toast.success('Post deleted');
      navigate('home');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  const handleSupport = () => {
    if (!currentPost) return;
    setDonationPostId(currentPost.id);
    setShowDonationModal(true);
  };

  const handleSponsor = () => {
    if (!currentPost) return;
    setSponsorPostId(currentPost.id);
    setShowSponsorModal(true);
  };

  if (!currentPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="glass-card p-12">
          <Eye className="w-12 h-12 text-white/20 mx-auto mb-4" aria-hidden="true" />
          <p className="text-white/40">Loading Lumina Article...</p>
        </div>
      </div>
    );
  }

  const infoItems = [
    { icon: User, label: 'AUTHOR', value: currentPost.author.name, sub: `@${currentPost.author.username}`, isAuthor: true },
    { icon: Calendar, label: 'PUBLISHED', value: new Date(currentPost.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
    { icon: Clock, label: 'READ TIME', value: `${currentPost.readingTime} min ${isVideo ? 'watch' : 'read'}` },
    { icon: Tag, label: 'CATEGORY', value: currentPost.category, isCategory: true },
    { icon: Eye, label: 'VIEWS', value: currentPost.views.toLocaleString() },
    { icon: DollarSign, label: 'TOTAL DONATED', value: `$${currentPostTotalDonated.toFixed(2)}`, isDonated: true },
  ];

  return (
    <article className="w-full">
      {/* JSON-LD Structured Data for this article */}
      <ArticleJsonLd post={currentPost} />

      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="fixed top-16 left-3 sm:top-20 sm:left-8 z-40">
        <button onClick={() => navigate('home')} className="flex items-center gap-2 glass-control px-3 py-2 rounded-full text-white/50 hover:text-white/80 transition-all group" aria-label="Back to feed">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-medium hidden sm:inline">Feed</span>
        </button>
      </motion.div>

      {/* ====== SPIDERHECK VERTICAL SPLIT LAYOUT ====== */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* LEFT: Cinematic Video/Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-[55%] shrink-0"
          >
            <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl" style={{ minHeight: isVideo ? 'clamp(200px, 35vh, 55vh)' : 'clamp(180px, 30vh, 45vh)' }}>
              {/* Video player for video posts */}
              {isVideo && currentPost.videoUrl ? (
                <video
                  autoPlay
                  loop
                  muted={false}
                  controls
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={currentPost.thumbnail || undefined}
                >
                  <source src={currentPost.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <>
                  <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" aria-hidden="true">
                    <source src="/hero-bg.mp4" type="video/mp4" />
                  </video>
                  {currentPost.thumbnail && (
                    <img
                      src={currentPost.thumbnail}
                      alt={`Lumina Article Preview - ${currentPost.title}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      width={800}
                      height={450}
                    />
                  )}
                </>
              )}

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute inset-0 bg-[#0a0a0a]/30" aria-hidden="true" />

              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)', opacity: 0.4 }} />

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-[#f97316]/30 to-transparent" aria-hidden="true" />

              {/* Badges */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2">
                {isVideo && (
                  <span className="glass-video-badge"><Video className="w-3 h-3" />VIDEO</span>
                )}
                {currentPost.isSponsored && (
                  <span className="glass-sponsored-badge"><Zap className="w-3 h-3" />Sponsored</span>
                )}
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-6 md:p-8">
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-[#f97316]/8 border border-[#f97316]/20 text-[#f97316]/80 mb-2 sm:mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] mr-1 sm:mr-2 animate-pulse shadow-[0_0_6px_#f97316]" />
                  {currentPost.category}
                </span>
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[0.95] tracking-tight" style={{ textShadow: '0 0 40px rgba(249,115,22,0.15)' }}>
                  {currentPost.title}
                </h1>
                {currentPost.excerpt && (
                  <p className="text-xs sm:text-base text-white/35 mt-1.5 sm:mt-3 max-w-xl leading-relaxed">{currentPost.excerpt}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Project Info Grid */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-[45%] flex flex-col gap-3 sm:gap-4"
          >
            <div className="mb-1 sm:mb-2">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/25 flex items-center gap-2">
                <span className="w-6 h-px bg-[#f97316]/30" />
                {isVideo ? 'Video Info' : 'Lumina Article Info'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {infoItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }}
                  className="glass-info-card p-2.5 sm:p-4"
                >
                  <div className="flex items-center gap-1 mb-1 sm:mb-2">
                    <item.icon className="w-3 h-3 text-[#f97316]/40" aria-hidden="true" />
                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em] text-white/20">{item.label}</span>
                  </div>
                  {(item as Record<string, unknown>).isAuthor ? (
                    <button onClick={() => navigate('profile', { username: currentPost.author.username })} className="flex items-center gap-1.5 sm:gap-2 group">
                      <Avatar className="h-6 w-6 sm:h-7 sm:w-7 border border-white/8 group-hover:border-[#f97316]/25 transition-colors">
                        <AvatarImage src={currentPost.author.avatar || undefined} alt={`${currentPost.author.name}'s avatar`} />
                        <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-[10px] sm:text-xs">{currentPost.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#f97316] transition-colors truncate">{currentPost.author.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-white/25">@{currentPost.author.username}</p>
                      </div>
                    </button>
                  ) : (item as Record<string, unknown>).isCategory ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#f97316]/8 text-[#f97316] border border-[#f97316]/15">{item.value}</span>
                  ) : (item as Record<string, unknown>).isDonated ? (
                    <p className="text-xs sm:text-sm font-semibold text-[#10b981]">{item.value}</p>
                  ) : (
                    <p className="text-xs sm:text-sm font-semibold text-white">{item.value}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Action Bar */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
              <Button variant="ghost" size="sm" onClick={handleLike} className={`group transition-all rounded-full px-2 sm:px-3 h-8 sm:h-9 ${userLikedCurrentPost ? 'text-red-400 hover:text-red-300' : 'text-white/40 hover:text-red-400'}`} aria-label={userLikedCurrentPost ? 'Unlike this article' : 'Like this article'}>
                <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 transition-transform ${likeAnimating ? 'animate-heart-pulse' : ''} ${userLikedCurrentPost ? 'fill-current' : ''}`} />
                <span className="text-xs">{currentPost._count?.likes || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-[#f97316] rounded-full px-2 sm:px-3 h-8 sm:h-9" aria-label="Read comments">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs">{currentPost._count?.comments || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-white/40 hover:text-[#10b981] rounded-full px-2 sm:px-3 h-8 sm:h-9" aria-label="Share this Lumina Article">
                {shared ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-[#10b981]" /> : <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />}
                <span className="text-xs">{shared ? 'Copied!' : 'Share'}</span>
              </Button>
              {isAuthor && (
                <Button variant="ghost" size="sm" onClick={handleDelete} className="text-white/40 hover:text-red-400 rounded-full px-2 sm:px-3 h-8 sm:h-9" aria-label="Delete this article">
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" /><span className="text-xs">Delete</span>
                </Button>
              )}
            </motion.div>

            {/* Support + Sponsor buttons */}
            <div className="flex gap-2 sm:gap-3 mt-1">
              <Button
                size="sm"
                onClick={handleSupport}
                className="flex-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-90 text-white border-0 font-bold rounded-full px-2 sm:px-4 text-[11px] sm:text-xs h-9 sm:h-auto min-h-[36px]"
                style={{ boxShadow: '0 0 15px rgba(249,115,22,0.25)' }}
                aria-label="Support the artist with a donation"
              >
                <Heart className="w-3.5 h-3.5 mr-1 fill-current" />
                <span className="hidden sm:inline">Support the Artist</span><span className="sm:hidden">Support</span>
              </Button>
              <Button
                size="sm"
                onClick={handleSponsor}
                className="flex-1 bg-gradient-to-r from-[#f59e0b]/20 to-[#f97316]/20 hover:from-[#f59e0b]/30 hover:to-[#f97316]/30 text-[#f97316] border border-[#f97316]/20 font-bold rounded-full px-2 sm:px-4 text-[11px] sm:text-xs h-9 sm:h-auto min-h-[36px]"
                aria-label="Boost this Lumina Article"
              >
                <Zap className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Boost This Post</span><span className="sm:hidden">Boost</span>
              </Button>
            </div>

            {/* Transparency notes */}
            <div className="space-y-2 mt-1">
              <div className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg bg-[#f97316]/5 border border-[#f97316]/10">
                <Info className="w-3.5 h-3.5 text-[#f97316]/40 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[10px] sm:text-[11px] text-white/25 leading-relaxed">
                  <span className="text-[#10b981] font-semibold">80%</span> of your donation goes directly to the artist. <span className="text-white/15">20% helps keep Lumina Blog free.</span>
                </p>
              </div>
              <div className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/10">
                <Zap className="w-3.5 h-3.5 text-[#f59e0b]/40 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[10px] sm:text-[11px] text-white/25 leading-relaxed">
                  <span className="text-[#f59e0b] font-semibold">100%</span> of sponsorship fees go to keeping Lumina free for everyone.
                </p>
              </div>
            </div>

            {/* Recent donors */}
            {useAppStore.getState().currentPostDonations.length > 0 && (
              <div className="glass-card p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-wider mb-2 sm:mb-3">Recent Supporters</p>
                <div className="space-y-2">
                  {useAppStore.getState().currentPostDonations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex items-center gap-2">
                      <Avatar className="h-5 w-5 sm:h-6 sm:w-6 border border-white/10">
                        <AvatarImage src={donation.donor.avatar || undefined} alt={`${donation.donor.name}'s avatar`} />
                        <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-[9px] sm:text-[10px]">{donation.donor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] sm:text-xs text-white/50 flex-1 truncate">{donation.donor.name}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-[#10b981]">${donation.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </div>

      {/* ====== STORY CONTENT ====== */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <ScrollReveal>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-4 sm:mb-5">
            <span className="w-6 h-px bg-[#10b981]/40" />
            The Story
          </h2>
          <div className="glass-story-card p-3 sm:p-6 md:p-10 lg:p-14">
            <div className="prose-cinematic max-w-none">
              {contentWithAd.split('<!--AD_INSERT-->').map((part, i) => (
                <div key={i}>
                  <ReactMarkdown>{part}</ReactMarkdown>
                  {i === 0 && contentWithAd.includes('<!--AD_INSERT-->') && <GoogleAdInArticle />}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* ====== COMMENTS ====== */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 mt-10 sm:mt-16 mb-8 sm:mb-12" id="comments-section">
        <ScrollReveal>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-4 sm:mb-6">
            <span className="w-6 h-px bg-[#f59e0b]/40" />
            Discussion
            <span className="text-white/15 font-normal normal-case tracking-normal ml-1">({currentPostComments.length})</span>
          </h2>
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-6 sm:mb-8">
              <div className="flex gap-2 sm:gap-3">
                <Input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Share your thoughts on this Lumina Article..." className="glass-input flex-1 text-white placeholder:text-white/25 h-10 sm:h-11 rounded-xl text-sm" aria-label="Comment text" />
                <Button type="submit" disabled={submittingComment || !commentText.trim()} className="bg-gradient-to-r from-[#f59e0b] to-[#10b981] hover:opacity-90 text-white border-0 shrink-0 rounded-xl h-10 sm:h-11 w-10 sm:w-11 p-0 flex items-center justify-center" aria-label="Submit comment">
                  {submittingComment ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          ) : (
            <div className="glass-card p-3 sm:p-4 mb-6 sm:mb-8 text-center rounded-xl">
              <p className="text-white/40 text-xs sm:text-sm"><button onClick={() => navigate('login')} className="text-[#f97316] hover:underline">Sign in</button> to join the conversation</p>
            </div>
          )}
          <div className="space-y-2 sm:space-y-3">
            <AnimatePresence>
              {currentPostComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)}
            </AnimatePresence>
            {currentPostComments.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white/10 mx-auto mb-3" aria-hidden="true" />
                <p className="text-white/30 text-xs sm:text-sm">No comments yet. Start the conversation about this Lumina Article.</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </article>
  );
}
