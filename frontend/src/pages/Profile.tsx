import React from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">User Profile</h1>
        <p className="text-xl text-secondary-600 mb-8">Manage your account and AI projects.</p>

        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 border border-secondary-200">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">AI Project</h2>
          <p className="text-secondary-600 mb-4">Create and train your 24/7 AI bot with a 14-day free Pro trial.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/projects/bot"
              className="inline-flex items-center justify-center rounded-md bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Go to Project
            </Link>
            <Link
              to="/projects/bot?startTrial=true"
              className="inline-flex items-center justify-center rounded-md bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
            >
              Start 14-day Pro Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 