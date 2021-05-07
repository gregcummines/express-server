import { User } from '../interfaces/user';
import * as Database from 'better-sqlite3';
import { Role } from '../interfaces/role';

export class WalrusRepository {
    private readonly dbPath: string = "./bundle/walrus.db";

    // This method returns true if it is the first user added to the database, in which case
    // that user is automatically the admin. All subsequent users will not automatically be
    // authorized until the admin flips a flag in the database for that user. 
    public addUser(firstName: string, lastName: string, email: string, password: string) : User {
        let user = new User();
        const db = new Database(this.dbPath, { verbose: console.log });
        if (db) {   
            let rowsExist = true;
            const row = db.prepare("SELECT COUNT(1) AS count FROM [user];").get();
            rowsExist = row.count > 0;

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
            
            const stmt = db.prepare(`
                INSERT INTO [user] ([first_name], [last_name], [email], [password], [role], [active])
                VALUES (?,?,?,?,?,?);`);
            stmt.run(...params, function (err) {  
                if (err) throw err;
                user.id = this.lastID;
              });
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
        const db = new Database(this.dbPath, { verbose: console.log });
        if (db) {
            const params = [username];
            
            const stmt = db.prepare(`
                SELECT * FROM [user]
                WHERE email = ?`);
            const userDB = stmt.get(...params);
            if (userDB) {
                user = new User();
                user.id = userDB.id;
                user.firstName = userDB.first_name;
                user.lastName = userDB.last_name;
                user.email = userDB.email;
                user.password = userDB.password;
                user.role = userDB.role;
                user.active = (userDB.active === 1);
            }
            db.close();
        }
        return user;
    } 

    public getUserById(id: number): User {
        let user: User = null;
        const db = new Database(this.dbPath, { verbose: console.log });
        if (db) {
            const params = [id];
            const stmt = db.prepare(`
                SELECT * FROM [user]
                WHERE [id] = ?`);
            const userDB = stmt.get(...params);
            if (userDB) {
                user = new User();
                user.id = userDB.id;
                user.firstName = userDB.first_name;
                user.lastName = userDB.last_name;
                user.email = userDB.email;
                user.password = userDB.password;
                user.role = userDB.role;
                user.active = userDB.active;
            }

            db.close();
        }
        return user;
    } 

    public deleteUserById(id: number): void {
        const db = new Database(this.dbPath, { verbose: console.log });
        if (db) {
            const params = [id];
            const stmt = db.prepare(`
                DELETE FROM [user] 
                WHERE [id] = ?;`);
            stmt.run(...params);
            db.close();
        }
    }

    public activateUserById(id: number): void {
        const db = new Database(this.dbPath, { verbose: console.log });
        if (db) {
            const params = [id];
            const stmt = db.prepare(`
                UPDATE [user] 
                SET [active] = 1
                WHERE [id] = ?;`);
            stmt.run(...params);
            db.close();
        }
    }

    public deactivateUserById(id: number): void {
        const db = new Database(this.dbPath, { verbose: console.log });
        if (db) {
            const params = [id];
            const stmt = db.prepare(`
                UPDATE [user] 
                SET [active] = 0
                WHERE [id] = ?;`);
            stmt.run(...params);
            db.close();
        }
    }

    public getUsers(): User[] {
        let users: User[] = [];
        const db = new Database(this.dbPath, { verbose: console.log });
        if (db) {
            const usersDB = db.prepare("SELECT * FROM [user]").all(); 
            usersDB.forEach(row => {
                let user = new User();
                user.id = row.id;
                user.firstName = row.first_name;
                user.lastName = row.last_name;
                user.email = row.email;
                user.role = row.role;
                user.active = row.active;
                users.push(user);
            });
            db.close();
        }
        return users;
    } 
}