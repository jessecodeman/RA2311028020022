import { useState, useEffect } from 'react';
import { Log } from 'logging-middleware';
import './index.css';

function App() {
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });

  useEffect(() => {
    // Log app initialization
    Log("frontend", "info", "page", "Application mounted successfully");
  }, []);

  const handleAction = async (actionType: string) => {
    setStatus({ message: 'Processing...', type: '' });
    
    try {
      if (actionType === 'login') {
        await Log("frontend", "info", "component", "User clicked login button");
        setStatus({ message: 'Login action logged successfully', type: 'success' });
      } 
      else if (actionType === 'error') {
        await Log("frontend", "error", "api", "Failed to fetch user data");
        setStatus({ message: 'Error simulated and logged', type: 'error' });
      }
      else if (actionType === 'warning') {
        await Log("frontend", "warn", "state", "Low memory warning simulated");
        setStatus({ message: 'Warning simulated and logged', type: 'success' });
      }
    } catch (err) {
      setStatus({ message: 'Failed to send log', type: 'error' });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Evaluation System</h1>
          <p>Logging Middleware Integration Demo</p>
        </div>

        <div className="actions">
          <button className="btn" onClick={() => handleAction('login')}>
            <span>Simulate Login</span>
            <span>→</span>
          </button>
          <button className="btn" onClick={() => handleAction('error')}>
            <span>Simulate API Error</span>
            <span>→</span>
          </button>
          <button className="btn" onClick={() => handleAction('warning')}>
            <span>Simulate Warning</span>
            <span>→</span>
          </button>
        </div>

        <div className={`status-box ${status.type ? `status-${status.type}` : ''}`}>
          {status.message || 'Ready to log actions'}
        </div>
      </div>
    </div>
  );
}

export default App;
