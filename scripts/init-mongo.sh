#!/bin/bash
echo "⏳ Waiting for MongoDB nodes to be ready..."
sleep 5

echo "⚙️ Initiating replica set..."
mongosh --host mongo1:27017 <<EOF
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})
EOF

echo "⏳ Waiting for PRIMARY election..."

while true; do
  STATUS=$(mongosh --quiet --host mongo1:27017 --eval "rs.isMaster().ismaster")
  if [[ "$STATUS" == "true" ]]; then
    echo "✅ PRIMARY is ready!"
    break
  fi
  echo "⏳ Still waiting..."
  sleep 2
done

echo "📥 Seeding database with sample data..."

# Use replica set URI (AUTO-SELECT PRIMARY)
URI="mongodb://mongo1:27017,mongo2:27017,mongo3:27017/shoes_shop?replicaSet=rs0"

echo "Importing variants..."
mongoimport \
  --uri "$URI" \
  --collection variants \
  --jsonArray \
  --file /data/shoesShop.variants.json \
  --writeConcern '{w: "majority"}'

echo "Importing products..."
mongoimport \
  --uri "$URI" \
  --collection products \
  --jsonArray \
  --file /data/shoesShop.products.json \
  --writeConcern '{w: "majority"}'

echo "Importing categories..."
mongoimport \
  --uri "$URI" \
  --collection categories \
  --jsonArray \
  --file /data/shoesShop.categories.json \
  --writeConcern '{w: "majority"}'

echo "Importing coupons..."
mongoimport \
  --uri "$URI" \
  --collection coupons \
  --jsonArray \
  --file /data/shoesShop.coupons.json \
  --writeConcern '{w: "majority"}'

echo "Importing orders..."
mongoimport \
  --uri "$URI" \
  --collection orders \
  --jsonArray \
  --file /data/shoesShop.orders.json \
  --writeConcern '{w: "majority"}'

echo "Importing users..."
mongoimport \
  --uri "$URI" \
  --collection users \
  --jsonArray \
  --file /data/shoesShop.users.json \
  --writeConcern '{w: "majority"}'

echo "Importing visits..."
mongoimport \
  --uri "$URI" \
  --collection visits \
  --jsonArray \
  --file /data/shoesShop.visits.json \
  --writeConcern '{w: "majority"}'

echo "MongoDB seed completed!"
