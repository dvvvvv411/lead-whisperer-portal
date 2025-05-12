
import { motion } from "framer-motion";

const BackgroundEffects = () => {
  return (
    <>
      {/* Abstract shapes */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-gold/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-accent1/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-gold/3 rounded-full blur-[80px] -z-10" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFGMkMiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTMwIDBhMzAgMzAgMCAxIDAgNjAgMCAzMCAzMCAwIDEgMC02MCAwIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2U9IiNmZmYiIGZpbGw9IiMxQTFGMkMiLz48cGF0aCBkPSJNMzAgMzBtLTE4IDBhMTggMTggMCAxIDAgMzYgMCAxOCAxOCAwIDEgMC0zNiAwIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2U9IiNmZmYiIGZpbGw9IiMxQTFGMkMiLz48cGF0aCBkPSJNMzAgMzBtLTYgMGE2IDYgMCAxIDAgMTIgMCA2IDYgMCAxIDAtMTIgMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlPSIjZmZmIiBmaWxsPSIjMUExRjJDIi8+PC9nPjwvc3ZnPg==')] opacity-10 -z-10" />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute bg-gold/20 w-1 h-1 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </>
  );
};

export default BackgroundEffects;
