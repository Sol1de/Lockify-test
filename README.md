# 🔐 Lockify Test Server

Serveur de test pour le package **Lockify** - Une API complète d'authentification avec gestion des utilisateurs, persistance des données et configuration CORS.

## ✨ Fonctionnalités

- **Authentification complète** : Inscription, connexion, vérification de token
- **Gestion des utilisateurs** : CRUD partiel (Create, Read, Delete)
- **Persistance des données** : Sauvegarde automatique dans `users.json`
- **Configuration CORS** : Compatible avec Hoppscotch, Postman, etc.
- **Sécurité** : Hachage bcrypt, JWT, routes protégées
- **Logging détaillé** : Suivi complet des opérations

## 🚀 Installation et démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement du serveur
```bash
npm start
```

**Le serveur démarre sur** : [http://localhost:3000](http://localhost:3000)

## 📋 API Endpoints

### 📖 Documentation
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/` | Documentation complète de l'API |

### 👤 Authentification
| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| `POST` | `/register` | Inscription d'un nouvel utilisateur | `{"email": "user@example.com", "password": "Password123!"}` |
| `POST` | `/login` | Connexion et génération de token JWT | `{"email": "user@example.com", "password": "Password123!"}` |
| `POST` | `/verify-token` | Vérification manuelle d'un token | `{"token": "your_jwt_token"}` |

### 🛡️ Routes protégées
| Méthode | Endpoint | Description | Headers |
|---------|----------|-------------|----------|
| `GET` | `/profile` | Accès au profil utilisateur | `Authorization: Bearer YOUR_TOKEN` |

### 👥 Gestion des utilisateurs
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/users` | Voir tous les utilisateurs (debug) |
| `DELETE` | `/users/:id` | Supprimer un utilisateur par ID |
| `DELETE` | `/users/email/:email` | Supprimer un utilisateur par email |
| `DELETE` | `/users` | Supprimer TOUS les utilisateurs ⚠️ |

## 🧪 Tests automatisés

```bash
npm run test-api
```

## 🧪 Tests manuels avec curl

### 📝 Inscription d'un utilisateur
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
        "email":"test@example.com",
        "password":"MyPassword123!"
      }'
```

**Réponse attendue :**
```json
{
  "message": "User registered successfully",
  "userId": "1",
  "email": "test@example.com",
  "hashedPassword": "$2b$12$..."
}
```

### 🔑 Connexion
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
        "email":"test@example.com",
        "password":"MyPassword123!"
      }'
```

**Réponse attendue :**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### 🛡️ Route protégée (remplacez YOUR_TOKEN)
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 🔍 Vérification de token
```bash
curl -X POST http://localhost:3000/verify-token \
  -H "Content-Type: application/json" \
  -d '{
        "token":"YOUR_TOKEN"
      }'
```

### 👥 Voir tous les utilisateurs
```bash
curl -X GET http://localhost:3000/users
```

### 🗑️ Supprimer un utilisateur par ID
```bash
curl -X DELETE http://localhost:3000/users/1
```

### 🗑️ Supprimer un utilisateur par email
```bash
curl -X DELETE http://localhost:3000/users/email/test@example.com
```

### ⚠️ Supprimer TOUS les utilisateurs
```bash
curl -X DELETE http://localhost:3000/users
```

## 🔧 Test avec Hoppscotch/Postman

1. **Ouvrez** [Hoppscotch.io](https://hoppscotch.io) ou Postman
2. **Testez d'abord** : `GET http://localhost:3000/` pour vérifier la connexion
3. **Créez un utilisateur** : `POST /register` avec le body JSON
4. **Connectez-vous** : `POST /login` pour obtenir le token
5. **Copiez le token** et utilisez-le dans les headers : `Authorization: Bearer YOUR_TOKEN`
6. **Testez la route protégée** : `GET /profile`

## 📊 Fonctionnalités Lockify testées

- **hashPassword()** - Hachage sécurisé avec bcrypt  
- **comparePassword()** - Vérification de mot de passe  
- **generateToken()** - Génération JWT avec expiration  
- **verifyToken()** - Validation de token  
- **requireAuth()** - Middleware de protection Express  

## 💾 Persistance des données

- **Fichier** : `users.json`
- **Format** : Stockage des utilisateurs avec compteur
- **Mise à jour automatique** : À chaque création/suppression
- **Compteur intelligent** : Reflète le nombre réel d'utilisateurs

## 📝 Structure du projet

```
lockify-test/
├── app.ts              # Serveur Express principal
├── users.json          # Base de données utilisateurs
├── package.json        # Configuration npm
├── tsconfig.json       # Configuration TypeScript
└── README.md          # Cette documentation
```

## ⚠️ Notes importantes

- **Développement uniquement** : JWT secret codé en dur
- **CORS activé** : Permet les requêtes depuis n'importe quelle origine
- **Persistance** : Les données survivent aux redémarrages
- **Logs détaillés** : Toutes les opérations sont loggées dans la console

## 🎆 Exemples de résultats attendus

### SuccesCréation d'utilisateur :
```
📝 Registration attempt: test@example.com
🔒 Password hashed successfully
💾 Users saved to disk
✅ User created with ID: 1
```

### Connexion réussie :
```
🔑 Login attempt: test@example.com
✅ Password validated
🎫 JWT token generated
```

### Suppression réussie :
```
🗑️ Delete attempt for user ID: 1
💾 Users saved to disk
✅ User test@example.com (ID: 1) deleted successfully
```

---

🎉 **Happy testing with Lockify!**
  -H "Content-Type: application/json" \
  -d '{
        "email":"test@example.com",
        "password":"MyPassword123!"
    }'
```

### Connexion
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
        "email":"test@example.com",
        "password":"MyPassword123!"
      }'
```

### Route protégée (remplacez YOUR_TOKEN par le token reçu)
```bash
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Vérification de token
```bash
curl -X POST http://localhost:3000/verify-token \
  -H "Content-Type: application/json" \
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
