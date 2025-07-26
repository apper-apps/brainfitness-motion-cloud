import { toast } from 'react-toastify';

const businessScenarios = [
  {
    Id: 1,
    title: "Competitor Pricing Analysis",
    description: "Analyze competitor pricing strategies for market positioning",
    category: "Market Research",
    difficulty: 2,
    suggestedPrompt: "Analyze competitor pricing for [product category] focusing on value propositions and market positioning strategies"
  },
  {
    Id: 2,
    title: "Customer Retention Strategy",
    description: "Develop strategies to improve customer retention rates",
    category: "Customer Success",
    difficulty: 3,
    suggestedPrompt: "Create a comprehensive customer retention strategy for [industry] considering lifecycle stages and pain points"
  },
  {
    Id: 3,
    title: "Product Feature Prioritization",
    description: "Prioritize product features based on user impact and business value",
    category: "Product Management",
    difficulty: 2,
    suggestedPrompt: "Prioritize product features for [product type] using impact vs effort matrix and user feedback data"
  },
  {
    Id: 4,
    title: "Marketing Campaign Optimization",
    description: "Optimize marketing campaigns for better ROI and engagement",
    category: "Marketing",
    difficulty: 2,
    suggestedPrompt: "Optimize marketing campaign performance for [target audience] across digital channels with budget constraints"
  },
  {
    Id: 5,
    title: "Supply Chain Risk Assessment",
    description: "Assess and mitigate supply chain risks",
    category: "Operations",
    difficulty: 3,
    suggestedPrompt: "Assess supply chain risks for [industry] and propose mitigation strategies considering global disruptions"
  },
  {
    Id: 6,
    title: "Employee Engagement Survey",
    description: "Design and analyze employee engagement initiatives",
    category: "HR",
    difficulty: 2,
    suggestedPrompt: "Design employee engagement survey for [company size] and create action plan based on typical response patterns"
  }
];

const aiResponses = [
  "That's an interesting approach. Have you considered the long-term implications of this strategy?",
  "Your prompt shows good structure. Could you be more specific about the desired outcome format?",
  "I notice you're focusing on quantitative aspects. What about qualitative factors that might influence this?",
  "This is a comprehensive prompt. How would you prioritize these different elements if resources were limited?",
  "Good thinking! What additional context would help an AI provide more actionable insights?",
  "Your approach is solid. Have you thought about potential edge cases or exceptions?",
  "Interesting perspective. How would you measure the success of this strategy?",
  "That's a thoughtful prompt. What timeframe are you considering for implementation?",
  "You're on the right track. Could you elaborate on the specific metrics you'd want to track?",
  "This shows strategic thinking. What would be your contingency plan if initial assumptions prove incorrect?"
];

const feedbackTemplates = [
  {
    category: "Clarity",
    good: "Your prompt is clear and well-structured with specific objectives.",
    improve: "Consider adding more specific context and desired output format for better clarity."
  },
  {
    category: "Efficacy", 
    good: "This prompt would generate highly actionable and relevant insights.",
    improve: "Try to include more specific parameters to get more targeted AI responses."
  },
  {
    category: "Specificity",
    good: "Excellent level of detail and specific requirements provided.",
    improve: "Add more specific examples or constraints to narrow down the scope."
  },
  {
    category: "Context",
    good: "Great context provided that would help AI understand the business situation.",
    improve: "Include more background information about industry, company size, or market conditions."
  }
];

// Mental Clarity Breathing Exercises
const breathingExercises = [
  {
    Id: 1,
    name: "4-7-8 Breathing",
    description: "Classic relaxation technique for instant calm",
    duration: 120, // 2 minutes
    type: "basic",
    instructions: [
      "Inhale through your nose for 4 counts",
      "Hold your breath for 7 counts", 
      "Exhale through your mouth for 8 counts",
      "Repeat this cycle 4 times"
    ],
    isPremium: false
  },
  {
    Id: 2,
    name: "Box Breathing",
    description: "Navy SEAL technique for focus and control",
    duration: 120,
    type: "focus",
    instructions: [
      "Inhale for 4 counts",
      "Hold for 4 counts",
      "Exhale for 4 counts", 
      "Hold empty for 4 counts",
      "Continue for 2 minutes"
    ],
    isPremium: false
  },
  {
    Id: 3,
    name: "Progressive Focus Reset",
    description: "Advanced technique with body awareness",
    duration: 120,
    type: "advanced",
    instructions: [
      "Take 3 deep breaths to center yourself",
      "Focus on different body parts with each breath",
      "Tense and release muscle groups progressively",
      "End with 30 seconds of mindful breathing"
    ],
    isPremium: true
  },
  {
    Id: 4,
    name: "Energy Boost Breathing",
    description: "Quick energizer for mental fatigue",
    duration: 90,
    type: "energizing",
    instructions: [
      "Take 10 quick, shallow breaths",
      "Follow with 5 deep, slow breaths",
      "Repeat sequence twice",
      "End with natural breathing rhythm"
    ],
    isPremium: true
  }
];

class PromptService {
  constructor() {
    this.scenarios = [...businessScenarios];
    this.workoutSessions = this.loadWorkoutSessions();
    this.conversations = this.loadConversations();
    this.clarityExercises = [...breathingExercises];
    this.claritySessions = this.loadClaritySessions();
    this.clarityHistory = this.loadClarityHistory();
  }

  // Mental Clarity Session Management
  async getClarityExercises() {
    await this.delay();
    return [...this.clarityExercises];
  }

  async getClarityExerciseById(id) {
    await this.delay();
    const exercise = this.clarityExercises.find(e => e.Id === id);
    if (!exercise) {
      throw new Error("Exercise not found");
    }
    return { ...exercise };
  }

  async startClaritySession(exerciseId, isPremium = false) {
    await this.delay();
    const exercise = await this.getClarityExerciseById(exerciseId);
    
    // Check premium access
    if (exercise.isPremium && !isPremium) {
      throw new Error("Premium subscription required for this exercise");
    }

    const session = {
      id: Date.now(),
      exerciseId,
      exercise,
      startTime: new Date(),
      duration: exercise.duration,
      isActive: true,
      isPaused: false,
      timeElapsed: 0,
      preWorkoutIntent: null,
      mentalFogLevel: null,
      postSessionLog: null
    };

    this.claritySessions.push(session);
    this.saveClaritySessions();
    toast.success(`${exercise.name} session started!`);
    return session;
  }

  async pauseClaritySession(sessionId) {
    await this.delay();
    const session = this.claritySessions.find(s => s.id === sessionId);
    if (!session || !session.isActive) {
      throw new Error("Session not found or inactive");
    }

    session.isPaused = !session.isPaused;
    this.saveClaritySessions();
    
    toast.info(session.isPaused ? "Session paused" : "Session resumed");
    return session;
  }

  async updateSessionTime(sessionId, timeElapsed) {
    const session = this.claritySessions.find(s => s.id === sessionId);
    if (session && session.isActive) {
      session.timeElapsed = timeElapsed;
      this.saveClaritySessions();
    }
  }

  async completeClaritySession(sessionId, sessionData) {
    await this.delay();
    const session = this.claritySessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    session.isActive = false;
    session.endTime = new Date();
    session.preWorkoutIntent = sessionData.preWorkoutIntent;
    session.mentalFogLevel = sessionData.mentalFogLevel;
    session.postSessionLog = sessionData.postSessionLog;
    session.completionScore = this.calculateClarityScore(session, sessionData);

    // Add to history
    const historyEntry = {
      Id: this.clarityHistory.length + 1,
      sessionId: session.id,
      exerciseName: session.exercise.name,
      date: new Date(),
      duration: session.timeElapsed || session.duration,
      completionScore: session.completionScore,
      preWorkoutIntent: session.preWorkoutIntent,
      mentalFogLevel: session.mentalFogLevel,
      postSessionLog: session.postSessionLog,
      thinkingScoreImpact: this.calculateThinkingScoreImpact(sessionData)
    };

    this.clarityHistory.push(historyEntry);
    this.saveClaritySessions();
    this.saveClarityHistory();

    toast.success("Clarity session completed! Great work!");
    return { session, historyEntry };
  }

  async getClarityHistory() {
    await this.delay();
    return [...this.clarityHistory].reverse(); // Most recent first
  }

  async getClarityStats() {
    await this.delay();
    const history = this.clarityHistory;
    const today = new Date().toDateString();
    
    const todaysSessions = history.filter(h => 
      new Date(h.date).toDateString() === today
    );

    const weekSessions = history.filter(h => {
      const sessionDate = new Date(h.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    const avgScore = history.length > 0 
      ? Math.round(history.reduce((sum, h) => sum + h.completionScore, 0) / history.length)
      : 0;

    const totalSessions = history.length;
    const currentStreak = this.calculateClarityStreak(history);

    return {
      todaysSessions: todaysSessions.length,
      weekSessions: weekSessions.length,
      avgScore,
      totalSessions,
      currentStreak,
      lastSession: history[0] || null
    };
  }

  async getDailyRecommendation(isPremium = false) {
    await this.delay();
    const history = this.clarityHistory;
    const stats = await this.getClarityStats();
    
    // Base recommendation on user history
    let recommendedExercise;
    
    if (history.length === 0) {
      // New user - start with basics
      recommendedExercise = this.clarityExercises.find(e => e.Id === 1);
    } else {
      const recentSessions = history.slice(0, 5);
      const avgFogLevel = recentSessions.reduce((sum, s) => sum + (s.mentalFogLevel || 3), 0) / recentSessions.length;
      
      if (avgFogLevel > 4) {
        // High fog - recommend energy boost (premium)
        recommendedExercise = isPremium 
          ? this.clarityExercises.find(e => e.Id === 4)
          : this.clarityExercises.find(e => e.Id === 2);
      } else if (avgFogLevel < 2) {
        // Low fog - advanced techniques
        recommendedExercise = isPremium
          ? this.clarityExercises.find(e => e.Id === 3)
          : this.clarityExercises.find(e => e.Id === 2);
      } else {
        // Medium fog - standard techniques
        recommendedExercise = this.clarityExercises.find(e => e.Id === 1);
      }
    }

    const recommendation = {
      exercise: recommendedExercise,
      reason: this.getRecommendationReason(history, stats),
      urgency: stats.todaysSessions === 0 ? 'high' : 'normal',
      benefitsText: this.getBenefitsText(recommendedExercise, history)
    };

    return recommendation;
  }

  // Existing AI Trainer methods...
  async getScenarios() {
    await this.delay();
    return [...this.scenarios];
  }

  async getScenarioById(id) {
    await this.delay();
    const scenario = this.scenarios.find(s => s.Id === id);
    if (!scenario) {
      throw new Error("Scenario not found");
    }
    return { ...scenario };
  }

  async startWorkoutSession(scenarioId) {
    await this.delay();
    const scenario = await this.getScenarioById(scenarioId);
    const session = {
      id: Date.now(),
      scenarioId,
      scenario,
      startTime: new Date(),
      prompts: [],
      scores: [],
      isActive: true,
      timeLimit: 5 * 60 * 1000 // 5 minutes
    };
    
    this.workoutSessions.push(session);
    this.saveWorkoutSessions();
    toast.success("Workout session started! You have 5 minutes.");
    return session;
  }

  async submitPrompt(sessionId, promptText) {
    await this.delay();
    const session = this.workoutSessions.find(s => s.id === sessionId);
    if (!session || !session.isActive) {
      throw new Error("Session not found or inactive");
    }

    const prompt = {
      id: Date.now(),
      text: promptText,
      timestamp: new Date(),
      feedback: this.generateFeedback(promptText),
      scores: this.calculateScores(promptText)
    };

    session.prompts.push(prompt);
    session.scores.push(prompt.scores);
    this.saveWorkoutSessions();
    
    toast.success("Prompt submitted and scored!");
    return prompt;
  }

  async endWorkoutSession(sessionId) {
    await this.delay();
    const session = this.workoutSessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    session.isActive = false;
    session.endTime = new Date();
    session.finalScore = this.calculateFinalScore(session.scores);
    this.saveWorkoutSessions();
    
    toast.info("Workout session completed!");
    return session;
  }

  // AI Conversation Simulator
  async startConversation(topic) {
    await this.delay();
    const conversation = {
      id: Date.now(),
      topic,
      messages: [
        {
          id: 1,
          type: 'ai',
          content: `I'm ready to help you explore "${topic}". What specific aspect would you like to dive into first?`,
          timestamp: new Date()
        }
      ],
      isActive: true
    };

    this.conversations.push(conversation);
    this.saveConversations();
    toast.success("AI conversation started!");
    return conversation;
  }

  async sendMessage(conversationId, message) {
    await this.delay(800); // Simulate AI thinking time
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation || !conversation.isActive) {
      throw new Error("Conversation not found or inactive");
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    conversation.messages.push(userMessage);

    // Generate AI response
    const aiResponse = {
      id: Date.now() + 1,
      type: 'ai',
      content: this.generateAIResponse(message, conversation.messages),
      timestamp: new Date()
    };
    conversation.messages.push(aiResponse);

    this.saveConversations();
    return aiResponse;
  }

  async endConversation(conversationId) {
    await this.delay();
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    conversation.isActive = false;
    conversation.endTime = new Date();
    this.saveConversations();
    
    toast.info("Conversation ended!");
    return conversation;
  }

  async getConversationHistory() {
    await this.delay();
    return [...this.conversations];
  }

  async getWorkoutHistory() {
    await this.delay();
    return [...this.workoutSessions];
  }

  // Private helper methods for Mental Clarity
  calculateClarityScore(session, sessionData) {
    let score = 70; // Base score

    // Duration completion bonus
    const completionRatio = (session.timeElapsed || session.duration) / session.duration;
    score += Math.min(20, completionRatio * 20);

    // Mental fog improvement
    if (sessionData.mentalFogLevel < 3) score += 10;
    if (sessionData.mentalFogLevel < 2) score += 5;

    // Pre-workout preparation bonus
    if (sessionData.preWorkoutIntent) score += 5;

    return Math.min(100, Math.round(score));
  }

  calculateThinkingScoreImpact(sessionData) {
    // Simulate thinking score improvement based on clarity session
    const baseImpact = 2;
    const fogReduction = Math.max(0, 5 - (sessionData.mentalFogLevel || 3));
    return baseImpact + fogReduction;
  }

  calculateClarityStreak(history) {
    if (!history.length) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < history.length; i++) {
      const sessionDate = new Date(history[i].date);
      const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  getRecommendationReason(history, stats) {
    if (stats.todaysSessions === 0) {
      return "Start your day with a quick focus reset to boost mental clarity";
    }
    
    if (stats.currentStreak > 7) {
      return "Amazing streak! Try an advanced technique to challenge yourself";
    }
    
    if (stats.avgScore < 75) {
      return "Build consistency with fundamental breathing techniques";
    }
    
    return "Continue your mental fitness journey with today's recommended exercise";
  }

  getBenefitsText(exercise, history) {
    const benefits = {
      1: "Reduces stress and anxiety, improves focus within minutes",
      2: "Enhances concentration and mental control, used by professionals",
      3: "Advanced mind-body connection for deep mental clarity",
      4: "Quick energy boost and mental fog elimination"
    };
    
    return benefits[exercise.Id] || "Improves mental clarity and focus";
  }

  // Existing helper methods
  generateFeedback(promptText) {
    const wordCount = promptText.split(' ').length;
    const hasSpecifics = promptText.includes('[') || promptText.toLowerCase().includes('specific');
    const hasContext = wordCount > 20;
    
    const feedback = [];
    
    if (hasContext && hasSpecifics) {
      feedback.push(feedbackTemplates[0].good);
      feedback.push(feedbackTemplates[1].good);
    } else {
      feedback.push(feedbackTemplates[0].improve);
      if (!hasSpecifics) {
        feedback.push(feedbackTemplates[2].improve);
      }
    }

    return feedback.join(' ');
  }

  calculateScores(promptText) {
    const wordCount = promptText.split(' ').length;
    const hasSpecifics = promptText.includes('[') || promptText.toLowerCase().includes('specific');
    const hasQuestions = promptText.includes('?');
    const hasContext = wordCount > 15;
    
    let clarityScore = 60;
    let efficacyScore = 55;

    // Clarity scoring
    if (wordCount > 10) clarityScore += 10;
    if (wordCount > 25) clarityScore += 10;
    if (hasSpecifics) clarityScore += 15;
    if (hasContext) clarityScore += 5;

    // Efficacy scoring  
    if (hasSpecifics) efficacyScore += 20;
    if (hasQuestions) efficacyScore += 10;
    if (wordCount > 20) efficacyScore += 10;
    if (promptText.toLowerCase().includes('analyze') || 
        promptText.toLowerCase().includes('strategy') ||
        promptText.toLowerCase().includes('optimize')) {
      efficacyScore += 5;
    }

    return {
      clarity: Math.min(100, clarityScore),
      efficacy: Math.min(100, efficacyScore)
    };
  }

  calculateFinalScore(scores) {
    if (!scores.length) return 0;
    
    const avgClarity = scores.reduce((sum, s) => sum + s.clarity, 0) / scores.length;
    const avgEfficacy = scores.reduce((sum, s) => sum + s.efficacy, 0) / scores.length;
    
    return Math.round((avgClarity + avgEfficacy) / 2);
  }

  generateAIResponse(userMessage, conversationHistory) {
    const responses = [...aiResponses];
    
    // Add contextual responses based on message content
    if (userMessage.toLowerCase().includes('strategy')) {
      responses.push("Strategic thinking is key here. What are the potential risks and opportunities you see?");
    }
    if (userMessage.toLowerCase().includes('data') || userMessage.toLowerCase().includes('analytics')) {
      responses.push("Data-driven decisions are crucial. What metrics would best validate your hypothesis?");
    }
    if (userMessage.toLowerCase().includes('customer') || userMessage.toLowerCase().includes('user')) {
      responses.push("Understanding the customer perspective is vital. How might you gather more user feedback on this?");
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Storage methods
  loadWorkoutSessions() {
    const stored = localStorage.getItem('ai-workout-sessions');
    return stored ? JSON.parse(stored) : [];
  }

  saveWorkoutSessions() {
    localStorage.setItem('ai-workout-sessions', JSON.stringify(this.workoutSessions));
  }

  loadConversations() {
    const stored = localStorage.getItem('ai-conversations');
    return stored ? JSON.parse(stored) : [];
  }

  saveConversations() {
    localStorage.setItem('ai-conversations', JSON.stringify(this.conversations));
  }

  loadClaritySessions() {
    const stored = localStorage.getItem('clarity-sessions');
    return stored ? JSON.parse(stored) : [];
  }

  saveClaritySessions() {
    localStorage.setItem('clarity-sessions', JSON.stringify(this.claritySessions));
  }

  loadClarityHistory() {
    const stored = localStorage.getItem('clarity-history');
    return stored ? JSON.parse(stored) : [];
  }

  saveClarityHistory() {
    localStorage.setItem('clarity-history', JSON.stringify(this.clarityHistory));
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const promptService = new PromptService();