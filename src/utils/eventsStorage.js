export const loadEvents = () => {
  if (typeof localStorage === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('ibf-events') || '[]');
  } catch {
    return [];
  }
};

export const saveEvents = (events) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('ibf-events', JSON.stringify(events));
  }
};
