
import { defineNuxtPlugin } from '#app';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'dein-datenbank-host',
  user: 'dein-datenbank-benutzer',
  password: 'dein-datenbank-passwort',
  database: 'dein-datenbank-name'
};

export default defineNuxtPlugin(async (nuxtApp) => {
  const connection = await mysql.createConnection(dbConfig);

  const auth = {
    async login(userCredentials) {
      const { username, password } = userCredentials;
      try {
        const [rows] = await connection.execute(
          'SELECT * FROM wp_users WHERE user_login = ? AND user_pass = MD5(?)',
          [username, password]
        );

        if (rows.length > 0) {
          console.log('Login erfolgreich:', rows[0]);
        } else {
          console.error('Ungültige Anmeldeinformationen');
        }
      } catch (error) {
        console.error('Fehler beim Login:', error);
      }
    },
    logout() {
      console.log('Benutzer abgemeldet');
    },
    isAuthenticated() {
      return false;
    }
  };

  nuxtApp.provide('auth', auth);
});
