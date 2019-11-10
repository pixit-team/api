import { ObjectId } from "bson";

import PlaylistItem from "../../core/types/PlaylistItem";
import Room from "../../core/types/Room";
import RoomMember from "../../core/types/RoomMember";
import Models from "../Models";
import { RoomDocument } from "../schemas/RoomSchema";

export default class RoomRepository {
  private readonly models: Models;

  constructor(models: Models) {
    this.models = models;
  }

  /**
   * Create a new Room
   *
   * @param room  The Room to create
   *
   * @return  The created Room
   */
  public readonly create = async (room: Room): Promise<RoomDocument> => {
    return this.models.roomModel.create(room);
  };

  /**
   * Find a specific Room using its `uuid`
   *
   * @param uuid The uuid of the Room to look for
   *
   * @return  The corresponding Room or `null`
   */
  public readonly findOneByUuid = async (
    uuid: string,
  ): Promise<RoomDocument | null> => {
    return this.models.roomModel.findOne({ uuid }).exec();
  };

  /**
   * Get all rooms
   *
   * @return  All rooms
   */
  public readonly getAll = async (): Promise<Room[]> => {
    return this.models.roomModel.find().exec();
  };

  /**
   * Add a user to a Room
   *
   * @param room The Room
   * @param roomMember The roomMember to add to the room
   */
  public readonly addUser = async (
    room: RoomDocument,
    roomMember: RoomMember,
  ): Promise<RoomDocument> => {
    room.members.push(roomMember);
    return room.save();
  };

  /**
   * Update a roomMember' status
   *
   * @param room The Room
   * @param memberId The id of the roomMember
   * @param isConnected The new status
   */
  public readonly setMemberStatus = async (
    room: RoomDocument,
    memberId: ObjectId,
    isConnected: boolean,
  ): Promise<RoomDocument> => {
    const memberIdx = room.members.findIndex(m => memberId.equals(m.id));
    if (memberIdx === -1) {
      throw new Error("Member not in Room");
    }

    room.members = room.members.map((m, idx) => {
      if (idx !== memberIdx) {
        return m;
      }

      return {
        ...m,
        isConnected,
      };
    });

    return room.save();
  };

  /**
   * Add a Music to a Room
   *
   * @param room The Room
   * @param playlistItem The playlistItem to add in the playlist
   */
  public readonly addMusic = async (
    room: RoomDocument,
    playlistItem: PlaylistItem,
  ): Promise<void> => {
    room.playlist.nextItems.push(playlistItem);
    await room.save();
  };
}
