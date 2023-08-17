#!/bin/bash

MYSQL_USER=${user_name}
MYSQL_PASSWORD=${password}
DB_SCHEMA=${db_schema}
#  this command updates all packages to the latest version
sudo yum update -y 

# this command installs MySQL server on your machine, it also creates a systemd service
sudo wget https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm
sudo dnf install mysql80-community-release-el9-1.noarch.rpm -y
sudo dnf install mysql-community-server -y

# this command enables the service created in previous step
sudo systemctl start mysqld
sudo systemctl enable mysqld

TMP_PASSWORD=$(sudo grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}')

# Set account
echo "$MYSQL_PASSWORD" | mysql -u root -p"$TMP_PASSWORD" --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"

echo "[mysqld]" | sudo tee -a /etc/my.cnf
echo "bind-address = 0.0.0.0" | sudo tee -a /etc/my.cnf

# Create new account
sudo mysql -u root -p"$MYSQL_PASSWORD" -e "CREATE USER '$MYSQL_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"
sudo mysql -u root -p"$MYSQL_PASSWORD" -e "GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER'@'localhost' WITH GRANT OPTION;"
sudo mysql -u root -p"$MYSQL_PASSWORD" -e " CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';"
sudo mysql -u root -p"$MYSQL_PASSWORD" -e "GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER'@'%' WITH GRANT OPTION;"
sudo mysql -u root -p"$MYSQL_PASSWORD" -e "FLUSH PRIVILEGES;"

# Create schema
sudo mysql -u root -p"$MYSQL_PASSWORD" -e "CREATE SCHEMA $DB_SCHEMA;"
# Restart
sudo systemctl restart mysqld

echo "Done"
