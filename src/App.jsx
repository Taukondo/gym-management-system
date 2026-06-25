import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Menu, X, Home, TrendingUp, TrendingDown, Users, Calendar,
  Package, Settings, LogOut, Eye, EyeOff, Plus, Search,
  Download, Filter, Edit2, Trash2, ChevronDown
} from 'lucide-react';

// البيانات المستوردة من Excel
const DATA = {
  revenues: [
    { id: 1, date: '2026-02-25', type: 'اشتراكات', category: '3 شهور', amount: 5094, paymentMethod: 'شبكة' },
    { id: 2, date: '2026-02-25', type: 'اشتراكات', category: 'شهر', amount: 698, paymentMethod: 'شبكة' },
    { id: 3, date: '2026-02-26', type: 'اشتراكات', category: '6 شهور', amount: 2049, paymentMethod: 'شبكة' }
  ],
  expenses: [
    { id: 1, date: '2026-05-30', category: 'صيانة', description: 'أعمال سباكة', amount: 1600 },
    { id: 2, date: '2026-05-31', category: 'صيانة', description: 'تركيب حديد', amount: 1600 },
    { id: 3, date: '2026-05-31', category: 'رواتب', description: 'رواتب شهر مايو', amount: 24223 }
  ],
  employees: [
    { id: 1, name: 'وفاء', position: 'مدربة', salary: 3500, phone: '+966501234567' },
    { id: 2, name: 'أسماء', position: 'مدربة', salary: 3500, phone: '+966501234568' },
    { id: 3, name: 'نادا', position: 'مدربة', salary: 3500, phone: '+966501234569' }
  ],
  classes: [
    { id: 1, name: 'Zumba', time: '07:30', capacity: 16, attendance: 0 },
    { id: 2, name: 'CrossFit', time: '07:30', capacity: 16, attendance: 0 },
    { id: 3, name: 'Pilates', time: '07:30', capacity: 16, attendance: 0 }
  ]
};

export default function GymManagementApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [darkMode, setDarkMode] = useState(false);

  // محاكاة البيانات الإحصائية
  const stats = {
    totalRevenue: 328_891,
    totalExpenses: 27_423,
    netProfit: 301_468,
    subscribersCount: 322,
    monthlyRevenue: 78_549,
    monthlyExpenses: 27_423
  };

  const chartData = [
    { month: 'فبراير', revenue: 75411, expenses: 27423 },
    { month: 'مارس', revenue: 66767, expenses: 28246 },
    { month: 'أبريل', revenue: 56752, expenses: 29068 },
    { month: 'مايو', revenue: 48239, expenses: 29891 }
  ];

  const revenueByType = [
    { name: 'اشتراكات', value: 216_062, color: '#3b82f6' },
    { name: 'تدريب شخصي', value: 10_392, color: '#10b981' },
    { name: 'تغذية', value: 3_495, color: '#f59e0b' },
    { name: 'خدمات', value: 1_905, color: '#ef4444' },
    { name: 'مشروبات', value: 96_937, color: '#8b5cf6' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username && loginData.password) {
      setIsLoggedIn(true);
      setLoginData({ username: '', password: '' });
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} loginData={loginData} setLoginData={setLoginData} />;
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">💪 كواكب اللياقة</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-blue-700 p-2 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          {[
            { id: 'dashboard', icon: Home, label: 'لوحة التحكم' },
            { id: 'revenues', icon: TrendingUp, label: 'الإيرادات' },
            { id: 'expenses', icon: TrendingDown, label: 'المصروفات' },
            { id: 'reports', icon: BarChart, label: 'التقارير' },
            { id: 'employees', icon: Users, label: 'الموظفات' },
            { id: 'classes', icon: Calendar, label: 'الحصص' },
            { id: 'inventory', icon: Package, label: 'المخزون' },
            { id: 'settings', icon: Settings, label: 'الإعدادات' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${
                currentPage === item.id ? 'bg-blue-500' : 'hover:bg-blue-700'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center space-x-2 p-3 hover:bg-blue-700 rounded-lg transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {
              {
                dashboard: 'لوحة التحكم',
                revenues: 'إدارة الإيرادات',
                expenses: 'إدارة المصروفات',
                reports: 'التقارير والتحليلات',
                employees: 'إدارة الموظفات',
                classes: 'جدول الحصص',
                inventory: 'المخزون',
                settings: 'الإعدادات'
              }[currentPage]
            }
          </h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          {currentPage === 'dashboard' && <DashboardPage stats={stats} chartData={chartData} revenueByType={revenueByType} />}
          {currentPage === 'revenues' && <RevenuesPage revenues={DATA.revenues} />}
          {currentPage === 'expenses' && <ExpensesPage expenses={DATA.expenses} />}
          {currentPage === 'reports' && <ReportsPage chartData={chartData} />}
          {currentPage === 'employees' && <EmployeesPage employees={DATA.employees} />}
          {currentPage === 'classes' && <ClassesPage classes={DATA.classes} />}
          {currentPage === 'inventory' && <InventoryPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}

// صفحة تسجيل الدخول
function LoginPage({ onLogin, loginData, setLoginData }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">💪</h1>
          <h2 className="text-2xl font-bold text-gray-800">كواكب اللياقة</h2>
          <p className="text-gray-600 mt-2">نظام إدارة نادي اللياقة البدنية</p>
        </div>

        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">اسم المستخدم</label>
            <input
              type="text"
              placeholder="أدخل اسم المستخدم"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="أدخل كلمة المرور"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2 rounded-lg hover:shadow-lg transition"
          >
            تسجيل الدخول
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          جرب: admin / 123456
        </p>
      </div>
    </div>
  );
}

// صفحة لوحة التحكم
function DashboardPage({ stats, chartData, revenueByType }) {
  return (
    <div className="space-y-6">
      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الإيرادات" value={`₪${stats.totalRevenue.toLocaleString('ar')}`} icon="📈" color="blue" />
        <StatCard title="إجمالي المصروفات" value={`₪${stats.totalExpenses.toLocaleString('ar')}`} icon="📉" color="red" />
        <StatCard title="صافي الربح" value={`₪${stats.netProfit.toLocaleString('ar')}`} icon="💰" color="green" />
        <StatCard title="عدد المشتركين" value={stats.subscribersCount} icon="👥" color="purple" />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الإيرادات والمصروفات */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">الإيرادات والمصروفات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="الإيرادات" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="المصروفات" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* توزيع الإيرادات */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">توزيع الإيرادات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={revenueByType} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                {revenueByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* معلومات سريعة */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">ملخص الشهر الحالي</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-600">الإيراد الشهري</p>
            <p className="text-2xl font-bold text-blue-600">₪{stats.monthlyRevenue.toLocaleString('ar')}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-gray-600">المصروفات الشهرية</p>
            <p className="text-2xl font-bold text-red-600">₪{stats.monthlyExpenses.toLocaleString('ar')}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-gray-600">الربح الشهري</p>
            <p className="text-2xl font-bold text-green-600">₪{(stats.monthlyRevenue - stats.monthlyExpenses).toLocaleString('ar')}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-gray-600">معدل الربح</p>
            <p className="text-2xl font-bold text-purple-600">{((stats.monthlyRevenue - stats.monthlyExpenses) / stats.monthlyRevenue * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون البطاقة الإحصائية
function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: 'bg-blue-100 border-blue-300',
    red: 'bg-red-100 border-red-300',
    green: 'bg-green-100 border-green-300',
    purple: 'bg-purple-100 border-purple-300'
  };

  return (
    <div className={`${colorMap[color]} border-2 rounded-lg p-6 text-right`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

// صفحة الإيرادات
function RevenuesPage({ revenues }) {
  const [filteredRevenues, setFilteredRevenues] = useState(revenues);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
    setFilteredRevenues(
      revenues.filter(r =>
        r.category.includes(term) || r.type.includes(term) || r.paymentMethod.includes(term)
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute right-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن الإيرادات..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          إضافة إيراد
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-right">
              <th className="px-6 py-3 font-semibold text-gray-800">التاريخ</th>
              <th className="px-6 py-3 font-semibold text-gray-800">النوع</th>
              <th className="px-6 py-3 font-semibold text-gray-800">الفئة</th>
              <th className="px-6 py-3 font-semibold text-gray-800">المبلغ</th>
              <th className="px-6 py-3 font-semibold text-gray-800">الدفع</th>
              <th className="px-6 py-3 font-semibold text-gray-800">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredRevenues.map((revenue) => (
              <tr key={revenue.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{revenue.date}</td>
                <td className="px-6 py-4 font-semibold">{revenue.type}</td>
                <td className="px-6 py-4">{revenue.category}</td>
                <td className="px-6 py-4 text-green-600 font-bold">₪{revenue.amount}</td>
                <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{revenue.paymentMethod}</span></td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit2 size={18} /></button>
                  <button className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// صفحة المصروفات
function ExpensesPage({ expenses }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4 flex gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute right-3 top-3 text-gray-400" />
          <input type="text" placeholder="ابحث عن المصروفات..." className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
          <Plus size={20} />
          إضافة مصروف
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-right">
              <th className="px-6 py-3 font-semibold">التاريخ</th>
              <th className="px-6 py-3 font-semibold">البند</th>
              <th className="px-6 py-3 font-semibold">الوصف</th>
              <th className="px-6 py-3 font-semibold">المبلغ</th>
              <th className="px-6 py-3 font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{expense.date}</td>
                <td className="px-6 py-4 font-semibold">{expense.category}</td>
                <td className="px-6 py-4">{expense.description}</td>
                <td className="px-6 py-4 text-red-600 font-bold">₪{expense.amount}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit2 size={18} /></button>
                  <button className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// صفحة التقارير
function ReportsPage({ chartData }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">تقرير الإيرادات والمصروفات</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="الإيرادات" />
            <Bar dataKey="expenses" fill="#ef4444" name="المصروفات" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">أفضل الأيام</h3>
          <div className="space-y-3">
            {['الأحد', 'السبت', 'الخميس'].map((day, i) => (
              <div key={day} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span>{day}</span>
                <span className="font-bold text-blue-600">₪{(59000 - i * 5000).toLocaleString('ar')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">تحليل المصروفات</h3>
          <div className="space-y-3">
            {[
              { category: 'الرواتب', amount: 24223, percentage: 88 },
              { category: 'الصيانة', amount: 3200, percentage: 12 }
            ].map((item) => (
              <div key={item.category}>
                <div className="flex justify-between mb-1">
                  <span>{item.category}</span>
                  <span className="font-semibold">₪{item.amount.toLocaleString('ar')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// صفحة الموظفات
function EmployeesPage({ employees }) {
  return (
    <div className="space-y-4">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
        <Plus size={20} />
        إضافة موظفة
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl">
                👩
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{emp.name}</h3>
              <p className="text-gray-600 text-sm">{emp.position}</p>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">الراتب الأساسي:</span>
                <span className="font-semibold">₪{emp.salary.toLocaleString('ar')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الهاتف:</span>
                <span className="font-semibold">{emp.phone}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2">
                <Edit2 size={18} />
                تعديل
              </button>
              <button className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2">
                <Trash2 size={18} />
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// صفحة الحصص
function ClassesPage({ classes }) {
  return (
    <div className="space-y-4">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
        <Plus size={20} />
        إضافة حصة
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-right">
              <th className="px-6 py-3 font-semibold">اسم الحصة</th>
              <th className="px-6 py-3 font-semibold">الوقت</th>
              <th className="px-6 py-3 font-semibold">السعة</th>
              <th className="px-6 py-3 font-semibold">الحاضرون</th>
              <th className="px-6 py-3 font-semibold">الإشغال</th>
              <th className="px-6 py-3 font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{cls.name}</td>
                <td className="px-6 py-4">{cls.time}</td>
                <td className="px-6 py-4">{cls.capacity}</td>
                <td className="px-6 py-4">{cls.attendance}</td>
                <td className="px-6 py-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(cls.attendance / cls.capacity) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// صفحة المخزون
function InventoryPage() {
  const inventory = [
    { id: 1, name: 'مياه', category: 'مشروبات', quantity: 1350, minAlert: 30, unitCost: 0.33, sellPrice: 1 },
    { id: 2, name: 'قهوة', category: 'مشروبات', quantity: 0, minAlert: 10, unitCost: 3, sellPrice: 12 }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr className="text-right">
              <th className="px-6 py-3 font-semibold">المنتج</th>
              <th className="px-6 py-3 font-semibold">التصنيف</th>
              <th className="px-6 py-3 font-semibold">الكمية</th>
              <th className="px-6 py-3 font-semibold">حد التنبيه</th>
              <th className="px-6 py-3 font-semibold">السعر</th>
              <th className="px-6 py-3 font-semibold">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.quantity}</td>
                <td className="px-6 py-4">{item.minAlert}</td>
                <td className="px-6 py-4">₪{item.sellPrice}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.quantity <= item.minAlert ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {item.quantity <= item.minAlert ? 'أعد الطلب' : 'متوفر'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// صفحة الإعدادات
function SettingsPage() {
  const [settings, setSettings] = useState({
    gymName: 'كواكب اللياقة',
    mainBranch: 'الفرع الرئيسي',
    taxRate: 15,
    currency: 'ريال سعودي'
  });

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">الإعدادات العامة</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">اسم النادي</label>
            <input
              type="text"
              value={settings.gymName}
              onChange={(e) => handleChange('gymName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">الفرع الافتراضي</label>
            <input
              type="text"
              value={settings.mainBranch}
              onChange={(e) => handleChange('mainBranch', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">نسبة الضريبة (%)</label>
            <input
              type="number"
              value={settings.taxRate}
              onChange={(e) => handleChange('taxRate', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
            حفظ الإعدادات
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">معلومات النظام</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">الإصدار:</span> v1.0.0</p>
          <p><span className="font-semibold">آخر تحديث:</span> يونيو 2026</p>
          <p><span className="font-semibold">قاعدة البيانات:</span> متصلة ✓</p>
        </div>
      </div>
    </div>
  );
}