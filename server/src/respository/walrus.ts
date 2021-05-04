import User from '../interfaces/user.interface';
import * as sqlite from 'sqlite3';

export class WalrusDatabase {
    public getUser(username: string, password: string): User {
        const db = new sqlite.Database("walrus.db");
        const params = [username, password];
        let user: User = null;
        db.get("SELECT * FROM user WHERE email = ? and password = ?", params, (err, row) => {
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
        return user;
    } 

    public getUsers(): User[] {
        const db = new sqlite.Database("walrus.db");
        let users: User[] = null;
        db.all("SELECT * FROM user", (err, rows) => {
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
        return users;
    } 
}