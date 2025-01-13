import React, { useState, useEffect } from "react";

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("mandi-expenses");
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    category: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("mandi-expenses", JSON.stringify(expenses));
  }, [expenses]);

  const categories = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Transportation",
    "Labor",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.amount ||
      !formData.name ||
      !formData.category ||
      !formData.date
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === editingId
            ? {
                ...formData,
                id: editingId,
                amount: parseFloat(formData.amount),
              }
            : expense
        )
      );
      setEditingId(null);
    } else {
      const newExpense = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount),
      };
      setExpenses((prev) => [...prev, newExpense]);
    }

    setFormData({
      amount: "",
      name: "",
      category: "",
      date: "",
    });
  };

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount.toString(),
      name: expense.name,
      category: expense.category,
      date: expense.date,
    });
    setEditingId(expense.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          amount: "",
          name: "",
          category: "",
          date: "",
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      amount: "",
      name: "",
      category: "",
      date: "",
    });
  };

  const filteredExpenses =
    selectedCategory === "all"
      ? expenses
      : expenses.filter((expense) => expense.category === selectedCategory);

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="expense-tracker">
      <style>
        {`
          .expense-tracker {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .form-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }
          
          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
          }
          
          .input-group {
            display: flex;
            flex-direction: column;
          }
          
          .input-group label {
            margin-bottom: 8px;
            font-weight: 500;
          }
          
          input, select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
          }
          
          button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
          }
          
          button:hover {
            background: #0056b3;
          }

          .button-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .cancel-btn {
            background: #6c757d;
          }

          .cancel-btn:hover {
            background: #5a6268;
          }

          .edit-btn {
            background: #28a745;
            padding: 6px 12px;
            width: auto;
            font-size: 14px;
            margin-right: 8px;
          }

          .edit-btn:hover {
            background: #218838;
          }

          .delete-btn {
            background: #dc3545;
            padding: 6px 12px;
            width: auto;
            font-size: 14px;
          }

          .delete-btn:hover {
            background: #c82333;
          }
          
          .table-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow-x: auto;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          
          th {
            background: #f8f9fa;
          }
          
          .amount {
            text-align: right;
          }
          
          .total-row {
            font-weight: bold;
          }

          .summary-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }

          .summary-title {
            font-weight: bold;
            margin-bottom: 10px;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
          }

          .summary-item {
            background: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .editing {
            background-color: #fff3cd;
          }
          
          @media (max-width: 600px) {
            .form-grid {
              grid-template-columns: 1fr;
            }
            
            .table-container {
              margin: 0 -20px;
              border-radius: 0;
            }

            .button-group {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="form-card">
        <h2>{editingId ? "Edit Expense" : "Add New Expense"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
            </div>

            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Expense name"
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {editingId ? (
            <div className="button-group">
              <button type="submit">Update Expense</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            </div>
          ) : (
            <button type="submit">Add Expense</button>
          )}
        </form>
      </div>

      <div className="summary-card">
        <div className="summary-title">Summary</div>
        <div className="summary-grid">
          <div className="summary-item">
            <div>Total Expenses</div>
            <div>₹{totalAmount.toFixed(2)}</div>
          </div>
          <div className="summary-item">
            <div>Total Items</div>
            <div>{filteredExpenses.length}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="input-group" style={{ marginBottom: "20px" }}>
          <label>Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Category</th>
              <th className="amount">Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr
                key={expense.id}
                className={editingId === expense.id ? "editing" : ""}
              >
                <td>{expense.date}</td>
                <td>{expense.name}</td>
                <td>{expense.category}</td>
                <td className="amount">₹{expense.amount.toFixed(2)}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={3} style={{ textAlign: "right" }}>
                Total:
              </td>
              <td className="amount">₹{totalAmount.toFixed(2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTracker;
