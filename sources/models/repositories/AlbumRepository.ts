import Album from "../../core/types/Album";
import AlbumMember from "../../core/types/AlbumMember";
import Models from "../Models";
import { AlbumDocument } from "../schemas/AlbumSchema";

export default class AlbumRepository {
  private readonly models: Models;

  constructor(models: Models) {
    this.models = models;
  }

  /**
   * Create a new Album
   *
   * @param album  The Album to create
   *
   * @return  The created Album
   */
  public readonly create = async (album: Album): Promise<AlbumDocument> => {
    return this.models.albumModel.create(album);
  };

  /**
   * Find a specific Album using its `uuid`
   *
   * @param uuid The uuid of the Album to look for
   *
   * @return  The corresponding Album or `null`
   */
  public readonly findOneByUuid = async (
    uuid: string,
  ): Promise<AlbumDocument | null> => {
    return this.models.albumModel.findOne({ uuid }).exec();
  };

  /**
   * Find a specific Albums for user
   *
   * @param email The email of the User
   *
   * @return  The Albums of the user
   */
  public readonly findForUser = async (
    email: string,
  ): Promise<AlbumDocument[]> => {
    return this.models.albumModel.find({ "members.email": email }).exec();
  };

  /**
   * Get all albums
   *
   * @return  All albums
   */
  public readonly getAll = async (): Promise<Album[]> => {
    return this.models.albumModel.find().exec();
  };

  /**
   * Add a user to an Album
   *
   * @param album The Album
   * @param albumMember The albumMember to add to the album
   */
  public readonly addUser = async (
    album: AlbumDocument,
    albumMember: AlbumMember,
  ): Promise<AlbumDocument> => {
    album.members.push(albumMember);
    return album.save();
  };

  /**
   * Remove a user to an Album
   *
   * @param album The Album
   * @param email The email of the user to remove
   */
  public readonly removeUser = async (
    album: AlbumDocument,
    email: string,
  ): Promise<void> => {
    album.members.splice(album.members.findIndex(a => a.email === email), 1);
    await album.save();
  };

  /**
   * Save the new Album state
   *
   * @param album The Album to save
   */
  public readonly saveAlbum = async (
    album: AlbumDocument,
  ): Promise<AlbumDocument> => {
    return album.save();
  };
}
