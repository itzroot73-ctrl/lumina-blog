'use client';

import { useAppStore, type Post } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Heart,
  MessageCircle,
  Clock,
  Eye,
  Trash2,
  Edit,
  Plus,
  FileText,
  TrendingUp,
  BarChart3,
  PenSquare,
  DollarSign,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PostEditor from './PostEditor';

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  prefix = '',
  suffix = '',
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 flex items-center gap-3"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{prefix}{typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value}{suffix}</p>
        <p className="text-xs text-white/40">{label}</p>
      </div>
    </motion.div>
  );
}

function PostRow({
  post,
  onEdit,
  onDelete,
}: {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between p-4 glass-card mb-3"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium text-white truncate">
            {post.title}
          </h4>
          <Badge
            variant={post.published ? 'default' : 'secondary'}
            className={
              post.published
                ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30 text-xs shrink-0'
                : 'bg-white/10 text-white/50 border-white/10 text-xs shrink-0'
            }
          >
            {post.published ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {post._count?.likes || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {post._count?.comments || 0}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(post.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 ml-3 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(post)}
          className="text-white/50 hover:text-white hover:bg-white/5 h-8 w-8 p-0"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(post.id)}
          className="text-red-400/50 hover:text-red-400 hover:bg-red-400/5 h-8 w-8 p-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const {
    user,
    myPosts,
    myPostsStats,
    myPostsLoading,
    loadMyPosts,
    deletePost,
    navigate,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'posts' | 'editor' | 'analytics'>('posts');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    loadMyPosts();
  }, [loadMyPosts]);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setActiveTab('editor');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      toast.success('Post deleted');
      loadMyPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setActiveTab('editor');
  };

  const handleSaveComplete = () => {
    setActiveTab('posts');
    setEditingPost(null);
    loadMyPosts();
  };

  // Calculate revenue: $0.02 per view, author gets 20%
  const totalRevenue = myPostsStats ? parseFloat((myPostsStats.totalViews * 0.02 * 0.20).toFixed(2)) : 0;

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-[#f97316]/30">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#f97316]/20 to-[#f59e0b]/20 text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-white/40">@{user.username}</p>
            </div>
          </div>
          <Button
            onClick={handleNewPost}
            className="bg-gradient-to-r from-[#f97316] to-[#f59e0b] hover:opacity-90 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={FileText}
            label="Total Posts"
            value={myPostsStats?.totalPosts || 0}
            color="#f97316"
          />
          <StatCard
            icon={TrendingUp}
            label="Published"
            value={myPostsStats?.publishedPosts || 0}
            color="#10b981"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={myPostsStats?.totalViews || 0}
            color="#f59e0b"
          />
          <StatCard
            icon={Heart}
            label="Total Likes"
            value={myPostsStats?.totalLikes || 0}
            color="#dc2626"
          />
          <StatCard
            icon={DollarSign}
            label="Revenue (20%)"
            value={totalRevenue}
            color="#10b981"
            prefix="$"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 glass rounded-lg w-fit">
          {[
            { key: 'posts', label: 'My Posts', icon: FileText },
            { key: 'editor', label: 'Editor', icon: PenSquare },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map(({ key, label, icon: TabIcon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'posts' | 'editor' | 'analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'posts' && (
          <div>
            {myPostsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-4 animate-pulse">
                    <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : myPosts.length === 0 ? (
              <Card className="glass-card p-12 text-center">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/60 mb-2">
                  No posts yet
                </h3>
                <p className="text-sm text-white/30 mb-4">
                  Start creating your first article
                </p>
                <Button
                  onClick={handleNewPost}
                  variant="outline"
                  className="border-[#f97316]/30 text-[#f97316] hover:bg-[#f97316]/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </Card>
            ) : (
              myPosts.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'editor' && (
          <PostEditor
            post={editingPost}
            onSaveComplete={handleSaveComplete}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Views Over Posts */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Views by Post
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {myPosts.map((post) => (
                  <div key={post.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60 truncate mr-2">
                        {post.title}
                      </span>
                      <span className="text-[#f97316] shrink-0">
                        {post.views}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#f97316] to-[#f59e0b] rounded-full transition-all"
                        style={{
                          width: `${
                            myPostsStats?.totalViews
                              ? Math.max(
                                  2,
                                  (post.views / myPostsStats.totalViews) * 100
                                )
                              : 2
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Likes Distribution */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Likes Distribution
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {myPosts.map((post) => (
                  <div key={post.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60 truncate mr-2">
                        {post.title}
                      </span>
                      <span className="text-[#f59e0b] shrink-0">
                        {post._count?.likes || 0}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#f59e0b] to-[#10b981] rounded-full transition-all"
                        style={{
                          width: `${
                            myPostsStats?.totalLikes
                              ? Math.max(
                                  2,
                                  ((post._count?.likes || 0) /
                                    myPostsStats.totalLikes) *
                                    100
                                )
                              : 2
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="glass-card p-6 md:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#10b981]" />
                Revenue Breakdown (20% of $0.02/view)
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {myPosts.map((post) => {
                  const postRevenue = (post.views * 0.02 * 0.20).toFixed(2);
                  return (
                    <div key={post.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60 truncate mr-2">
                          {post.title}
                        </span>
                        <span className="text-[#10b981] shrink-0">
                          ${postRevenue}
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#10b981] to-[#f59e0b] rounded-full transition-all"
                          style={{
                            width: `${
                              myPostsStats?.totalViews
                                ? Math.max(
                                    2,
                                    (post.views / myPostsStats.totalViews) * 100
                                  )
                                : 2
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {myPosts.length > 0 && (
                  <div className="flex justify-between text-sm pt-3 border-t border-white/5">
                    <span className="text-white/80 font-semibold">Total Revenue</span>
                    <span className="text-[#10b981] font-bold">${totalRevenue.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
