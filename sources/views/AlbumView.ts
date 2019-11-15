import AlbumItem from "../core/types/AlbumItem";
import { AlbumDocument } from "../models/schemas/AlbumSchema";

export default class AlbumView {
  public readonly formatSnippetAlbum = (album: AlbumDocument): object => {
    return {
      uuid: album.uuid,
      name: album.name,
      nb_members: album.members.length,
      nb_items: album.items.length,
    };
  };

  public readonly formatAlbum = (album: AlbumDocument): object => {
    return {
      uuid: album.uuid,
      name: album.name,
      members: album.members.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
      })),
      items: album.items.map(AlbumView.formatAlbumItem),
    };
  };

  private static readonly formatAlbumItem = (albumItem: AlbumItem): object => {
    return {
      uuid: albumItem.uuid,
      img: albumItem.img,
      addedBy: albumItem.addedBy,
    };
  };
}
