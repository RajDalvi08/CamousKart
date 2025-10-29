import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${category}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, [category]);

  return (
    <div>
      <h1>{category.toUpperCase()}</h1>
      <div className="product-list">
        {products.map(p => (
          <div key={p._id} className="product-item">
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>₹{p.price}</p>
            <div className="product-images">
              {p.images.map((img, i) => (
                <img key={i} src={img} alt={p.title} width={100} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
