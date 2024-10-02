import Dexie, { type EntityTable } from "dexie";

export interface OrderItemType {
   code: string;
   amount: number;
   name: string;
   price: number;
}

export interface OrderType {
   id: number;
   table: string;
   status: string;
   start_time: string;
   end_time: string;
   items: Array<OrderItemType>;
}

export interface CafeteriaSchema {
   orders: EntityTable<OrderType, 'id'>
}

export const db = new Dexie('db_01') as Dexie & CafeteriaSchema;

db.version(1).stores({
   orders: '++id, table, status, start_time, end_time'
})