"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  description: string
  image: string
  stock: number
  variants: {
    colors?: string[]
    sizes?: string[]
  }
  badge?: string
  specs?: { [key: string]: string }
}

interface CartItem extends Product {
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 399,
    originalPrice: 499,
    category: 'Audio',
    description: 'Industry-leading noise cancellation with premium comfort and 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stock: 24,
    variants: { colors: ['Black', 'Silver', 'Space Gray'] },
    badge: 'Best Seller',
    specs: { 'Battery Life': '30 hours', 'Weight': '250g', 'Connectivity': 'Bluetooth 5.0' }
  },
  {
    id: '2',
    name: 'Minimalist Desk Lamp',
    price: 189,
    category: 'Lighting',
    description: 'Precision-engineered aluminum desk lamp with wireless charging base and dimmer control.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    stock: 18,
    variants: { colors: ['White', 'Black', 'Bronze'] },
    specs: { 'Material': 'Aluminum', 'Power': '12W LED', 'Charging': 'Wireless Qi' }
  },
  {
    id: '3',
    name: 'Premium Leather Wallet',
    price: 129,
    category: 'Accessories',
    description: 'Hand-crafted Italian leather wallet with RFID protection and lifetime warranty.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    stock: 31,
    variants: { colors: ['Black', 'Brown', 'Navy'] },
    badge: 'New',
    specs: { 'Material': 'Italian Leather', 'Protection': 'RFID Blocking', 'Warranty': 'Lifetime' }
  },
  {
    id: '4',
    name: 'Smart Watch Series X',
    price: 449,
    category: 'Tech',
    description: 'Advanced health monitoring with ECG, GPS, and 7-day battery life in titanium case.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    stock: 12,
    variants: { colors: ['Titanium', 'Gold', 'Space Black'], sizes: ['40mm', '44mm'] },
    badge: 'Premium',
    specs: { 'Display': 'OLED Retina', 'Battery': '7 days', 'Water': '50m resistant' }
  },
  {
    id: '5',
    name: 'Ceramic Coffee Mug Set',
    price: 89,
    category: 'Lifestyle',
    description: 'Artisan-crafted ceramic mugs with temperature retention technology.',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800&q=80',
    stock: 45,
    variants: { colors: ['White', 'Charcoal', 'Sage'] },
    specs: { 'Material': 'Premium Ceramic', 'Capacity': '350ml', 'Set': '2 pieces' }
  },
  {
    id: '6',
    name: 'Wireless Charging Stand',
    price: 79,
    originalPrice: 99,
    category: 'Tech',
    description: 'Fast wireless charging with premium aluminum construction and LED indicator.',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
    stock: 28,
    variants: { colors: ['Silver', 'Black'] },
    specs: { 'Power': '15W Fast Charge', 'Material': 'Aluminum', 'Compatibility': 'Qi Devices' }
  },
  {
    id: '7',
    name: 'Premium Sunglasses',
    price: 249,
    category: 'Accessories',
    description: 'Polarized lenses with titanium frames and scratch-resistant coating.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    stock: 19,
    variants: { colors: ['Black', 'Tortoise', 'Silver'] },
    badge: 'Limited',
    specs: { 'Lens': 'Polarized UV400', 'Frame': 'Titanium', 'Protection': 'Anti-scratch' }
  },
  {
    id: '8',
    name: 'Smart Home Hub',
    price: 199,
    category: 'Tech',
    description: 'Central control for your smart home with voice assistant and touchscreen display.',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
    stock: 22,
    variants: { colors: ['White', 'Charcoal'] },
    specs: { 'Display': '7" Touchscreen', 'Voice': 'Built-in Assistant', 'Connectivity': 'Wi-Fi 6' }
  },
  {
    id: '9',
    name: 'Luxury Pen Set',
    price: 159,
    category: 'Accessories',
    description: 'Precision-engineered writing instruments with gold-plated details and gift box.',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80',
    stock: 15,
    variants: { colors: ['Black Gold', 'Silver', 'Rose Gold'] },
    specs: { 'Material': 'Premium Metal', 'Ink': 'Swiss Refill', 'Packaging': 'Gift Box' }
  },
  {
    id: '10',
    name: 'Minimalist Table Clock',
    price: 119,
    category: 'Lifestyle',
    description: 'Silent movement clock with ambient light sensor and wireless charging capability.',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80',
    stock: 33,
    variants: { colors: ['White', 'Black', 'Wood'] },
    badge: 'Trending',
    specs: { 'Movement': 'Silent Quartz', 'Light': 'Auto Brightness', 'Power': 'Wireless' }
  }
]

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCheckout, setIsCheckout] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [orderComplete, setOrderComplete] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, color?: string, size?: string) => {
    const existingItem = cart.find(item => 
      item.id === product.id && item.selectedColor === color && item.selectedSize === size
    )
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.selectedColor === color && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedColor: color, selectedSize: size }])
    }
  }

  const updateQuantity = (id: string, color: string | undefined, size: string | undefined, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => !(item.id === id && item.selectedColor === color && item.selectedSize === size)))
    } else {
      setCart(cart.map(item =>
        item.id === id && item.selectedColor === color && item.selectedSize === size
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const categories = ['All', 'Tech', 'Audio', 'Accessories', 'Lighting', 'Lifestyle']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold tracking-tight">LUXE</h1>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-700 hover:text-black transition-colors">Collections</a>
                <a href="#" className="text-gray-700 hover:text-black transition-colors">About</a>
                <a href="#" className="text-gray-700 hover:text-black transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 pl-10 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-black transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 104 0m4 0a2 2 0 104 0" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              New Collection Available
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Premium
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Redefined
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover our curated collection of luxury products designed for the modern lifestyle. 
              Every detail crafted to perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105">
                Explore Collection
              </button>
              <button className="px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                Watch Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden">
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                    {product.badge}
                  </div>
                )}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                >
                  <span className="px-6 py-3 bg-white/90 backdrop-blur-sm text-black font-semibold rounded-full">
                    Quick View
                  </span>
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="aspect-square relative rounded-xl overflow-hidden">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    {selectedProduct.badge && (
                      <span className="inline-block px-3 py-1 bg-black text-white text-xs font-semibold rounded-full mb-3">
                        {selectedProduct.badge}
                      </span>
                    )}
                    <h2 className="text-3xl font-bold mb-2">{selectedProduct.name}</h2>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold">${selectedProduct.price}</span>
                      {selectedProduct.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${selectedProduct.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                
                {selectedProduct.specs && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">Specifications</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedProduct.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(selectedProduct.variants.colors || selectedProduct.variants.sizes) && (
                  <div className="space-y-4">
                    {selectedProduct.variants.colors && (
                      <div>
                        <h4 className="font-semibold mb-2">Color</h4>
                        <div className="flex space-x-2">
                          {selectedProduct.variants.colors.map((color) => (
                            <button key={color} className="px-4 py-2 border border-gray-200 rounded-lg hover:border-black transition-colors text-sm">
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedProduct.variants.sizes && (
                      <div>
                        <h4 className="font-semibold mb-2">Size</h4>
                        <div className="flex space-x-2">
                          {selectedProduct.variants.sizes.map((size) => (
                            <button key={size} className="px-4 py-2 border border-gray-200 rounded-lg hover:border-black transition-colors text-sm">
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct)
                      setSelectedProduct(null)
                    }}
                    className="flex-1 px-6 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart - ${selectedProduct.price}
                  </button>
                  <button className="px-6 py-4 border border-gray-300 font-semibold rounded-full hover:bg-gray-50 transition-colors">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="flex-1 bg-black/25 backdrop-blur-sm" 
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Shopping Cart ({cartItemCount})</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 104 0m4 0a2 2 0 104 0" />
                  </svg>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center space-x-4 bg-gray-50 rounded-xl p-4">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <div className="text-sm text-gray-600">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span className="ml-2">Size: {item.selectedSize}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold">${item.price}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false)
                    setIsCheckout(true)
                  }}
                  className="w-full py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {!orderComplete ? (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Checkout</h2>
                  <button
                    onClick={() => setIsCheckout(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step <= checkoutStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {step}
                        </div>
                        {step < 3 && <div className={`w-8 h-0.5 ${step < checkoutStep ? 'bg-black' : 'bg-gray-200'}`}></div>}
                      </div>
                    ))}
                  </div>
                </div>
                
                {checkoutStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Shipping Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="First Name" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      <input type="text" placeholder="Last Name" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                    </div>
                    <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                    <input type="text" placeholder="Street Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                    <div className="grid grid-cols-3 gap-4">
                      <input type="text" placeholder="City" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      <input type="text" placeholder="State" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      <input type="text" placeholder="ZIP Code" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                    </div>
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}
                
                {checkoutStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Payment Method</h3>
                    <div className="space-y-4">
                      <div className="border border-gray-300 rounded-lg p-4">
                        <label className="flex items-center">
                          <input type="radio" name="payment" className="mr-3" defaultChecked />
                          <span className="font-semibold">Credit Card</span>
                        </label>
                      </div>
                      <input type="text" placeholder="Card Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                        <input type="text" placeholder="CVV" className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" />
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setCheckoutStep(1)}
                        className="flex-1 py-4 border border-gray-300 font-semibold rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCheckoutStep(3)}
                        className="flex-1 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                )}
                
                {checkoutStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Order Review</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between">
                          <span>{item.name} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping</span>
                          <span>Free</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax</span>
                          <span>${(cartTotal * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
                          <span>Total</span>
                          <span>${(cartTotal * 1.08).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setCheckoutStep(2)}
                        className="flex-1 py-4 border border-gray-300 font-semibold rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          setOrderComplete(true)
                          setCart([])
                        }}
                        className="flex-1 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                      >
                        Complete Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Order Complete!</h2>
                <p className="text-gray-600 mb-6">Thank you for your purchase. Your order confirmation has been sent to your email.</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 mb-2">Order Number</div>
                  <div className="font-mono font-semibold">#LX{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                </div>
                <button
                  onClick={() => {
                    setIsCheckout(false)
                    setOrderComplete(false)
                    setCheckoutStep(1)
                  }}
                  className="w-full py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
