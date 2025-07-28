import { formatCurrency } from '../utils/format';

export function SummaryCards({ items, income = 0, expenses = 0, availableMoney, useCustomAmount = false, nonUsable = 0 }) {
   // Calcular totales
   const totalSaved = items.reduce((sum, item) => sum + (item.paid || 0), 0);
   const totalToSave = items.reduce((sum, item) => sum + ((item.amount || 0) - (item.paid || 0)), 0);
   const totalBudget = items.reduce((sum, item) => sum + (item.amount || 0), 0);
   // Calcular el saldo disponible restando gastos fijos y monto no utilizable
   const availableBalance = useCustomAmount ? availableMoney : (income || 0) - (expenses || 0) - (nonUsable || 0);
   const monthsToSave = availableBalance > 0 ? Math.ceil(totalToSave / availableBalance) : '∞';

   const cards = [
      {
         title: 'Total Ahorrado',
         amount: totalSaved,
         description: 'Acumulado hasta ahora',
         icon: (
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         ),
         color: 'bg-green-50',
         textColor: 'text-green-600'
      },
      {
         title: 'Por Ahorrar',
         amount: totalToSave,
         description: 'Falta por completar',
         icon: (
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         ),
         color: 'bg-blue-50',
         textColor: 'text-blue-600'
      },
      {
         title: 'Presupuesto Total',
         amount: totalBudget,
         description: 'Monto total de tus metas',
         icon: (
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         ),
         color: 'bg-purple-50',
         textColor: 'text-purple-600'
      },
      {
         title: useCustomAmount ? 'Monto Personalizado' : 'Mensualidad Necesaria',
         amount: useCustomAmount ? availableBalance : (availableBalance > 0 ? Math.ceil(totalToSave / monthsToSave) : 0),
         description: useCustomAmount 
            ? 'Monto fijo establecido' 
            : `Para completar en ${monthsToSave} meses`,
         icon: (
            <svg className={`w-8 h-8 ${useCustomAmount ? 'text-purple-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
         ),
         color: useCustomAmount ? 'bg-purple-50' : 'bg-yellow-50',
         textColor: useCustomAmount ? 'text-purple-600' : 'text-yellow-600',
         showPositiveNegative: true
      },
      {
         title: 'Mensual',
         amount: availableBalance,
         description: availableBalance > 0 
            ? `Tiempo estimado: ${monthsToSave} ${monthsToSave === 1 ? 'mes' : 'meses'}`
            : 'Ajusta tus ingresos/gastos',
         icon: (
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
         ),
         color: 'bg-yellow-50',
         textColor: 'text-yellow-600',
         showPositiveNegative: true
      }
   ];

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {cards.map((card, index) => (
            <div 
               key={index} 
               className={`${card.color} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-sm font-medium text-gray-500">{card.title}</p>
                     <p className={`mt-1 text-2xl font-semibold ${card.textColor}`}>
                        {formatCurrency(card.amount, card.showPositiveNegative)}
                     </p>
                     <p className="mt-2 text-xs text-gray-500">{card.description}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${card.color.replace('bg-', 'bg-opacity-40 ')}`}>
                     {card.icon}
                  </div>
               </div>
               
               {card.title === 'Mensual' && availableBalance > 0 && totalToSave > 0 && (
                  <div className="mt-4">
                     <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                           className="bg-blue-500 h-2 rounded-full" 
                           style={{
                              width: `${Math.min(100, (availableBalance / totalToSave) * 100)}%`,
                              maxWidth: '100%'
                           }}
                        />
                     </div>
                     <p className="text-xs text-gray-500 mt-1">
                        {Math.round((availableBalance / totalToSave) * 100)}% de lo necesario este mes
                     </p>
                  </div>
               )}
            </div>
         ))}
      </div>
   );
}