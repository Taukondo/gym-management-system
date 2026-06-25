import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-here';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// البيانات المخزنة (في تطبيق حقيقي ستكون في قاعدة بيانات)
const users = [
  { id: 1, username: 'admin', password: bcrypt.hashSync('123456', 10) }
];

let revenues = [
  { id: 1, date: '2026-02-25', type: 'اشتراكات', category: '3 شهور', amount: 5094, paymentMethod: 'شبكة' },
  { id: 2, date: '2026-02-25', type: 'اشتراكات', category: 'شهر', amount: 698, paymentMethod: 'شبكة' },
];

let expenses = [
  { id: 1, date: '2026-05-30', category: 'صيانة', description: 'أعمال سباكة', amount: 1600 },
  { id: 2, date: '2026-05-31', category: 'صيانة', description: 'تركيب حديد', amount: 1600 },
];

let employees = [
  { id: 1, name: 'وفاء', position: 'مدربة', salary: 3500, phone: '+966501234567' },
  { id: 2, name: 'أسماء', position: 'مدربة', salary: 3500, phone: '+966501234568' },
];

// Middleware للتحقق من التوكن
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==================== Authentication Routes ====================

// تسجيل الدخول
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'المستخدم غير موجود' });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, username: user.username } });
});

// تسجيل جديد
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'المستخدم موجود بالفعل' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    password: bcrypt.hashSync(password, 10)
  };
  
  users.push(newUser);
  res.json({ message: 'تم التسجيل بنجاح' });
});

// ==================== Revenues Routes ====================

// الحصول على جميع الإيرادات
app.get('/api/revenues', authenticateToken, (req, res) => {
  const { startDate, endDate, type, paymentMethod } = req.query;
  
  let filtered = revenues;
  
  if (startDate) {
    filtered = filtered.filter(r => r.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter(r => r.date <= endDate);
  }
  if (type) {
    filtered = filtered.filter(r => r.type === type);
  }
  if (paymentMethod) {
    filtered = filtered.filter(r => r.paymentMethod === paymentMethod);
  }
  
  res.json(filtered);
});

// إضافة إيراد جديد
app.post('/api/revenues', authenticateToken, (req, res) => {
  const newRevenue = {
    id: revenues.length + 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0]
  };
  
  revenues.push(newRevenue);
  res.json(newRevenue);
});

// تحديث الإيراد
app.put('/api/revenues/:id', authenticateToken, (req, res) => {
  const revenue = revenues.find(r => r.id === parseInt(req.params.id));
  if (!revenue) return res.status(404).json({ message: 'الإيراد غير موجود' });
  
  Object.assign(revenue, req.body);
  res.json(revenue);
});

// حذف الإيراد
app.delete('/api/revenues/:id', authenticateToken, (req, res) => {
  revenues = revenues.filter(r => r.id !== parseInt(req.params.id));
  res.json({ message: 'تم حذف الإيراد بنجاح' });
});

// ==================== Expenses Routes ====================

// الحصول على جميع المصروفات
app.get('/api/expenses', authenticateToken, (req, res) => {
  const { startDate, endDate, category } = req.query;
  
  let filtered = expenses;
  
  if (startDate) {
    filtered = filtered.filter(e => e.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter(e => e.date <= endDate);
  }
  if (category) {
    filtered = filtered.filter(e => e.category === category);
  }
  
  res.json(filtered);
});

// إضافة مصروف جديد
app.post('/api/expenses', authenticateToken, (req, res) => {
  const newExpense = {
    id: expenses.length + 1,
    ...req.body,
    date: new Date().toISOString().split('T')[0]
  };
  
  expenses.push(newExpense);
  res.json(newExpense);
});

// تحديث المصروف
app.put('/api/expenses/:id', authenticateToken, (req, res) => {
  const expense = expenses.find(e => e.id === parseInt(req.params.id));
  if (!expense) return res.status(404).json({ message: 'المصروف غير موجود' });
  
  Object.assign(expense, req.body);
  res.json(expense);
});

// حذف المصروف
app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
  expenses = expenses.filter(e => e.id !== parseInt(req.params.id));
  res.json({ message: 'تم حذف المصروف بنجاح' });
});

// ==================== Employees Routes ====================

// الحصول على الموظفات
app.get('/api/employees', authenticateToken, (req, res) => {
  res.json(employees);
});

// إضافة موظفة
app.post('/api/employees', authenticateToken, (req, res) => {
  const newEmployee = {
    id: employees.length + 1,
    ...req.body
  };
  
  employees.push(newEmployee);
  res.json(newEmployee);
});

// تحديث الموظفة
app.put('/api/employees/:id', authenticateToken, (req, res) => {
  const employee = employees.find(e => e.id === parseInt(req.params.id));
  if (!employee) return res.status(404).json({ message: 'الموظفة غير موجودة' });
  
  Object.assign(employee, req.body);
  res.json(employee);
});

// حذف الموظفة
app.delete('/api/employees/:id', authenticateToken, (req, res) => {
  employees = employees.filter(e => e.id !== parseInt(req.params.id));
  res.json({ message: 'تم حذف الموظفة بنجاح' });
});

// ==================== Dashboard Routes ====================

// إحصائيات
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  res.json({
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    transactionsCount: revenues.length + expenses.length,
    employeesCount: employees.length
  });
});

// التقارير
app.get('/api/dashboard/reports', authenticateToken, (req, res) => {
  const monthlyData = {};
  
  // معالجة الإيرادات
  revenues.forEach(r => {
    const month = r.date.slice(0, 7);
    if (!monthlyData[month]) monthlyData[month] = { month, revenue: 0, expenses: 0 };
    monthlyData[month].revenue += r.amount;
  });
  
  // معالجة المصروفات
  expenses.forEach(e => {
    const month = e.date.slice(0, 7);
    if (!monthlyData[month]) monthlyData[month] = { month, revenue: 0, expenses: 0 };
    monthlyData[month].expenses += e.amount;
  });
  
  res.json(Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)));
});

// ==================== Export Routes ====================

// تصدير إلى Excel
app.get('/api/export/revenues', authenticateToken, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=revenues.json');
  res.json(revenues);
});

app.get('/api/export/expenses', authenticateToken, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=expenses.json');
  res.json(expenses);
});

// ==================== Error Handling ====================

// معالج الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'حدث خطأ في السيرفر', error: err.message });
});

// جميع المسارات الأخرى
app.get('*', (req, res) => {
  res.status(404).json({ message: 'المسار غير موجود' });
});

// بدء السيرفر
app.listen(PORT, () => {
  console.log(`🚀 السيرفر يعمل على http://localhost:${PORT}`);
  console.log('📊 نظام إدارة نادي كواكب اللياقة');
  console.log('🔐 استخدم المسار /api/auth/login لتسجيل الدخول');
});

export default app;