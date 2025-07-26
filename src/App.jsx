import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Exercises from "@/components/pages/Exercises";
import ExerciseGame from "@/components/pages/ExerciseGame";
import Progress from "@/components/pages/Progress";
import Achievements from "@/components/pages/Achievements";
import Settings from "@/components/pages/Settings";
import DailyAIThinkingTrainer from "@/components/pages/DailyAIThinkingTrainer";
import MentalClarityTrainer from "@/components/pages/MentalClarityTrainer";
import PromptMarketplace from "@/components/pages/PromptMarketplace";
import SellerDashboard from "@/components/pages/SellerDashboard";
function App() {
  return (
    <>
<Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="exercise/:id" element={<ExerciseGame />} />
          <Route path="ai-trainer" element={<DailyAIThinkingTrainer />} />
          <Route path="clarity-trainer" element={<MentalClarityTrainer />} />
          <Route path="prompt-market" element={<PromptMarketplace />} />
          <Route path="seller-dashboard" element={<SellerDashboard />} />
          <Route path="progress" element={<Progress />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;