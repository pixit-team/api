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
    id: string;
    uuid: string;
    addedBy: ObjectId; // id of the User that added it

    // ...
    // Expand this to include all necessary information (title, description, ...)
}
```

```ts
interface Room {
    name: string;
    members: RoomMembers[];
    playlist: {
        current: {
            item: PlaylistItem,
            playingSince: Date,
            musicOffset: number, // in milliseconds
        },
        nextItems: PlaylistItem[],
        isPlaying: boolean,
    }
}
```

## Connection

- POST {api}/rooms/:uuid/join

  - Room

- "connect"
- "authenticate" -> {token, roomUuid}
  - SERVER_BROADCAST: "user_join" -> {UserMember}

## Music play

- POST {api}/rooms/:uuid/music-play
  - SERVER_BROADCAST: "music_start"

## Music pause

- POST {api}/rooms/:uuid/music-pause
  - SERVER_BROADCAST: "music_pause"

## Music next

- POST {api}/rooms/:uuid/music-next -> {PlaylistItem.uuid}
  - SERVER_BROADCAST: "music_next"

## Music add

- POST {api}/rooms/:uuid/music-add -> {MusicInfo} // musicInfo is used to create a MusicItem
  - SERVER_BROADCAST: "music_add" -> {PlaylistItem}

## Disconnection

SERVER_SEE_DISCONNECTION

- SERVER_BROADCAST: "user_leave" -> {UserMember.id}
