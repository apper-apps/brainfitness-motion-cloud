import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import { promptService } from '@/services/api/promptService';

const DailyAIThinkingTrainer = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const data = await promptService.getScenarios();
      setScenarios(data);
    } catch (error) {
      toast.error('Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'workout', name: 'Daily Workout', icon: 'Zap' },
    { id: 'simulator', name: 'AI Simulator', icon: 'MessageSquare' }
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
          <h1 className="text-3xl font-bold text-gray-900 font-display">Daily AI Thinking Trainer</h1>
          <p className="text-gray-600 font-body">Sharpen your AI prompting skills with daily practice</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="Clock" size={16} />
          <span>5 min daily workout recommended</span>
        </div>
      </div>

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
        {activeTab === 'workout' && (
          <motion.div
            key="workout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <WorkoutTab scenarios={scenarios} />
          </motion.div>
        )}
        {activeTab === 'simulator' && (
          <motion.div
            key="simulator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <SimulatorTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Workout Tab Component
const WorkoutTab = ({ scenarios }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionResults, setSessionResults] = useState(null);

  useEffect(() => {
    let timer;
    if (currentSession && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            endSession();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentSession, timeRemaining]);

  const startWorkout = async (scenario) => {
    try {
      const session = await promptService.startWorkoutSession(scenario.Id);
      setCurrentSession(session);
      setSelectedScenario(scenario);
      setTimeRemaining(session.timeLimit);
      setPromptText(scenario.suggestedPrompt || '');
    } catch (error) {
      toast.error('Failed to start workout session');
    }
  };

  const submitPrompt = async () => {
    if (!promptText.trim() || !currentSession) return;

    try {
      const result = await promptService.submitPrompt(currentSession.id, promptText);
      setPromptText('');
      
      // Show immediate feedback
      toast.success(`Clarity: ${result.scores.clarity}%, Efficacy: ${result.scores.efficacy}%`);
    } catch (error) {
      toast.error('Failed to submit prompt');
    }
  };

  const endSession = async () => {
    if (!currentSession) return;

    try {
      const finalSession = await promptService.endWorkoutSession(currentSession.id);
      setSessionResults(finalSession);
      setCurrentSession(null);
      setTimeRemaining(0);
    } catch (error) {
      toast.error('Failed to end session');
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Show session results
  if (sessionResults) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="CheckCircle" size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Workout Complete!</h3>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{sessionResults.finalScore}</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">{sessionResults.prompts.length}</div>
              <div className="text-sm text-gray-600">Prompts Created</div>
            </div>
          </div>
          <Button onClick={() => {setSessionResults(null); setSelectedScenario(null);}} className="mt-4">
            Start New Workout
          </Button>
        </div>
      </Card>
    );
  }

  // Active workout session
  if (currentSession) {
    return (
      <div className="space-y-6">
        {/* Timer and Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center">
                <ApperIcon name="Clock" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedScenario.title}</h3>
                <p className="text-sm text-gray-600">Time Remaining: {formatTime(timeRemaining)}</p>
              </div>
            </div>
            <Button variant="outline" onClick={endSession}>
              End Session
            </Button>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent to-warning h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeRemaining / currentSession.timeLimit) * 100}%` }}
            />
          </div>
        </Card>

        {/* Prompt Input */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Scenario Description</h4>
              <p className="text-gray-600 text-sm">{selectedScenario.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Craft Your AI Prompt
              </label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Write a detailed prompt that would help an AI analyze this scenario effectively..."
              />
            </div>
            <Button 
              onClick={submitPrompt} 
              disabled={!promptText.trim()}
              className="w-full"
            >
              Submit Prompt for Scoring
            </Button>
          </div>
        </Card>

        {/* Session Stats */}
        {currentSession.prompts.length > 0 && (
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Session Progress</h4>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentSession.prompts.length}</div>
                <div className="text-xs text-gray-600">Prompts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {Math.round(currentSession.scores.reduce((sum, s) => sum + s.clarity, 0) / currentSession.scores.length) || 0}
                </div>
                <div className="text-xs text-gray-600">Avg Clarity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round(currentSession.scores.reduce((sum, s) => sum + s.efficacy, 0) / currentSession.scores.length) || 0}
                </div>
                <div className="text-xs text-gray-600">Avg Efficacy</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Scenario selection
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="Target" size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">5-Minute AI Thinking Workout</h3>
            <p className="text-gray-600 text-sm mt-1">
              Choose a business scenario and craft AI prompts within 5 minutes. Get real-time feedback on prompt quality, clarity, and efficacy.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario) => (
          <Card key={scenario.Id} className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {scenario.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  scenario.difficulty === 1 ? 'bg-success/20 text-success' :
                  scenario.difficulty === 2 ? 'bg-warning/20 text-warning' :
                  'bg-error/20 text-error'
                }`}>
                  Level {scenario.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {scenario.category}
                </span>
                <Button 
                  size="sm" 
                  onClick={() => startWorkout(scenario)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Start Workout
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Simulator Tab Component
const SimulatorTab = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newTopic, setNewTopic] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await promptService.getConversationHistory();
      setConversations(data);
    } catch (error) {
      toast.error('Failed to load conversations');
    }
  };

  const startNewConversation = async () => {
    if (!newTopic.trim()) return;

    try {
      setLoading(true);
      const conversation = await promptService.startConversation(newTopic);
      setConversations(prev => [conversation, ...prev]);
      setActiveConversation(conversation);
      setNewTopic('');
    } catch (error) {
      toast.error('Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return;

    try {
      setLoading(true);
      const response = await promptService.sendMessage(activeConversation.id, messageInput);
      
      // Update local state
      setActiveConversation(prev => ({
        ...prev,
        messages: [...prev.messages, 
          { id: Date.now() - 1, type: 'user', content: messageInput, timestamp: new Date() },
          response
        ]
      }));
      
      setMessageInput('');
      loadConversations(); // Refresh conversations list
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const endConversation = async () => {
    if (!activeConversation) return;

    try {
      await promptService.endConversation(activeConversation.id);
      setActiveConversation(null);
      loadConversations();
    } catch (error) {
      toast.error('Failed to end conversation');
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversation List */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Start New Conversation</h3>
          <div className="space-y-2">
            <Input
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Enter conversation topic..."
              onKeyPress={(e) => e.key === 'Enter' && startNewConversation()}
            />
            <Button 
              onClick={startNewConversation} 
              disabled={!newTopic.trim() || loading}
              className="w-full"
              size="sm"
            >
              Start Conversation
            </Button>
          </div>
        </Card>

        <Card className="p-4 flex-1 overflow-hidden">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Conversations</h3>
          <div className="space-y-2 overflow-y-auto h-full">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeConversation?.id === conv.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-sm text-gray-900 truncate">
                  {conv.topic}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {conv.messages.length} messages
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Conversation */}
      <div className="lg:col-span-2">
        {activeConversation ? (
          <Card className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <div>
                <h3 className="font-semibold text-gray-900">{activeConversation.topic}</h3>
                <p className="text-sm text-gray-600">AI Conversation Simulator</p>
              </div>
              {activeConversation.isActive && (
                <Button variant="outline" size="sm" onClick={endConversation}>
                  End Conversation
                </Button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {activeConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            {activeConversation.isActive && (
              <div className="flex space-x-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!messageInput.trim() || loading}
                >
                  <ApperIcon name="Send" size={16} />
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <Card className="p-8 h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="MessageSquare" size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Conversation Simulator</h3>
                <p className="text-gray-600">
                  Start a new conversation or select an existing one to practice iterative problem-solving with AI.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyAIThinkingTrainer;