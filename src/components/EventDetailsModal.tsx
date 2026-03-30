import { useState, useEffect } from 'react';
import { supabase, Event, Registration, EventField } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { X, Download, Users, Calendar, MapPin } from 'lucide-react';

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
}

export default function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [customFields, setCustomFields] = useState<EventField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, [event.id]);

  const loadRegistrations = async () => {
    try {
      const [registrationsResult, fieldsResult] = await Promise.all([
        supabase
          .from('registrations')
          .select('*')
          .eq('event_id', event.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('event_fields')
          .select('*')
          .eq('event_id', event.id)
          .order('order_index', { ascending: true }),
      ]);

      if (registrationsResult.error) throw registrationsResult.error;
      if (fieldsResult.error) throw fieldsResult.error;

      setRegistrations(registrationsResult.data || []);
      setCustomFields(fieldsResult.data || []);
    } catch (error) {
      console.error('Error loading registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', ...customFields.map((f) => f.label), 'Registration Date'];
    const rows = registrations.map((reg) => [
      reg.name,
      reg.email,
      reg.phone,
      ...customFields.map((field) => {
        const value = reg.custom_responses?.[field.id];
        if (field.field_type === 'checkbox') {
          return value ? 'Yes' : 'No';
        }
        return value || '';
      }),
      new Date(reg.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.slug}-registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              <p className="text-blue-100 text-sm">{event.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(event.event_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {registrations.length} {t('details.registrations')}
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t('details.registrations')}</h3>
            {registrations.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                <Download className="w-4 h-4" />
                {t('details.exportCSV')}
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-600">{t('common.loading')}</div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">{t('details.noRegistrations')}</p>
              <p className="text-gray-500 text-sm mt-2">
                {t('details.shareLink')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{registration.name}</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{t('details.email')}:</span> {registration.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{t('details.phone')}:</span> {registration.phone}
                        </p>
                        {customFields.length > 0 && registration.custom_responses && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            {customFields.map((field) => {
                              const value = registration.custom_responses?.[field.id];
                              if (!value && value !== false) return null;

                              let displayValue = value;
                              if (field.field_type === 'checkbox') {
                                displayValue = value ? 'Yes' : 'No';
                              }

                              return (
                                <p key={field.id} className="text-sm text-gray-600">
                                  <span className="font-medium">{field.label}:</span> {displayValue}
                                </p>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(registration.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
          >
            {t('event.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
