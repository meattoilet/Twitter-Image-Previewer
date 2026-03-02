import React, { useState, useEffect } from 'react';
import { UserProfile, Tweet } from './types';
import { TweetInput } from './components/TweetInput';
import { TweetCard } from './components/TweetCard';
import { ProfilePage } from './components/ProfilePage';
import { Settings, User, Bell, Mail, Search, Home, Hash, Bookmark, List, MoreHorizontal, UserCircle, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_USER: UserProfile = {
  name: '사용자',
  handle: 'user_id',
  avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
  bio: '트위터 이미지 미리보기 앱을 사용 중입니다.',
  location: '대한민국',
  website: 'https://example.com',
  joinDate: '2024년 3월'
};

export default function App() {
  const [view, setView] = useState<'home' | 'profile'>('home');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tweet_preview_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [tweets, setTweets] = useState<Tweet[]>(() => {
    const saved = localStorage.getItem('tweet_preview_tweets');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('tweet_preview_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('tweet_preview_tweets', JSON.stringify(tweets));
    } catch (e) {
      console.error('Failed to save tweets to localStorage', e);
    }
  }, [tweets]);

  const handleTweet = (newTweetData: Omit<Tweet, 'id' | 'timestamp' | 'user'>) => {
    const newTweet: Tweet = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      user: user,
      ...newTweetData
    };
    setTweets([newTweet, ...tweets]);
  };

  const deleteTweet = (id: string) => {
    setTweets(prev => prev.filter(t => t.id !== id));
  };

  const updateTweet = (id: string, content: string) => {
    setTweets(prev => prev.map(t => t.id === id ? { ...t, content } : t));
  };

  const clearAllTweets = () => {
    setTweets([]);
    setConfirmDeleteAll(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newUser = { ...user, ...updates };
    setUser(newUser);
    // Update existing tweets to reflect profile changes
    setTweets(prev => prev.map(t => ({
      ...t,
      user: { ...t.user, ...updates }
    })));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ headerImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const headerInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex justify-center">
      {/* Sidebar Navigation */}
      <header className="hidden sm:flex flex-col items-end w-20 xl:w-64 px-2 sticky top-0 h-screen border-r border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col h-full py-2">
          <div 
            onClick={() => setView('home')}
            className="p-3 mb-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full w-fit transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current text-zinc-900 dark:text-zinc-100">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </div>
          
          <nav className="space-y-1">
            <NavItem icon={<Home />} label="홈" active={view === 'home'} onClick={() => setView('home')} />
            <NavItem icon={<Search />} label="탐색하기" disabled />
            <NavItem icon={<Bell />} label="알림" disabled />
            <NavItem icon={<Mail />} label="쪽지" disabled />
            <NavItem icon={<List />} label="리스트" disabled />
            <NavItem icon={<Bookmark />} label="북마크" disabled />
            <NavItem icon={<User />} label="프로필" active={view === 'profile'} onClick={() => setView('profile')} />
            <NavItem icon={<MoreHorizontal />} label="더 보기" disabled />
          </nav>

          <button className="mt-4 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3 rounded-full w-full hidden xl:block transition-colors">
            게시하기
          </button>
          <button className="mt-4 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white p-3 rounded-full xl:hidden transition-colors">
            <Hash />
          </button>

          <div className="mt-auto mb-4 p-3 flex items-center hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full cursor-pointer transition-colors" onClick={() => setIsSettingsOpen(true)}>
            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div className="hidden xl:block ml-3 text-left">
              <p className="font-bold text-sm truncate w-32">{user.name}</p>
              <p className="text-zinc-500 text-sm truncate w-32">@{user.handle}</p>
            </div>
            <MoreHorizontal className="hidden xl:block ml-auto" size={18} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[600px] border-r border-zinc-200 dark:border-zinc-800 min-h-screen pb-16 sm:pb-0">
        {view === 'home' ? (
          <>
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
              <div className="px-4 py-3 flex items-center justify-between">
                <h1 className="text-xl font-bold">홈</h1>
                <div className="flex items-center space-x-2">
                  {tweets.length > 0 && (
                    <button 
                      onClick={() => setConfirmDeleteAll(true)}
                      className="text-xs text-rose-500 hover:bg-rose-500/10 px-2 py-1 rounded-full transition-colors font-bold"
                    >
                      전체 삭제
                    </button>
                  )}
                </div>
              </div>
              <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                <button className="flex-1 py-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors relative font-bold">
                  추천
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />
                </button>
                <button className="flex-1 py-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-500">
                  팔로잉
                </button>
              </div>
            </div>

            <TweetInput user={user} onTweet={handleTweet} />

            <div className="pb-20">
              <AnimatePresence initial={false}>
                {tweets.map((tweet) => (
                  <motion.div
                    key={tweet.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TweetCard 
                      tweet={tweet} 
                      onDelete={() => deleteTweet(tweet.id)}
                      onUpdate={(content) => updateTweet(tweet.id, content)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {tweets.length === 0 && (
                <div className="p-10 text-center text-zinc-500">
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">아직 게시물이 없습니다</p>
                  <p>첫 번째 트윗을 작성하여 이미지가 어떻게 보일지 확인해보세요.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <ProfilePage 
            user={user} 
            tweets={tweets} 
            onBack={() => setView('home')}
            onUpdateProfile={updateProfile}
            onDeleteTweet={deleteTweet}
            onUpdateTweet={updateTweet}
            onEditProfile={() => setIsSettingsOpen(true)}
            onClearAll={() => setConfirmDeleteAll(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center py-2 z-30">
        <button 
          onClick={() => setView('home')}
          className={`p-3 rounded-full transition-colors ${view === 'home' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}
        >
          <Home size={24} fill={view === 'home' ? 'currentColor' : 'none'} />
        </button>
        <button className="p-3 rounded-full text-zinc-500 opacity-40 cursor-default">
          <Search size={24} />
        </button>
        <button className="p-3 rounded-full text-zinc-500 opacity-40 cursor-default">
          <Bell size={24} />
        </button>
        <button 
          onClick={() => setView('profile')}
          className={`p-3 rounded-full transition-colors ${view === 'profile' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`}
        >
          <User size={24} fill={view === 'profile' ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Right Sidebar / Settings */}
      <aside className="hidden lg:block w-80 xl:w-[350px] px-4 py-2 sticky top-0 h-screen overflow-y-auto">
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">프로필 설정</h2>
            <Settings size={20} className="text-zinc-500" />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">닉네임</label>
              <input 
                type="text" 
                value={user.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 focus:ring-2 focus:ring-[#1d9bf0] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">아이디 (@)</label>
              <input 
                type="text" 
                value={user.handle}
                onChange={(e) => updateProfile({ handle: e.target.value })}
                className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 focus:ring-2 focus:ring-[#1d9bf0] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">아바타</label>
              <div className="flex items-center space-x-3">
                <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-800" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg text-sm font-bold transition-colors"
                >
                  이미지 업로드
                </button>
                <input 
                  type="file" 
                  ref={avatarInputRef} 
                  onChange={handleAvatarUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">헤더 이미지</label>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  {user.headerImage && <img src={user.headerImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                </div>
                <button 
                  onClick={() => headerInputRef.current?.click()}
                  className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg text-sm font-bold transition-colors"
                >
                  이미지 업로드
                </button>
                <input 
                  type="file" 
                  ref={headerInputRef} 
                  onChange={handleHeaderUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4">
          <h2 className="text-xl font-bold mb-4">나를 위한 트렌드</h2>
          <div className="space-y-4">
            <TrendItem category="대한민국에서 트렌드 중" title="#이미지미리보기" tweets="12.5K" />
            <TrendItem category="기술 · 실시간 트렌드" title="Twitter UI" tweets="8,421" />
            <TrendItem category="디자인 · 트렌드" title="Aspect Ratio" tweets="2,105" />
          </div>
        </div>
      </aside>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {confirmDeleteAll && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteAll(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-2">모든 트윗 삭제</h2>
              <p className="text-zinc-500 mb-6">정말로 모든 트윗을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={clearAllTweets}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-full transition-colors"
                >
                  삭제하기
                </button>
                <button 
                  onClick={() => setConfirmDeleteAll(false)}
                  className="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold py-3 rounded-full transition-colors"
                >
                  취소
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">프로필 수정</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-5">
                <div className="flex justify-center mb-4">
                  <div className="relative group cursor-pointer">
                    <img src={user.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <UserCircle className="text-white" size={32} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-500 mb-1">닉네임</label>
                  <input 
                    type="text" 
                    value={user.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-[#1d9bf0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-500 mb-1">아이디 (@)</label>
                  <input 
                    type="text" 
                    value={user.handle}
                    onChange={(e) => updateProfile({ handle: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-[#1d9bf0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-500 mb-1">자기소개</label>
                  <textarea 
                    value={user.bio}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-[#1d9bf0] outline-none resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-500 mb-1">위치</label>
                  <input 
                    type="text" 
                    value={user.location}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-[#1d9bf0] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-500 mb-1">웹사이트</label>
                  <input 
                    type="text" 
                    value={user.website}
                    onChange={(e) => updateProfile({ website: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-[#1d9bf0] outline-none"
                  />
                </div>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-full mt-4 transition-colors"
                >
                  저장하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active = false, disabled = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, disabled?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={disabled ? undefined : onClick}
      className={`flex items-center p-3 rounded-full w-fit transition-colors group ${disabled ? 'cursor-default opacity-40' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer'}`}
    >
      <div className={`${active ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-900 dark:text-zinc-100'} ${!disabled && 'group-hover:scale-110'} transition-transform`}>
        {icon}
      </div>
      <span className={`hidden xl:block ml-4 text-xl ${active ? 'font-bold' : 'font-normal'}`}>
        {label}
      </span>
    </div>
  );
}

function TrendItem({ category, title, tweets }: { category: string, title: string, tweets: string }) {
  return (
    <div className="hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
      <p className="text-xs text-zinc-500">{category}</p>
      <p className="font-bold">{title}</p>
      <p className="text-xs text-zinc-500">{tweets} 게시물</p>
    </div>
  );
}
