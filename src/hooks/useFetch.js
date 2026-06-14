import { useEffect, useState } from "react";

export function useFetch(url) {
  const [state, setState] = useState({ loading: true, error: false, data: null });

  useEffect(() => {
    if (!url) return;
    setState({ loading: true, error: false, data: null });

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setState({ loading: false, error: false, data }))
      .catch(() => setState({ loading: false, error: true, data: null }));
  }, [url]);

  return state;
}