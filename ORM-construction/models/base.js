import { QueryBuilder } from "./queryBuilder.js"

export class BaseModel {
  table = null;

  query() {
    return new QueryBuilder(this.table)
  }
}