const fetchHello = (): Promise<string> => fetch('/api/v1/hello')
  .then((response) => response.text());

export default fetchHello;
