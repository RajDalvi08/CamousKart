import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import About from "./components/pages/About";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Contact from "./components/pages/Contact";
import Sell from "./components/Sell";
import Cart from "./components/pages/cart";
import Home from "./components/pages/Home";
import Chat from "./components/Chat";
import Book from "./components/pages/Book";
import Labcoat from "./components/pages/Labcoat";
import Calculator from "./components/pages/Calculator";
import Drafter from "./components/pages/Drafter";
import Checkout from "./components/pages/Checkout";
import EgKit from "./components/pages/EGKIT";
import EGContainer from "./components/pages/EGContainer";
import CategoryPage from "./components/pages/CategoryPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Importing ProtectedRoute component

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* Default route */}
        <Route index element={<Login />} />

        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Routes (only accessible if logged in) */}
        <Route
          path="about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="sell"
          element={
            <ProtectedRoute>
              <Sell />
            </ProtectedRoute>
          }
        />
        <Route
          path="contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="cht-section"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="books"
          element={
            <ProtectedRoute>
              <Book />
            </ProtectedRoute>
          }
        />
        // ...
        <Route
          path="labcoat"  // <--- This is the correct path
          element={
            <ProtectedRoute>
              <Labcoat />
            </ProtectedRoute>
          }
        />

        {/* --- END LAB COATS --- */}
        <Route
          path="calculators"
          element={
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="drafters"
          element={
            <ProtectedRoute>
              <Drafter />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="egkit"
          element={
            <ProtectedRoute>
              <EgKit />
            </ProtectedRoute>
          }
        />
        <Route
          path="egcontainer"
          element={
            <ProtectedRoute>
              <EGContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="category"
          element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>
);
