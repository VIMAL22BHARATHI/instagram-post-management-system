import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { templateService } from '../../services/template.service';
import { useToast } from '../../context/ToastContext';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import {
  FileCode,
  Plus,
  Search,
  Copy,
  Edit2,
  Trash2,
  Lock,
  Globe,
  Check,
  Loader2,
  Sparkles,
  Layers,
  Hash,
  MessageSquare,
  Instagram,
  CopyPlus,
  ArrowRight,
  Tag,
  Heart,
  Send,
  Zap,
} from 'lucide-react';

// Pre-built Starter Templates for 1-click creation
const STARTER_TEMPLATES = [
  {
    id: 'starter-1',
    name: 'Product Launch Showcase',
    category: 'Captions',
    type: 'caption',
    description: 'High-conversion carousel caption for new feature or product releases',
    body: `🚀 BIG NEWS: Introducing [Product Name]!\n\nWe built this to help you [Primary Benefit]. Here's what's included:\n\n✨ Feature 1: [Short description]\n⚡ Feature 2: [Short description]\n🔥 Feature 3: [Short description]\n\n👉 Tap the link in bio to explore today!\n\n#ProductLaunch #NewRelease #InstagramMarketing #IPMS`,
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    icon: MessageSquare,
  },
  {
    id: 'starter-2',
    name: 'Reel Hook & Retention Breakdown',
    category: 'Layouts',
    type: 'layout',
    description: 'Optimized video script structure with strong hook and comment triggers',
    body: `Stop making this [Industry] mistake! 🛑\n\nSave this reel for later 📌\n\nHere are 3 quick fixes:\n1️⃣ [Point 1]\n2️⃣ [Point 2]\n3️⃣ [Point 3]\n\nWhich one are you implementing first? Drop a comment below! 👇\n\n#ReelsStrategy #ContentCreator #ViralReels #InstagramTips`,
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: Layers,
  },
  {
    id: 'starter-3',
    name: 'High-Growth Hashtag Stack',
    category: 'Hashtag Sets',
    type: 'hashtag',
    description: 'Categorized hashtag bundle for maximum reach across niche & viral tags',
    body: `/* Niche Community Tags */\n#SocialMediaManager #ContentStrategy #InstagramGrowth\n\n/* High Volume Tags */\n#DigitalMarketing #CreatorEconomy #SaaSProduct\n\n/* Engagement Boosters */\n#MarketingTips #BuildInPublic #IPMS`,
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: Hash,
  },
];

// Category Filter Chips Config
const CATEGORY_CHIPS = [
  { id: 'all', label: 'All Templates', icon: Tag },
  { id: 'captions', label: 'Captions', icon: MessageSquare },
  { id: 'layouts', label: 'Layouts', icon: Layers },
  { id: 'hashtags', label: 'Hashtag Sets', icon: Hash },
  { id: 'stories', label: 'Story Templates', icon: Instagram },
];

export const ContentTemplatesPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [isPublicFilter, setIsPublicFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Copy tracker
  const [copiedId, setCopiedId] = useState(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await templateService.search({
        keyword: keyword || undefined,
        isPublic: isPublicFilter !== '' ? isPublicFilter === 'true' : undefined,
        page,
        size: 9,
      });
      setData(res.data);
    } catch (err) {
      showError(err.message || 'Failed to fetch templates.');
    } finally {
      setLoading(false);
    }
  }, [keyword, isPublicFilter, page, showError]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const openCreateModal = () => {
    setEditingTemplate(null);
    setName('');
    setBody('');
    setDescription('');
    setIsPublic(false);
    setIsModalOpen(true);
  };

  const openEditModal = (tmpl) => {
    setEditingTemplate(tmpl);
    setName(tmpl.name || '');
    setBody(tmpl.body || '');
    setDescription(tmpl.description || '');
    setIsPublic(tmpl.isPublic || false);
    setIsModalOpen(true);
  };

  const handleDuplicate = (tmpl) => {
    setEditingTemplate(null);
    setName(`${tmpl.name} (Copy)`);
    setBody(tmpl.body || '');
    setDescription(tmpl.description || '');
    setIsPublic(false);
    setIsModalOpen(true);
    showSuccess('Template copied into new draft!');
  };

  const handleUseStarter = (starter) => {
    setEditingTemplate(null);
    setName(starter.name);
    setBody(starter.body);
    setDescription(starter.description);
    setIsPublic(false);
    setIsModalOpen(true);
    showSuccess(`Pre-filled with "${starter.name}" template!`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { name, body, description, isPublic };
      if (editingTemplate) {
        await templateService.update(editingTemplate.templateId, payload);
        showSuccess('Template updated successfully!');
      } else {
        await templateService.create(payload);
        showSuccess('Template created successfully!');
      }
      setIsModalOpen(false);
      fetchTemplates();
    } catch (err) {
      showError(err.message || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await templateService.delete(templateId);
      showSuccess('Template deleted successfully!');
      fetchTemplates();
    } catch (err) {
      showError(err.message || 'Delete failed.');
    }
  };

  const handleCopyBody = (tmpl) => {
    navigator.clipboard.writeText(tmpl.body);
    setCopiedId(tmpl.templateId);
    showSuccess('Template body copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Determine template category badge helper
  const getCategoryMeta = (tmpl) => {
    const text = `${tmpl.name} ${tmpl.description || ''} ${tmpl.body || ''}`.toLowerCase();
    if (text.includes('hashtag') || text.includes('#')) {
      return { label: 'Hashtag Set', icon: Hash, bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    }
    if (text.includes('layout') || text.includes('carousel') || text.includes('frame')) {
      return { label: 'Layout', icon: Layers, bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    }
    if (text.includes('story') || text.includes('poll')) {
      return { label: 'Story Template', icon: Instagram, bg: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
    }
    return { label: 'Caption', icon: MessageSquare, bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
  };

  // Filter templates based on Category filter chips
  const filteredContent = useMemo(() => {
    if (!data?.content) return [];
    if (activeCategory === 'all') return data.content;

    return data.content.filter((tmpl) => {
      const cat = getCategoryMeta(tmpl).label.toLowerCase();
      if (activeCategory === 'captions') return cat.includes('caption');
      if (activeCategory === 'layouts') return cat.includes('layout');
      if (activeCategory === 'hashtags') return cat.includes('hashtag');
      if (activeCategory === 'stories') return cat.includes('story');
      return true;
    });
  }, [data, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Page Header Banner with Instagram Gradient Accent */}
      <div className="relative overflow-hidden glass-panel p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
        {/* Subtle Instagram Gradient Top Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#feda75]/20 via-[#d62976]/20 to-[#4f5bd5]/20 text-[#d62976] border border-[#d62976]/30 shadow-lg shadow-pink-500/10 flex-shrink-0">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Content Templates</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#fa7e1e] to-[#d62976] text-white shadow-sm">
                  Library
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Reusable post layouts, viral caption hooks, and strategic hashtag presets for your Instagram workflow
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="py-2.5 px-5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-[#fa7e1e] hover:via-[#d62976] hover:to-[#962fbf] text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all duration-300 active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="space-y-4">
        {/* Search Bar & Visibility Dropdown */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-center gap-4 shadow-lg">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-pink-400 transition-colors" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
              placeholder="Search templates by title, hashtags, or body content..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-2.5 border border-slate-800 rounded-xl w-full md:w-auto flex-shrink-0">
            <select
              value={isPublicFilter}
              onChange={(e) => {
                setIsPublicFilter(e.target.value);
                setPage(0);
              }}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full"
            >
              <option value="" className="bg-slate-900 text-white">All Visibility</option>
              <option value="true" className="bg-slate-900 text-white">Public Templates</option>
              <option value="false" className="bg-slate-900 text-white">Private Templates</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_CHIPS.map((chip) => {
            const Icon = chip.icon;
            const isActive = activeCategory === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveCategory(chip.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 ring-1 ring-indigo-500/30 shadow-md'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Loading vs Empty State vs Card Grid */}
      {loading ? (
        <Loader className="py-24" />
      ) : !filteredContent || filteredContent.length === 0 ? (
        /* ILLUSTRATED EMPTY STATE */
        <div className="space-y-8">
          <div className="glass-panel p-10 sm:p-14 text-center rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Illustrated Icon Container with Instagram Gradient Ring */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5] p-0.5 shadow-2xl shadow-pink-500/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                  <FileCode className="w-9 h-9 text-pink-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-indigo-600 text-white shadow-md border border-slate-900">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Headline & Description */}
            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              {keyword || isPublicFilter || activeCategory !== 'all'
                ? 'No matching templates found'
                : 'No templates yet'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
              {keyword || isPublicFilter || activeCategory !== 'all'
                ? 'Try adjusting your search query or filter tags to find the content template you are looking for.'
                : 'Save time and maintain brand consistency by creating reusable caption structures, reel hooks, and hashtag stacks.'}
            </p>

            {/* Prominent CTA Button directly inside Empty State */}
            <button
              onClick={openCreateModal}
              className="py-3 px-6 bg-gradient-to-r from-[#fa7e1e] via-[#d62976] to-[#962fbf] hover:opacity-95 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xl shadow-pink-500/20 flex items-center space-x-2.5 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Template</span>
            </button>
          </div>

          {/* SUGGESTED STARTER TEMPLATES SECTION */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Suggested Starter Templates</h3>
              </div>
              <span className="text-xs text-slate-400">Click any starter to pre-fill a new template</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {STARTER_TEMPLATES.map((starter) => {
                const Icon = starter.icon;
                return (
                  <div
                    key={starter.id}
                    onClick={() => handleUseStarter(starter)}
                    className="group glass-card rounded-2xl border border-slate-800/80 p-5 flex flex-col justify-between hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer space-y-4 relative overflow-hidden"
                  >
                    {/* Gradient Border top strip on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${starter.badgeBg} flex items-center space-x-1.5`}>
                          <Icon className="w-3 h-3" />
                          <span>{starter.category}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-pink-400 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                          <span>Use Starter</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                          {starter.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {starter.description}
                        </p>
                      </div>

                      {/* Mockup Preview Box */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-200 line-clamp-3 whitespace-pre-wrap leading-relaxed shadow-inner">
                        {starter.body}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>IPMS Starter Preset</span>
                      <span className="text-indigo-400 group-hover:underline">1-Click Import</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* TEMPLATE CARD GRID */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredContent.map((tmpl) => {
              const isOwnerOrAdmin = user?.role === 'ADMIN' || tmpl.createdById === user?.userId;
              const catMeta = getCategoryMeta(tmpl);
              const CatIcon = catMeta.icon;

              return (
                <div
                  key={tmpl.templateId}
                  className="group glass-card rounded-2xl border border-slate-800/80 p-5 flex flex-col justify-between hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1 transition-all duration-300 space-y-4 relative overflow-hidden"
                >
                  {/* Top Hover Gradient Accent Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="space-y-3.5">
                    {/* Header badges */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${catMeta.bg} flex items-center space-x-1.5`}>
                        <CatIcon className="w-3 h-3" />
                        <span>{catMeta.label}</span>
                      </span>

                      <span className="text-[11px] font-bold flex items-center space-x-1.5">
                        {tmpl.isPublic ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                            <Globe className="w-3 h-3" />
                            <span>Public</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Private</span>
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Template Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                        {tmpl.name}
                      </h3>
                      {tmpl.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {tmpl.description}
                        </p>
                      )}
                    </div>

                    {/* INSTAGRAM POST MOCKUP PREVIEW BOX */}
                    <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 space-y-2.5 shadow-inner relative overflow-hidden">
                      {/* Post Header Mock */}
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] p-[1px]">
                            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                              IP
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-300">@yourbrand</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">TEMPLATE PREVIEW</span>
                      </div>

                      {/* Post Body Snippet */}
                      <div className="text-xs font-mono text-indigo-200 line-clamp-4 overflow-hidden whitespace-pre-wrap leading-relaxed">
                        {tmpl.body}
                      </div>

                      {/* Post Action Mock Footer */}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-900/80">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-3 h-3 text-pink-400" />
                          <span>1.2k</span>
                        </div>
                        <span>Instagram Post Format</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Author & Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
                        By {tmpl.createdByName || 'Team Member'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {formatDate(tmpl.createdDate)}
                      </p>
                    </div>

                    {/* Action Icon Buttons */}
                    <div className="flex items-center space-x-1">
                      {/* Quick Copy Button */}
                      <button
                        onClick={() => handleCopyBody(tmpl)}
                        className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                        title="Copy Body to Clipboard"
                      >
                        {copiedId === tmpl.templateId ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Duplicate Template Button */}
                      <button
                        onClick={() => handleDuplicate(tmpl)}
                        className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-pink-300 hover:bg-slate-700 transition-colors"
                        title="Duplicate Template"
                      >
                        <CopyPlus className="w-4 h-4" />
                      </button>

                      {/* Edit & Delete for Owner/Admin */}
                      {isOwnerOrAdmin && (
                        <>
                          <button
                            onClick={() => openEditModal(tmpl)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            title="Edit Template"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tmpl.templateId)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Delete Template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination pageResponse={data} onPageChange={(p) => setPage(p)} />
        </div>
      )}

      {/* Create / Edit Template Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTemplate ? 'Edit Content Template' : 'Create Content Template'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Template Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Instagram Carousel Caption"
              required
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Template Body / Layout Structure *
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="🔥 [Hook Line]\n\n[Body Content]\n\n👉 Tag a friend!\n#brand #influencer"
              rows={6}
              required
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-indigo-200 font-mono focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Description / Usage Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Used for weekly carousel updates and feature launches..."
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isPublic" className="text-xs text-slate-300 font-medium cursor-pointer">
              Make template public to all team members
            </label>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#fa7e1e] via-[#d62976] to-[#962fbf] hover:opacity-95 text-white shadow-md shadow-pink-500/20 flex items-center space-x-1.5 disabled:opacity-50 transition-all"
            >
              {formLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingTemplate ? 'Update Template' : 'Create Template'}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
