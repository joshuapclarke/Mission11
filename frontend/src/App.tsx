import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { Store } from './Store';
import { AdminBooks } from './AdminBooks';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;