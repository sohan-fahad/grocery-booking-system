import { TableColumnOptions } from 'typeorm';

export enum ENUM_TABLE_NAMES {
  USERS = 'users',
  GROCERY_ITEMS = 'grocery_items',
  INVENTORY_UPDATE_CIRCULARS = 'inventory_update_circulars',
  INVENTORY_UPDATE_CIRCULAR_ITEMS = 'inventory_update_circular_items',
  ORDERS = 'orders',
  ORDER_ITEMS = 'order_items',
  FILE_STORAGES = 'file_storages',
  CATEGORIES = 'categories',
}

export enum ENUM_SEQUENCE {

}

export enum ENUM_COLUMN_TYPES {
  UUID = 'uuid',
  INT = 'int',
  FLOAT = 'float',
  TEXT = 'text',
  VARCHAR = 'varchar',
  BOOLEAN = 'boolean',
  TIMESTAMP_UTC = 'timestamp without time zone',
  ENUM = 'enum',
  JSONB = 'jsonb',
}

export const defaultDateTimeColumns: TableColumnOptions[] = [
  {
    name: 'createdAt',
    type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC,
    default: 'NOW()',
    isNullable: true,
  },
  {
    name: 'updatedAt',
    type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC,
    isNullable: true,
  },
  {
    name: 'deletedAt',
    type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC,
    isNullable: true,
  },
];

export const defaultColumns: TableColumnOptions[] = [
  {
    name: 'createdBy',
    type: ENUM_COLUMN_TYPES.UUID,
    isNullable: true,
  },
  {
    name: 'updatedBy',
    type: ENUM_COLUMN_TYPES.UUID,
    isNullable: true,
  },
  {
    name: 'deletedBy',
    type: ENUM_COLUMN_TYPES.UUID,
    isNullable: true,
  },
  {
    name: 'isActive',
    type: ENUM_COLUMN_TYPES.BOOLEAN,
    isNullable: true,
    default: true,
  },
];
