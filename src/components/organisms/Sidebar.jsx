import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Exercises", path: "/exercises", icon: "Brain" },
    { name: "Progress", path: "/progress", icon: "TrendingUp" },
    { name: "Achievements", path: "/achievements", icon: "Award" },
    { name: "Settings", path: "/settings", icon: "Settings" }
  ];
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="Brain" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">BrainFitness</h1>
            <p className="text-sm text-gray-600 font-body">AI Brain Gym</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  }`
                }
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-body">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Premium Upgrade */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-accent/10 to-warning/10 rounded-xl p-4 border border-accent/20">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="Crown" size={20} className="text-accent" />
            <h3 className="font-display font-bold text-gray-900">Go Premium</h3>
          </div>
          <p className="text-sm text-gray-600 font-body mb-3">
            Unlock unlimited exercises and advanced analytics
          </p>
          <Button variant="accent" size="sm" className="w-full">
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <ApperIcon name="Menu" size={24} className="text-gray-600" />
      </button>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-screen">
        <SidebarContent />
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 w-80 h-full bg-white z-50 shadow-2xl"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;