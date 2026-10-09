/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3364120122")
  const fieldNames = ["quantity", "unitCostSnapshot"]

  for (const fieldName of fieldNames) {
    const field = collection.fields.getByName(fieldName)
    if (field) field.max = 999999999999
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3364120122")
  const fieldNames = ["quantity", "unitCostSnapshot"]

  for (const fieldName of fieldNames) {
    const field = collection.fields.getByName(fieldName)
    if (field?.max === 999999999999) field.max = 0
  }

  return app.save(collection)
})