import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @Index({ unique: true })
  public email: string;

  constructor(data?: UserData) {
    this.id = (data && data.id) || 0;
    this.email = (data && data.email) || "";
  }
}

type UserData = {
  id: number;
  email: string;
};
