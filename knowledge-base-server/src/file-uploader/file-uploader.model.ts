import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'knowledge-base' })
export class Files extends Model {
    @Column
    filename_id: string;

    @Column
    filename_name: string;
}