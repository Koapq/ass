import React, { useState } from 'react';
import { MessageSquare, Plus, Reply, Pin, Clock, User, Tag, ThumbsUp, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ForumPage: React.FC = () => {
  const { currentUser, forumTopics, createForumTopic, replyToTopic, pinTopic } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [topicForm, setTopicForm] = useState({
    title: '',
    content: '',
    tags: ''
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Cần đăng nhập</h2>
          <p className="text-slate-300">Vui lòng đăng nhập để tham gia diễn đàn.</p>
        </div>
      </div>
    );
  }

  const handleCreateTopic = () => {
    if (createForumTopic && topicForm.title.trim() && topicForm.content.trim()) {
      const tagsArray = topicForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      createForumTopic({
        title: topicForm.title,
        content: topicForm.content,
        tags: tagsArray
      });
      setTopicForm({ title: '', content: '', tags: '' });
      setShowCreateModal(false);
    }
  };

  const handleReply = (topicId: string) => {
    if (replyToTopic && replyContent.trim()) {
      replyToTopic(topicId, replyContent);
      setReplyContent('');
      setSelectedTopic(null);
    }
  };

  const sortedTopics = forumTopics ? [...forumTopics].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-6 py-2 mb-4">
            <MessageSquare className="w-4 h-4 text-green-400" />
            <span className="text-green-300 font-mono text-sm">Forum</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-mono mb-2">Diễn đàn</h1>
          <p className="text-slate-300">Thảo luận và chia sẻ kiến thức về AI cùng cộng đồng</p>
        </div>

        {/* Create Topic Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo chủ đề mới</span>
          </button>
        </div>

        {/* Forum Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 text-center">
            <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">{sortedTopics.length}</div>
            <div className="text-slate-400 text-sm">Chủ đề</div>
          </div>
          
          <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-6 text-center">
            <Reply className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">
              {sortedTopics.reduce((sum, topic) => sum + topic.replies.length, 0)}
            </div>
            <div className="text-slate-400 text-sm">Phản hồi</div>
          </div>
          
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-6 text-center">
            <Pin className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white font-mono">
              {sortedTopics.filter(t => t.isPinned).length}
            </div>
            <div className="text-slate-400 text-sm">Chủ đề ghim</div>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-6">
          {sortedTopics.map((topic) => (
            <div key={topic.id} className="bg-slate-800/50 border border-green-500/20 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {topic.isPinned && <Pin className="w-4 h-4 text-purple-400" />}
                    <h3 className="text-xl font-bold text-white">{topic.title}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-slate-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{topic.authorName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(topic.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Reply className="w-4 h-4" />
                      <span>{topic.replies.length} phản hồi</span>
                    </div>
                  </div>

                  {topic.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <div className="flex flex-wrap gap-2">
                        {topic.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-900/20 text-green-400 border border-green-500/50 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {topic.content}
                  </p>
                </div>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => pinTopic && pinTopic(topic.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      topic.isPinned 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-600 hover:bg-purple-600 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Replies */}
              {topic.replies.length > 0 && (
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <h4 className="text-sm font-bold text-slate-300 mb-3">Phản hồi gần đây:</h4>
                  <div className="space-y-3">
                    {topic.replies.slice(-2).map((reply) => (
                      <div key={reply.id} className="bg-slate-700/30 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-cyan-400">{reply.authorName}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              {selectedTopic === topic.id ? (
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                    rows={3}
                    placeholder="Nhập phản hồi của bạn..."
                  />
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleReply(topic.id)}
                      className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                    >
                      Gửi phản hồi
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTopic(null);
                        setReplyContent('');
                      }}
                      className="bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <button
                    onClick={() => setSelectedTopic(topic.id)}
                    className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span className="text-sm">Phản hồi</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {sortedTopics.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">Chưa có chủ đề nào</h3>
            <p className="text-slate-500">Hãy tạo chủ đề đầu tiên để bắt đầu thảo luận!</p>
          </div>
        )}

        {/* Create Topic Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-green-500/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white font-mono">Tạo chủ đề mới</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setTopicForm({ title: '', content: '', tags: '' });
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-green-300 text-sm font-mono mb-2">Tiêu đề chủ đề</label>
                  <input
                    type="text"
                    value={topicForm.title}
                    onChange={(e) => setTopicForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="Nhập tiêu đề chủ đề"
                  />
                </div>

                <div>
                  <label className="block text-green-300 text-sm font-mono mb-2">Nội dung</label>
                  <textarea
                    value={topicForm.content}
                    onChange={(e) => setTopicForm(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                    rows={8}
                    placeholder="Nhập nội dung thảo luận..."
                  />
                </div>

                <div>
                  <label className="block text-green-300 text-sm font-mono mb-2">Tags (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={topicForm.tags}
                    onChange={(e) => setTopicForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    placeholder="AI, machine learning, deep learning"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleCreateTopic}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                  >
                    <span>Tạo chủ đề</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setTopicForm({ title: '', content: '', tags: '' });
                    }}
                    className="bg-slate-600 hover:bg-slate-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;