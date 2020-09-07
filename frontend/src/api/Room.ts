export type CreateRoomResponse = {
  message: string,
  roomId: string;
};

export type JoinRoomRequest = {
  roomId: string;
};

export type JoinRoomResponse = {
  message: string,
  roomId: string;
  playerName: string;
};

const basePath = '/api/v1/rooms';
const routes = {
  createRoom: `${basePath}/`,
  joinRoom: `${basePath}/`,
};

const jsonHeader = {
  'Content-Type': 'application/json',
};

export const createRoom = (): Promise<CreateRoomResponse> => fetch(routes.createRoom, {
  method: 'POST',
  headers: jsonHeader,
})
  .then((res) => {
    // TODO: switch to axios, add error handling (search React + TypeScript API error handling)
    // return type CRR | Error, then have ErrorPopup component if error
    if (res.status === 204) {
      return res.json();
    }
    return null;
  })
  .catch((error) => {
    console.log('Request failed', error);
  });
