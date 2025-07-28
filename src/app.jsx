import { useState, useEffect } from 'preact/hooks'
import { SummaryCards } from './components/SummaryCards'
import { AddItem } from './components/AddItems'
import { ItemList } from './components/ItemList'
import { StrategyCalc } from './components/StrategyCalc'

// Componente para la pestaña de presupuesto
function BudgetTab({ 
  items = [], 
  income = 0, 
  expenses = 0, 
  nonUsable = 0,
  customAmount = 0, 
  useCustomAmount = false, 
  onUpdateItem = () => {}, 
  onDeleteItem = () => {}, 
  onAddItem = () => {}, 
  onUpdateIncome = () => {}, 
  onUpdateExpenses = () => {},
  onUpdateNonUsable = () => {},
  onUpdateCustomAmount = () => {},
  onToggleUseCustomAmount = () => {}
}) {
  // Calcular el monto disponible restando gastos fijos y monto no utilizable
  const availableMoney = useCustomAmount ? customAmount : (income - expenses - nonUsable);
  
  return (
    <div className="space-y-6">
      <SummaryCards 
        items={items} 
        income={income} 
        expenses={expenses} 
        availableMoney={availableMoney} 
        useCustomAmount={useCustomAmount} 
        nonUsable={nonUsable}
      />
      <div className="bg-white p-6 rounded-lg shadow divide-y divide-gray-200">
        <div className="pb-4">
          <h2 className="text-xl font-semibold">Ingresos y Gastos</h2>
          <p className="text-sm text-gray-500 mt-1">Ingresa tus ingresos y gastos mensuales</p>
        </div>
        <div className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingresos Mensuales</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={income}
                  onChange={(e) => onUpdateIncome(Number(e.target.value) || 0)}
                  className="pl-7 w-full p-2 border rounded"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gastos Fijos</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={expenses}
                  onChange={(e) => onUpdateExpenses(Number(e.target.value) || 0)}
                  className="pl-7 w-full p-2 border rounded"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">No utilizable</label>
                <span className="text-xs text-gray-500">Se resta del total</span>
              </div>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={nonUsable}
                  onChange={(e) => onUpdateNonUsable(Number(e.target.value) || 0)}
                  className="pl-7 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  type="button"
                  className={`${useCustomAmount ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  onClick={onToggleUseCustomAmount}
                >
                  <span className="sr-only">Usar monto personalizado</span>
                  <span
                    className={`${useCustomAmount ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform`}
                  />
                </button>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {useCustomAmount ? 'Usando monto personalizado' : 'Usar monto personalizado'}
                </span>
              </div>
              {useCustomAmount && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Modo manual activado
                </span>
              )}
            </div>
            
            {useCustomAmount && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto a utilizar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => onUpdateCustomAmount(Number(e.target.value) || 0)}
                    className="pl-7 w-full p-2 border rounded"
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}
            
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Monto disponible:</span> ${availableMoney.toFixed(2)}
                {useCustomAmount 
                  ? ' (personalizado)' 
                  : ` (ingresos - gastos ${nonUsable > 0 ? `- no utilizable` : ''})`}
              </p>
              {!useCustomAmount && nonUsable > 0 && (
                <p className="mt-1 text-xs text-blue-600">
                  Cálculo: ${income.toFixed(2)} - ${expenses.toFixed(2)} - ${nonUsable.toFixed(2)} = ${availableMoney.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Ítem</h2>
        <AddItem onAdd={onAddItem} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Lista de Compras</h2>
        <ItemList items={items} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
      </div>
    </div>
  );
}

// Componente para la pestaña de estrategias
function StrategyTab({ items, availableMoney }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Estrategias de Pago</h2>
      <StrategyCalc items={items} availableMoney={availableMoney} />
    </div>
  );
}

export function App() {
  // Cargar datos desde localStorage al iniciar
  const loadData = () => {
    const savedData = localStorage.getItem('budgetData');
    if (savedData) {
      try {
        const { 
          items = [], 
          income = 0, 
          expenses = 0, 
          nonUsable = 0,
          useCustomAmount = false, 
          customAmount = 0 
        } = JSON.parse(savedData);
        return { items, income, expenses, nonUsable, useCustomAmount, customAmount };
      } catch (e) {
        console.error('Error al cargar datos guardados', e);
      }
    }
    return { items: [], income: 0, expenses: 0, nonUsable: 0, useCustomAmount: false, customAmount: 0 };
  };

  const [state, setState] = useState(loadData());
  console.log('Estado actual:', state); // Para depuración
  // Asegurando que todas las propiedades necesarias estén definidas
  const { 
    items = [], 
    income = 0, 
    expenses = 0, 
    nonUsable = 0, 
    customAmount = 0, 
    useCustomAmount = false 
  } = state || {};

  // Actualizar estado y localStorage cuando cambia algún dato
  const updateState = (updates) => {
    const newState = { ...state, ...updates };
    setState(newState);
    localStorage.setItem('budgetData', JSON.stringify(newState));
  };

  // Manejar adición de ítem
  const handleAddItem = (newItem) => {
    updateState({ items: [...items, newItem] });
  };

  // Manejar actualización de ítem
  const handleUpdateItem = (updatedItem) => {
    const updatedItems = items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    updateState({ items: updatedItems });
  };

  // Manejar eliminación de ítem
  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    updateState({ items: updatedItems });
  };

  // Manejar cambio de ingresos/gastos
  const handleIncomeChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    updateState({ income: Math.max(0, value) });
  };

  const handleExpensesChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    updateState({ expenses: Math.max(0, value) });
  };

  const handleNonUsableChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    updateState({ nonUsable: Math.max(0, value) });
  };

  const handleCustomAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    updateState({ customAmount: Math.max(0, value) });
  };

  const toggleUseCustomAmount = () => {
    updateState({ useCustomAmount: !state.useCustomAmount });
  };

  // Calcular el monto disponible según la opción seleccionada
  const availableMoney = state.useCustomAmount 
    ? state.customAmount 
    : (income - expenses - (state.nonUsable || 0));

  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState('budget');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mi Plan de Ahorros</h1>
        <p className="text-gray-600">Controla tus metas de ahorro de manera sencilla</p>
        
        {/* Navegación por pestañas */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('budget')}
              className={`${activeTab === 'budget' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Presupuesto
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`${activeTab === 'strategy' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Estrategias de Pago
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {activeTab === 'budget' ? (
          <BudgetTab 
            items={items} 
            income={income} 
            expenses={expenses}
            nonUsable={nonUsable}
            customAmount={customAmount}
            useCustomAmount={useCustomAmount}
            onUpdateItem={handleUpdateItem} 
            onDeleteItem={handleDeleteItem} 
            onAddItem={handleAddItem}
            onUpdateIncome={(value) => updateState({ income: value })}
            onUpdateExpenses={(value) => updateState({ expenses: value })}
            onUpdateNonUsable={(value) => updateState({ nonUsable: value })}
            onUpdateCustomAmount={(value) => updateState({ customAmount: value })}
            onToggleUseCustomAmount={toggleUseCustomAmount}
          />
        ) : (
          <StrategyTab 
            items={items} 
            availableMoney={availableMoney} 
          />
        )}
      </main>
    </div>
  );
}
