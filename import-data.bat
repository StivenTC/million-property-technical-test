@echo off

echo.
echo [INFO] Waiting for MongoDB to be ready...
timeout /t 5 /nobreak > NUL

echo.
echo [INFO] Importing Owner data...
docker exec mongo_db mongoimport --db MillionRealEstate --collection Owner --file /data/Owner.json --jsonArray

echo.
echo [INFO] Importing Property data...
docker exec mongo_db mongoimport --db MillionRealEstate --collection Property --file /data/Property.json --jsonArray

echo.
echo [INFO] Importing PropertyImage data...
docker exec mongo_db mongoimport --db MillionRealEstate --collection PropertyImage --file /data/PropertyImage.json --jsonArray

echo.
echo [INFO] Importing PropertyTrace data...
docker exec mongo_db mongoimport --db MillionRealEstate --collection PropertyTrace --file /data/PropertyTrace.json --jsonArray

echo.
echo [SUCCESS] Data import complete.
pause
