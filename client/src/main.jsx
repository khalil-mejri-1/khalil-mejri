import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'   // ⚠️ هذا مهم
import ClickSpark from './components/ClickSpark.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
                  <ClickSpark
  sparkColor='#fff'
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
>

</ClickSpark>
    <App />

  </React.StrictMode>,
)
