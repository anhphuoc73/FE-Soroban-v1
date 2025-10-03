import {useCallback, useMemo, useState} from 'react';

// ----------------------------------------------------------------------

export function useTabs(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  return useMemo(() => ({value, setValue, onChange}), [onChange, value]);
}
