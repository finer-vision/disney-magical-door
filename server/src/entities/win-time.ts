import {
  AfterUpdate,
  AllowNull,
  Column,
  Default,
  Index,
  Model,
  Table,
} from "sequelize-typescript";
import adminData from "../services/admin-data";

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

  @AfterUpdate
  static async emitUpdate() {
    try {
      const { socket } = await import("../services/app");
      socket.emit("update", await adminData());
    } catch (err) {
      console.error(err);
    }
  }
}
