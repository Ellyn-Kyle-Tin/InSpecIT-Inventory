import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { FiChevronDown } from "react-icons/fi";
import "./products.css";

const Products = () => {

  const [selectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const datePickerRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    code: "",
    name: "",
    desc: "",
    category: "",
    price: "",
    stock: "",
    min: ""
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleInput = (e) => {

    const { name, value } = e.target;

    let newValue = value;
    let newErrors = { ...errors };

    if (name === "name" || name === "desc") {

      if (/[^a-zA-Z\s]/.test(value)) {
        newErrors[name] = "Only letters allowed";
        setErrors(newErrors);
        return;
      } else {
        delete newErrors[name];
      }

      newValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (name === "price" || name === "stock" || name === "min") {

      if (/[^0-9]/.test(value)) {
        newErrors[name] = "Only numbers allowed";
        setErrors(newErrors);
        return;
      } else {
        delete newErrors[name];
      }

    }

    if (name === "category") {

      if (value === "") {
        newErrors.category = "Please select a category";
      } else {
        delete newErrors.category;
      }

    }

    setErrors(newErrors);

    setForm(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSaveProduct = () => {

    let newErrors = {};

    if (!form.code) newErrors.code = "Product number required";
    if (!form.name) newErrors.name = "Name required";
    if (!form.desc) newErrors.desc = "Description required";
    if (!form.category) newErrors.category = "Select category";
    if (!form.price) newErrors.price = "Price required";
    if (!form.stock) newErrors.stock = "Stock required";
    if (!form.min) newErrors.min = "Min stock required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newProduct = {
      code: form.code,
      name: form.name,
      desc: form.desc,
      category: form.category,
      price: "Php " + form.price,
      stock: form.stock,
      min: form.min
    };

    if (editingIndex !== null) {

      const updated = [...products];
      updated[editingIndex] = newProduct;
      setProducts(updated);
      setEditingIndex(null);

    } else {

      setProducts(prev => [...prev, newProduct]);

    }

    setShowModal(false);

    setForm({
      code: "",
      name: "",
      desc: "",
      category: "",
      price: "",
      stock: "",
      min: ""
    });

    setErrors({});
  };

  const handleEdit = (index) => {

    const product = products[index];

    setForm({
      code: product.code,
      name: product.name,
      desc: product.desc,
      category: product.category,
      price: product.price.replace("Php ", ""),
      stock: product.stock,
      min: product.min
    });

    setEditingIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {

    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveProduct();
  };

  const filteredProducts = useMemo(() => {

    if (!searchTerm) return products;

    const search = searchTerm.toLowerCase();

    return products.filter(product =>
      product.code?.toLowerCase().includes(search) ||
      product.name?.toLowerCase().includes(search) ||
      product.desc?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search) ||
      product.price?.toLowerCase().includes(search)
    );

  }, [searchTerm, products]);

  const formattedDate = format(selectedDate, "dd MMMM yyyy");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  startOfWeek(monthStart);
  endOfWeek(monthEnd);

  return (

    <div className="products-container">

      {showModal && (

        <div className="modal-overlay">

          <div className="add-product-modal">

            <h2>ADD PRODUCT</h2>

            <form className="modal-form" onSubmit={handleSubmit}>

              <div className="form-row">
                <label>Product No.</label>
                <input name="code" value={form.code} onChange={handleInput}/>
                {errors.code && <p className="error">{errors.code}</p>}
              </div>

              <div className="form-row">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleInput}/>
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              <div className="form-row">
                <label>Description</label>
                <input name="desc" value={form.desc} onChange={handleInput}/>
                {errors.desc && <p className="error">{errors.desc}</p>}
              </div>

              <div className="form-row">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleInput}>
                  <option value="">Select Category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Tools">Tools</option>
                </select>
                {errors.category && <p className="error">{errors.category}</p>}
              </div>

              <div className="form-row">
                <label>Price</label>
                <input name="price" value={form.price} onChange={handleInput}/>
                {errors.price && <p className="error">{errors.price}</p>}
              </div>

              <div className="form-row">
                <label>Stock</label>
                <input name="stock" value={form.stock} onChange={handleInput}/>
                {errors.stock && <p className="error">{errors.stock}</p>}
              </div>

              <div className="form-row">
                <label>Min Stock</label>
                <input name="min" value={form.min} onChange={handleInput}/>
                {errors.min && <p className="error">{errors.min}</p>}
              </div>

              <div className="modal-buttons">

                <button type="submit" className="save-btn">
                  Save
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      <div className="products-top">

        <div className="products-title">
          <img src="/red_product.png" alt="product"/>
          <h2>Products</h2>
        </div>

        <div className="products-search">

          <input
            type="text"
            placeholder="Search Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <img src="/search.png" alt="search"/>

        </div>

      </div>

      <div className="products-controls">

        <div className="date-picker-wrapper" ref={datePickerRef}>

          <button
            className="date-btn"
            onClick={() => {
              setCurrentMonth(selectedDate);
              setShowDatePicker(!showDatePicker);
            }}
          >

            <img src="/calendar.png" alt="calendar"/>

            <span className="date-text">
              {formattedDate}
            </span>

            <FiChevronDown />

          </button>

        </div>

        {/* ADD PRODUCT BUTTON */}

        <button className="add-btn" onClick={() => setShowModal(true)}>

          <span className="add-icon">
            <img src="/add.png" alt="add"/>
          </span>

          Add Product

        </button>

      </div>

      <div className="products-table-wrapper">

        <table className="products-table">

          <thead>
            <tr>
              <th>PRODUCT NO.</th>
              <th>NAME</th>
              <th>DESCRIPTION</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>MIN STOCK</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>

            {filteredProducts.length === 0 ? (

              <tr>
                <td colSpan="8" style={{ textAlign:"center", padding:"15px" }}>
                  No products available
                </td>
              </tr>

            ) : (

              filteredProducts.map((item, index) => (

                <tr key={index}>

                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.desc}</td>
                  <td>{item.category}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>{item.min}</td>

                  <td className="action-buttons">

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(index)}
                    >
                      <img src="/edit.png" alt="edit" className="action-icon"/>
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(index)}
                    >
                      <img src="/delete.png" alt="delete" className="action-icon"/>
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Products;