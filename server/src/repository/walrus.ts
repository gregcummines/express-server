import User from '../interfaces/user.interface';
import * as sqlite from 'sqlite3';

export class WalrusDatabase {
    public getUser(username: string, password: string): User {
        let user: User = null;
        const db = new sqlite.Database("walrus.db", (err) => {
            if (err) {
              console.error('Could not connect to database', err);
            } else {
              console.log('Connected to database');
            }
        });
        if (db) {
            const params = [username, password];
            
            db.get(`
             SELECT * FROM [user]
             WHERE email = ? and password = ?`, params, (err, row) => {
                if (err) {
                    console.error(err);
                } else {
                    user = new User();
                    user.id = row.id;
                    user.firstName = row.first_name;
                    user.lastName = row.last_name;
                    user.email = row.email;
                }
            });
            db.close();
        }
        return user;
    } 

    public getUsers(): User[] {
        let users: User[] = null;
        const db = new sqlite.Database("walrus.db", (err) => {
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
                        users.push(user);
                    });
                    
                }
            });
            db.close();
        }
        return users;
    } 
}