import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an external service or console
    console.error("Error caught in error boundary:", error, errorInfo);
    // Optional: send error details to an error tracking service here
  }

  handleRetry = () => {
    // Reset error state and allow children to re-render
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1>Something went wrong.</h1>
          <p>Please try again later.</p>
          <button onClick={this.handleRetry} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
