import React, { useState, useEffect } from "react";
import { Upload, X, MapPin,  Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./sell.css"
// import "./sell.css"; // Removed this line to fix the compilation error

const Sell = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    condition: "used", // Default to 'used'
    location: "",
    contactInfo: "",
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  // --- FIX ---
  // These names now match your router file (e.g., "Labcoats", "EgKit")
  // This will prevent the "No routes matched" error on navigation.
  const categories = ["Books", "Calculators", "Labcoats", "EgKit", "Drafters", "egcontainer"];

  useEffect(() => {
    const savedDraft = localStorage.getItem("productDraft");
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft);
      setFormData(draftData);
      setImages(draftData.images || []);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleConditionChange = (newCondition) => {
      setFormData({ ...formData, condition: newCondition });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, { file, preview: e.target.result }]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("File must be an image and less than 10MB!");
      }
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.title || !formData.category || !formData.description || !formData.price || !formData.location) {
      alert("All fields marked with * are required.");
      return false;
    }
    if (!formData.condition) {
        alert("Please select the product condition.");
        return false;
    }
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  if (images.length === 0) {
    alert("Please upload at least one product image!");
    return;
  }

  const data = new FormData();
  data.append("title", formData.title);
  data.append("category", formData.category);
  data.append("description", formData.description);
  data.append("price", formData.price);
  data.append("condition", formData.condition);
  data.append("location", formData.location);
  data.append("contactInfo", formData.contactInfo);

  // ✅ Append all uploaded images
  images.forEach((img) => {
    data.append("images", img.file);
  });

  try {
    const res = await axios.post("http://localhost:5000/api/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("newProductPublished"));
      alert("✅ Product listed successfully!");

      localStorage.removeItem("productDraft");
      setFormData({
        title: "",
        category: "",
        description: "",
        price: "",
        condition: "used",
        location: "",
        contactInfo: "",
      });
      setImages([]);

      const categoryPath = formData.category.toLowerCase();
      navigate(`/${categoryPath}`);
    } else {
      alert("❌ Failed to list product. Please try again.");
    }
  } catch (err) {
    console.error("Error uploading product:", err);
    if (err.response) {
      alert(`⚠️ Error: ${err.response.data.message || "Failed to upload product"}`);
    } else {
      alert("⚠️ An unexpected network error occurred. Check your server connection.");
    }
  }
};


  const handleSaveDraft = () => {
    localStorage.setItem("productDraft", JSON.stringify({ ...formData, images }));
    alert("💾 Draft saved successfully!");
  };

  // --- STYLING ---
  // Added inline styles to make the component usable without the CSS file
  return (
    <div className="sell-products-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className="header" style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Sell Your Product</h1>
        <p>List your item and reach thousands of students on campus</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Image Upload Section */}
        <div className="image-upload-section" style={{ marginBottom: '20px' }}>
          <h2>Product Images</h2>
          <div
            className={`image-drop-area ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? '#3498db' : '#ccc'}`,
              borderRadius: '10px',
              padding: '30px',
              textAlign: 'center',
              backgroundColor: dragActive ? '#f0f8ff' : '#fafafa',
            }}
          >
            <Upload className="upload-icon" size={48} color="#3498db" style={{ margin: '0 auto 15px' }} />
            <p className="upload-text" style={{ margin: '0 0 10px' }}>Drag and drop your images here</p>
            <p className="or-text" style={{ margin: '0 0 10px' }}>or</p>
            <label className="browse-button" style={{
              backgroundColor: '#3498db', color: 'white', padding: '10px 15px',
              borderRadius: '5px', cursor: 'pointer', display: 'inline-block'
            }}>
              Browse Files
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
                style={{ display: 'none' }}
              />
            </label>
            <p className="file-info" style={{ fontSize: '12px', color: '#777', marginTop: '10px' }}>
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>

          {images.length > 0 && (
            <div className="image-preview" style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
              {images.map((image, index) => (
                <div key={index} className="image-preview-item" style={{ position: 'relative' }}>
                  <img src={image.preview} alt={`Preview ${index + 1}`} className="image-preview-img" style={{
                    width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px'
                  }}/>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-button"
                    style={{
                      position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)',
                      color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      lineHeight: '1'
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="product-details-section" style={{ border: '1px solid #eee', borderRadius: '10px', padding: '20px' }}>
          <h2>Product Details</h2>
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Product Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Category *</label>
              <div className="select-container" style={{ position: 'relative' }}>
                <Tag className="select-icon" size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#777' }} />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={{ padding: '10px 10px 10px 35px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Price (₹) *</label>
              <div className="input-container" style={{ position: 'relative' }}>
                <div className="input-icon" size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#777' }} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                  style={{ padding: '10px 10px 10px 35px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
                />
              </div>
            </div>
            
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Pickup Location *</label>
              <div className="input-container" style={{ position: 'relative' }}>
                <MapPin className="input-icon" size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: '#777' }} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Campus, Library"
                  required
                  style={{ padding: '10px 10px 10px 35px', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}
                />
              </div>
            </div>

            <div className="form-group full-width" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Condition *</label>
              <div className="condition-buttons" style={{ display: 'flex', gap: '10px' }}>
                  <button
                      type="button"
                      className={`condition-btn ${formData.condition === 'new' ? 'active-condition' : ''}`}
                      onClick={() => handleConditionChange('new')}
                      style={{
                        padding: '10px 15px', borderRadius: '20px', border: '1px solid',
                        borderColor: formData.condition === 'new' ? '#3498db' : '#ccc',
                        background: formData.condition === 'new' ? '#3498db' : 'white',
                        color: formData.condition === 'new' ? 'white' : '#333',
                        cursor: 'pointer', fontWeight: 'bold'
                      }}
                  >
                      ✨ New 
                  </button>
                  <button
                      type="button"
                      className={`condition-btn ${formData.condition !== 'new' ? 'active-condition' : ''}`}
                      onClick={() => handleConditionChange('used')}
                      style={{
                        padding: '10px 15px', borderRadius: '20px', border: '1px solid',
                        borderColor: formData.condition !== 'new' ? '#3498db' : '#ccc',
                        background: formData.condition !== 'new' ? '#3498db' : 'white',
                        color: formData.condition !== 'new' ? 'white' : '#333',
                        cursor: 'pointer', fontWeight: 'bold'
                      }}
                  >
                      ♻️ Used
                  </button>
              </div>
            </div>

            <div className="form-group full-width" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your item in detail..."
                required
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'Arial' }}
              />
            </div>

            <div className="form-group full-width" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Contact Info (optional)</label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                placeholder="Phone number or email"
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
        </div>

        {/* Submit and Save Draft */}
        <div className="submit-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
          <button type="button" className="save-draft-button" onClick={handleSaveDraft} style={{
            padding: '12px 20px', borderRadius: '8px', border: '1px solid #777',
            background: 'white', color: '#333', cursor: 'pointer', fontWeight: 'bold'
          }}>
            💾 Save Draft
          </button>
          <button type="submit" className="publish-button" style={{
            padding: '12px 20px', borderRadius: '8px', border: 'none',
            background: '#2ecc71', color: 'white', cursor: 'pointer', fontWeight: 'bold'
          }}>
            🚀 Publish Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sell;