import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Header = () => {
  const [notifications] = useState([
    { id: 1, message: "Daily workout ready!", time: "5 min ago" },
    { id: 2, message: "New achievement unlocked!", time: "1 hour ago" }
  ]);
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
{/* Right side - Notifications and Profile */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <ApperIcon name="Bell" size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center text-xs text-white">
                  {notifications.length}
                </span>
              )}
            </Button>
          </div>
          
{/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 font-body">Brain Trainer</p>
              <p className="text-xs text-gray-600">Premium Member</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const { logout } = useContext(AuthContext);
                logout();
              }}
              className="ml-2"
            >
              <ApperIcon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;