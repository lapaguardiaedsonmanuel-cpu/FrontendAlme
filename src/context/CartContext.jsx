import React, { createContext, useState, useContext, useEffect } from 'react';
import { resolveMediaUrl } from '../utils/media';
import { getPrecioUnitarioAplicable } from '../utils/pricing';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const resolveItemUnitPrice = (item) => getPrecioUnitarioAplicable(item, item.cantidad);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('cart');
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, cantidad = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.id === product._id
            ? {
                ...item,
                cantidad: item.cantidad + cantidad,
                precioMenor: Number(product.precioMenor),
                precioMayor: Number(product.precioMayor),
                cantidadMayorMinima: Number(product.cantidadMayorMinima || 6),
                ofertaDestacada: Boolean(product.ofertaDestacada)
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product._id,
          codigo: product.codigo,
          nombre: product.nombre,
          precioMenor: Number(product.precioMenor),
          precioMayor: Number(product.precioMayor),
          cantidadMayorMinima: Number(product.cantidadMayorMinima || 6),
          ofertaDestacada: Boolean(product.ofertaDestacada),
          precio: Number(product.precioMenor),
          imagen: resolveMediaUrl(product.imagenes?.[0]),
          cantidad
        }
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, cantidad } : item)));
    }
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.cantidad * resolveItemUnitPrice(item), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        resolveItemUnitPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
