/**
 * Utilitarios para formateo de moneda
 */
export const formatCurrency = (value: number, locale: string = 'es-ES'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'COP', // Cambiar según región
  }).format(value);
};

/**
 * Utilitarios para formateo de fechas
 */
export const formatDate = (date: string | Date, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

/**
 * Utilitarios para validación de datos
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+\d{1,3})?\d{6,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};
