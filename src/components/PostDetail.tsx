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
import {
  Heart, MessageCircle, Eye, Share2, ArrowLeft, Send, Check, Trash2,
  DollarSign, Clock, User, Calendar, Tag, BookOpen, Play, Info, Zap, Video,
} from 'lucide-react';

function CommentCard({ comment }: { comment: CommentType }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 border border-white/10 shrink-0">
          <AvatarImage src={comment.author.avatar || undefined} alt={comment.author.name} />
          <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-xs">
            {comment.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button className="text-sm font-medium text-white/80 hover:text-[#f97316] transition-colors">{comment.author.name}</button>
            <span className="text-xs text-white/30">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">{comment.content}</p>
        </div>
      </div>
    </motion.div>
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
          <Eye className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">Loading post...</p>
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
    <div className="w-full">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="fixed top-20 left-4 sm:left-8 z-40">
        <button onClick={() => navigate('home')} className="flex items-center gap-2 glass-control px-3 py-2 rounded-full text-white/50 hover:text-white/80 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-medium hidden sm:inline">Feed</span>
        </button>
      </motion.div>

      {/* ====== SPIDERHECK VERTICAL SPLIT LAYOUT ====== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Cinematic Video/Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-[55%] shrink-0"
          >
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ minHeight: isVideo ? '60vh' : '50vh' }}>
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
                  <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                    <source src="/hero-bg.mp4" type="video/mp4" />
                  </video>
                  {currentPost.thumbnail && (
                    <img src={currentPost.thumbnail} alt={currentPost.title} className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </>
              )}

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[#0a0a0a]/30" />

              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)', opacity: 0.4 }} />

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-[#f97316]/30 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                {isVideo && (
                  <span className="glass-video-badge"><Video className="w-3 h-3" />VIDEO</span>
                )}
                {currentPost.isSponsored && (
                  <span className="glass-sponsored-badge"><Zap className="w-3 h-3" />Sponsored</span>
                )}
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-8">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#f97316]/8 border border-[#f97316]/20 text-[#f97316]/80 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] mr-2 animate-pulse shadow-[0_0_6px_#f97316]" />
                  {currentPost.category}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight" style={{ textShadow: '0 0 40px rgba(249,115,22,0.15)' }}>
                  {currentPost.title}
                </h1>
                {currentPost.excerpt && (
                  <p className="text-base text-white/35 mt-3 max-w-xl leading-relaxed">{currentPost.excerpt}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Project Info Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-[45%] flex flex-col gap-4"
          >
            <div className="mb-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/25 flex items-center gap-2">
                <span className="w-6 h-px bg-[#f97316]/30" />
                {isVideo ? 'Video Info' : 'Story Info'}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {infoItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }}
                  className="glass-info-card p-4"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <item.icon className="w-3 h-3 text-[#f97316]/40" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20">{item.label}</span>
                  </div>
                  {(item as Record<string, unknown>).isAuthor ? (
                    <button onClick={() => navigate('profile', { username: currentPost.author.username })} className="flex items-center gap-2 group">
                      <Avatar className="h-7 w-7 border border-white/8 group-hover:border-[#f97316]/25 transition-colors">
                        <AvatarImage src={currentPost.author.avatar || undefined} alt={currentPost.author.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-xs">{currentPost.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white group-hover:text-[#f97316] transition-colors">{currentPost.author.name}</p>
                        <p className="text-[10px] text-white/25">@{currentPost.author.username}</p>
                      </div>
                    </button>
                  ) : (item as Record<string, unknown>).isCategory ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#f97316]/8 text-[#f97316] border border-[#f97316]/15">{item.value}</span>
                  ) : (item as Record<string, unknown>).isDonated ? (
                    <p className="text-sm font-semibold text-[#10b981]">{item.value}</p>
                  ) : (
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Action Bar */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex items-center gap-2 mt-2 flex-wrap">
              <Button variant="ghost" size="sm" onClick={handleLike} className={`group transition-all rounded-full px-3 ${userLikedCurrentPost ? 'text-red-400 hover:text-red-300' : 'text-white/40 hover:text-red-400'}`}>
                <Heart className={`w-4 h-4 mr-1 transition-transform ${likeAnimating ? 'animate-heart-pulse' : ''} ${userLikedCurrentPost ? 'fill-current' : ''}`} />
                <span className="text-xs">{currentPost._count?.likes || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/40 hover:text-[#f97316] rounded-full px-3">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">{currentPost._count?.comments || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-white/40 hover:text-[#10b981] rounded-full px-3">
                {shared ? <Check className="w-4 h-4 mr-1 text-[#10b981]" /> : <Share2 className="w-4 h-4 mr-1" />}
                <span className="text-xs">{shared ? 'Copied!' : 'Share'}</span>
              </Button>
              {isAuthor && (
                <Button variant="ghost" size="sm" onClick={handleDelete} className="text-white/40 hover:text-red-400 rounded-full px-3">
                  <Trash2 className="w-4 h-4 mr-1" /><span className="text-xs">Delete</span>
                </Button>
              )}
            </motion.div>

            {/* Support + Sponsor buttons */}
            <div className="flex gap-3 mt-1">
              <Button
                size="sm"
                onClick={handleSupport}
                className="flex-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:opacity-90 text-white border-0 font-bold rounded-full px-4 text-xs"
                style={{ boxShadow: '0 0 15px rgba(249,115,22,0.25)' }}
              >
                <Heart className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Support the Artist
              </Button>
              <Button
                size="sm"
                onClick={handleSponsor}
                className="flex-1 bg-gradient-to-r from-[#f59e0b]/20 to-[#f97316]/20 hover:from-[#f59e0b]/30 hover:to-[#f97316]/30 text-[#f97316] border border-[#f97316]/20 font-bold rounded-full px-4 text-xs"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Boost This Post
              </Button>
            </div>

            {/* Transparency notes */}
            <div className="space-y-2 mt-1">
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#f97316]/5 border border-[#f97316]/10">
                <Info className="w-3.5 h-3.5 text-[#f97316]/40 shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/25 leading-relaxed">
                  <span className="text-[#10b981] font-semibold">80%</span> of your donation goes directly to the artist. <span className="text-white/15">20% helps keep Lumina free.</span>
                </p>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/10">
                <Zap className="w-3.5 h-3.5 text-[#f59e0b]/40 shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/25 leading-relaxed">
                  <span className="text-[#f59e0b] font-semibold">100%</span> of sponsorship fees go to keeping Lumina free for everyone.
                </p>
              </div>
            </div>

            {/* Recent donors */}
            {useAppStore.getState().currentPostDonations.length > 0 && (
              <div className="glass-card p-4">
                <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3">Recent Supporters</p>
                <div className="space-y-2">
                  {useAppStore.getState().currentPostDonations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-white/10">
                        <AvatarImage src={donation.donor.avatar || undefined} alt={donation.donor.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white text-[10px]">{donation.donor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-white/50 flex-1">{donation.donor.name}</span>
                      <span className="text-xs font-bold text-[#10b981]">${donation.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ====== STORY CONTENT ====== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <ScrollReveal>
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-5">
            <span className="w-6 h-px bg-[#10b981]/40" />
            The Story
          </h3>
          <div className="glass-story-card p-6 sm:p-10 lg:p-14">
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12" id="comments-section">
        <ScrollReveal>
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 flex items-center gap-2 mb-6">
            <span className="w-6 h-px bg-[#f59e0b]/40" />
            Discussion
            <span className="text-white/15 font-normal normal-case tracking-normal ml-1">({currentPostComments.length})</span>
          </h3>
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-3">
                <Input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Share your thoughts..." className="glass-input flex-1 text-white placeholder:text-white/25 h-11 rounded-xl" />
                <Button type="submit" disabled={submittingComment || !commentText.trim()} className="bg-gradient-to-r from-[#f59e0b] to-[#10b981] hover:opacity-90 text-white border-0 shrink-0 rounded-xl h-11 w-11 p-0 flex items-center justify-center">
                  {submittingComment ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </form>
          ) : (
            <div className="glass-card p-4 mb-8 text-center rounded-xl">
              <p className="text-white/40 text-sm"><button onClick={() => navigate('login')} className="text-[#f97316] hover:underline">Sign in</button> to join the conversation</p>
            </div>
          )}
          <div className="space-y-3">
            <AnimatePresence>
              {currentPostComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)}
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
