#!/usr/bin/env bash

SITENAME=pennlib
DBPATH=/var/www/$SITENAME/dev.sql

echo ""
echo -n "You are about to destory all of" $SITENAME"'s files not saved in git, drop the database and load a backup. Are you sure you want to do this?[Y/N]: "
read YESNO
  if [ "$YESNO" == "Y" ]
  then
    drush sql-drop -y; drush sql-cli < $DBPATH;
    echo "One Time login"
    drush uli

# check to see if site with name already exists
  echo -n "Do you want to load" $SITENAME"'s configuration? [Y/N]:"
  read YESNO
  if [ "$YESNO" == "Y" ]
  then
  drush config-import -y
  else
    echo ""
    echo "Not loading the configuration."
    echo ""
    exit
  fi
  else
    echo ""
    echo "This is not the droid you are looking for."
    echo ""
    exit
fi


#git clean -fd; drush sql-drop -y; drush sql-cli < /var/www/pennlib/dev.sql; drush config-import -y; drush uli git clean -fd;