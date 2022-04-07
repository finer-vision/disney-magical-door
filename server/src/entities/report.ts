import { Column, Model, Table } from "sequelize-typescript";

@Table({ tableName: "reports", timestamps: false })
export default class Report extends Model {
  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
