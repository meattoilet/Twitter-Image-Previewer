import React, { useRef, useState } from 'react';
import { UserProfile, Tweet } from '../types';
import { TweetCard } from './TweetCard';
import { ArrowLeft, Calendar, MapPin, Link as LinkIcon, Camera } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfilePageProps {
  user: UserProfile;
  tweets: Tweet[];
  onBack: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onDeleteTweet: (id: string) => void;
  onUpdateTweet: (id: string, content: string) => void;
  onEditProfile: () => void;
  onClearAll: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, 
  tweets, 
  onBack, 
  onUpdateProfile,
  onDeleteTweet,
  onUpdateTweet,
  onEditProfile,
  onClearAll
}) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'highlights' | 'media'>('posts');

  const userTweets = tweets.filter(t => t.user.handle === user.handle);
  const mediaTweets = userTweets.filter(t => t.images.length > 0);

  const handleImageUpload = (field: 'avatar' | 'headerImage') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold leading-tight">{user.name}</h1>
            <p className="text-xs text-zinc-500">{userTweets.length} 게시물</p>
          </div>
        </div>
        {userTweets.length > 0 && (
          <button 
            onClick={onClearAll}
            className="text-xs text-rose-500 hover:bg-rose-500/10 px-2 py-1 rounded-full transition-colors font-bold"
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* Header Image */}
      <div className="relative group">
        <div className="aspect-[3/1] bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          {user.headerImage ? (
            <img src={user.headerImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-zinc-300 dark:bg-zinc-700" />
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <button 
            onClick={() => headerInputRef.current?.click()}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <Camera size={24} />
          </button>
          <input type="file" ref={headerInputRef} onChange={handleImageUpload('headerImage')} accept="image/*" className="hidden" />
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="relative flex justify-between items-end -mt-12 mb-4">
          <div className="relative group">
            <img 
              src={user.avatar} 
              className="w-32 h-32 rounded-full border-4 border-white dark:border-black object-cover bg-white dark:bg-black" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
              <button 
                onClick={() => avatarInputRef.current?.click()}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <Camera size={20} />
              </button>
              <input type="file" ref={avatarInputRef} onChange={handleImageUpload('avatar')} accept="image/*" className="hidden" />
            </div>
          </div>
          <button 
            onClick={onEditProfile}
            className="px-4 py-1.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full font-bold transition-colors"
          >
            프로필 수정
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-zinc-500">@{user.handle}</p>
          </div>

          {user.bio && <p className="text-zinc-900 dark:text-zinc-100">{user.bio}</p>}

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500 text-sm">
            {user.location && (
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {user.location}
              </div>
            )}
            {user.website && (
              <div className="flex items-center">
                <LinkIcon size={16} className="mr-1" />
                <a href={user.website} className="text-[#1d9bf0] hover:underline" target="_blank" rel="noopener noreferrer">
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              가입일: {user.joinDate || '2024년 3월'}
            </div>
          </div>

          <div className="flex space-x-4 text-sm">
            <p><span className="font-bold">128</span> <span className="text-zinc-500">팔로잉</span></p>
            <p><span className="font-bold">1.2K</span> <span className="text-zinc-500">팔로워</span></p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <TabItem 
          label="게시물" 
          active={activeTab === 'posts'} 
          onClick={() => setActiveTab('posts')} 
        />
        <TabItem 
          label="답글" 
          active={activeTab === 'replies'} 
          onClick={() => setActiveTab('replies')} 
          disabled
        />
        <TabItem 
          label="하이라이트" 
          active={activeTab === 'highlights'} 
          onClick={() => setActiveTab('highlights')} 
          disabled
        />
        <TabItem 
          label="미디어" 
          active={activeTab === 'media'} 
          onClick={() => setActiveTab('media')} 
        />
      </div>

      {/* Content */}
      <div className="pb-20">
        {activeTab === 'posts' && (
          <>
            {userTweets.map(tweet => (
              <TweetCard 
                key={tweet.id} 
                tweet={tweet} 
                onDelete={() => onDeleteTweet(tweet.id)}
                onUpdate={(content) => onUpdateTweet(tweet.id, content)}
              />
            ))}
            {userTweets.length === 0 && (
              <div className="p-10 text-center text-zinc-500">
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">작성한 트윗이 없습니다</p>
                <p>트윗을 작성하여 프로필을 채워보세요.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'media' && (
          <div className="grid grid-cols-3 gap-0.5 p-0.5">
            {mediaTweets.map(tweet => (
              <div key={tweet.id} className="aspect-square relative group cursor-pointer overflow-hidden">
                <img 
                  src={tweet.images[0]} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
            {mediaTweets.length === 0 && (
              <div className="col-span-3 p-10 text-center text-zinc-500">
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">게시된 미디어가 없습니다</p>
                <p>사진이나 동영상이 포함된 트윗을 게시하면 여기에 표시됩니다.</p>
              </div>
            )}
          </div>
        )}

        {(activeTab === 'replies' || activeTab === 'highlights') && (
          <div className="p-10 text-center text-zinc-500">
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">표시할 내용이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

function TabItem({ label, active, onClick, disabled = false }: { label: string, active: boolean, onClick: () => void, disabled?: boolean }) {
  return (
    <button 
      onClick={disabled ? undefined : onClick}
      className={`flex-1 py-4 transition-colors relative font-bold ${disabled ? 'opacity-40 cursor-default' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer'} ${active ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1d9bf0] rounded-full" />
      )}
    </button>
  );
}
