import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Plus } from 'lucide-react';

const mockPosts = [
  {
    id: '1',
    user: 'Juan & Bruno',
    avatar: 'https://picsum.photos/seed/userj/100/100',
    content: 'First day at the new park! Bruno loved chasing the frisbee. ☀️🎾',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
    likes: 42,
    comments: 8
  },
  {
    id: '2',
    user: 'Vet Community',
    avatar: 'https://picsum.photos/seed/vetc/100/100',
    content: 'Healthy treat tip: Frozen apples are perfect for the summer heat! 🍏🧊',
    image: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&q=80&w=800',
    likes: 189,
    comments: 24
  }
];

export const SocialFeed: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Stories/Pets Row Estilo Pawsome */}
      <div className="flex gap-5 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar">
        <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center bg-white shadow-sm hover:border-primary transition-colors">
            <Plus className="w-7 h-7 text-primary" />
          </div>
          <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Add</span>
        </div>
        {['Toby', 'Luna', 'Max', 'Bella', 'Duke'].map((name, i) => (
          <div key={name} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
            <div className="p-1 rounded-full bg-gradient-to-tr from-primary to-accent shadow-xl group-hover:scale-105 transition-transform">
              <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden bg-white">
                <img src={`https://picsum.photos/seed/petstory${i}/100/100`} alt={name} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest group-hover:text-primary transition-colors">{name}</span>
          </div>
        ))}
      </div>

      {/* Feed Posts Style Modern Card */}
      <div className="space-y-10">
        {mockPosts.map(post => (
          <div key={post.id} className="bg-white rounded-5xl overflow-hidden shadow-2xl shadow-secondary/5 border border-white group">
            {/* User Header */}
            <div className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-crema p-0.5 border-2 border-primary/20">
                   <img src={post.avatar} alt={post.user} className="w-full h-full rounded-[14px] object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-secondary">{post.user}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">2 hours ago</span>
                </div>
              </div>
              <button className="text-slate-300 hover:text-secondary transition-colors">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>
            {/* Image with Soft Corners */}
            <div className="px-3">
              <img src={post.image} alt="Post" className="w-full aspect-[4/3] object-cover rounded-[32px] shadow-sm" />
            </div>
            {/* Content & Actions */}
            <div className="p-6">
              <div className="flex items-center gap-8 mb-4">
                <button className="flex items-center gap-2 text-secondary/40 hover:text-primary transition-colors group/btn">
                  <Heart className="w-6 h-6 group-hover/btn:fill-primary" />
                  <span className="text-xs font-black text-secondary">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-secondary/40 hover:text-secondary transition-colors group/btn">
                  <MessageCircle className="w-6 h-6 group-hover/btn:fill-secondary" />
                  <span className="text-xs font-black text-secondary">{post.comments}</span>
                </button>
                <button className="ml-auto text-secondary/30 hover:text-secondary transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                <span className="font-black text-secondary mr-2">{post.user.split(' ')[0]}</span>
                {post.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};