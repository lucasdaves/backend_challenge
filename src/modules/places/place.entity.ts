import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity("places")
@Unique(["country", "city"])
export class Place {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false })
  country: string;

  @Column({ type: "varchar", nullable: false })
  city: string;

  @Column({ type: "datetime", nullable: false })
  goal: Date;

  @Column({ type: "varchar", name: "image_url", nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
