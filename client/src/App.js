import React from 'react';
import './App.css';

import Jobs from './Jobs'; 

const mockJobs = [
  {title: "SWE1", company: "Google" },
  { title: "SWE2", company: "Microsoft" },
]

function App() {
  return (
    <div className="App">
      <Jobs jobs={mockJobs} /> 
    </div>
  );
}

export default App;
