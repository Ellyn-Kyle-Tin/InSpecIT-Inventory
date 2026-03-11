import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  getYear,
  isSameDay,
  isSameMonth,
  setMonth,
  setYear,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./products.css";

const Products = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pendingSelectedDate, setPendingSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProductRow, setSelectedProductRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const datePickerRef = useRef(null);

  // store selected row
  const [selectedProduct, setSelectedProduct] = useState(null);

  const data = Array(18).fill({
    code: "SH-1C120-TxL-A1BK",
    name: "Cable",
    desc: "1 CORE x 120 MM2 BLACK COLOR",
    category: "Hardware",
    price: "Php 4,500.00",
    stock: 3,
    min: 3
  });

  const formattedDate = format(selectedDate, "dd MMMM yyyy");
  const monthNames = useMemo(
    () => Array.from({ length: 12 }, (_, i) => format(new Date(2020, i, 1), "MMMM")),
    []
  );
  const yearOptions = useMemo(() => {
    const base = getYear(new Date());
    const start = base - 10;
    const end = base + 10;
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, []);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) => {
      const haystack = [
        item.code,
        item.name,
        item.desc,
        item.category,
        item.price,
        String(item.stock),
        String(item.min),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, searchTerm]);

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handleDayPick = (day) => setPendingSelectedDate(day);

  const handleConfirmDate = () => {
    setSelectedDate(pendingSelectedDate);
    setCurrentMonth(pendingSelectedDate);
    setShowDatePicker(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setPendingSelectedDate(today);
    setCurrentMonth(today);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  return (
    <div className="products-container">

      {/* HEADER */}
      <div className="products-top">

        <div className="products-title">
          <img src="/product.png" alt="product" />
          <h2>Products</h2>
        </div>

        <div className="products-search">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img src="/search.png" alt="search" />
        </div>

      </div>

      {/* CONTROLS */}
      <div className="products-controls">

        <div className="date-picker-wrapper" ref={datePickerRef}>
          <button 
            className={`date-btn ${showDatePicker ? 'active' : ''}`}
            onClick={() => {
              setPendingSelectedDate(selectedDate);
              setCurrentMonth(selectedDate);
              setShowDatePicker(!showDatePicker);
            }}
            type="button"
          >
            <img src="/calendar.png" alt="calendar" />
            <span className="date-text">{formattedDate}</span>
            <FiChevronDown className={`chevron-icon ${showDatePicker ? 'rotated' : ''}`} />
          </button>
          {showDatePicker && (
            <div className="calendar-dropdown">
              <div className="calendar-top">
                <div className="calendar-title">Select Date</div>
                <img className="calendar-top-icon" src="/calendar.png" alt="" />
              </div>

              <div className="calendar-controls">
                <div className="calendar-selects">
                  <label className="calendar-select">
                    <span className="sr-only">Month</span>
                    <select
                      value={getMonth(currentMonth)}
                      onChange={(e) => setCurrentMonth((prev) => setMonth(prev, Number(e.target.value)))}
                    >
                      {monthNames.map((m, idx) => (
                        <option key={m} value={idx}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="calendar-select-icon" />
                  </label>

                  <label className="calendar-select">
                    <span className="sr-only">Year</span>
                    <select
                      value={getYear(currentMonth)}
                      onChange={(e) => setCurrentMonth((prev) => setYear(prev, Number(e.target.value)))}
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="calendar-select-icon" />
                  </label>
                </div>

                <div className="calendar-nav">
                  <button className="calendar-nav-btn" onClick={handlePrevMonth} type="button" aria-label="Previous month">
                    <FiChevronLeft />
                  </button>
                  <button className="calendar-nav-btn" onClick={handleNextMonth} type="button" aria-label="Next month">
                    <FiChevronRight />
                  </button>
                </div>
              </div>
              
              <div className="calendar-weekdays">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="calendar-weekday">{day}</div>
                ))}
              </div>
              
              <div className="calendar-days">
                {calendarDays.map((day, idx) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = isSameDay(day, pendingSelectedDate);
                  const isToday = isSameDay(day, new Date());
                  const isSunday = day.getDay() === 0;
                  
                  return (
                    <button
                      key={idx}
                      className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isSunday ? 'sunday' : ''}`}
                      onClick={() => handleDayPick(day)}
                      type="button"
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
              
              <div className="calendar-footer">
                <button className="calendar-today-btn" onClick={handleToday} type="button">
                  Today
                </button>
                <button className="calendar-confirm-btn" onClick={handleConfirmDate} type="button">
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="add-btn">
          <img src="/add.png" alt="add" />
          Add Product
        </button>

      </div>

      {/* TABLE */}
      <div className="products-table-wrapper">

        <table className="products-table">

          <thead>
            <tr>
              <th>NO.</th>
              <th>NAME</th>
              <th>DESCRIPTION</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>MIN STOCK</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className={selectedProduct === index ? "active-row" : ""}
                onClick={() => setSelectedProduct(index)}
              >

                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.desc}</td>
                <td>{item.category}</td>
                <td>{item.price}</td>
                <td>{item.stock}</td>
                <td>{item.min}</td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Products;