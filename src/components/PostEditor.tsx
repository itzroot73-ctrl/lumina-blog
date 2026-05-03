'use client';

import { useAppStore, type Post, CATEGORIES, CATEGORY_COLORS } from '@/lib/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Save, Eye, Edit3, Image as ImageIcon, FileText, Send, Video, Link,
} from 'lucide-react';

interface PostEditorProps {
  post?: Post | null;
  postType?: 'article' | 'video';
  onSaveComplete: () => void;
}

export default function PostEditor({ post, postType = 'article', onSaveComplete }: PostEditorProps) {
  const { createPost, updatePost } = useAppStore();
  const [type, setType] = useState<'article' | 'video'>(postType);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState(type === 'video' ? 'Video' : 'Tech');
  const [published, setPublished] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setExcerpt(post.excerpt || '');
      setContent(post.content);
      setThumbnail(post.thumbnail || '');
      setVideoUrl(post.videoUrl || '');
      setCategory(post.category || 'Tech');
      setPublished(post.published);
      setType(post.postType === 'video' ? 'video' : 'article');
    }
  }, [post]);

  useEffect(() => {
    if (type === 'video' && category !== 'Video') {
      setCategory('Video');
    }
  }, [type, category]);

  const estimatedReadingTime = Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!content.trim()) { toast.error(type === 'video' ? 'Description is required' : 'Content is required'); return; }
    if (type === 'video' && !videoUrl.trim()) { toast.error('Video URL is required for video posts'); return; }

    setSaving(true);
    try {
      if (post) {
        await updatePost(post.id, {
          title, excerpt: excerpt || undefined, content, thumbnail: thumbnail || undefined,
          videoUrl: videoUrl || undefined, category, published, readingTime: estimatedReadingTime,
        });
        toast.success('Post updated!');
      } else {
        await createPost({
          title, excerpt: excerpt || undefined, content, thumbnail: thumbnail || undefined,
          videoUrl: videoUrl || undefined, postType: type, category, published, readingTime: estimatedReadingTime,
        });
        toast.success(published ? `${type === 'video' ? 'Video' : 'Article'} published!` : 'Draft saved!');
      }
      onSaveComplete();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">{post ? 'Edit' : 'New'} {type === 'video' ? 'Video' : 'Article'}</h2>
          {/* Post Type Toggle */}
          {!post && (
            <div className="flex items-center gap-1 glass rounded-lg p-1">
              <button
                onClick={() => setType('article')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${type === 'article' ? 'bg-[#f97316]/15 text-[#f97316]' : 'text-white/30 hover:text-white/50'}`}
              >
                <FileText className="w-3 h-3" />Article
              </button>
              <button
                onClick={() => setType('video')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${type === 'video' ? 'bg-[#a855f7]/15 text-[#a855f7]' : 'text-white/30 hover:text-white/50'}`}
              >
                <Video className="w-3 h-3" />Video
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass rounded-lg p-1">
            <button onClick={() => setShowPreview(false)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${!showPreview ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
              <Edit3 className="w-3.5 h-3.5" />Edit
            </button>
            <button onClick={() => setShowPreview(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${showPreview ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
              <Eye className="w-3.5 h-3.5" />Preview
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={published} onCheckedChange={setPublished} className="data-[state=checked]:bg-[#10b981]" />
            <span className="text-sm text-white/60">{published ? 'Published' : 'Draft'}</span>
          </div>
          <Button onClick={handleSave} disabled={saving} className={`border-0 ${type === 'video' ? 'bg-gradient-to-r from-[#a855f7] to-[#7c3aed]' : 'bg-gradient-to-r from-[#f97316] to-[#f59e0b]'} hover:opacity-90 text-white`}>
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : published ? <><Send className="w-4 h-4 mr-1.5" />Publish</> : <><Save className="w-4 h-4 mr-1.5" />Save Draft</>}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <div className="glass-card p-8">
          <div className="prose-dark max-w-none">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-[#f97316]">{title || 'Untitled'}</h1>
              {type === 'video' && <span className="glass-video-badge"><Video className="w-3 h-3" />VIDEO</span>}
            </div>
            {excerpt && <p className="text-lg text-white/50 italic mb-6">{excerpt}</p>}
            {type === 'video' && videoUrl && (
              <div className="mb-8 relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <video src={videoUrl} className="w-full h-full object-cover" poster={thumbnail || undefined} controls />
              </div>
            )}
            {thumbnail && type !== 'video' && <img src={thumbnail} alt={title} className="w-full h-64 object-cover rounded-xl mb-8" />}
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/70 text-sm flex items-center gap-1.5">
              {type === 'video' ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              {type === 'video' ? 'Video Title' : 'Article Title'}
            </Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === 'video' ? 'Enter video title...' : 'Enter article title...'} className="glass-input h-12 text-lg text-white placeholder:text-white/25" />
          </div>

          <div className="space-y-2">
            <Label className="text-white/70 text-sm">{type === 'video' ? 'Video Description' : 'Excerpt'}</Label>
            <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder={type === 'video' ? 'Brief description of the video...' : 'A brief description of your post...'} className="glass-input h-10 text-white placeholder:text-white/25" />
          </div>

          {/* Video URL - only for video posts */}
          {type === 'video' && (
            <div className="space-y-2">
              <Label className="text-white/70 text-sm flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" />Video URL (MP4/WebM)
              </Label>
              <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://example.com/video.mp4" className="glass-input h-10 text-white placeholder:text-white/25" />
              <p className="text-[10px] text-white/15">Direct link to your video file. Supported formats: MP4, WebM</p>
            </div>
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-white/70 text-sm">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter(c => c !== 'All').map((cat) => {
                const colors = CATEGORY_COLORS[cat];
                const isActive = category === cat;
                return (
                  <button key={cat} type="button" onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${isActive ? '' : 'border border-white/10 bg-white/5 text-white/40 hover:border-white/20'}`}
                    style={isActive && colors ? { background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` } : undefined}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label className="text-white/70 text-sm flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />Thumbnail URL
            </Label>
            <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="https://example.com/thumbnail.jpg" className="glass-input h-10 text-white placeholder:text-white/25" />
            {thumbnail && <div className="mt-2 relative h-40 rounded-lg overflow-hidden"><img src={thumbnail} alt="Preview" className="w-full h-full object-cover" /></div>}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white/70 text-sm">{type === 'video' ? 'Description / Show Notes (Markdown)' : 'Content (Markdown)'}</Label>
              <span className="text-xs text-white/30">~{estimatedReadingTime} min {type === 'video' ? 'watch' : 'read'}</span>
            </div>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={type === 'video' ? 'Write video description, timestamps, credits...' : 'Write your post content in Markdown...'} className="glass-input min-h-[400px] text-white placeholder:text-white/25 font-mono text-sm leading-relaxed resize-y" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
