'use client';

import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Unhandled error in Dashboard tree:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-slate-950 p-6 text-white">
          <div className="glass max-w-sm rounded-3xl p-7 text-center">
            <p className="text-lg font-semibold">Something went wrong.</p>
            <p className="mt-2 text-sm text-white/65">Please reload the page and try again.</p>
            <button onClick={() => window.location.reload()} className="glass mt-5 rounded-xl px-4 py-2 text-sm font-medium hover:bg-white/20">Reload</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
