const SIMPLE_USERS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin'
  },
  employee: {
    username: 'employee',
    password: 'employee123',
    name: 'Employee User',
    role: 'employee'
  }
};

// Simple authentication functions
export const simpleLogin = async (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = SIMPLE_USERS[username];
      if (user && user.password === password) {
        resolve({
          user: {
            uid: user.username,
            username: user.username,
            displayName: user.name
          },
          userData: user
        });
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 500); // Simulate network delay
  });
};

// Registration function
export const simpleRegister = async (username, password, fullName, email, role) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if username already exists
      if (SIMPLE_USERS[username]) {
        reject(new Error('Username already exists'));
        return;
      }

      // Validate role
      if (role !== 'employee' && role !== 'admin') {
        reject(new Error('Invalid role. Must be either "employee" or "admin"'));
        return;
      }

      // Create new user
      const newUser = {
        username: username,
        password: password,
        name: fullName,
        email: email,
        role: role
      };

      // Add user to SIMPLE_USERS
      SIMPLE_USERS[username] = newUser;

      // Update mockDatabase users
      mockDatabase.users = SIMPLE_USERS;

      resolve({
        user: {
          uid: username,
          username: username,
          displayName: fullName
        },
        userData: newUser
      });
    }, 500); // Simulate network delay
  });
};

// Mock database for data storage
let mockDatabase = {
  users: SIMPLE_USERS,
  orders: [
    {
      id: 'order-001',
      customerName: 'John Doe',
      items: [
        { name: 'Solar Panel 300W', quantity: 2, price: 2500 },
        { name: 'Power Cable 50m', quantity: 1, price: 800 }
      ],
      orderTotal: 5800,
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: 'completed'
    },
    {
      id: 'order-002',
      customerName: 'Jane Smith',
      items: [
        { name: 'Marine Battery 12V', quantity: 3, price: 4500 }
      ],
      orderTotal: 13500,
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      status: 'completed'
    }
  ],
  inventory: [
    { 
      id: 'inv-001', 
      Item: 'Solar Panel 300W', 
      Category: 'Solar Equipment', 
      Stock: 25, 
      MinStock: 15, 
      'Unit Price': 2500,
      status: 'good' 
    },
    { 
      id: 'inv-002', 
      Item: 'Marine Battery 12V', 
      Category: 'Marine Equipment', 
      Stock: 8, 
      MinStock: 20, 
      'Unit Price': 4500,
      status: 'critical' 
    },
    { 
      id: 'inv-003', 
      Item: 'Power Cable 50m', 
      Category: 'Cables', 
      Stock: 45, 
      MinStock: 30, 
      'Unit Price': 800,
      status: 'good' 
    },
    { 
      id: 'inv-004', 
      Item: 'Solar Inverter 5kW', 
      Category: 'Solar Equipment', 
      Stock: 12, 
      MinStock: 10, 
      'Unit Price': 15000,
      status: 'low' 
    },
    { 
      id: 'inv-005', 
      Item: 'Marine GPS Navigator', 
      Category: 'Marine Equipment', 
      Stock: 18, 
      MinStock: 15, 
      'Unit Price': 8500,
      status: 'good' 
    },
    { 
      id: 'inv-006', 
      Item: 'Ethernet Cable 100m', 
      Category: 'Cables', 
      Stock: 65, 
      MinStock: 40, 
      'Unit Price': 350,
      status: 'good' 
    },
    { 
      id: 'inv-007', 
      Item: 'Solar Charge Controller', 
      Category: 'Solar Equipment', 
      Stock: 22, 
      MinStock: 25, 
      'Unit Price': 3200,
      status: 'low' 
    },
    { 
      id: 'inv-008', 
      Item: 'Marine Radio VHF', 
      Category: 'Marine Equipment', 
      Stock: 6, 
      MinStock: 12, 
      'Unit Price': 6800,
      status: 'critical' 
    },
    { 
      id: 'inv-009', 
      Item: 'Coaxial Cable 25m', 
      Category: 'Cables', 
      Stock: 38, 
      MinStock: 35, 
      'Unit Price': 450,
      status: 'low' 
    },
    { 
      id: 'inv-010', 
      Item: 'Solar Mounting Kit', 
      Category: 'Solar Equipment', 
      Stock: 15, 
      MinStock: 20, 
      'Unit Price': 1800,
      status: 'critical' 
    }
  ],
  stockLogs: [
    {
      id: 'log-001',
      productName: 'Solar Panel 300W',
      category: 'Solar Equipment',
      changeType: 'increase',
      changeAmount: 10,
      previousStock: 15,
      newStock: 25,
      action: 'Manual Restock from Inventory',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      performedBy: 'Admin',
      notes: 'Restocked 10 units via Inventory Management'
    },
    {
      id: 'log-002',
      productName: 'Solar Panel 300W',
      category: 'Solar Equipment',
      changeType: 'decrease',
      changeAmount: 2,
      previousStock: 27,
      newStock: 25,
      action: 'Order Processing',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      performedBy: 'System',
      notes: 'Customer order fulfillment'
    },
    {
      id: 'log-003',
      productName: 'Power Cable 50m',
      category: 'Cables',
      changeType: 'increase',
      changeAmount: 15,
      previousStock: 30,
      newStock: 45,
      action: 'Manual Restock from Inventory',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      performedBy: 'Admin',
      notes: 'Bulk cable restock'
    }
  ],
  products: [
    { id: 1, no: 'PRD-001', name: 'Laptop', description: 'High-performance laptop for professionals', category: 'Electronics', price: 999.99, stock: 25, minStock: 10 },
    { id: 2, no: 'PRD-002', name: 'Office Chair', description: 'Ergonomic office chair with lumbar support', category: 'Furniture', price: 299.99, stock: 15, minStock: 5 },
    { id: 3, no: 'PRD-003', name: 'Wireless Mouse', description: 'Bluetooth wireless mouse', category: 'Electronics', price: 29.99, stock: 50, minStock: 20 },
    { id: 4, no: 'PRD-004', name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness', category: 'Furniture', price: 49.99, stock: 30, minStock: 10 },
    { id: 5, no: 'PRD-005', name: 'Keyboard', description: 'Mechanical keyboard with RGB lighting', category: 'Electronics', price: 79.99, stock: 20, minStock: 8 },
    { id: 6, no: 'PRD-006', name: 'Monitor', description: '24-inch LED monitor', category: 'Electronics', price: 199.99, stock: 12, minStock: 5 },
    { id: 7, no: 'PRD-007', name: 'Notebook Set', description: 'Set of 5 notebooks', category: 'Stationery', price: 12.99, stock: 100, minStock: 25 },
    { id: 8, no: 'PRD-008', name: 'Pen Set', description: 'Premium ballpoint pen set', category: 'Stationery', price: 19.99, stock: 75, minStock: 20 },
    { id: 9, no: 'PRD-009', name: 'USB Hub', description: '7-port USB hub', category: 'Electronics', price: 39.99, stock: 35, minStock: 15 },
    { id: 10, no: 'PRD-010', name: 'Bookshelf', description: '5-tier wooden bookshelf', category: 'Furniture', price: 149.99, stock: 8, minStock: 3 }
  ],
  userLoginHistory: [
    {
      id: 'login-001',
      userName: 'Administrator',
      userType: 'admin',
      action: 'Login',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      sessionDuration: 'Active',
      ip: '127.0.0.1',
      email: 'admin@example.com'
    },
    {
      id: 'login-002',
      userName: 'Employee User',
      userType: 'employee',
      action: 'Login',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      sessionDuration: 'Active',
      ip: '127.0.0.1',
      email: 'employee@example.com'
    }
  ],
  StudentTransactions: [],
  collectionLogs: [],
  weeklyPlans: {
    current: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  }
};

// Mock Firestore functions
export const mockFirestore = {
  collection: (collectionName) => ({
    add: (data) => {
      const newDoc = {
        id: `doc-${Date.now()}-${Math.random()}`,
        ...data,
        timestamp: data.timestamp || new Date()
      };
      if (!mockDatabase[collectionName]) {
        mockDatabase[collectionName] = [];
      }
      mockDatabase[collectionName].push(newDoc);
      return Promise.resolve({ id: newDoc.id });
    },
    get: () => {
      const data = mockDatabase[collectionName] || [];
      const snapshot = {
        docs: data.map(doc => ({
          id: doc.id,
          data: () => doc
        })),
        forEach: (callback) => {
          data.forEach((doc, index) => {
            callback({
              id: doc.id,
              data: () => doc
            });
          });
        }
      };
      return Promise.resolve(snapshot);
    },
    doc: (docId) => ({
      get: () => {
        const data = mockDatabase[collectionName]?.find(doc => doc.id === docId);
        return Promise.resolve({
          exists: !!data,
          data: () => data
        });
      },
      set: (newData) => {
        if (!mockDatabase[collectionName]) {
          mockDatabase[collectionName] = [];
        }
        const existingIndex = mockDatabase[collectionName].findIndex(doc => doc.id === docId);
        const docToSet = { id: docId, ...newData };
        
        if (existingIndex >= 0) {
          mockDatabase[collectionName][existingIndex] = docToSet;
        } else {
          mockDatabase[collectionName].push(docToSet);
        }
        return Promise.resolve();
      },
      update: (updates) => {
        if (!mockDatabase[collectionName]) {
          mockDatabase[collectionName] = [];
        }
        const docIndex = mockDatabase[collectionName].findIndex(doc => doc.id === docId);
        if (docIndex >= 0) {
          mockDatabase[collectionName][docIndex] = {
            ...mockDatabase[collectionName][docIndex],
            ...updates
          };
        }
        return Promise.resolve();
      },
      delete: () => {
        if (mockDatabase[collectionName]) {
          mockDatabase[collectionName] = mockDatabase[collectionName].filter(doc => doc.id !== docId);
        }
        return Promise.resolve();
      }
    }),
    where: (field, operator, value) => ({
      get: () => {
        const data = mockDatabase[collectionName] || [];
        const filtered = data.filter(doc => {
          if (operator === '==') return doc[field] === value;
          if (operator === '>') return doc[field] > value;
          if (operator === '<') return doc[field] < value;
          return true;
        });
        return Promise.resolve({
          docs: filtered.map(doc => ({
            id: doc.id,
            data: () => doc
          }))
        });
      }
    }),
    orderBy: (field) => ({
      get: () => {
        const data = mockDatabase[collectionName] || [];
        const sorted = [...data].sort((a, b) => {
          if (a[field] < b[field]) return -1;
          if (a[field] > b[field]) return 1;
          return 0;
        });
        return Promise.resolve({
          docs: sorted.map(doc => ({
            id: doc.id,
            data: () => doc
          }))
        });
      }
    }),
    limit: (count) => ({
      get: () => {
        const data = mockDatabase[collectionName] || [];
        const limited = data.slice(0, count);
        return Promise.resolve({
          docs: limited.map(doc => ({
            id: doc.id,
            data: () => doc
          }))
        });
      }
    })
  })
};

// Utility functions
export const serverTimestamp = () => new Date();

// Firebase compatibility functions
export const collection = (db, collectionName) => mockFirestore.collection(collectionName);
export const query = (collectionRef, ...queryConstraints) => collectionRef;
export const orderBy = (field, direction = 'asc') => ({ type: 'orderBy', field, direction });
export const limit = (count) => ({ type: 'limit', count });
export const where = (field, operator, value) => ({ type: 'where', field, operator, value });
export const startAfter = (doc) => ({ type: 'startAfter', doc });
export const getDocs = (querySnapshot) => querySnapshot.get();
export const addDoc = (collectionRef, data) => collectionRef.add(data);
export const doc = (db, path, id) => mockFirestore.collection(path).doc(id);
export const setDoc = (docRef, data) => docRef.set(data);
export const updateDoc = (docRef, data) => docRef.update(data);
export const deleteDoc = (docRef) => docRef.delete();
export const getFirestore = () => db;

// Export mock database
export const getMockDatabase = () => mockDatabase;
