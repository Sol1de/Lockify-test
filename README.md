# 🔐 Lockify Test Server

Lockify Test Server est une API simple pour tester les fonctionnalités d'authentification avec Express.js.

## 🚀 Installation et démarrage

1. **Installer les dépendances :**
   ```bash
   npm install
   ```
2. **Lancer le serveur :**
   ```bash
   npm start
   ```
   Le serveur démarre sur [http://localhost:3000](http://localhost:3000).

## 📋 API Endpoints

- **GET /** : Documentation de l'API
- **POST /register** : Inscription
- **POST /login** : Connexion
- **GET /profile** : Accès profil (nécessite un token)
- **POST /verify-token** : Vérification manuel de token
- **GET /users** : Voir les utilisateurs (debug)
- **DELETE /users/:id** : Supprimer un utilisateur par ID
- **DELETE /users/email/:email** : Supprimer par email
- **DELETE /users** : Supprimer TOUS les utilisateurs ⚠️

## 🛠 Utilisation

### Inscription
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"MyPassword123!"}'
```

### Connexion
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"MyPassword123!"}'
```

### Accès au profil
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📂 Structure du projet

- `app.ts`: Serveur principal
- `users.json`: Stockage des utilisateurs
- `package.json`: Configuration npm

---

🎉 **Bon test avec Lockify !**
🗑️ Delete attempt for user ID: 1
💾 Users saved to disk
✅ User test@example.com (ID: 1) deleted successfully
```

---

🎉 **Happy testing with Lockify!**
  -H "Content-Type: application/json"
  -d '{
        "email":"test@example.com",
        "password":"MyPassword123!"
    }'
```

### Connexion
```bash
curl -X POST http://localhost:3000/login
  -H "Content-Type: application/json"
  -d '{
        "email":"test@example.com",
        "password":"MyPassword123!"
      }'
```

### Route protégée (remplacez YOUR_TOKEN par le token reçu)
```bash
curl -X GET http://localhost:3000/profile
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Vérification de token
```bash
curl -X POST http://localhost:3000/verify-token
  -H "Content-Type: application/json"
  -d '{"token":"YOUR_TOKEN"}'
```

## 📋 Ce qui est testé

- **Hachage de mots de passe** avec bcrypt  
- **Comparaison de mots de passe** sécurisée  
- **Génération de tokens JWT** avec options  
- **Vérification de tokens JWT**  
- **Middleware d'authentification** Express  
- **Gestion d'erreurs** appropriée  
- **Protection des routes** sans token  

## 🎯 Fonctionnalités Lockify testées

- `hashPassword()` - Hachage sécurisé
- `comparePassword()` - Vérification de mot de passe
- `generateToken()` - Génération JWT avec expiration
- `verifyToken()` - Validation de token
- `requireAuth()` - Middleware de protection

## 📊 Résultats attendus

Tous les tests devraient passer si Lockify fonctionne correctement :
- Documentation accessible
- Inscription d'utilisateur réussie
- Connexion avec token généré
- Accès autorisé aux routes protégées
- Vérification de token valide
- Accès refusé sans token

## 🔧 Structure du projet

```
lockify-test/
├── app.ts          # Serveur Express de test
├── test-api.ts          # Tests automatisés
├── package.json         # Configuration npm
├── tsconfig.json        # Configuration TypeScript
└── README.md           # Cette documentation
```

## 💡 Notes importantes

- Le serveur utilise une base de données en mémoire (Map)
- Les données sont perdues à chaque redémarrage
- Le JWT secret est codé en dur pour les tests
- En production, utilisez des variables d'environnement sécurisées
