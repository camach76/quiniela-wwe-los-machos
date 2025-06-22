import { useState, useEffect } from 'react';
import { MatchWithClubs } from '../types/match';

interface MatchResultFormProps {
  match: MatchWithClubs;
  onSubmit: (resultado_a: number | null, resultado_b: number | null) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function MatchResultForm({ match, onSubmit, onCancel, isSubmitting }: MatchResultFormProps) {
  const [resultadoA, setResultadoA] = useState<number | null>(match.resultado_a);
  const [resultadoB, setResultadoB] = useState<number | null>(match.resultado_b);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  useEffect(() => {
    // Si el partido ya tiene un resultado, lo cargamos en el formulario
    setResultadoA(match.resultado_a);
    setResultadoB(match.resultado_b);
  }, [match]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que al menos uno de los valores no sea nulo
    if (resultadoA === null && resultadoB === null) {
      setError('Debes ingresar al menos un resultado');
      return;
    }

    // Validar que los valores sean números enteros no negativos
    if ((resultadoA !== null && (!Number.isInteger(resultadoA) || resultadoA < 0)) ||
        (resultadoB !== null && (!Number.isInteger(resultadoB) || resultadoB < 0))) {
      setError('Los resultados deben ser números enteros no negativos');
      return;
    }

    try {
      setIsSubmittingForm(true);
      setError(null);
      const { success, error } = await onSubmit(resultadoA, resultadoB);
      
      if (!success && error) {
        setError(error);
      }
    } catch (err) {
      console.error('Error al guardar el resultado:', err);
      setError('Error al guardar el resultado. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
            {match.club_a_nombre} vs {match.club_b_nombre}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <div className="font-medium">{match.club_a_nombre}</div>
                </div>
                
                <div className="flex items-center justify-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={resultadoA ?? ''}
                    onChange={(e) => setResultadoA(e.target.value === '' ? null : parseInt(e.target.value))}
                    className="w-16 text-center border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={resultadoB ?? ''}
                    onChange={(e) => setResultadoB(e.target.value === '' ? null : parseInt(e.target.value))}
                    className="w-16 text-center border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
                
                <div className="font-medium">{match.club_b_nombre}</div>
              </div>
              
              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting || isSubmittingForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmittingForm}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting || isSubmittingForm ? 'Guardando...' : 'Guardar resultado'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
