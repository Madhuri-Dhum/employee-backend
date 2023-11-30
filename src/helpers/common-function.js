async function insert(object, table_name, mysql) {
    var insert_columns = [],
      insert_values = [],
      actual_values = [];
    for (var key of Object.keys(object)) {
      insert_columns.push(key);
      insert_values.push("?");
      actual_values.push(object[key]);
    }
    const inserted_data = await mysql(
      "INSERT into " +
        table_name +
        " (" +
        insert_columns.join(",") +
        ") VALUES (" +
        insert_values.join(",") +
        ") ",
      actual_values
    );
    return inserted_data;
  }

  async function update(object, table_id, table_name, mysql) {
    let update_columns = [],
      update_values = [];
    for (var key of Object.keys(object)) {
      update_columns.push(key + " = ?");
      update_values.push(object[key]);
    }
    update_values.push(table_id);
    const inserted_data = await mysql(
      "UPDATE " +
        table_name +
        " SET " +
        update_columns.join(",") +
        " WHERE id = ? ",
      update_values
    );
    return inserted_data;
  }
  
module.exports.insert = insert;
module.exports.update = update;