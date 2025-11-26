import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Recommendations() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recommendations', { withCredentials: true })
      .then(res => setProducts(res.data.recommendations))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading recommendations...</div>;
  if (!products.length) return <div>No recommendations available.</div>;

  return (
    <div>
      <h2 className="font-bold text-lg mb-2">Recommended for You</h2>
      <ul>
        {products.map(p => (
          <li key={p._id} className="mb-2">
            <div>{p.name}</div>
            <div className="text-sm text-gray-500">{p.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}