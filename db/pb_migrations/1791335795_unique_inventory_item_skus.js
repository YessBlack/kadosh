/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1406054367")
  const records = []
  let offset = 0

  while (true) {
    const batch = app.findRecordsByFilter(collection.id, "id != ''", "createdAt,id", 200, offset)
    records.push(...batch)
    if (batch.length < 200) break
    offset += batch.length
  }

  const nextNumbers = { PRD: 0, SRV: 0 }
  for (const record of records) {
    const prefix = record.getString("type") === "PRODUCT" ? "PRD" : "SRV"
    const match = record.getString("sku").trim().match(new RegExp(`^${prefix}-(\\d+)$`, "i"))
    if (match) nextNumbers[prefix] = Math.max(nextNumbers[prefix], Number(match[1]))
  }

  const seenSkus = new Set()
  for (const record of records) {
    let sku = record.getString("sku").trim()
    if (!sku || seenSkus.has(sku.toLowerCase())) {
      const prefix = record.getString("type") === "PRODUCT" ? "PRD" : "SRV"
      let candidate
      do {
        nextNumbers[prefix] += 1
        candidate = `${prefix}-${String(nextNumbers[prefix]).padStart(3, "0")}`
      } while (seenSkus.has(candidate.toLowerCase()))

      sku = candidate
      record.set("sku", sku)
      app.save(record)
    }

    seenSkus.add(sku.toLowerCase())
  }

  const uniqueSkuIndex = "CREATE UNIQUE INDEX `idx_inventory_items_sku_unique` ON `inventory_items` (`sku` COLLATE NOCASE)"
  if (!collection.indexes.some(index => index.includes("idx_inventory_items_sku_unique"))) {
    collection.indexes = [...collection.indexes, uniqueSkuIndex]
  }

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1406054367")
  collection.indexes = collection.indexes.filter(index => !index.includes("idx_inventory_items_sku_unique"))
  return app.save(collection)
})