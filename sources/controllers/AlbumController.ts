import Uuid from "uuid/v4";

import { isAlbumMember } from "../core/types/Album";
import AlbumItem from "../core/types/AlbumItem";
import AlbumMember from "../core/types/AlbumMember";
import Repositories from "../models/repositories";
import ApiAlbumContext from "../server/contexts/ApiAlbumContext";
import ApiContext from "../server/contexts/ApiContext";
import Views from "../views";

export default class AlbumController {
  private readonly repositories: Repositories;

  private readonly views: Views;

  constructor(repositories: Repositories, views: Views) {
    this.repositories = repositories;
    this.views = views;
  }

  public readonly createAlbum = async (ctx: ApiContext): Promise<void> => {
    const { requestingUser } = ctx.state;

    const albumName: string =
      ctx.request.body.name ||
      ctx.throw(400, ctx.t("req.album.create.name.missing"));

    const newMember: AlbumMember = {
      id: requestingUser._id,
      name: requestingUser.name,
      email: requestingUser.email,
    };

    // Create new Album
    const createdAlbum = await this.repositories.albumRepository.create({
      uuid: Uuid(),
      name: albumName,
      members: [newMember],
      items: [],
    });

    ctx.status = 201;
    ctx.body = {
      message: "OK",
      album: this.views.albumView.formatAlbum(createdAlbum),
    };
  };

  public readonly getAlbums = async (ctx: ApiContext): Promise<void> => {
    const albums = await this.repositories.albumRepository.getAll();

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      albums: albums.map(album => {
        return this.views.albumView.formatSnippetAlbum(album);
      }),
    };
  };

  public readonly myAlbums = async (ctx: ApiContext): Promise<void> => {
    const { requestingUser } = ctx.state;

    const albums = await this.repositories.albumRepository.findForUser(
      requestingUser.email,
    );

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      albums: albums.map(album => {
        return this.views.albumView.formatSnippetAlbum(album);
      }),
    };
  };

  public readonly getAlbum = async (ctx: ApiAlbumContext): Promise<void> => {
    const { album } = ctx.state;

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      album: this.views.albumView.formatAlbum(album),
    };
  };

  public readonly joinAlbum = async (ctx: ApiAlbumContext): Promise<void> => {
    const { requestingUser, album } = ctx.state;

    // If the User is not already part of the Album, we add him in
    let updatedAlbum = album;
    if (!isAlbumMember(album, requestingUser._id)) {
      const newMember: AlbumMember = {
        id: requestingUser._id,
        name: requestingUser.name,
        email: requestingUser.email,
      };
      updatedAlbum = await this.repositories.albumRepository.addUser(
        album,
        newMember,
      );
    } else {
      ctx.throw(400, ctx.t("req.album.userAlreadyThere"));
      return;
    }

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      album: this.views.albumView.formatAlbum(updatedAlbum),
    };
  };

  public readonly leaveAlbum = async (ctx: ApiAlbumContext): Promise<void> => {
    const { requestingUser, album } = ctx.state;

    if (isAlbumMember(album, requestingUser._id)) {
      await this.repositories.albumRepository.removeUser(
        album,
        requestingUser.email,
      );
    } else {
      ctx.throw(400, ctx.t("req.album.userNotThere"));
      return;
    }

    ctx.status = 204;
    ctx.body = {
      message: "OK",
    };
  };

  public readonly photoAdd = async (ctx: ApiAlbumContext): Promise<void> => {
    const { requestingUser, album } = ctx.state;

    // Validate request's parameters
    const PhotoImg: string =
      ctx.request.body.img ||
      ctx.throw(400, ctx.t("req.album.photoAdd.PhotoImg.missing"));

    // Create new Photo
    const newPhoto: AlbumItem = {
      uuid: Uuid(),
      img: PhotoImg,
      addedBy: requestingUser._id,
    };
    // Add it to the existing list
    album.items.push(newPhoto);

    await this.repositories.albumRepository.saveAlbum(album);

    ctx.status = 200;
    ctx.body = {
      message: "OK",
      photo: newPhoto,
    };
  };

  public readonly photoRemove = async (ctx: ApiAlbumContext): Promise<void> => {
    const { album, requestingUser } = ctx.state;

    // Validate request's parameters
    const photoUuid: string =
      ctx.request.body.uuid ||
      ctx.throw(400, ctx.t("req.album.photoRemove.photoUuid.missing"));

    const photoIdx = album.items.findIndex(i => i.uuid === photoUuid);
    if (album.items[photoIdx].addedBy !== requestingUser.id) {
      ctx.throw(403, ctx.t("req.album.photoRemove.forbidden"));
      return;
    }

    album.items.splice(photoIdx, 1);

    await this.repositories.albumRepository.saveAlbum(album);

    ctx.status = 204;
    ctx.body = {
      message: "OK",
    };
  };
}
