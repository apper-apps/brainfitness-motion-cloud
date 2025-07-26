import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="text-center">
          <h3 className="font-display text-lg font-semibold text-gray-800 mb-2">
            Loading Your Brain Training
          </h3>
          <p className="text-gray-600 font-body">
            Preparing your cognitive workout...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;