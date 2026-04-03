import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Transactions from "./pages/Transactions/Transactions";
import Analytics from "./pages/Analytics/Analytics";
import Settings from "./pages/Settings/Settings";

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
