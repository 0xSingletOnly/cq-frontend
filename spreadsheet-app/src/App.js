import './App.css';
import Spreadsheet from './Spreadsheet'; // Import the Spreadsheet component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Student Spreadsheet</h1>
      </header>
      <main>
        <div className="spreadsheet-container">
          <Spreadsheet />
        </div>
      </main>
    </div>
  );
}

export default App;
