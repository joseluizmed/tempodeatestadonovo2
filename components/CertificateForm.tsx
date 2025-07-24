import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MedicalCertificate, DateInputType } from '../types';
import { parseDateString, addDays, differenceInDays, formatDate, formatInputDate } from '../utils/dateUtils';

interface CertificateFormProps {
  onSaveCertificate: (
    certificateData: Omit<MedicalCertificate, 'id' | 'displayId' | 'status'>,
    editingId: string | null
  ) => void;
  editingCertificate: MedicalCertificate | null;
  onCancelEdit: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ onSaveCertificate, editingCertificate, onCancelEdit }) => {
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');
  const [daysOffStr, setDaysOffStr] = useState('');
  const [inputType, setInputType] = useState<DateInputType>(DateInputType.END_DATE);
  const [error, setError] = useState<string | null>(null);

  const startDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCertificate) {
      setStartDateStr(formatDate(editingCertificate.startDate));
      if (editingCertificate.originalDaysString !== undefined) {
        setInputType(DateInputType.DAYS_OFF);
        setDaysOffStr(editingCertificate.originalDaysString);
        setEndDateStr('');
      } else if (editingCertificate.originalEndDateString !== undefined) {
        setInputType(DateInputType.END_DATE);
        setEndDateStr(editingCertificate.originalEndDateString);
        setDaysOffStr('');
      } else { // Fallback if somehow original strings are missing
        setInputType(DateInputType.END_DATE);
        setEndDateStr(formatDate(editingCertificate.endDate));
        setDaysOffStr('');
      }
      setError(null);
      startDateInputRef.current?.focus();
    } else {
      // Reset form for new entry when not editing or when editing is cancelled/finished
      setStartDateStr('');
      setEndDateStr('');
      setDaysOffStr('');
      setInputType(DateInputType.END_DATE); 
      setError(null);
      // For a brand new certificate, focus can be set by the calling component or after add
    }
  }, [editingCertificate]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDateStr(formatInputDate(e.target.value));
    setError(null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDateStr(formatInputDate(e.target.value));
    if (inputType === DateInputType.END_DATE) setDaysOffStr('');
    setError(null);
  };

  const handleDaysOffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow only numbers
    setDaysOffStr(value);
    if (inputType === DateInputType.DAYS_OFF) setEndDateStr('');
    setError(null);
  };
  
  const handleSubmit = useCallback(() => {
    setError(null);
    const startDate = parseDateString(startDateStr);
    if (!startDate) {
      setError("Data de Início inválida. Use DD/MM/AAAA.");
      startDateInputRef.current?.focus();
      return;
    }

    let endDate: Date | null = null;
    let days = 0;

    if (inputType === DateInputType.END_DATE) {
      endDate = parseDateString(endDateStr);
      if (!endDate) {
        setError("Data de Término inválida. Use DD/MM/AAAA.");
        return;
      }
      if (endDate < startDate) {
        setError("Data de Término não pode ser anterior à Data de Início.");
        return;
      }
      days = differenceInDays(startDate, endDate) + 1;
    } else {
      days = parseInt(daysOffStr, 10);
      if (isNaN(days) || days <= 0) {
        setError("Número de Dias de Afastamento inválido.");
        return;
      }
      endDate = addDays(startDate, days - 1);
    }

    onSaveCertificate(
      { 
        startDate, 
        endDate, 
        days,
        originalStartDateString: startDateStr,
        originalEndDateString: inputType === DateInputType.END_DATE ? endDateStr : undefined,
        originalDaysString: inputType === DateInputType.DAYS_OFF ? daysOffStr : undefined,
      },
      editingCertificate ? editingCertificate.id : null
    );
    
    // If not editing (i.e., adding a new one), clear form and focus.
    // If editing, onSaveCertificate callback in App.tsx will call onCancelEdit, which resets editingCertificate,
    // and then the useEffect in this component will clear the form.
    if (!editingCertificate) {
        setStartDateStr('');
        setEndDateStr('');
        setDaysOffStr('');
        setError(null);
        startDateInputRef.current?.focus(); 
    } else {
      // For edits, the parent component handles exiting edit mode, which triggers useEffect here.
    }

  }, [startDateStr, endDateStr, daysOffStr, inputType, onSaveCertificate, editingCertificate]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form id="certificate-form-section" className="bg-white p-6 shadow-lg rounded-lg border border-gray-200" onSubmit={handleFormSubmit}>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">
        {editingCertificate ? 'Editar Atestado' : 'Adicionar Atestado'}
      </h2>
      {error && <p className="text-red-500 text-sm mb-4 bg-red-100 p-3 rounded">{error}</p>}
      
      <div className="mb-4">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Início (DD/MM/AAAA)</label>
        <input
          type="text"
          id="startDate"
          ref={startDateInputRef}
          value={startDateStr}
          onChange={handleStartDateChange}
          placeholder="DD/MM/AAAA"
          maxLength={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-2">
          <label className="flex items-center">
            <input 
              type="radio" 
              name="inputType" 
              value={DateInputType.END_DATE} 
              checked={inputType === DateInputType.END_DATE} 
              onChange={() => setInputType(DateInputType.END_DATE)}
              className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-sm text-gray-700">Data de Término</span>
          </label>
          <label className="flex items-center">
            <input 
              type="radio" 
              name="inputType" 
              value={DateInputType.DAYS_OFF}
              checked={inputType === DateInputType.DAYS_OFF}
              onChange={() => setInputType(DateInputType.DAYS_OFF)}
              className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-sm text-gray-700">Dias de Afastamento</span>
          </label>
        </div>

        {inputType === DateInputType.END_DATE ? (
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Término (DD/MM/AAAA)</label>
            <input
              type="text"
              id="endDate"
              value={endDateStr}
              onChange={handleEndDateChange}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="daysOff" className="block text-sm font-medium text-gray-700 mb-1">Dias de Afastamento</label>
            <input
              type="text"
              id="daysOff"
              value={daysOffStr}
              onChange={handleDaysOffChange}
              placeholder="Ex: 5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-105"
      >
        {editingCertificate ? 'Salvar Alterações' : '+ Adicionar'}
      </button>
      {editingCertificate && (
        <button
          type="button"
          onClick={onCancelEdit}
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Cancelar Edição
        </button>
      )}
    </form>
  );
};

export default CertificateForm;