import { Column, Default, Index, Model, Table } from "sequelize-typescript";

@Table({ tableName: "codes", timestamps: false })
export default class Code extends Model {
  @Index({ name: "codesCodeIndex", unique: true })
  @Column
  code: string;

  @Default(false)
  @Index({ name: "codesUsedIndex" })
  @Column
  used: boolean;

  @Default(false)
  @Index({ name: "codesGuaranteedWinIndex" })
  @Column
  guaranteedWin: boolean;
}
