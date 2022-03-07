import {
  AllowNull,
  Column,
  Default,
  Index,
  Model,
  Table,
} from "sequelize-typescript";

@Table({ tableName: "winTimes", timestamps: false })
export default class WinTime extends Model {
  @Default(false)
  @Index({ name: "winTimesUsedIndex" })
  @Column
  used: boolean;

  @AllowNull(false)
  @Index({ name: "winTimesTimestampIndex" })
  @Column
  timestamp: Date;

  @Default(null)
  @Index({ name: "winTimesUsedAtIndex" })
  @Column
  usedAt: Date;
}
