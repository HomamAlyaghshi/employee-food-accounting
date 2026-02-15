import React, { useState, useEffect } from "react";
import { Plus, Trash2, Users, UserPlus, Search, AlertCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const EmployeeManager = ({ onEmployeesUpdated, onProceedToOrders }) => {
  const { t } = useLanguage();
  const [employees, setEmployees] = useState([]);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Load employees from localStorage on mount
  useEffect(() => {
    const savedEmployees = localStorage.getItem('customEmployees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
    setShowHint(true);
  }, []);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('customEmployees', JSON.stringify(employees));
    }
  }, [employees]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const addEmployee = () => {
    const trimmedName = newEmployeeName.trim();
    
    if (!trimmedName) {
      showNotification('error', t('pleaseEnterEmployeeName'));
      return;
    }
    
    if (employees.some(emp => emp.toLowerCase() === trimmedName.toLowerCase())) {
      showNotification('error', t('employeeAlreadyExists'));
      return;
    }
    
    const newEmployee = {
      id: Date.now(),
      name: trimmedName,
      createdAt: new Date().toISOString()
    };
    
    setEmployees([...employees, newEmployee]);
    setNewEmployeeName("");
    setShowAddForm(false);
    showNotification('success', t('employeeAddedSuccessfully').replace('{name}', trimmedName));
  };

  const removeEmployee = (id, name) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    showNotification('success', t('employeeRemoved').replace('{name}', name));
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProceed = () => {
    if (employees.length === 0) {
      showNotification('error', t('pleaseAddAtLeastOneEmployee'));
      return;
    }
    onEmployeesUpdated(employees);
    onProceedToOrders();
  };

  return (
    <div className="employee-manager">
      {/* Header */}
      <div className="employee-manager-header">
        <div className="header-content">
          <div className="header-title">
            <Users size={32} />
            <div>
              <h1>{t('employeeManagement')}</h1>
              <p>{t('addAndManageTeam')}</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{employees.length}</span>
              <span className="stat-label">{t('totalEmployees')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Hint */}
      {showHint && employees.length === 0 && (
        <div className="welcome-hint">
          <div className="hint-content">
            <AlertCircle size={20} />
            <div>
              <h3>{t('welcomeLetsSetupTeam')}</h3>
              <p>{t('startByAddingEmployees')}</p>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setShowHint(false)}
            >
              {t('gotIt')}
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-container">
          <Search size={18} />
          <input
            type="text"
            placeholder={t('searchEmployees')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* Add Employee Form */}
      {showAddForm && (
        <div className="add-employee-form">
          <div className="form-content">
            <h3>{t('addNewEmployee')}</h3>
            <div className="input-group">
              <input
                type="text"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                placeholder={t('enterEmployeeName')}
                className="form-control"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && addEmployee()}
              />
              <div className="input-hint">
                {t('pressEnterToAdd')}
              </div>
            </div>
            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={addEmployee}
              >
                <Plus size={16} />
                {t('addEmployee')}
              </button>
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setNewEmployeeName("");
                }}
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="employees-table-container">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>{t('noEmployeesFound')}</h3>
            <p>
              {searchTerm ? t('tryAdjustingSearch') : t('addFirstEmployee')}
            </p>
            {!searchTerm && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                <Plus size={16} />
                {t('addFirstEmployee')}
              </button>
            )}
          </div>
        ) : (
          <div className="employees-table">
            <div className="table-header">
              <div className="header-cell">{t('employeeNameHeader')}</div>
              <div className="header-cell">{t('addedDate')}</div>
              <div className="header-cell">{t('actionsHeader')}</div>
            </div>
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="table-row">
                <div className="table-cell employee-name">
                  <UserPlus size={16} />
                  <span>{employee.name}</span>
                </div>
                <div className="table-cell">
                  {new Date(employee.createdAt).toLocaleDateString()}
                </div>
                <div className="table-cell">
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => removeEmployee(employee.id, employee.name)}
                  >
                    <Trash2 size={14} />
                    {t('remove')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proceed Button */}
      {employees.length > 0 && (
        <div className="proceed-section">
          <div className="proceed-content">
            <div className="proceed-info">
              <h3>{t('readyToCreateOrders')}</h3>
              <p>{t('employeesInTeam').replace('{count}', employees.length).replace('{plural}', employees.length !== 1 ? 's' : '')}</p>
            </div>
            <button 
              className="btn btn-success btn-lg"
              onClick={handleProceed}
            >
              {t('proceedToOrders')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManager;
