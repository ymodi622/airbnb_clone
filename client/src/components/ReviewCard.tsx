import { motion } from 'motion/react';

type ReviewCardProps = {
  authorName: string;
  authorImage: string;
  date: string;
  duration: string;
  rating: number;
  content: string;
};

export default function ReviewCard({ authorName, authorImage, date, duration, rating, content }: ReviewCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
          <img 
            src={authorImage} 
            alt={authorName} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex flex-col">
          <h3 className="font-label-md text-label-md text-on-surface font-semibold">{authorName}</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{date} · {duration}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className="material-symbols-outlined text-[14px]"
            style={{ 
              fontVariationSettings: "'FILL' 1",
              color: i < Math.floor(rating) ? '#1f1e1d' : '#e6e5e3'
            }}
          >
            star
          </span>
        ))}
      </div>
      
      <p className="font-body-md text-body-md text-on-surface line-clamp-4 leading-relaxed">
        {content}
      </p>
      
      <button className="text-left font-label-md font-semibold text-on-surface underline mt-auto self-start hover:text-primary transition-colors focus:outline-none">
        Show more
      </button>
    </motion.div>
  );
}
