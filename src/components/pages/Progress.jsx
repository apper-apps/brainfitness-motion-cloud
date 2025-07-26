import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatCard from "@/components/molecules/StatCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { progressService } from "@/services/api/progressService";
import { format, subDays } from "date-fns";

const Progress = () => {
  const [progressData, setProgressData] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30"); // 7, 30, 90 days
  
  const loadProgressData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [progress, stats] = await Promise.all([
        progressService.getProgressHistory(parseInt(timeRange)),
        progressService.getOverallStats()
      ]);
      
      setProgressData(progress);
      setOverallStats(stats);
    } catch (err) {
      setError("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadProgressData();
  }, [timeRange]);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProgressData} />;
  
  // Prepare chart data
  const chartData = {
    series: [
      {
        name: "Mental Fitness Score",
        data: progressData.map(item => ({
          x: format(new Date(item.date), "MMM dd"),
          y: item.score
        }))
      }
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        toolbar: { show: false },
        background: "transparent"
      },
      colors: ["#5B4CDB"],
      stroke: {
        curve: "smooth",
        width: 3
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      },
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 3
      },
      xaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontFamily: "Manrope, sans-serif"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontFamily: "Manrope, sans-serif"
          }
        }
      },
      tooltip: {
        theme: "light",
        style: {
          fontSize: "12px",
          fontFamily: "Manrope, sans-serif"
        }
      }
    }
  };
  
  const categoryData = {
    series: overallStats?.categoryScores?.map(cat => cat.score) || [],
    options: {
      chart: {
        type: "donut",
        height: 300
      },
      labels: overallStats?.categoryScores?.map(cat => cat.category) || [],
      colors: ["#5B4CDB", "#8B7FE8", "#FFB547", "#4CAF50", "#FF9800"],
      legend: {
        position: "bottom",
        fontSize: "12px",
        fontFamily: "Manrope, sans-serif"
      },
      plotOptions: {
        pie: {
          donut: {
            size: "70%"
          }
        }
      }
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 font-display mb-4">
          Your Progress Tracking
        </h1>
        <p className="text-xl text-gray-600 font-body">
          Monitor your cognitive improvement and celebrate your achievements
        </p>
      </motion.div>
      
      {/* Time Range Selector */}
      <div className="flex items-center justify-center space-x-2">
        {[
          { value: "7", label: "7 Days" },
          { value: "30", label: "30 Days" },
          { value: "90", label: "90 Days" }
        ].map((range) => (
          <Button
            key={range.value}
            variant={timeRange === range.value ? "primary" : "outline"}
            size="sm"
            onClick={() => setTimeRange(range.value)}
          >
            {range.label}
          </Button>
        ))}
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current Score"
          value={overallStats?.currentScore || 0}
          icon="Brain"
          color="primary"
          trend={{ direction: "up", value: `+${overallStats?.improvement || 0}` }}
        />
        <StatCard
          title="Total Sessions"
          value={overallStats?.totalSessions || 0}
          icon="Dumbbell"
          color="success"
        />
        <StatCard
          title="Average Score"
          value={overallStats?.averageScore || 0}
          icon="Target"
          color="accent"
        />
        <StatCard
          title="Best Category"
          value={overallStats?.bestCategory || "None"}
          icon="Award"
          color="warning"
        />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-display">
                Mental Fitness Trend
              </h2>
              <div className="flex items-center space-x-2 text-success">
                <ApperIcon name="TrendingUp" size={20} />
                <span className="text-sm font-medium">
                  +{overallStats?.improvement || 0} points
                </span>
              </div>
            </div>
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="area"
              height={350}
            />
          </Card>
        </div>
        
        {/* Category Breakdown & Overall Score */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 font-display mb-4">
              Overall Progress
            </h3>
            <div className="flex justify-center">
              <ProgressRing
                progress={overallStats?.overallProgress || 0}
                size={150}
                strokeWidth={12}
                color="#5B4CDB"
                label="Complete"
              />
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 font-display mb-4">
              Category Performance
            </h3>
            <ReactApexChart
              options={categoryData.options}
              series={categoryData.series}
              type="donut"
              height={300}
            />
          </Card>
        </div>
      </div>
      
      {/* Detailed Progress */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
          Category Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {overallStats?.categoryDetails?.map((category) => (
            <div key={category.name} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name={category.icon} size={24} className="text-white" />
              </div>
              <h4 className="font-display font-bold text-gray-900 mb-1">
                {category.name}
              </h4>
              <p className="text-2xl font-bold text-primary font-display mb-1">
                {category.score}
              </p>
              <p className="text-sm text-gray-600 font-body">
                {category.sessions} sessions
              </p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )) || []}
        </div>
      </Card>
      
      {/* Milestones */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 font-display mb-6">
          Recent Milestones
        </h2>
        <div className="space-y-4">
          {overallStats?.recentMilestones?.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-full flex items-center justify-center">
                <ApperIcon name="Trophy" size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                <p className="text-sm text-gray-600">{milestone.description}</p>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(milestone.date), "MMM dd")}
              </span>
            </motion.div>
          )) || []}
        </div>
      </Card>
    </div>
  );
};

export default Progress;