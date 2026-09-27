/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  collection.fields.addAt(collection.fields.length, new Field({
    "autogeneratePattern": "",
    "help": "Original email preserved after logical deletion.",
    "hidden": true,
    "id": "text1790526763",
    "max": 254,
    "min": 0,
    "name": "deletedEmail",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  collection.fields.removeById("text1790526763")

  return app.save(collection)
})