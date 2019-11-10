# Room protocol

```ts
interface RoomMember {
  id: ObjectId;
  name: string;
  isConnected: bool;
}
```

```ts
interface PlaylistItem {
  videoId: string;
  uuid: string;
  addedBy: ObjectId; // id of the User that added it

  // ...
  // Expand this to include all necessary information (title, description, ...)
}
```

```ts
export default interface Room {
  name: string;
  uuid: string;
  members: RoomMember[];
  playlist: {
    items: PlaylistItem[];
    isPlaying: boolean;
    playingSince: Date;
    musicOffset: number; // in milliseconds
  };
}
```

## Connection

- POST {api}/rooms/:uuid/join

  - Room

- "connect"
- "authenticate" -> {token, roomUuid}
  - SERVER_BROADCAST: "user_join" -> {UserMember}

## Music add

- POST {api}/rooms/:uuid/music-add -> {MusicInfo} // musicInfo is { video_id: "xXxXx", + all additional info }
  - SERVER_BROADCAST: "music_add" -> {PlaylistItem}

## Music play

- POST {api}/rooms/:uuid/music-play
  - SERVER_BROADCAST: "music_start"

## Music pause

- POST {api}/rooms/:uuid/music-pause
  - SERVER_BROADCAST: "music_pause"

## Music next

- POST {api}/rooms/:uuid/music-next -> {PlaylistItem.uuid}
  - SERVER_BROADCAST: "music_next"

## Disconnection

SERVER_SEE_DISCONNECTION

- SERVER_BROADCAST: "user_leave" -> {UserMember.id}
