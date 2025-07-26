import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { userService } from "@/services/api/userService";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    dailyReminders: true,
    streakAlerts: true,
    soundEffects: true,
    darkMode: false,
    difficultyLevel: "adaptive"
  });
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError("");
      const userData = await userService.getCurrentUser();
      setUser(userData);
      // Load user settings if available
      const userSettings = await userService.getUserSettings();
      setSettings({ ...settings, ...userSettings });
    } catch (err) {
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUserData();
  }, []);
  
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const saveSettings = async () => {
    try {
      setSaving(true);
      await userService.updateSettings(settings);
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUserData} />;
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-4">
          Settings & Preferences
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Customize your brain training experience
        </p>
      </motion.div>
      
      {/* Profile Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
          Profile Information
        </h2>
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={32} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-display">
              {user?.displayName || "Brain Trainer"}
            </h3>
            <p className="text-gray-600 font-body">{user?.email || "user@brainfit.ai"}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant={user?.isPremium ? "accent" : "default"}>
                {user?.isPremium ? (
                  <>
                    <ApperIcon name="Crown" size={12} className="mr-1" />
                    Premium
                  </>
                ) : (
                  "Free"
                )}
              </Badge>
              <Badge variant="primary">
                Member since {new Date(user?.joinDate || Date.now()).getFullYear()}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Display Name"
            value={user?.displayName || ""}
            onChange={(e) => setUser(prev => ({ ...prev, displayName: e.target.value }))}
          />
          <Input
            label="Email Address"
            type="email"
            value={user?.email || ""}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </Card>
      
      {/* Training Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
          Training Preferences
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-body mb-3">
              Difficulty Level
            </label>
            <div className="flex space-x-3">
              {[
                { value: "easy", label: "Easy" },
                { value: "adaptive", label: "Adaptive" },
                { value: "hard", label: "Hard" }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={settings.difficultyLevel === option.value ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleSettingChange("difficultyLevel", option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 font-body">Sound Effects</h4>
                <p className="text-sm text-gray-600">Play sounds during exercises</p>
              </div>
              <button
                onClick={() => handleSettingChange("soundEffects", !settings.soundEffects)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.soundEffects ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEffects ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 font-body">Dark Mode</h4>
                <p className="text-sm text-gray-600">Switch to dark theme</p>
              </div>
              <button
                onClick={() => handleSettingChange("darkMode", !settings.darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.darkMode ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
          Notifications
        </h2>
        <div className="space-y-4">
          {[
            {
              key: "notifications",
              title: "Push Notifications",
              description: "Receive notifications about your progress"
            },
            {
              key: "dailyReminders",
              title: "Daily Reminders",
              description: "Get reminded to complete your daily workout"
            },
            {
              key: "streakAlerts",
              title: "Streak Alerts",
              description: "Notifications when your streak is at risk"
            }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 font-body">{notification.title}</h4>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <button
                onClick={() => handleSettingChange(notification.key, !settings[notification.key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[notification.key] ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[notification.key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Data & Privacy */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
          Data & Privacy
        </h2>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <ApperIcon name="Download" size={20} className="mr-3" />
            Export My Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <ApperIcon name="Shield" size={20} className="mr-3" />
            Privacy Settings
          </Button>
          <Button variant="outline" className="w-full justify-start text-error border-error hover:bg-error hover:text-white">
            <ApperIcon name="Trash2" size={20} className="mr-3" />
            Delete Account
          </Button>
        </div>
      </Card>
      
      {/* Premium Upgrade */}
      {!user?.isPremium && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-accent/10 to-warning/10 rounded-xl p-8 border border-accent/20"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Crown" size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-display mb-2">
              Upgrade to Premium
            </h3>
            <p className="text-gray-600 font-body mb-6 max-w-2xl mx-auto">
              Unlock advanced settings, unlimited exercises, and detailed analytics to maximize your brain training potential.
            </p>
            <Button variant="accent" size="lg">
              <ApperIcon name="Sparkles" size={20} className="mr-2" />
              Upgrade Now
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? (
            <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
          ) : (
            <ApperIcon name="Save" size={20} className="mr-2" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;