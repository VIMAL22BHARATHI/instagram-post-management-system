import React, { useState, useEffect, useCallback } from 'react';
import { contentService } from '../../services/content.service';
import { useToast } from '../../context/ToastContext';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { formatDate } from '../../utils/formatters';
import { CONTENT_TYPES, ROLES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import {
  FolderKanban,
  Upload,
  Search,
  Filter,
  Repeat,
  Trash2,
  Edit2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Eye,
  Loader2,
} from 'lucide-react';

export const ContentLibraryPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [page, setPage] = useState(0);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState(CONTENT_TYPES.IMAGE);
  const [tag, setTag] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Preview Modal
  const [previewItem, setPreviewItem] = useState(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await contentService.search({
        keyword: keyword || undefined,
        tag: tagFilter || undefined,
        contentType: contentTypeFilter || undefined,
        page,
        size: 12,
      });
      setData(res.data);
    } catch (err) {
      showError(err.message || 'Failed to fetch content items.');
    } finally {
      setLoading(false);
    }
  }, [keyword, tagFilter, contentTypeFilter, page, showError]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const canUpload =
    user?.role === ROLES.ADMIN ||
    user?.role === ROLES.ACCOUNT_MANAGER ||
    user?.role === ROLES.SOCIAL_MEDIA_MANAGER ||
    user?.role === ROLES.CONTENT_CREATOR;

  const openUploadModal = () => {
    setTitle('');
    setDescription('');
    setContentType(CONTENT_TYPES.IMAGE);
    setTag('');
    setSelectedFile(null);
    setIsUploadModalOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showError('Please select a file to upload.');
      return;
    }

    const fileName = selectedFile.name.toLowerCase();
    const isZip = fileName.endsWith('.zip') || selectedFile.type?.includes('zip');
    if (isZip) {
      showError('ZIP files are not supported. Please upload a valid image, video, audio, or PDF file.');
      return;
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.pdf', '.mp3', '.wav'];
    const isAllowed = allowedExtensions.some((ext) => fileName.endsWith(ext));
    if (!isAllowed) {
      showError('Unsupported file format. Allowed formats: Images (JPG, PNG, GIF, WEBP), Videos (MP4, MOV), Audio (MP3, WAV), and PDF.');
      return;
    }

    setFormLoading(true);
    try {
      const requestDto = { title, description, contentType, tag };
      await contentService.upload(requestDto, selectedFile);
      showSuccess('Content item uploaded successfully!');
      setIsUploadModalOpen(false);
      fetchContent();
    } catch (err) {
      showError(err.message || 'Upload failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleReuse = async (contentId) => {
    try {
      await contentService.reuse(contentId);
      showSuccess('Recorded asset reuse!');
      fetchContent();
    } catch (err) {
      showError(err.message || 'Reuse recording failed.');
    }
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm('Deactivate this content asset?')) return;
    try {
      await contentService.delete(contentId);
      showSuccess('Asset deactivated successfully!');
      fetchContent();
    } catch (err) {
      showError(err.message || 'Deactivation failed.');
    }
  };

  const renderIconForType = (type) => {
    switch (type) {
      case CONTENT_TYPES.IMAGE:
        return <ImageIcon className="w-5 h-5 text-indigo-400" />;
      case CONTENT_TYPES.VIDEO:
        return <Video className="w-5 h-5 text-rose-400" />;
      case CONTENT_TYPES.AUDIO:
        return <Music className="w-5 h-5 text-amber-400" />;
      case CONTENT_TYPES.DOCUMENT:
        return <FileText className="w-5 h-5 text-emerald-400" />;
      default:
        return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Content Library</h1>
            <p className="text-xs text-slate-400">Upload, tag, and reuse media assets across campaigns</p>
          </div>
        </div>

        {canUpload && (
          <button
            onClick={openUploadModal}
            className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Asset</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-center gap-4 shadow-lg">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0);
            }}
            placeholder="Search assets by title or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          <input
            type="text"
            value={tagFilter}
            onChange={(e) => {
              setTagFilter(e.target.value);
              setPage(0);
            }}
            placeholder="Filter by tag..."
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
          />

          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-2 border border-slate-800 rounded-xl w-full sm:w-auto">
            <Filter className="w-4 h-4 text-emerald-400" />
            <select
              value={contentTypeFilter}
              onChange={(e) => {
                setContentTypeFilter(e.target.value);
                setPage(0);
              }}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full"
            >
              <option value="" className="bg-slate-900 text-white">All Asset Types</option>
              {Object.keys(CONTENT_TYPES).map((typeKey) => (
                <option key={typeKey} value={typeKey} className="bg-slate-900 text-white">
                  {typeKey}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <Loader className="py-20" />
      ) : !data || data.content.length === 0 ? (
        <div className="glass-panel p-12 text-center text-xs sm:text-sm text-slate-400 rounded-2xl border border-slate-800/80 shadow-lg">
          No content assets found. Upload media to start building your library!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.content.map((item) => (
              <div
                key={item.contentId}
                className="glass-card rounded-2xl border border-slate-800/80 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-200 space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                      {renderIconForType(item.contentType)}
                    </div>
                    {item.tag && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        #{item.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Reuse: <strong className="text-emerald-400 font-extrabold">{item.usageCount || 0}</strong></span>
                    <span>{formatDate(item.createdDate)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      {canUpload && (
                        <button
                          onClick={() => handleReuse(item.contentId)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                          title="Record Reuse"
                        >
                          <Repeat className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {user?.role === ROLES.ADMIN && (
                        <button
                          onClick={() => handleDelete(item.contentId)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                          title="Deactivate Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination pageResponse={data} onPageChange={(p) => setPage(p)} />
        </>
      )}

      {/* Upload Asset Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Content Asset"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hero Banner 2026"
              required
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief details about media resolution or creative specs..."
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Content Type *
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
              >
                {Object.keys(CONTENT_TYPES).map((typeKey) => (
                  <option key={typeKey} value={typeKey} className="bg-slate-900 text-white">
                    {typeKey}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Tag / Category
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. summer_promo"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Media File *
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.mp3,.wav,.pdf,image/*,video/*,audio/*,application/pdf"
              onChange={(e) => setSelectedFile(e.target.files[0] || null)}
              required
              className="w-full px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 transition-colors"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md flex items-center space-x-1.5 disabled:opacity-50 transition-all"
            >
              {formLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload Asset</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewItem && (
        <Modal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          title={`Asset Preview: ${previewItem.title}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[200px]">
              {previewItem.filePath && previewItem.filePath.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <img
                  src={`http://localhost:8080/${previewItem.filePath}`}
                  alt={previewItem.title}
                  className="max-h-80 object-contain rounded-xl shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center space-y-2 py-8">
                  {renderIconForType(previewItem.contentType)}
                  <p className="text-xs text-slate-400">{previewItem.originalFileName || 'Asset Preview Unavailable'}</p>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p><strong>Uploader:</strong> {previewItem.uploadedByName || 'System'}</p>
              <p><strong>File Path:</strong> <span className="font-mono text-slate-400">{previewItem.filePath}</span></p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

