# Setup file to upload data to MongoDB Atlas
mongosh "mongodb+srv://a-krishnakundan:akk-cluster-1@qkart-node.uuiyeot.mongodb.net/qkart?retryWrites=true&w=majority" --eval "db.dropDatabase()"
mongoimport --uri="mongodb+srv://a-krishnakundan:akk-cluster-1@qkart-node.uuiyeot.mongodb.net/qkart?retryWrites=true&w=majority" -c users --file data/export_qkart_users.json
mongoimport --uri="mongodb+srv://a-krishnakundan:akk-cluster-1@qkart-node.uuiyeot.mongodb.net/qkart?retryWrites=true&w=majority" -c products --file data/export_qkart_products.json