type HelloMessage = {
  message: string;
}

const fetchHello = (): Promise<HelloMessage> => fetch('/api/v1/hello')
  .then((response) => response.json());

export default fetchHello;
