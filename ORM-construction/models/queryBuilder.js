import pool from "../db/config.js";

class QueryBuilderError extends Error {
  constructor(message) {
    super(message);
    this.name = "QueryBuilderError";
  }
}

export class QueryBuilder {
  constructor(table) {
    this.table = table;

    // internal state
    this._mainCondition = null;
    this._conditions = [];
    this._selectedFields = [];
    this._limitVal = null;

    // flags
    this._selectCalled = false; //becomes true after select() is called
    this._whereSet = false; //becomes true after where() is called
  }

  /*-----PUBLIC API------*/

  select(...fields) {
    if (this._selectCalled) {
      throw new QueryBuilderError(
        "select() was already called on this query. Start a new query to change selected fields."
      );
    }
    this._selectCalled = true;

    this._selectedFields = fields;
    return this;
  }

  where(field, op, val) {
    let operator, value;
    if (val === undefined) {
      operator = "=";
      value = op;
    } else {
      operator = op;
      value = val;
    }
    this._mainCondition = { field, operator, value };
    this._whereSet = true;
    return this;
  }

  andWhere(field, op, val) {
    if (!this._whereSet) {
      throw new QueryBuilderError(
        "Cannot call andWhere() before where(). Use where() first."
      );
    }

    let operator, value;
    if (val === undefined) {
      operator = "=";
      value = op;
    } else {
      operator = op;
      value = val;
    }
    this._conditions.push({ field, operator, value, connector: "AND" });
    return this;
  }

  orWhere(field, op, val) {
    if (!this._whereSet) {
      throw new QueryBuilderError(
        "Cannot call orWhere() before where(). Use where() first."
      );
    }

    let operator, value;
    if (val === undefined) {
      operator = "=";
      value = op;
    } else {
      operator = op;
      value = val;
    }
    this._conditions.push({ field, operator, value, connector: "OR" });
    return this;
  }

  limit(value) {
    const num = Number(value);
    if (!Number.isFinite(num) || !Number.isInteger(num) || num <= 0) {
      throw new QueryBuilderError("limit() expects a positive integer.");
    }
    this._limitVal = num;
    return this;
  }

  async get() {
    const fields =
      this._selectedFields.length > 0 ? this._selectedFields.join(", ") : "*";
    let command = `SELECT ${fields} FROM ${this.table}`;

    if (this._mainCondition != null) {
      const { field, operator, value } = this._mainCondition;
      command += ` WHERE ${field} ${operator} ${value}`;
    }

    this._conditions.forEach(({ field, operator, value, connector }) => {
      command += ` ${connector} ${field} ${operator} ${value}`;
    });

    if (this._limitVal != null) {
      command += ` LIMIT ${this._limitVal}`;
    }

    const [rows] = await pool.query(command);
    return rows;
  }
}
