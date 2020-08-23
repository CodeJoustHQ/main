const fetchHello = (): Promise<string> => fetch('/api/hello')
  .then((response) => response.text());

export default fetchHello;
