import {
  AfterUpdate,
  Column,
  Default,
  Index,
  Model,
  Table,
} from "sequelize-typescript";
import adminData from "../services/admin-data";

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

  @Default(false)
  @Index({ name: "codesWinnerIndex" })
  @Column
  winner: boolean;

  @Default(null)
  @Index({ name: "codesUsedAtIndex" })
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
