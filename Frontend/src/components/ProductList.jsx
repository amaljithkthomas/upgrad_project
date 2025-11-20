import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../CartContext';
import { AuthContext } from '../AuthContext';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => setProducts(res.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }
    setAdding(productId);
    const success = await addToCart(productId);
    setAdding(null);
    if (success) alert('Added to cart!');
    else alert('Failed to add to cart');
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded p-4">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-700 mb-2">₹{product.price}</p>
            <button
              onClick={() => handleAddToCart(product._id)}
              disabled={adding === product._id}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
            >
              {adding === product._id ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}