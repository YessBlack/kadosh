/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  collection.fields.addAt(collection.fields.length, new Field({
    "help": "Authorization role assigned to the user.",
    "hidden": false,
    "id": "select1790530818",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": ["admin", "vendedor", "inventario"]
  }))

  app.save(collection)

  const batchSize = 200
  let offset = 0

  while (true) {
    const records = app.findRecordsByFilter(collection.id, "id != ''", "id", batchSize, offset)
    if (records.length === 0) break

    for (const record of records) {
      if (!record.getString("role")) {
        record.set("role", "vendedor")
        app.save(record)
      }
    }

    offset += records.length
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")
  collection.fields.removeById("select1790530818")

  return app.save(collection)
})