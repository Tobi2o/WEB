# Wordle++ - User Guide

## Setup the database

### Pre-requisite
#### On Windows
1. You'll need to install MySQL Server and MySQL Workbench (or other mySQL client like HeidiSQL). Here is the download link: [Download MySQL Installer](https://dev.mysql.com/downloads/installer/)
2. You can directly install MySQL Server and Workbench from this installer. 

Click on ```Add ...```, you shouldn't see any products installed if you haven't installed it before!
![image](https://hackmd.io/_uploads/HkkLAELSC.png)

3. In the next window, select MySQL Server and Workbench to be installed and then wait for the installation
4. Now that MySQL Server and Workbench are installed, make sure that the MySQL server is running on localhost, setup the username and password used to connect to this local database. Make sure to have python3 and pip installed for the next step ([Download Python](https://www.python.org/downloads/) and [Install pip](https://pip.pypa.io/en/stable/installation/)). If you don't want to install python and pip on your machine, bypass step 5 and go to step 6.
5. Run our custom script ```create_db_and_insert.py``` located in the folder ```database\scripts``` using the following commands. Make sure to modify the login informations used to connect to the database in the script:

```bash= 
DB_USER = "user_db_username"
DB_PASSWORD = "user_db_password"
```

And then use theses following commands to run the script:

```bash= 
pip install mysql.connector
py create_db_and_insert.py # or python create_db_and_insert.py or python3 create_db_and_insert.py (depending on your python version)
```
6. Alternative solution, you can use MySQL Workbench and our script ```create_tables.sql``` located in the folder ```database\scripts```. In order to do so, follow these steps:
    7. Click on 'Database' => 'Connect to Database'(or ctrl+u)
   
    ![image](https://hackmd.io/_uploads/r1-ImHUHA.png)

    9. Choose the username previously set up
    10. Enter the password previously set up, now you should see this page
    ![image](https://hackmd.io/_uploads/r1Y2QS8SR.png)
    11. Drag and drop the file ```create_tables.sql``` in the query page, you should see something like this:
    ![image](https://hackmd.io/_uploads/Skg7NrLrR.png)
    12. Run the script by clicking on the lightning icon
    13. Click on the refresh icon (near SCHEMAS) to see the new database
    ![image](https://hackmd.io/_uploads/HJ3v4BUHR.png)

There you go! The database is setup and ready to use!


#### On Linux

Checkout this link: [Install and Configure a MySQL Server on Ubuntu](https://ubuntu.com/server/docs/install-and-configure-a-mysql-server)

Note : Might have to create a user for the Database, please refer to the official documentation.
The command `sudo mysql -u root -p wordle_multiplayer` is used to log in to a MySQL database. Useful to see if we can access it properly. 

- `sudo`: This command allows a permitted user to execute a command as the superuser or another user. In this case, it ensures that the MySQL command is run with administrative privileges.
  
- `mysql`: This is the command-line tool for interacting with the MySQL database server.

- `-u root`: The `-u` option specifies the MySQL user to log in as. Here, `root` is the username, which is typically the administrative user for the MySQL server.

- `-p`: This option tells MySQL to prompt for the password of the specified user (`root` in this case). After entering this command, you will be prompted to enter the password.

- `wordle_multiplayer`: This is the name of the MySQL database you want to access. In this context, it refers to a specific database named `wordle_multiplayer`.


## Launch the frontend

1. Run the following commands at the root of the folder:
```bash= 
npm install # to install dependencies
npm start # to launch the frontend
```
You can now access to our app on localhost:3000

## Launch the backend
1. Run the following commands in the ```src\server```:
```bash= 
cd src/server
node server.js # To start the backend server
```
The backend server will run on port 3002


Make sure to launch both frontend and backend! It will not work otherwise ;) 

### Tailwindcss - Nothing is needed to be done here ( Can skip )

Note : Nothing is needed to be done here since everything is installed with **npm install**, this is simply the documentation to install and configure Tailwindcss from scratch and import it into the project.

### Install Tailwindcss

```bash
npm install -D tailwindcss
npx tailwindcss init
```

### Configurataion of the template

`tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
### Add Tailwind directives to css

`src/input.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Start the Tailwind CLI build

```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

### Bulld the tailwindcss each time new tailwindcss is added in the views !
```bash
npx tailwindcss -o src/output.css
```
