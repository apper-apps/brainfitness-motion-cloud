import workoutsData from "@/services/mockData/workouts.json";
import { exerciseService } from "./exerciseService";

class WorkoutService {
  constructor() {
    this.workouts = [...workoutsData];
  }

  async getTodayWorkout() {
    await this.delay();
    const today = new Date().toISOString().split("T")[0];
    const todayWorkout = this.workouts.find(workout => 
      workout.date.split("T")[0] === today
    );
    return todayWorkout ? { ...todayWorkout } : null;
  }

  async createDailyWorkout() {
    await this.delay();
    const exercises = await exerciseService.getRecommendedExercises();
    const selectedExercises = exercises.slice(0, 3).map(ex => ({
      Id: ex.Id,
      name: ex.name,
      category: ex.category,
      completed: false
    }));

    const newWorkout = {
      Id: this.getNextId(),
      userId: "1",
      date: new Date().toISOString(),
      exercises: selectedExercises,
      duration: 0,
      score: 0,
      completed: false
    };

    this.workouts.push(newWorkout);
    return { ...newWorkout };
  }

  async recordExerciseCompletion(exerciseId, score) {
    await this.delay();
    // In a real app, this would update the database
    return { success: true, score };
  }

  getNextId() {
    return Math.max(...this.workouts.map(w => w.Id), 0) + 1;
  }

  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const workoutService = new WorkoutService();