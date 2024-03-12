import React, { useState, useEffect, useRef } from 'react';
import productData from './product-data.json';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const observerRef = useRef(null);
  const itemsPerPage = 12;
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const imageIntervalRefs = useRef({});

  useEffect(() => {
    const fetchProducts = () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newProducts = productData.slice(startIndex, endIndex);
      setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    };

    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        });
      },
      { rootMargin: '0px 0px 200px 0px' }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  const handleImageHover = (productId, index) => {
    setHoveredProductId(productId);
    const images = document.querySelectorAll(`#product-${productId} img`);
    images.forEach((img, i) => {
      img.style.display = i === index ? 'block' : 'none';
    });

    clearInterval(imageIntervalRefs.current[productId]);
    imageIntervalRefs.current[productId] = setInterval(() => {
      const currentIndex = [...images].findIndex((img) => img.style.display === 'block');
      const nextIndex = (currentIndex + 1) % images.length;
      images.forEach((img, i) => {
        img.style.display = i === nextIndex ? 'block' : 'none';
      });
    }, 2000);
  };

  const handleImageLeave = (productId) => {
    setHoveredProductId(null);
    clearInterval(imageIntervalRefs.current[productId]);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          id={`product-${product.id}`}
          className="bg-white rounded-lg shadow-md overflow-hidden relative"
          onMouseEnter={() => handleImageHover(product.id, 0)}
          onMouseLeave={() => handleImageLeave(product.id)}
        >
          <div className="relative h-48">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${product.id}`}
                className={`absolute inset-0 w-full h-full object-cover ${
                  index === 0 ? 'block' : 'hidden'
                }`}
              />
            ))}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600">ID: {product.id}</p>
            <p className="text-gray-800 font-bold">${product.price}</p>
          </div>
        </div>
      ))}
      <div ref={observerRef} />
    </div>
  );
};

export default ProductGrid;