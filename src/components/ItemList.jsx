import { useState } from 'preact/hooks';
import { formatCurrency } from '../utils/format';

const EditableField = ({ value, onSave, label, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    const finalValue = type === 'number' ? parseFloat(inputValue) || 0 : inputValue;
    onSave(finalValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type={type}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full p-1 border rounded text-sm"
          autoFocus
          onBlur={handleSave}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          min={type === 'number' ? '0' : undefined}
          step={type === 'number' ? '0.01' : undefined}
        />
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-gray-50 p-1 rounded"
      title={`Haz clic para editar ${label}`}
    >
      {type === 'number' ? formatCurrency(value) : value || '-'}
    </div>
  );
};

export function ItemList({ items, onUpdateItem, onDeleteItem }) {
  const handleUpdate = (id, updates) => {
    const item = items.find(i => i.id === id);
    onUpdateItem({ ...item, ...updates });
  };
  
  const handleDelete = (id, name) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${name}"?`)) {
      onDeleteItem(id);
    }
  };

  const getProgressColor = (paid, amount) => {
    const percentage = (paid / amount) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay ítems aún. ¡Agrega tu primera meta de ahorro!</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-500">
        <div className="col-span-5">Nombre</div>
        <div className="col-span-2 text-right">Abonado</div>
        <div className="col-span-2 text-right">Monto</div>
        <div className="col-span-2">Progreso</div>
        <div className="col-span-1"></div>
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 rounded-lg border bg-white border-gray-200 hover:bg-gray-50"
          >
            {/* Nombre */}
            <div className="md:col-span-5 font-medium">
              {item.name || '-'}
            </div>
            
            {/* Abonado */}
            <div className="md:col-span-2 text-right">
              <EditableField
                value={item.paid}
                onSave={(value) => handleUpdate(item.id, { paid: value })}
                label="monto abonado"
                type="number"
              />
            </div>
            
            {/* Monto Total */}
            <div className="md:col-span-2 text-right">
              <EditableField
                value={item.amount}
                onSave={(value) => handleUpdate(item.id, { amount: value })}
                label="monto total"
                type="number"
              />
            </div>
            
            {/* Barra de progreso */}
            <div className="md:col-span-3 flex items-center">
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{Math.round((item.paid / item.amount) * 100)}%</span>
                  <span>{formatCurrency(item.amount - item.paid)} faltan</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(item.paid, item.amount)}`}
                    style={{
                      width: `${Math.min(100, (item.paid / item.amount) * 100)}%`,
                      transition: 'width 0.3s ease-in-out'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Acciones */}
            <div className="md:col-span-1 flex items-center justify-end pr-2">
              <button 
                className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id, item.name);
                }}
                title="Eliminar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
