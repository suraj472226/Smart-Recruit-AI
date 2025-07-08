import { useState } from "react";
import SidebarNav from "@/components/SidebarNav.js";
import Header from "@/components/Header.js";
import React from "react";

// Early draft of main app component
// Goal: Basic layout with sidebar and header

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar navigation */}
      <SidebarNav />
      <div className="flex-1 flex flex-col pl-64">
        {/* Header with job title and dark mode toggle */}
        <Header
          currentJobTitle="Upload a Job Description" // Placeholder
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <div className="p-6 overflow-y-auto">
          {/* TODO: Add main content (JD upload, CV processing, etc.) */}
          <p>Main content goes here</p>
        </div>
      </div>
    </div>
  );
};

export default App;