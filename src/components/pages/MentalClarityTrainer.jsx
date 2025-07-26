import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import { promptService } from '@/services/api/promptService';

const MentalClarityTrainer = () => {
  const [activeTab, setActiveTab] = useState('exercises');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clarityStats, setClarityStats] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [exercisesData, statsData, recommendationData] = await Promise.all([
        promptService.getClarityExercises(),
        promptService.getClarityStats(),
        promptService.getDailyRecommendation(true) // Assume premium for demo
      ]);
      
      setExercises(exercisesData);
      setClarityStats(statsData);
      setRecommendation(recommendationData);
    } catch (error) {
      toast.error('Failed to load mental clarity data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'exercises', name: 'Focus Resets', icon: 'Focus' },
    { id: 'history', name: 'Progress', icon: 'TrendingUp' },
    { id: 'insights', name: 'Insights', icon: 'Brain' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Mental Clarity Trainer</h1>
          <p className="text-gray-600 font-body">2-minute focus resets to eliminate mental fog and boost clarity</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 text-success">
            <ApperIcon name="Target" size={16} />
            <span>{clarityStats?.todaysSessions || 0} sessions today</span>
          </div>
          <div className="flex items-center space-x-2 text-primary">
            <ApperIcon name="Flame" size={16} />
            <span>{clarityStats?.currentStreak || 0} day streak</span>
          </div>
        </div>
      </div>

      {/* Daily Recommendation Card */}
      {recommendation && (
        <Card gradient className="p-6 bg-gradient-to-br from-accent/10 to-warning/10 border-accent/30">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-warning rounded-xl flex items-center justify-center flex-shrink-0">
              <ApperIcon name="Sparkles" size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900 font-display">Today's Recommended Reset</h3>
                {recommendation.urgency === 'high' && (
                  <span className="px-2 py-1 text-xs bg-error/20 text-error rounded-full font-medium">
                    Daily Goal
                  </span>
                )}
              </div>
              <h4 className="text-md font-semibold text-gray-800 mb-1">{recommendation.exercise.name}</h4>
              <p className="text-gray-600 text-sm mb-2">{recommendation.reason}</p>
              <p className="text-gray-500 text-xs mb-4">{recommendation.benefitsText}</p>
              <StartSessionButton exercise={recommendation.exercise} variant="accent" />
            </div>
          </div>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ApperIcon name={tab.icon} size={18} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'exercises' && (
          <motion.div
            key="exercises"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ExercisesTab exercises={exercises} />
          </motion.div>
        )}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <HistoryTab clarityStats={clarityStats} />
          </motion.div>
        )}
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <InsightsTab clarityStats={clarityStats} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Exercises Tab Component
const ExercisesTab = ({ exercises }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <Card 
            key={exercise.Id} 
            className="p-6 hover:shadow-lg transition-all duration-200 group relative"
          >
            {exercise.isPremium && (
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 text-xs bg-gradient-to-r from-accent to-warning text-white rounded-full font-medium">
                  Premium
                </span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                exercise.type === 'basic' ? 'bg-primary/10 text-primary' :
                exercise.type === 'focus' ? 'bg-secondary/10 text-secondary' :
                exercise.type === 'advanced' ? 'bg-accent/10 text-accent' :
                'bg-success/10 text-success'
              }`}>
                <ApperIcon 
                  name={
                    exercise.type === 'basic' ? 'Wind' :
                    exercise.type === 'focus' ? 'Target' :
                    exercise.type === 'advanced' ? 'Brain' :
                    'Zap'
                  } 
                  size={24} 
                />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-display mb-2">
                  {exercise.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={14} />
                    <span>{Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="BookOpen" size={14} />
                    <span>{exercise.instructions.length} steps</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {exercise.instructions.slice(0, 2).map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </div>
                  ))}
                  {exercise.instructions.length > 2 && (
                    <div className="text-xs text-gray-500 ml-7">
                      +{exercise.instructions.length - 2} more steps
                    </div>
                  )}
                </div>
                
                <StartSessionButton exercise={exercise} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// History Tab Component
const HistoryTab = ({ clarityStats }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await promptService.getClarityHistory();
      setHistory(data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">{clarityStats?.totalSessions || 0}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">{clarityStats?.avgScore || 0}</div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent mb-1">{clarityStats?.currentStreak || 0}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary mb-1">{clarityStats?.weekSessions || 0}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </Card>
      </div>

      {/* Session History */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 font-display mb-4">Recent Sessions</h3>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Clock" size={32} className="text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h4>
            <p className="text-gray-600 mb-4">Start your first focus reset to see your progress here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 10).map((session) => (
              <div key={session.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center">
                    <ApperIcon name="Focus" size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{session.exerciseName}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{session.completionScore}</div>
                  <div className="text-xs text-gray-600">Score</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// Insights Tab Component
const InsightsTab = ({ clarityStats }) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 font-display mb-4">Performance Insights</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Consistency Score</h4>
                <p className="text-sm text-gray-600">Based on daily practice habits</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-success to-success/80 h-3 rounded-full"
                style={{ width: `${Math.min(100, (clarityStats?.currentStreak || 0) * 10)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {clarityStats?.currentStreak > 7 ? 
                'Excellent consistency! Your mental clarity routine is well established.' :
                clarityStats?.currentStreak > 3 ?
                'Good progress! Keep building your daily clarity habit.' :
                'Start building consistency with daily 2-minute sessions.'
              }
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center">
                <ApperIcon name="Brain" size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Focus Improvement</h4>
                <p className="text-sm text-gray-600">Impact on thinking performance</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-accent">+{Math.round((clarityStats?.avgScore || 0) / 10)}%</div>
            <p className="text-sm text-gray-600">
              Mental clarity sessions are contributing to improved focus and cognitive performance in your daily workouts.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="Lightbulb" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-display mb-2">Smart Recommendations</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Best time for clarity sessions: 15 minutes before brain workouts</p>
              <p>• Your optimal session length: 2-3 minutes for maximum focus</p>
              <p>• Recommended frequency: Once in morning, once before challenging tasks</p>
              <p>• Premium techniques unlock 40% better mental fog reduction</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Start Session Button Component
const StartSessionButton = ({ exercise, variant = 'primary' }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionData, setSessionData] = useState({
    preWorkoutIntent: false,
    mentalFogLevel: 3,
    postSessionLog: ''
  });
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  useEffect(() => {
    let timer;
    if (activeSession && timeRemaining > 0 && !isPaused) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          promptService.updateSessionTime(activeSession.id, activeSession.duration - newTime);
          
          if (newTime <= 0) {
            setShowCompletionForm(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeSession, timeRemaining, isPaused]);

  const startSession = async () => {
    try {
      const session = await promptService.startClaritySession(exercise.Id, true);
      setActiveSession(session);
      setTimeRemaining(session.duration);
      setIsPaused(false);
    } catch (error) {
      if (error.message.includes('Premium')) {
        toast.error('Premium subscription required for this exercise');
      } else {
        toast.error('Failed to start session');
      }
    }
  };

  const togglePause = async () => {
    if (activeSession) {
      try {
        await promptService.pauseClaritySession(activeSession.id);
        setIsPaused(!isPaused);
      } catch (error) {
        toast.error('Failed to pause session');
      }
    }
  };

  const completeSession = async () => {
    if (activeSession) {
      try {
        await promptService.completeClaritySession(activeSession.id, sessionData);
        setActiveSession(null);
        setShowCompletionForm(false);
        setTimeRemaining(0);
        setSessionData({ preWorkoutIntent: false, mentalFogLevel: 3, postSessionLog: '' });
        toast.success('Session completed! Mental clarity improved.');
      } catch (error) {
        toast.error('Failed to complete session');
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show completion form
  if (showCompletionForm && activeSession) {
    return (
      <Card className="p-6 mt-4 border-2 border-success/30 bg-success/5">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="CheckCircle" size={32} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Session Complete!</h3>
          <p className="text-gray-600 text-sm">How do you feel?</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={sessionData.preWorkoutIntent}
                onChange={(e) => setSessionData(prev => ({ ...prev, preWorkoutIntent: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span>I'll use this session to prepare for a brain workout</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mental fog level (1 = Clear, 5 = Very foggy)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setSessionData(prev => ({ ...prev, mentalFogLevel: level }))}
                  className={`w-8 h-8 rounded-full border-2 text-sm font-medium ${
                    sessionData.mentalFogLevel === level
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick note (optional)
            </label>
            <Input
              value={sessionData.postSessionLog}
              onChange={(e) => setSessionData(prev => ({ ...prev, postSessionLog: e.target.value }))}
              placeholder="How did this session help you?"
              className="w-full"
            />
          </div>
          
          <Button onClick={completeSession} className="w-full" variant="success">
            Complete Session
          </Button>
        </div>
      </Card>
    );
  }

  // Show active session
  if (activeSession) {
    return (
      <Card className="p-4 mt-4 border-2 border-primary/30 bg-primary/5">
        <div className="text-center space-y-3">
          <div className="text-3xl font-bold text-primary">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-600">
            {isPaused ? 'Paused' : 'Focus on your breath...'}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((activeSession.duration - timeRemaining) / activeSession.duration) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={togglePause}
            >
              <ApperIcon name={isPaused ? "Play" : "Pause"} size={16} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setActiveSession(null);
                setTimeRemaining(0);
                toast.info('Session ended');
              }}
            >
              <ApperIcon name="Square" size={16} />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Show start button
  return (
    <Button 
      onClick={startSession}
      variant={variant}
      className="w-full"
    >
      <ApperIcon name="Play" size={16} className="mr-2" />
      Start 2-Min Reset
    </Button>
  );
};

export default MentalClarityTrainer;