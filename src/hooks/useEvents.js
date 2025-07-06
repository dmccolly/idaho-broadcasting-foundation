import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function useEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let channel;

    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      if (error) {
        console.error('Supabase fetch error:', error);
      } else {
        setEvents(data || []);
      }
    }

    fetchEvents();

    channel = supabase
      .channel('realtime:public:events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      channel && supabase.removeChannel(channel);
    };
  }, []);

  return events;
}
