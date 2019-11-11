# Room protocol

This page intends to define how the different clients will communicate inside of Rooms.

The protocol uses a combination of classic REST queries and [Socket.IO](https://socket.io).

## Connection

### Join the Room

Before anything else, the client has to join the Room.
This can be accomplished using the request:

#### Request

| HTTP method | Path                | Body | Response            |
| :---------: | :------------------ | :--- | :------------------ |
|  **POST**   | `/room/{uuid}/join` | -    | [Room state](#Room) |

#### Description

You will join the room and retrieve the current [Room state](#Room).

> If you were not already a member, you will be added as a new one.

### Socket

Once inside of the Room, you have to create a new Socket connection and authenticate.

This can be done in the `connect` callback. You must provide the following payload:

| Key        | Description                                          |
| ---------- | ---------------------------------------------------- |
| `token`    | Your session token (the one you got when logging in) |
| `roomUuid` | The uuid of the room you want to join                |

After the authentication is performed, you will start receiving `Socket Events`.

#### Example

```ts
const API_URL = "your.website.url";
const TOKEN = "your-api-token";
const ROOM_UUID = "The-room-you-just-joined";

const socket = SocketIo(API_URL);

socket.on("connect", () => {
  socket.emit("authenticate", {
    token: TOKEN,
    roomUuid: ROOM_UUID,
  });
});
```

## Room actions

### Music add

Add a new song at the end of the play queue.

| HTTP method | Path                     | Body                          |
| :---------: | :----------------------- | :---------------------------- |
|  **POST**   | `/room/{uuid}/music-add` | [MusicPayload](#MusicPayload) |

#### Behavior

The song will be added at the end of the play queue and a [music_add](#music-added)
event will be broadcasted through the socket.

### Music play

Put the Room in "play mode"

| HTTP method | Path                      | Body |
| :---------: | :------------------------ | :--- |
|  **POST**   | `/room/{uuid}/music-play` | -    |

#### Behavior

If the Room was previously in "pause mode", change its state to "play" and
broadcast a [music_start](#music-started) event.

### Music pause

Put the Room in "pause mode"

| HTTP method | Path                       | Body |
| :---------: | :------------------------- | :--- |
|  **POST**   | `/room/{uuid}/music-pause` | -    |

#### Behavior

If the Room was previously in "play mode", change its state to "pause" and
broadcast a [music_pause](#music-paused) event.

### Music next

Jump to the next music.

| HTTP method | Path                      | Body              |
| :---------: | :------------------------ | :---------------- |
|  **POST**   | `/room/{uuid}/music-next` | `{ uuid: string}` |

#### Behavior

If the next music's uuid matches the provided one and the Room contains
2 songs or more, removes the playing one and starts the next one.

It will then broadcast a [music_next](#music-next-2) event.

> The field `uuid` must be provided to prevent unexpected behaviors. For example,
> if 2 clients ask for `music-next` at the same time, only one will succeed
> and the room will advance to the next song (which is what was expected).

## Socket Events

### User join

A User just joined the Room.

|   Event   | Payload                   |
| :-------: | :------------------------ |
| user_join | [RoomMember](#RoomMember) |

#### Cause

This event can be triggered in 2 cases:

- A new member just joined the room
- A member just re-connected through the Socket

#### Expected behavior

The client is expected to update its current member list by either adding the new
member, or updating the existing one's information.

You can determine if the member is a new one or not by looking at its `id` property.

### User leave

A User just disconnected from the Room.

|   Event    | Payload            |
| :--------: | :----------------- |
| user_leave | `memberId: string` |

#### Cause

The server socket lost connection with the corresponding client.

#### Expected behavior

The client is expected to update its member list by updating the member's status.

You can determine which member it is by looking at its `id` property.

### Music added

A new song was added to the play queue.

|   Event   | Payload                      |
| :-------: | :--------------------------- |
| music_add | [PaylistItem](#PlaylistItem) |

#### Cause

A client just successfully performed a [music-add](#music-add) action.

#### Expected behavior

The client is excepted to add the new song to its play queue.

### Music started

Start the music.

|    Event    | Payload |
| :---------: | :------ |
| music_start | -       |

#### Cause

A client requested the music to be started.

#### Expected behavior

The client is expected to put the Room in a "play" state.

### Music paused

Start the music.

|    Event    | Payload |
| :---------: | :------ |
| music_pause | -       |

#### Cause

A client requested the music to be paused.

#### Expected behavior

The client is expected to put the Room in a "pause" state.

### Music next

Next song in queue.

|   Event    | Payload |
| :--------: | :------ |
| music_next | -       |

#### Cause

A client asked to jump to the next song.

#### Expected behavior

The client is expected to remove the first song of the play queue and to start
playing the next one.

### Exception

A server exception occurred.

|   Event   | Payload           |
| :-------: | :---------------- |
| exception | `message: string` |

#### Cause

An error occurred during the communication. For example, the authentication failed.

#### Expected behavior

The client is expected to communicate the error to the user.

## Types

### RoomMember

Describes a Room member.

```ts
interface RoomMember {
  id: string; // The id of the member (unique)
  name: string; // The name of the member
  isConnected: bool; // `true` if the member is actually connected
}
```

### PlaylistItem

Describes a Playlist item.

```ts
interface PlaylistItem {
  uuid: string; // The unique identifier associated with the item
  videoId: string; // The videoId (for youtube)
  title: string; // The video title
  img: string; // The preview image of the video
  addedBy: string; // The id of the member that added this item
}
```

### Room

Describes a Room.

```ts
interface Room {
  name: string; // The room name
  uuid: string; // The room unique identifier
  members: RoomMember[]; // All room's members
  playlist: {
    items: PlaylistItem[]; // All playlist's items (always contains at least 1)
    isPlaying: boolean; // `true` if the music is actually playing
    playingSince: Date; // The Date at which the song was started
    musicOffset: number; // The offset at which it was started (milliseconds)
  };
}
```

### MusicPayload

Describes a song that shall be added.

```ts
interface MusicPayload {
  video_id: string; // The videoId (for youtube)
  title: string; // The title of the video
  img: string; // The preview image of the video
}
```
