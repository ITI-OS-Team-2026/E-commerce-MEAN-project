const Cart = require('../models/Cart');
const Product = require('../models/Product');
const APIError = require('../utils/APIError');

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findOne({ _id: productId, isdeleted: null });

  if (!product) {
    throw new APIError('Product not found', 404);
  }

  if (quantity == null || quantity < 1) {
    throw new APIError('Quantity must be at least 1', 400);
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    if (product.stock < quantity) {
      throw new APIError('Insufficient stock', 400);
    }

    cart = new Cart({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
          price: product.price,
        },
      ],
      totalPrice: 0,
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );

    if (existingItem) {
      if (product.stock < existingItem.quantity + quantity) {
        throw new APIError('Insufficient stock', 400);
      }

      existingItem.quantity += quantity;
      existingItem.price = product.price;
    } else {
      if (product.stock < quantity) {
        throw new APIError('Insufficient stock', 400);
      }

      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
  }

  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await cart.save();

  await cart.populate('items.product', 'name price images');
  return cart;
};

const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new APIError('Cart not found', 404);
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== productId.toString());

  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await cart.save();

  await cart.populate('items.product', 'name price images');
  return cart;
};

const updateQuantity = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new APIError('Cart not found', 404);
  }

  const item = cart.items.find((item) => item.product.toString() === productId.toString());

  if (!item) {
    throw new APIError('Item not found in cart', 404);
  }

  if (quantity == null || quantity < 1) {
    throw new APIError('Quantity must be at least 1', 400);
  }

  const product = await Product.findOne({ _id: productId, isdeleted: null });

  if (!product) {
    throw new APIError('Product not found', 404);
  }

  if (product.stock < quantity) {
    throw new APIError('Insufficient stock', 400);
  }

  item.quantity = quantity;

  cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await cart.save();

  await cart.populate('items.product', 'name price images');
  return cart;
};

module.exports = { addToCart, removeFromCart, updateQuantity };
