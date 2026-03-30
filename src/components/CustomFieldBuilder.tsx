import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { FieldType } from '../lib/supabase';

export interface CustomFieldData {
  id: string;
  label: string;
  field_type: FieldType;
  required: boolean;
  options: string[];
  order_index: number;
}

interface CustomFieldBuilderProps {
  fields: CustomFieldData[];
  onChange: (fields: CustomFieldData[]) => void;
}

export default function CustomFieldBuilder({ fields, onChange }: CustomFieldBuilderProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  const addField = () => {
    const newField: CustomFieldData = {
      id: `temp-${Date.now()}`,
      label: '',
      field_type: 'text',
      required: false,
      options: [],
      order_index: fields.length,
    };
    onChange([...fields, newField]);
    setEditingField(newField.id);
  };

  const updateField = (id: string, updates: Partial<CustomFieldData>) => {
    onChange(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id).map((field, index) => ({
      ...field,
      order_index: index,
    })));
  };

  const addOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      updateField(fieldId, {
        options: [...field.options, ''],
      });
    }
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      updateField(fieldId, { options: newOptions });
    }
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field) {
      updateField(fieldId, {
        options: field.options.filter((_, index) => index !== optionIndex),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Custom Form Fields</h3>
        <button
          type="button"
          onClick={addField}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Add Field
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-sm">No custom fields yet. Click "Add Field" to create one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <GripVertical className="w-5 h-5 text-gray-400 mt-2 flex-shrink-0" />

                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Field Label
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        placeholder="e.g., Company Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Field Type
                      </label>
                      <select
                        value={field.field_type}
                        onChange={(e) => updateField(field.id, { field_type: e.target.value as FieldType })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>
                  </div>

                  {field.field_type === 'dropdown' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Dropdown Options
                      </label>
                      <div className="space-y-2">
                        {field.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(field.id, optionIndex)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(field.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`required-${field.id}`}
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`required-${field.id}`} className="text-sm text-gray-700">
                      Required field
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
