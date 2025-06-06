import React, { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Eye, EyeOff, Clock, User, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

const EventsPage: React.FC = () => {
  const { currentUser, events, createEvent, updateEvent, deleteEvent } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    content: '',
    tags: '',
    isPublished: true
  });

  const handleCreateEvent = () => {
    if (createEvent && eventForm.title.trim() && eventForm.content.trim()) {
      const tagsArray = eventForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      createEvent({
        title: eventForm.title,
        content: eventForm.content,
        tags: tagsArray,
        isPublished: eventForm.isPublished
      });
      setEventForm({ title: '', content: '', tags: '', isPublished: true });
      setShowCreateModal(false);
    }
  };

  const handleEditEvent = (eventId: string) => {
    const event = events?.find(e => e.id === eventId);
    if (event) {
      setEventForm({
        title: event.title,
        content: event.content,
        tags: event.tags.join(', '),
        isPublished: event.isPublished
      });
      setEditingEvent(eventId);
    }
  };

  const handleUpdateEvent = () => {
    if (updateEvent && editingEvent && eventForm.title.trim() && eventForm.content.trim()) {
      const tagsArray = eventForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      updateEvent(editingEvent, {
        title: eventForm.title,
        content: eventForm.content,
        tags: tagsArray,
        isPublished: eventForm.isPublished
      });
      setEventForm({ title: '', content: '', tags: '', isPublished: true });
      setEditingEvent(null);
    }
  };

  const publishedEvents = events?.filter(e => e.isPublished) || [];
  const allEvents = events || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-2 mb-4">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-mono text-sm">Events</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-mono mb-2">Sự kiện</h1>
          <p className="text-slate-300">Cập nhật các sự kiện và hoạt động mới nhất của VAIC AI Club</p>
        </div>

        {/* Create Event Button for Admin */}
        {currentUser?.role === 'admin' && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo sự kiện mới</span>
            </button>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-8">
          {(currentUser?.role === 'admin' ? allEvents : publishedEvents).map((event) => (
            <div key={event.id} className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                    {!event.isPublished && (
                      <span className="px-2 py-1 bg-yellow-900/20 text-yellow-400 border border-yellow-500/50 rounded text-xs font-mono">
                        DRAFT
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-slate-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{event.authorName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(event.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {event.isPublished ? (
                      <div className="flex items-center space-x-1 text-green-400">
                        <Eye className="w-4 h-4" />
                        <span>Công khai</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <EyeOff className="w-4 h-4" />
                        <span>Bản nháp</span>
                      </div>
                    )}
                  </div>

                  {event.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-900/20 text-purple-400 border border-purple-500/50 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {currentUser?.role === 'admin' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditEvent(event.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteEvent && deleteEvent(event.id)}
                      className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {event.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {(currentUser?.role === 'admin' ? allEvents : publishedEvents).length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">Chưa có sự kiện nào</h3>
            <p className="text-slate-500">
              {currentUser?.role === 'admin' 
                ? 'Hãy tạo sự kiện đầu tiên!' 
                : 'Các sự kiện mới sẽ được cập nhật sớm!'
              }
            </p>
          </div>
        )}

        {/* Create/Edit Event Modal */}
        {(showCreateModal || editingEvent) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-purple-500/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white font-mono">
                  {editingEvent ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingEvent(null);
                    setEventForm({ title: '', content: '', tags: '', isPublished: true });
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-purple-300 text-sm font-mono mb-2">Tiêu đề sự kiện</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Nhập tiêu đề sự kiện"
                  />
                </div>

                <div>
                  <label className="block text-purple-300 text-sm font-mono mb-2">Nội dung</label>
                  <textarea
                    value={eventForm.content}
                    onChange={(e) => setEventForm(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    rows={12}
                    placeholder="Nhập nội dung sự kiện..."
                  />
                </div>

                <div>
                  <label className="block text-purple-300 text-sm font-mono mb-2">Tags (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={eventForm.tags}
                    onChange={(e) => setEventForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="workshop, AI, machine learning"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={eventForm.isPublished}
                    onChange={(e) => setEventForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isPublished" className="text-purple-300 font-mono text-sm">
                    Công khai sự kiện
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                  >
                    <span>{editingEvent ? 'Cập nhật' : 'Tạo sự kiện'}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingEvent(null);
                      setEventForm({ title: '', content: '', tags: '', isPublished: true });
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

export default EventsPage;