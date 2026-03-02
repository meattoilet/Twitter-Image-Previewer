import React, { useState, useRef, useEffect } from 'react';
import { Tweet } from '../types';
import { ImageGrid } from './ImageGrid';
import { MessageCircle, Repeat2, Heart, Share, MoreHorizontal, Trash2, Edit2, X, Check } from 'lucide-react';

interface TweetCardProps {
  tweet: Tweet;
  onDelete: () => void;
  onUpdate: (content: string) => void;
}

export const TweetCard: React.FC<TweetCardProps> = ({ tweet, onDelete, onUpdate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsDeleting(false);
  };

  const formatContent = (content: string) => {
    const parts = content.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span key={i} className="text-[#1d9bf0] hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      if (part.startsWith('@')) {
        return (
          <span key={i} className="text-[#1d9bf0] hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const timeString = new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(tweet.timestamp));

  return (
    <div className="flex p-4 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer relative group">
      <div className="flex-shrink-0 mr-3">
        <img 
          src={tweet.user.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'} 
          alt={tweet.user.name}
          className="w-10 h-10 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate mr-1">
              {tweet.user.name}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 truncate text-sm">
              @{tweet.user.handle} · {timeString}
            </span>
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="text-zinc-500 hover:text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-1.5 rounded-full transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Edit2 size={14} className="mr-2" />
                  수정하기
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleting(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 size={14} className="mr-2" />
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
        
        {isDeleting && (
          <div className="mt-2 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-2">이 트윗을 삭제하시겠습니까?</p>
            <div className="flex space-x-2">
              <button 
                onClick={handleDelete}
                className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full hover:bg-rose-600 transition-colors"
              >
                삭제
              </button>
              <button 
                onClick={() => setIsDeleting(false)}
                className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-xs font-bold rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="mt-1" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-[#1d9bf0] outline-none resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(tweet.content);
                }}
                className="p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
              <button 
                onClick={handleUpdate}
                className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-full transition-colors"
              >
                <Check size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-1 text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap break-words leading-normal">
            {formatContent(tweet.content)}
          </div>
        )}

        <ImageGrid images={tweet.images} />

        <div className="flex items-center justify-between mt-3 max-w-md text-zinc-500 dark:text-zinc-400">
          <button className="flex items-center group">
            <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors">
              <MessageCircle size={18} />
            </div>
            <span className="text-xs group-hover:text-[#1d9bf0]">0</span>
          </button>
          <button className="flex items-center group">
            <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 transition-colors">
              <Repeat2 size={18} />
            </div>
            <span className="text-xs group-hover:text-green-500">0</span>
          </button>
          <button className="flex items-center group">
            <div className="p-2 rounded-full group-hover:bg-rose-500/10 group-hover:text-rose-500 transition-colors">
              <Heart size={18} />
            </div>
            <span className="text-xs group-hover:text-rose-500">0</span>
          </button>
          <button className="flex items-center group">
            <div className="p-2 rounded-full group-hover:bg-[#1d9bf0]/10 group-hover:text-[#1d9bf0] transition-colors">
              <Share size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
