import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f1a] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#131b2e] border border-white/10 p-8 rounded-2xl shadow-2xl">
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase bg-slate-800/60 px-3 py-1 rounded-full">
              SYSTEM RECOVERY
            </span>
            <h1 className="text-2xl font-bold text-slate-100 mt-4 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              An unexpected system anomaly occurred. The application state has been safely isolated to prevent instability.
            </p>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-slate-100 text-slate-900 text-sm font-semibold rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
