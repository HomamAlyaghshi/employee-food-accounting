# يلا فطور - Yalla Breakfast - Employee Food Accounting System

A modern, professional food expense tracking application built with React, featuring a beautiful SaaS-style design with comprehensive functionality. "يلا فطور" (Yalla Breakfast) is designed to help teams track their breakfast and meal expenses efficiently.

## 🎨 Design & Features

### Modern UI/UX
- **SaaS-style Design** with clean, minimal interface
- **Custom Color Palette**: Primary (#FF5A3C), Secondary (#1F2937), Accent (#FBBF24)
- **Dark Mode Support** with smooth transitions
- **Responsive Design** optimized for all devices
- **Multi-language Support** (Arabic/English with RTL)
- **Professional Components** with smooth animations

### Core Functionality
- **Employee Management**: Select from predefined employee list
- **Multi-item Entry**: Add multiple food items in a single submission
- **Real-time Calculations**: Automatic total calculations
- **Edit Capabilities**: Inline editing of existing items
- **Bulk Operations**: Multi-select and bulk delete functionality
- **Data Persistence**: LocalStorage with automatic backups

### Advanced Features
- **Analytics Dashboard**: Interactive charts and statistics
- **Data Visualization**: Bar charts, pie charts, and comparisons
- **Export/Import**: JSON and CSV export functionality
- **Backup System**: Automatic and manual backup creation
- **Storage Management**: Complete data management interface
- **Confirmation Modals**: Professional delete confirmations

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HomamAlyaghshi/employee-food-accounting.git
   cd yalla-breakfast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
yalla-breakfast/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── ModernHeader.jsx
│   │   ├── FoodForm.jsx
│   │   ├── FoodTable.jsx
│   │   ├── EmployeeTotals.jsx
│   │   ├── DetailedStats.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── StorageManager.jsx
│   │   └── Modal.jsx
│   ├── contexts/          # React contexts
│   │   ├── ThemeContext.jsx
│   │   └── LanguageContext.jsx
│   ├── hooks/             # Custom hooks
│   │   ├── useFoodItems.js
│   │   ├── useItemRows.js
│   │   ├── useError.js
│   │   └── useModal.js
│   ├── utils/             # Utility functions
│   │   ├── storage.js
│   │   ├── calculations.js
│   │   ├── validation.js
│   │   └── export.js
│   ├── constants/         # Application constants
│   │   └── employees.js
│   ├── types/             # Type definitions
│   │   └── index.js
│   ├── App.jsx            # Main application component
│   ├── App-modern.css     # Modern styling
│   └── App-dark.css       # Dark mode styles
├── package.json
└── README.md
```

## 🎯 Key Features

### 📊 Analytics & Reporting
- **Employee Cost Analysis**: Visual breakdown of expenses by employee
- **Trend Analysis**: Track spending patterns over time
- **Comparative Charts**: Side-by-side employee comparisons
- **Statistical Insights**: Average order values, item prices, and more

### 💾 Data Management
- **Automatic Backup**: Creates backups every 10 items
- **Manual Backup**: On-demand backup creation
- **Data Export**: Export to JSON or CSV formats
- **Data Import**: Restore from backup files
- **Storage Info**: View storage usage and statistics

### 🌍 Internationalization
- **Arabic/English Support**: Complete language switching
- **RTL Layout**: Proper right-to-left support for Arabic
- **Localized Content**: All UI elements translated

### 🎨 Design System
- **CSS Variables**: Consistent theming throughout
- **Component Library**: Reusable, styled components
- **Responsive Grid**: Mobile-first responsive design
- **Smooth Animations**: Professional transitions and effects

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Recharts**: Data visualization library
- **Lucide React**: Modern icon library
- **CSS3**: Custom CSS with variables
- **LocalStorage**: Client-side data persistence

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory for environment-specific configuration.

### Customization
- **Employee List**: Modify `src/constants/employees.js`
- **Color Scheme**: Update CSS variables in `src/App-modern.css`
- **Languages**: Add translations in `src/contexts/LanguageContext.jsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Lucide icons for the beautiful icon set
- Recharts for the powerful charting library
- The modern design community for inspiration

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using React and Modern Web Technologies**
