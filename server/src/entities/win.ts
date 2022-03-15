import {
  AfterCreate,
  Column,
  Default,
  Index,
  Model,
  Table,
} from "sequelize-typescript";
import adminData from "../services/admin-data";

@Table({ tableName: "wins", timestamps: false })
export default class Code extends Model {
  @Index({ name: "winCodeIndex" })
  @Column
  code: string;

  @Default(false)
  @Index({ name: "winGuaranteedWinIndex" })
  @Column
  guaranteedWin: boolean;

  @Default(null)
  @Index({ name: "winUsedAtIndex" })
  @Column
  usedAt: Date;

  @AfterCreate
  static async emitUpdate() {
    try {
      const { socket } = await import("../services/app");
      socket.emit("update", await adminData());
    } catch (err) {
      console.error(err);
    }
  }
}
