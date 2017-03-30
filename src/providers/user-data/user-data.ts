
export interface User {
  id: string,
  name: string,
  pictureURL: string,
  friends: Friend[],
}

export interface Friend {
  id: string,
  name: string,
}
