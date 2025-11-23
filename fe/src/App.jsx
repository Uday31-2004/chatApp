import "./App.css";
import AuthPage from "./page/auth";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import AuthGuard from "./router/authGuard";
import { Toaster } from "react-hot-toast";
import ChatApp from "./page/Chat";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            success: { duration: 3000 },
            error: { duration: 3500 },
          }}
        />

        <Routes>
          {/* Protected Routes Wrap */}
          <Route element={<AuthGuard />}>
            {/* Protected Route Example */}
            <Route path="/dashboard" element={<ChatApp />} />
          </Route>

          {/* Public Route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Catch unmatched routes */}
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
