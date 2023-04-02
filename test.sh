echo "------------------------------------------"
echo "Running unit tests..."
echo "------------------------------------------"

jest src

echo "------------------------------------------"
echo "Starting up DB..."
echo "------------------------------------------"

docker-compose up -d

echo "------------------------------------------"
echo "Running DB migrations..."
echo "------------------------------------------"

npx prisma migrate dev --name init

echo "------------------------------------------"
echo "Running integration tests..."
echo "------------------------------------------"

jest integration-tests/
