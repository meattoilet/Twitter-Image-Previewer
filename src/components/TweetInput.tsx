import React, { useState, useRef } from 'react';
import { UserProfile, Tweet } from '../types';
import { Image, X, Smile, Calendar, MapPin, Hash } from 'lucide-react';

interface TweetInputProps {
  user: UserProfile;
  onTweet: (tweet: Omit<Tweet, 'id' | 'timestamp' | 'user'>) => void;
}

export const TweetInput: React.FC<TweetInputProps> = ({ user, onTweet }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent) => {
    let files: FileList | File[] | null = null;
    
    if ('files' in e.target && e.target.files) {
      files = e.target.files;
    } else if ('clipboardData' in e && e.clipboardData.files) {
      files = Array.from(e.clipboardData.files);
    }

    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string].slice(0, 4));
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input if it's a change event
    if ('target' in e && 'value' in e.target && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData.files.length > 0) {
      handleImageUpload(e);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) return;
    onTweet({ content, images });
    setContent('');
    setImages([]);
  };

  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex">
      <div className="flex-shrink-0 mr-3">
        <img 
          src={user.avatar || 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'} 
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-grow">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          placeholder="무슨 일이 일어나고 있나요?"
          className="w-full bg-transparent border-none focus:ring-0 text-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 resize-none min-h-[100px]"
        />

        {images.length > 0 && (
          <div className={`mt-3 grid gap-2 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {images.map((img, i) => (
              <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <img src={img} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors"
              disabled={images.length >= 4}
            >
              <Image size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            <button className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
              <Hash size={20} />
            </button>
            <button className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
              <Smile size={20} />
            </button>
            <button className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
              <Calendar size={20} />
            </button>
            <button className="p-2 text-[#1d9bf0] hover:bg-[#1d9bf0]/10 rounded-full transition-colors">
              <MapPin size={20} />
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() && images.length === 0}
            className="px-4 py-1.5 bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 text-white font-bold rounded-full transition-colors"
          >
            게시하기
          </button>
        </div>
      </div>
    </div>
  );
};
