import { useState } from 'preact/hooks';

export function AddItem({ onAdd }) {
   const [name, setName] = useState("");
   const [paid, setPaid] = useState("");
   const [amount, setAmount] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validaciones
      if (!name.trim()) {
         setError("El nombre es requerido");
         return;
      }
      
      const paidValue = parseFloat(paid) || 0;
      const amountValue = parseFloat(amount) || 0;
      
      if (amountValue <= 0) {
         setError("El monto total debe ser mayor a 0");
         return;
      }
      
      if (paidValue < 0) {
         setError("El monto abonado no puede ser negativo");
         return;
      }
      
      if (paidValue > amountValue) {
         setError("Lo abonado no puede ser mayor al monto total");
         return;
      }
      
      // Si todo está bien, llamamos a onAdd
      onAdd({ 
         name: name.trim(), 
         paid: paidValue, 
         amount: amountValue,
         id: Date.now() // Usamos timestamp como ID único
      });
      
      // Resetear formulario
      setName("");
      setPaid("");
      setAmount("");
      setError("");
   };

   return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
         <h2 className="text-xl font-bold mb-4 text-gray-800">Agregar Nuevo Ítem</h2>
         
         {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
               <p>{error}</p>
            </div>
         )}
         
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del ítem
               </label>
               <input
                  id="name"
                  type="text"
                  placeholder='Ej: Televisor 55"'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                     Monto total
                  </label>
                  <div className="relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                     </div>
                     <input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-7 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>
               </div>
               
               <div>
                  <label htmlFor="paid" className="block text-sm font-medium text-gray-700 mb-1">
                     Abonado
                  </label>
                  <div className="relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                     </div>
                     <input
                        id="paid"
                        type="number"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={paid}
                        onChange={(e) => setPaid(e.target.value)}
                        className="pl-7 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                  </div>
               </div>
            </div>
            
            <div className="pt-2">
               <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out transform hover:scale-105"
               >
                  Agregar a la lista
               </button>
            </div>
         </form>
      </div>
   );
}