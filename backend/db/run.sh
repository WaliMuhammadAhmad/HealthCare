docker --version
docker pull mcr.microsoft.com/mssql/server:2022-latest
docker run -d --name sql_server_test -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=dockerStrongPwd123' -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
npm --version
npm install -g sql-cli
mssql -u sa -p
# mssql -u sa -p dockerStrongPwd123
