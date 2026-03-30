import { useState, useEffect } from 'react';
import { supabase, Event, EventField } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

interface EventRegistrationPageProps {
  slug: string;
}

export default function EventRegistrationPage({ slug }: EventRegistrationPageProps) {
  const { t } = useTranslation();
  const [event, setEvent] = useState<Event | null>(null);
  const [customFields, setCustomFields] = useState<EventField[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [customResponses, setCustomResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    loadEvent();
  }, [slug]);

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      setEvent(data);

      if (data) {
        const { data: fieldsData, error: fieldsError } = await supabase
          .from('event_fields')
          .select('*')
          .eq('event_id', data.id)
          .order('order_index', { ascending: true });

        if (fieldsError) throw fieldsError;
        setCustomFields(fieldsData || []);
      }
    } catch (err) {
      console.error('Error loading event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    for (const field of customFields) {
      if (field.required && !customResponses[field.id]) {
        setError(`${field.label} is required`);
        return;
      }
    }

    setSubmitting(true);

    try {
      if (!event) throw new Error('Event not found');

      const { error: insertError } = await supabase.from('registrations').insert({
        event_id: event.id,
        ...formData,
        custom_responses: customResponses,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '' });
      setCustomResponses({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">{t('registration.loadingEvent')}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('registration.eventNotFound')}</h1>
          <p className="text-gray-600">
            {t('registration.invalidLink')}
          </p>
        </div>
      </div>
    );
  }

  if (event.status === 'closed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
          <p className="text-gray-600">
            {t('registration.registrationClosed')}
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('registration.registrationSuccessful')}</h1>
          <p className="text-gray-600 mb-6">
            {t('registration.thankYou', { eventTitle: event.title })}
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {t('registration.registerAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
        {event.poster_url && (
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={event.poster_url}
              alt={event.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white">
          <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
          <p className="text-blue-100 mb-6 leading-relaxed">{event.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(event.event_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('registration.registerForEvent')}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('registration.fullName')}
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('registration.email')}
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('registration.phone')}
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {customFields.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  {customFields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.field_type === 'text' && (
                        <input
                          type="text"
                          value={customResponses[field.id] || ''}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          required={field.required}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      )}

                      {field.field_type === 'number' && (
                        <input
                          type="number"
                          value={customResponses[field.id] || ''}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          required={field.required}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      )}

                      {field.field_type === 'dropdown' && (
                        <select
                          value={customResponses[field.id] || ''}
                          onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                          required={field.required}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        >
                          <option value="">Select an option</option>
                          {field.options?.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {field.field_type === 'checkbox' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={customResponses[field.id] || false}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.checked)}
                            required={field.required}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl"
            >
              {submitting ? t('registration.submitting') : t('registration.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
