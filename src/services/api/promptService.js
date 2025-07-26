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

class PromptService {
  constructor() {
    this.scenarios = [...businessScenarios];
    this.workoutSessions = this.loadWorkoutSessions();
    this.conversations = this.loadConversations();
  }

  // Workout Session Management
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

  // Private helper methods
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

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const promptService = new PromptService();