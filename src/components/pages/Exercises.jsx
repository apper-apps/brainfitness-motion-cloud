import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ExerciseCard from "@/components/molecules/ExerciseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { exerciseService } from "@/services/api/exerciseService";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  
  const categories = ["All", "Memory", "Focus", "Logic", "Speed", "Pattern"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  
  const loadExercises = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await exerciseService.getAll();
      setExercises(data);
      setFilteredExercises(data);
    } catch (err) {
      setError("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadExercises();
  }, []);
  
  useEffect(() => {
    let filtered = exercises;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }
    
    // Filter by difficulty
    if (selectedDifficulty !== "All") {
      const difficultyMap = { "Easy": 1, "Medium": 2, "Hard": 3 };
      filtered = filtered.filter(exercise => exercise.difficulty === difficultyMap[selectedDifficulty]);
    }
    
    setFilteredExercises(filtered);
  }, [exercises, searchTerm, selectedCategory, selectedDifficulty]);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadExercises} />;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-4">
          Brain Training Exercises
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Challenge yourself with cognitive exercises designed to boost your mental fitness
        </p>
      </motion.div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-body mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 font-body mb-2">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 font-body">
            Showing {filteredExercises.length} of {exercises.length} exercises
            {(searchTerm || selectedCategory !== "All" || selectedDifficulty !== "All") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                }}
                className="ml-2"
              >
                Clear filters
              </Button>
            )}
          </p>
        </div>
      </div>
      
      {/* Exercise Grid */}
      {filteredExercises.length === 0 ? (
        <Empty
          icon="Search"
          title="No exercises found"
          description="Try adjusting your search criteria or browse all available exercises"
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm("");
            setSelectedCategory("All");
            setSelectedDifficulty("All");
          }}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredExercises.map((exercise, index) => (
            <motion.div
              key={exercise.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ExerciseCard exercise={exercise} />
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Premium Upgrade Banner */}
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
            Unlock all premium exercises, get personalized training plans, and access advanced analytics to supercharge your brain training journey.
          </p>
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Check" size={20} className="text-success" />
              <span className="text-sm text-gray-700">Unlimited exercises</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Check" size={20} className="text-success" />
              <span className="text-sm text-gray-700">Advanced analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Check" size={20} className="text-success" />
              <span className="text-sm text-gray-700">Custom training plans</span>
            </div>
          </div>
          <Button variant="accent" size="lg">
            <ApperIcon name="Sparkles" size={20} className="mr-2" />
            Upgrade Now
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Exercises;