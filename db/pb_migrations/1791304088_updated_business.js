/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1218262561")

  // update collection data
  unmarshal({
    "name": "businesses"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1218262561")

  // update collection data
  unmarshal({
    "name": "business"
  }, collection)

  return app.save(collection)
})
