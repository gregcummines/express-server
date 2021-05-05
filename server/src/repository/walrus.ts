import { User } from '../interfaces/user';
import * as sqlite from 'sqlite3';
import { Role } from '../interfaces/role';

export class WalrusDatabase {
    private readonly dbPath: string = "./bundle/walrus.db";

    // This method returns true if it is the first user added to the database, in which case
    // that user is automatically the admin. All subsequent users will not automatically be
    // authorized until the admin flips a flag in the database for that user. 
    public addUser(firstName: string, lastName: string, email: string, password: string) : User {
        let user = new User();
        const db = new sqlite.Database(this.dbPath, (err) => {
            if (err) {
              console.error('Could not connect to database', err);
            } else {
              console.log('Connected to database');
            }
        });
        if (db) {   
            const rowsExist = db.run("SELECT COUNT(1) FROM [user];");
            // If there are not users in the database, which means this is the first user
            // being added, that user is automatically "Admin" role and is active
            // Otherwise subsequent users are not active and will need an "Admin" to activate them.
            let role: Role = Role.User;
            let active = 0;
            if (!rowsExist) {
                role = Role.Admin;
                active = 1;
            }

            const params = [firstName, lastName, email, password, role, active];
            
            db.run(`
             INSERT INTO [user] ([lastName], [firstName], [email], [password], [role], [active])
             VALUES (?,?,?,?,?,?);`, params);
            db.close();

            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.role = role;
            user.active = (!!active);
        }

        return user;
    }

    public getUser(username: string): User {
        let user: User = null;
        const db = new sqlite.Database(this.dbPath, (err) => {
            if (err) {
              console.error('Could not connect to database', err);
            } else {
              console.log('Connected to database');
            }
        });
        if (db) {
            const params = [username];
            
            db.get(`
             SELECT * FROM [user]
             WHERE email = ?`, params, (err, row) => {
                if (err) {
                    console.error(err);
                } else {
                    if (row) {
                        user = new User();
                        user.id = row.id;
                        user.firstName = row.first_name;
                        user.lastName = row.last_name;
                        user.email = row.email;
                        user.password = row.password;
                        user.role = row.role;
                        user.active = row.active;
                    }
                }
            });
            db.close();
        }
        return user;
    } 

    public getUsers(): User[] {
        let users: User[] = null;
        const db = new sqlite.Database(this.dbPath, (err) => {
            if (err) {
              console.error('Could not connect to database', err);
            } else {
              console.log('Connected to database');
            }
        });
        if (db) {
            db.all("SELECT * FROM [user]", (err, rows) => {
                if (err) {
                    console.error(err);
                } else {
                    rows.forEach(row => {
                        let user = new User();
                        user.id = row.id;
                        user.firstName = row.first_name;
                        user.lastName = row.last_name;
                        user.email = row.email;
                        user.role = row.role;
                        user.active = row.active;
                        users.push(user);
                    });
                    
                }
            });
            db.close();
        }
        return users;
    } 
}