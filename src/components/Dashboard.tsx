'use client';

import { useAppStore, type Post } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Heart, MessageCircle, Clock, Eye, Trash2, Edit, Plus, FileText,
  TrendingUp, BarChart3, PenSquare, DollarSign, Video, Wallet,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PostEditor from './PostEditor';

function StatCard({ icon: Icon, label, value, color, prefix = '' }: { icon: React.ElementType; label: string; value: number; color: string; prefix?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{prefix}{typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value}</p>
        <p className="text-xs text-white/40">{label}</p>
      </div>
    </motion.div>
  );
}

function PostRow({ post, onEdit, onDelete }: { post: Post; onEdit: (post: Post) => void; onDelete: (id: string) => void }) {
  const isVideo = post.postType === 'video' || post.category === 'Video';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 glass-card mb-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {isVideo && <Video className="w-3.5 h-3.5 text-[#a855f7] shrink-0" />}
          <h4 className="text-sm font-medium text-white truncate">{post.title}</h4>
          <Badge variant={post.published ? 'default' : 'secondary'} className={post.published ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30 text-xs shrink-0' : 'bg-white/10 text-white/50 border-white/10 text-xs shrink-0'}>
            {post.published ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post._count?.likes || 0}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{post._count?.comments || 0}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => onEdit(post)} className="text-white/50 hover:text-white hover:bg-white/5 h-8 w-8 p-0"><Edit className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)} className="text-red-400/50 hover:text-red-400 hover:bg-red-400/5 h-8 w-8 p-0"><Trash2 className="w-4 h-4" /></Button>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, myPosts, myPostsStats, myPostsLoading, loadMyPosts, deletePost, navigate, loadEarnings, earningsData } = useAppStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'editor' | 'analytics' | 'earnings'>('posts');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPostType, setNewPostType] = useState<'article' | 'video'>('article');

  useEffect(() => {
    loadMyPosts();
    loadEarnings();
  }, [loadMyPosts, loadEarnings]);

  const handleEdit = (post: Post) => { setEditingPost(post); setNewPostType(post.postType === 'video' ? 'video' : 'article'); setActiveTab('editor'); };
  const handleDelete = async (id: string) => { if (!confirm('Delete this post?')) return; try { await deletePost(id); toast.success('Post deleted'); loadMyPosts(); } catch (err) { toast.error(err instanceof Error ? err.message : 'Failed to delete'); } };
  const handleNewArticle = () => { setEditingPost(null); setNewPostType('article'); setActiveTab('editor'); };
  const handleNewVideo = () => { setEditingPost(null); setNewPostType('video'); setActiveTab('editor'); };
  const handleSaveComplete = () => { setActiveTab('posts'); setEditingPost(null); loadMyPosts(); };

  const totalRevenue = earningsData?.totalDonationIncome || (myPostsStats ? parseFloat((myPostsStats.totalViews * 0.02 * 0.20).toFixed(2)) : 0);
  const walletBalance = earningsData?.walletBalance || user?.walletBalance || 0;

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-[#f97316]/30">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-white/40">@{user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleNewArticle} className="bg-gradient-to-r from-[#f97316] to-[#f59e0b] hover:opacity-90 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />Article
            </Button>
            <Button onClick={handleNewVideo} className="bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:opacity-90 text-white border-0">
              <Video className="w-4 h-4 mr-2" />Video
            </Button>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className="glass-wallet-card p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-[#f97316]/60" />
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider font-semibold">Wallet Balance</p>
                <p className="text-3xl font-black text-white">${walletBalance.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-white/20 uppercase tracking-wider">Donation Income</p>
                <p className="text-sm font-bold text-[#10b981]">${earningsData?.totalDonationIncome.toFixed(2) || '0.00'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/20 uppercase tracking-wider">Platform Commission</p>
                <p className="text-sm font-bold text-white/40">${earningsData?.platformCommission.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FileText} label="Total Posts" value={myPostsStats?.totalPosts || 0} color="#f97316" />
          <StatCard icon={TrendingUp} label="Published" value={myPostsStats?.publishedPosts || 0} color="#10b981" />
          <StatCard icon={Eye} label="Total Views" value={myPostsStats?.totalViews || 0} color="#f59e0b" />
          <StatCard icon={Heart} label="Total Likes" value={myPostsStats?.totalLikes || 0} color="#dc2626" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 glass rounded-lg w-fit">
          {[
            { key: 'posts', label: 'My Posts', icon: FileText },
            { key: 'editor', label: 'Editor', icon: PenSquare },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 },
            { key: 'earnings', label: 'Earnings', icon: DollarSign },
          ].map(({ key, label, icon: TabIcon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'posts' | 'editor' | 'analytics' | 'earnings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === key ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
            >
              <TabIcon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'posts' && (
          <div>
            {myPostsLoading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => (<div key={i} className="glass-card p-4 animate-pulse"><div className="h-4 bg-white/5 rounded w-3/4 mb-2" /><div className="h-3 bg-white/5 rounded w-1/2" /></div>))}</div>
            ) : myPosts.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/60 mb-2">No posts yet</h3>
                <p className="text-sm text-white/30 mb-4">Start creating your first article or video</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleNewArticle} className="bg-gradient-to-r from-[#f97316] to-[#f59e0b] hover:opacity-90 text-white border-0"><Plus className="w-4 h-4 mr-2" />Article</Button>
                  <Button onClick={handleNewVideo} className="bg-gradient-to-r from-[#a855f7] to-[#7c3aed] hover:opacity-90 text-white border-0"><Video className="w-4 h-4 mr-2" />Video</Button>
                </div>
              </Card>
            ) : myPosts.map((post) => <PostRow key={post.id} post={post} onEdit={handleEdit} onDelete={handleDelete} />)}
          </div>
        )}

        {activeTab === 'editor' && (
          <PostEditor post={editingPost} postType={newPostType} onSaveComplete={handleSaveComplete} />
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Views by Post</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {myPosts.map((post) => (
                  <div key={post.id}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-white/60 truncate mr-2">{post.title}</span><span className="text-[#f97316] shrink-0">{post.views}</span></div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#f97316] to-[#f59e0b] rounded-full transition-all" style={{ width: `${myPostsStats?.totalViews ? Math.max(2, (post.views / myPostsStats.totalViews) * 100) : 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Likes Distribution</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {myPosts.map((post) => (
                  <div key={post.id}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-white/60 truncate mr-2">{post.title}</span><span className="text-[#f59e0b] shrink-0">{post._count?.likes || 0}</span></div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#10b981] rounded-full transition-all" style={{ width: `${myPostsStats?.totalLikes ? Math.max(2, ((post._count?.likes || 0) / myPostsStats.totalLikes) * 100) : 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-earnings-card p-5">
                <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-2">Donation Income</p>
                <p className="text-2xl font-black text-[#10b981]">${earningsData?.totalDonationIncome.toFixed(2) || '0.00'}</p>
                <p className="text-[10px] text-white/15 mt-1">80% of all donations received</p>
              </div>
              <div className="glass-card p-5">
                <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-2">Platform Commission</p>
                <p className="text-2xl font-black text-white/60">${earningsData?.platformCommission.toFixed(2) || '0.00'}</p>
                <p className="text-[10px] text-white/15 mt-1">20% platform fee from donations</p>
              </div>
              <div className="glass-card p-5">
                <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-2">Sponsorship Revenue</p>
                <p className="text-2xl font-black text-[#f59e0b]">${earningsData?.totalSponsorshipIncome.toFixed(2) || '0.00'}</p>
                <p className="text-[10px] text-white/15 mt-1">100% to platform admin</p>
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
              {(earningsData?.recentTransactions?.length || 0) > 0 ? (
                <div className="space-y-3">
                  {earningsData?.recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-[#10b981]/50" />
                        <div>
                          <p className="text-sm text-white/60">{tx.description}</p>
                          <p className="text-[10px] text-white/20">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#10b981]">+${tx.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <DollarSign className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No transactions yet. Start creating to earn!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
