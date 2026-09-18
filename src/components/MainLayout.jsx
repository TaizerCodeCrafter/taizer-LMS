import React, { Component } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center bg-[#070b14] text-white">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 max-w-md space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-amber-400">Content Temporarily Unavailable</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A minor rendering issue occurred. Click the button below to reload the application.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#070b14]">
      <ErrorBoundary>
        <Navbar />
      </ErrorBoundary>
      <main className="flex-grow">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default MainLayout;
