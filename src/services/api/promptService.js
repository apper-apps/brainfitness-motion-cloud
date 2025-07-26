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
// Prompt Marketplace Data
const marketplacePrompts = [
  {
    Id: 1,
    title: "Ultimate Business Strategy Analyzer",
    description: "Comprehensive business analysis prompt that won 15 battles",
    prompt: "Analyze the competitive landscape for [BUSINESS] by examining market positioning, pricing strategies, customer segments, and growth opportunities. Provide actionable insights with specific recommendations for market entry or expansion.",
    price: 4.99,
    sellerId: 1,
    sellerName: "StrategyPro",
    sellerRating: 4.8,
    category: "Business Strategy",
    battleWins: 15,
    totalSales: 89,
    rating: 4.9,
    reviews: 23,
    tags: ["strategy", "competitive-analysis", "market-research"],
    createdAt: new Date('2024-01-15'),
    featured: true
  },
  {
    Id: 2,
    title: "Creative Writing Catalyst",
    description: "Spark creativity with this battle-tested storytelling prompt",
    prompt: "Create a compelling narrative around [THEME/CONCEPT] that incorporates unexpected plot twists, rich character development, and vivid sensory details. Include dialogue that reveals character motivations and drives the story forward with emotional resonance.",
    price: 2.99,
    sellerId: 2,
    sellerName: "WordWizard",
    sellerRating: 4.6,
    category: "Creative Writing",
    battleWins: 8,
    totalSales: 156,
    rating: 4.7,
    reviews: 45,
    tags: ["creative-writing", "storytelling", "character-development"],
    createdAt: new Date('2024-01-20'),
    featured: false
  },
  {
    Id: 3,
    title: "Technical Problem Solver",
    description: "Debug and optimize code with this engineering-focused prompt",
    prompt: "Analyze the provided [CODE/SYSTEM] to identify performance bottlenecks, security vulnerabilities, and optimization opportunities. Provide specific code improvements, architectural suggestions, and best practices implementation with clear explanations.",
    price: 6.99,
    sellerId: 3,
    sellerName: "CodeMaster",
    sellerRating: 4.9,
    category: "Technology",
    battleWins: 22,
    totalSales: 67,
    rating: 4.8,
    reviews: 18,
    tags: ["debugging", "optimization", "code-review"],
    createdAt: new Date('2024-01-25'),
    featured: true
  }
];

// Prompt Packs for Brain Fitness
const promptPacks = [
  {
    Id: 1,
    title: "Memory Boost Pack",
    description: "10 scientifically-backed prompts designed to enhance memory retention and recall through targeted cognitive exercises.",
    price: 9.99,
    tier: 'standard',
    promptCount: 10,
    category: 'Memory Enhancement',
    featured: true,
    includesTemplates: true,
    includesGuides: true,
    rating: 4.8,
    reviews: 124,
    totalSales: 87,
    efficacyRating: 94,
    workoutIntegration: "Perfect for Daily Thinking Sessions focused on memory improvement. Use before important learning sessions.",
    createdAt: '2024-01-15',
    prompts: [
      "Create a detailed mental map of [topic] with interconnected concepts and visual anchors for enhanced recall.",
      "Design a memory palace for [subject] using familiar locations and vivid imagery associations.",
      "Generate mnemonic devices for [information] using the Method of Loci technique.",
      // ... 7 more prompts
    ]
  },
  {
    Id: 2,
    title: "Focus Amplifier Pack",
    description: "15 premium prompts to sharpen concentration and eliminate mental distractions for peak performance.",
    price: 14.99,
    tier: 'premium',
    promptCount: 15,
    category: 'Focus Training',
    featured: true,
    includesTemplates: true,
    includesGuides: true,
    rating: 4.9,
    reviews: 98,
    totalSales: 63,
    efficacyRating: 96,
    workoutIntegration: "Ideal for Mental Clarity Trainer sessions when you need sustained attention for complex tasks.",
    createdAt: '2024-01-20',
    prompts: [
      "Create a focused attention protocol for [task] that eliminates distractions and maintains flow state.",
      "Design a concentration exercise that progressively builds mental stamina for [duration] minutes.",
      // ... 13 more prompts
    ]
  },
  {
    Id: 3,
    title: "Problem Solver Starter",
    description: "5 essential prompts for systematic problem-solving and creative thinking breakthroughs.",
    price: 4.99,
    tier: 'basic',
    promptCount: 5,
    category: 'Problem Solving',
    featured: false,
    includesTemplates: false,
    includesGuides: true,
    rating: 4.6,
    reviews: 156,
    totalSales: 142,
    efficacyRating: 89,
    workoutIntegration: "Great starting point for any workout session involving analytical thinking or decision making.",
    createdAt: '2024-01-10',
    prompts: [
      "Break down [complex problem] into manageable components using systematic analysis.",
      "Generate multiple solution pathways for [challenge] using lateral thinking techniques.",
      // ... 3 more prompts
    ]
  },
  {
    Id: 4,
    title: "Creative Genius Bundle",
    description: "25 advanced prompts for unleashing creative potential with templates and comprehensive guides.",
    price: 19.99,
    tier: 'premium',
    promptCount: 25,
    category: 'Creative Thinking',
    featured: true,
    includesTemplates: true,
    includesGuides: true,
    rating: 4.9,
    reviews: 89,
    totalSales: 45,
    efficacyRating: 97,
    workoutIntegration: "Perfect for brainstorming sessions and creative problem-solving workouts. Combines well with any exercise.",
    createdAt: '2024-01-25',
    prompts: [
      "Generate innovative solutions for [challenge] using SCAMPER methodology and creative constraints.",
      "Create unexpected connections between [concept A] and [concept B] to spark breakthrough insights.",
      // ... 23 more prompts
    ]
  },
  {
    Id: 5,
    title: "Decision Master Pack",
    description: "12 strategic prompts for making better decisions under pressure with confidence and clarity.",
    price: 12.99,
    tier: 'standard',
    promptCount: 12,
    category: 'Decision Making',
    featured: false,
    includesTemplates: true,
    includesGuides: true,
    rating: 4.7,
    reviews: 67,
    totalSales: 78,
    efficacyRating: 92,
    workoutIntegration: "Essential for leadership workouts and strategic thinking sessions. Use when facing important choices.",
    createdAt: '2024-01-18',
    prompts: [
      "Evaluate [decision] using a structured framework that weighs risks, benefits, and long-term consequences.",
      "Create a decision matrix for [options] that considers multiple criteria and stakeholder perspectives.",
      // ... 10 more prompts
    ]
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
this.marketplacePrompts = [...marketplacePrompts];
    this.promptPacks = [...promptPacks];
    this.userPurchases = this.loadUserPurchases();
    this.sellerListings = this.loadSellerListings();
    this.stripeLoaded = this.loadStripe();
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

  // Prompt Packs API Methods
  async getPromptPacks(filters = {}) {
    await this.delay();
    let packs = [...this.promptPacks];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      packs = packs.filter(pack => 
        pack.title.toLowerCase().includes(searchTerm) ||
        pack.description.toLowerCase().includes(searchTerm) ||
        pack.category.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category && filters.category !== 'All') {
      packs = packs.filter(pack => pack.category === filters.category);
    }

    if (filters.priceRange) {
      packs = packs.filter(pack => 
        pack.price >= filters.priceRange[0] && pack.price <= filters.priceRange[1]
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        packs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        packs.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        packs.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        packs.sort((a, b) => b.rating - a.rating);
        break;
      case 'sales':
        packs.sort((a, b) => b.totalSales - a.totalSales);
        break;
      case 'featured':
      default:
        packs.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return packs;
  }

  async getPromptPackById(id) {
    await this.delay();
    const pack = this.promptPacks.find(p => p.Id === parseInt(id));
    if (!pack) {
      throw new Error('Prompt pack not found');
    }
    return { ...pack };
  }

  async purchasePromptPack(packId, paymentMethod) {
    await this.delay(1000);
    
    const pack = this.promptPacks.find(p => p.Id === parseInt(packId));
    if (!pack) {
      throw new Error('Prompt pack not found');
    }

    // Simulate Stripe payment processing
    const stripeResult = await this.processStripePayment(pack.price, paymentMethod);
    
    if (!stripeResult.success) {
      throw new Error('Payment failed. Please try again.');
    }

    // Create purchase record
    const purchase = {
      Id: Date.now(),
      packId: pack.Id,
      packTitle: pack.title,
      amount: pack.price,
      paymentId: stripeResult.paymentId,
      purchaseDate: new Date().toISOString(),
      type: 'pack',
      downloadUrls: pack.prompts.map((prompt, index) => ({
        promptId: `${pack.Id}_${index + 1}`,
        title: `Prompt ${index + 1}`,
        content: prompt,
        downloadUrl: `https://api.brainfitness.ai/downloads/pack_${pack.Id}_prompt_${index + 1}.txt`
      })),
      templates: pack.includesTemplates ? [
        {
          title: 'Customization Template',
          downloadUrl: `https://api.brainfitness.ai/downloads/pack_${pack.Id}_template.pdf`
        }
      ] : [],
      guides: pack.includesGuides ? [
        {
          title: 'Usage Guide',
          downloadUrl: `https://api.brainfitness.ai/downloads/pack_${pack.Id}_guide.pdf`
        }
      ] : []
    };

    // Add to user purchases
    this.userPurchases.push(purchase);
    this.saveUserPurchases();

    // Update pack sales count
    pack.totalSales += 1;

    toast.success(`${pack.title} purchased successfully! Downloads are ready.`);
    return purchase;
  }

  async getPackWorkoutSuggestions(packId) {
    await this.delay();
    const pack = this.promptPacks.find(p => p.Id === parseInt(packId));
    if (!pack) {
      throw new Error('Prompt pack not found');
    }

    // Generate workout integration suggestions based on pack category
    const suggestions = {
      'Memory Enhancement': [
        {
          workoutType: 'Daily Thinking Session',
          suggestion: 'Use memory prompts before learning new information to improve retention by up to 40%.',
          timing: 'Start of session',
          duration: '5-10 minutes'
        },
        {
          workoutType: 'Mental Clarity Trainer',
          suggestion: 'Combine with breathing exercises to enhance memory consolidation during focus breaks.',
          timing: 'Mid-session break',
          duration: '3-5 minutes'
        }
      ],
      'Focus Training': [
        {
          workoutType: 'Mental Clarity Trainer',
          suggestion: 'Perfect for sustained attention tasks. Use these prompts to maintain deep focus for longer periods.',
          timing: 'Throughout session',
          duration: '15-30 minutes'
        },
        {
          workoutType: 'Daily Thinking Session',
          suggestion: 'Ideal for complex problem-solving that requires uninterrupted concentration.',
          timing: 'Peak focus time',
          duration: '20-45 minutes'
        }
      ],
      'Problem Solving': [
        {
          workoutType: 'Daily Thinking Session',
          suggestion: 'Use these prompts when facing challenging decisions or complex analytical tasks.',
          timing: 'Start of session',
          duration: '10-20 minutes'
        }
      ],
      'Creative Thinking': [
        {
          workoutType: 'Daily Thinking Session',
          suggestion: 'Perfect for brainstorming and innovative problem-solving sessions.',
          timing: 'Peak creativity time',
          duration: '15-60 minutes'
        }
      ],
      'Decision Making': [
        {
          workoutType: 'Daily Thinking Session',
          suggestion: 'Use when facing important choices or strategic planning sessions.',
          timing: 'Start of session',
          duration: '10-30 minutes'
        }
      ]
    };

    return suggestions[pack.category] || [];
  }

// Marketplace Methods
  async getMarketplacePrompts(filters = {}) {
    await this.delay();
    let prompts = [...this.marketplacePrompts];
    
    if (filters.category && filters.category !== 'All') {
      prompts = prompts.filter(p => p.category === filters.category);
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      prompts = prompts.filter(p => p.price >= min && p.price <= max);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      prompts = prompts.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tags.some(tag => tag.includes(search))
      );
    }
    
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          prompts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          prompts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          prompts.sort((a, b) => b.rating - a.rating);
          break;
        case 'sales':
          prompts.sort((a, b) => b.totalSales - a.totalSales);
          break;
        case 'newest':
          prompts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
    }
    
    return prompts;
}

  async getPromptById(id) {
    await this.delay();
    return this.marketplacePrompts.find(p => p.Id === parseInt(id));
  }

  async getFeaturedPrompts() {
    await this.delay();
    return this.marketplacePrompts.filter(p => p.featured).slice(0, 3);
  }

  async purchasePrompt(promptId, paymentMethod) {
    await this.delay(1000);
    
    const prompt = this.marketplacePrompts.find(p => p.Id === parseInt(promptId));
    if (!prompt) throw new Error('Prompt not found');

    // Simulate Stripe payment processing
    const paymentResult = await this.processStripePayment(prompt.price, paymentMethod);
    
    if (paymentResult.success) {
      // Add to user purchases
      const purchase = {
        Id: Date.now(),
        promptId: prompt.Id,
        prompt: { ...prompt },
        purchaseDate: new Date().toISOString(),
        amount: prompt.price,
        platformFee: prompt.price * 0.3,
        sellerEarnings: prompt.price * 0.7,
        paymentIntentId: paymentResult.paymentIntentId
      };
      
      this.userPurchases.push(purchase);
      this.saveUserPurchases();
      
      // Update prompt sales count
      prompt.totalSales += 1;
      
      // Process seller payout
      await this.processSellePayout(prompt.sellerId, purchase.sellerEarnings);
      
      toast.success('Prompt purchased successfully!');
      return purchase;
    } else {
      throw new Error(paymentResult.error || 'Payment failed');
    }
}
  async getUserPurchases() {
    await this.delay();
    return [...this.userPurchases];
  }

  async getSellerDashboard(sellerId = 1) {
    await this.delay();
    const listings = this.sellerListings.filter(l => l.sellerId === sellerId);
    const totalEarnings = listings.reduce((sum, l) => sum + (l.totalSales * l.price * 0.7), 0);
    const totalSales = listings.reduce((sum, l) => sum + l.totalSales, 0);
    
    return {
      listings,
      stats: {
        totalListings: listings.length,
        totalSales,
        totalEarnings: totalEarnings.toFixed(2),
        averageRating: listings.length > 0 ? 
          (listings.reduce((sum, l) => sum + l.rating, 0) / listings.length).toFixed(1) : 0
      }
    };
  }

  async createPromptListing(promptData) {
    await this.delay();
    
    const newListing = {
      Id: Date.now(),
      ...promptData,
      sellerId: 1, // Current user
      sellerName: "You",
      sellerRating: 4.5,
      totalSales: 0,
      rating: 0,
      reviews: 0,
      createdAt: new Date(),
      featured: false
    };
    
    this.sellerListings.push(newListing);
    this.marketplacePrompts.push(newListing);
    this.saveSellerListings();
    
    toast.success('Prompt listed successfully!');
    return newListing;
  }

  async updatePromptListing(id, updates) {
    await this.delay();
    
    const index = this.sellerListings.findIndex(l => l.Id === parseInt(id));
    if (index === -1) throw new Error('Listing not found');
    
    this.sellerListings[index] = { ...this.sellerListings[index], ...updates };
    
    const marketIndex = this.marketplacePrompts.findIndex(p => p.Id === parseInt(id));
    if (marketIndex !== -1) {
      this.marketplacePrompts[marketIndex] = { ...this.marketplacePrompts[marketIndex], ...updates };
    }
    
    this.saveSellerListings();
    toast.success('Listing updated successfully!');
    return this.sellerListings[index];
  }

  async deletePromptListing(id) {
    await this.delay();
    
    this.sellerListings = this.sellerListings.filter(l => l.Id !== parseInt(id));
    this.marketplacePrompts = this.marketplacePrompts.filter(p => p.Id !== parseInt(id));
    
    this.saveSellerListings();
    toast.success('Listing deleted successfully!');
  }

  // Stripe Integration
  async loadStripe() {
    if (typeof window !== 'undefined') {
      const { loadStripe } = await import('@stripe/stripe-js');
      return loadStripe('pk_test_your_publishable_key_here'); // Replace with actual key
    }
    return null;
  }

  async processStripePayment(amount, paymentMethod) {
    // Simulate Stripe payment processing
    await this.delay(2000);
    
    // In real implementation, this would call your backend API
    // which would create a PaymentIntent with Stripe
    const success = Math.random() > 0.1; // 90% success rate for demo
    
    if (success) {
      return {
        success: true,
        paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Payment failed. Please try again.'
      };
    }
  }

async processSellePayout(sellerId, amount) {
    // Simulate automated payout processing
    await this.delay(500);
    
    // In real implementation, this would trigger Stripe Connect payout
    console.log(`Processing payout of $${amount.toFixed(2)} to seller ${sellerId}`);
    
    // Store payout record
    const payout = {
      Id: Date.now(),
      sellerId,
      amount,
      status: 'completed',
      processedAt: new Date().toISOString()
    };
    
    // In real app, save to payouts collection
    return payout;
  }

  // Analytics for prompt packs
  async getPackAnalytics() {
    await this.delay();
    
    const totalPackSales = this.promptPacks.reduce((sum, pack) => sum + pack.totalSales, 0);
    const totalPackRevenue = this.promptPacks.reduce((sum, pack) => sum + (pack.totalSales * pack.price), 0);
    const avgPackRating = this.promptPacks.reduce((sum, pack) => sum + pack.rating, 0) / this.promptPacks.length;
    
    return {
      totalPacks: this.promptPacks.length,
      totalPackSales,
      totalPackRevenue,
      avgPackRating: Math.round(avgPackRating * 10) / 10,
      topSellingPack: this.promptPacks.reduce((max, pack) => 
        pack.totalSales > (max?.totalSales || 0) ? pack : max, null
      ),
      packsByTier: {
        basic: this.promptPacks.filter(p => p.tier === 'basic').length,
        standard: this.promptPacks.filter(p => p.tier === 'standard').length,
        premium: this.promptPacks.filter(p => p.tier === 'premium').length
      }
    };
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
  loadUserPurchases() {
    const stored = localStorage.getItem('user-purchases');
    return stored ? JSON.parse(stored) : [];
  }

  saveUserPurchases() {
    localStorage.setItem('user-purchases', JSON.stringify(this.userPurchases));
  }

  loadSellerListings() {
    const stored = localStorage.getItem('seller-listings');
    return stored ? JSON.parse(stored) : [];
  }

  saveSellerListings() {
    localStorage.setItem('seller-listings', JSON.stringify(this.sellerListings));
  }

  // Existing storage methods
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