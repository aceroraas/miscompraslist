import { useState, useMemo } from 'preact/hooks';
import { formatCurrency } from '../utils/format';

export function StrategyCalc({ items, availableMoney }) {
  const [activeStrategy, setActiveStrategy] = useState('avalanche');
  
  // Filtrar solo ítems que aún necesitan pago
  const itemsNeedingPayment = useMemo(() => 
    items.filter(item => item.amount > item.paid)
  , [items]);

  // Estrategia de Avalancha: Pagar primero la deuda con mayor tasa de interés (en este caso, mayor monto restante)
  const calculateAvalanche = useMemo(() => {
    if (availableMoney <= 0) return [];
    
    const sorted = [...itemsNeedingPayment].sort((a, b) => 
      (b.amount - b.paid) - (a.amount - a.paid)
    );
    
    let remainingMoney = availableMoney;
    return sorted.map(item => {
      const remaining = item.amount - item.paid;
      const assign = Math.min(remainingMoney, remaining);
      remainingMoney = Math.max(0, remainingMoney - assign);
      return { ...item, assign };
    }).filter(item => item.assign > 0);
  }, [itemsNeedingPayment, availableMoney]);

  // Estrategia de Bola de Nieve: Pagar primero la deuda más pequeña
  const calculateSnowball = useMemo(() => {
    if (availableMoney <= 0) return [];
    
    const sorted = [...itemsNeedingPayment].sort((a, b) => 
      (a.amount - a.paid) - (b.amount - b.paid)
    );
    
    let remainingMoney = availableMoney;
    return sorted.map(item => {
      const remaining = item.amount - item.paid;
      const assign = Math.min(remainingMoney, remaining);
      remainingMoney = Math.max(0, remainingMoney - assign);
      return { ...item, assign };
    }).filter(item => item.assign > 0);
  }, [itemsNeedingPayment, availableMoney]);

  // Estrategia de Pagos Equitativos: Distribuir el pago disponible por igual
  const calculateEqual = useMemo(() => {
    if (availableMoney <= 0 || itemsNeedingPayment.length === 0) return [];
    
    const perItem = availableMoney / itemsNeedingPayment.length;
    return itemsNeedingPayment.map(item => {
      const remaining = item.amount - item.paid;
      const assign = Math.min(perItem, remaining);
      return { ...item, assign };
    }).filter(item => item.assign > 0);
  }, [itemsNeedingPayment, availableMoney]);

  // Obtener la estrategia activa
  const activeResults = useMemo(() => {
    switch(activeStrategy) {
      case 'snowball': return calculateSnowball;
      case 'equal': return calculateEqual;
      case 'avalanche':
      default: return calculateAvalanche;
    }
  }, [activeStrategy, calculateAvalanche, calculateSnowball, calculateEqual]);

  // Calcular totales
  const totalAssigned = activeResults.reduce((sum, item) => sum + item.assign, 0);
  const remainingAfterPayment = availableMoney - totalAssigned;

  const strategies = [
    {
      id: 'avalanche',
      name: 'Avalancha',
      description: 'Paga primero la deuda más grande',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      results: calculateAvalanche
    },
    {
      id: 'snowball',
      name: 'Bola de Nieve',
      description: 'Paga primero la deuda más pequeña',
      icon: 'M18 9v6m-5-5v5m-5-5v5m-5-5v5m14-13v16a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h14a1 1 0 011 1z',
      results: calculateSnowball
    },
    {
      id: 'equal',
      name: 'Pagos Equitativos',
      description: 'Distribuye el pago por igual',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      results: calculateEqual
    }
  ];

  if (itemsNeedingPayment.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Estrategias de Pago</h2>
        <p className="text-gray-600">¡Felicidades! No tienes deudas pendientes.</p>
      </div>
    );
  }

  if (availableMoney <= 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Estrategias de Pago</h2>
        <p className="text-gray-600">No hay dinero disponible para asignar a pagos este mes.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Estrategias de Pago</h2>
      <p className="text-gray-600 mb-4">
        Dinero disponible este mes: <span className="font-semibold">{formatCurrency(availableMoney)}</span>
      </p>
      
      {/* Selector de estrategias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => setActiveStrategy(strategy.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeStrategy === strategy.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                activeStrategy === strategy.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={strategy.icon} />
                </svg>
              </div>
              <div className="ml-3 text-left">
                <h3 className="font-medium text-gray-900">{strategy.name}</h3>
                <p className="text-sm text-gray-500">{strategy.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Resultados de la estrategia seleccionada */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Plan de Pagos - {strategies.find(s => s.id === activeStrategy)?.name}
        </h3>
        
        <div className="space-y-3">
          {activeResults.map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.name}</span>
                <span className="text-blue-600 font-medium">
                  +{formatCurrency(item.assign)}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {formatCurrency(item.paid)} de {formatCurrency(item.amount)} • 
                {item.assign === (item.amount - item.paid) ? (
                  <span className="text-green-600"> ¡Completado!</span>
                ) : (
                  <span> {Math.round(((item.paid + item.assign) / item.amount) * 100)}% completado</span>
                )}
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: `${Math.min(100, ((item.paid + item.assign) / item.amount) * 100)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total asignado este mes:</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(totalAssigned)}
            </p>
          </div>
          {remainingAfterPayment > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Restante por asignar:</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(remainingAfterPayment)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}