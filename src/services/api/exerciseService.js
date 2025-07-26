import exercisesData from "@/services/mockData/exercises.json";

class ExerciseService {
  constructor() {
    this.exercises = [...exercisesData];
  }

  async getAll() {
    await this.delay();
    return [...this.exercises];
  }

  async getById(id) {
    await this.delay();
    const exercise = this.exercises.find(ex => ex.Id === id);
    if (!exercise) {
      throw new Error("Exercise not found");
    }
    return { ...exercise };
  }

  async getRecommendedExercises() {
    await this.delay();
    // Return a mix of free exercises for quick access
    return this.exercises.filter(ex => !ex.isPremium).slice(0, 6);
  }

  async getByCategory(category) {
    await this.delay();
    return this.exercises.filter(ex => ex.category === category);
  }

  delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const exerciseService = new ExerciseService();