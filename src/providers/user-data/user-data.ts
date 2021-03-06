
export interface User {
  id: string,
  name: string,
  pictureURL: string,
  authToken: string,
  friends: Friend[],
  totalCount: number,
}

export interface Friend {
  id: string,
  name: string,
}

export interface Player {
  name: string,
  score: number,
}
