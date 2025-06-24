import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function useAssignments() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let channel;

    async function fetchRows() {
      const { data, error } = await supabase.from('assignments').select('*');
      if (!error) setRows(data);
    }
    fetchRows();

    channel = supabase
      .channel('realtime:public:assignments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assignments' },
        payload => {
          setRows(prev => {
            const next = prev.filter(r => r.id !== payload.new.id);
            next.push(payload.new);
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      channel && supabase.removeChannel(channel);
    };
  }, []);

  return rows;
}
