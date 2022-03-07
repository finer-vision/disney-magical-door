import { Column, Default, Index, Model, Table } from "sequelize-typescript";

@Table({ tableName: "codes", timestamps: false })
export default class Code extends Model {
  @Index({ name: "codeIndex", unique: true })
  @Column
  code: string;

  @Default(false)
  @Column
  used: boolean;

  @Default(null)
  @Column
  usedAt: Date;
}
