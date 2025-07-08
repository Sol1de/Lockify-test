const express = require('express');
const fs = require('fs');
const path = require('path');
const { hashPassword, comparePassword, generateToken, verifyToken, requireAuth } = require('lockify');

const app = express();
app.use(express.json());

app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Fichier pour la persistance des utilisateurs
const USERS_FILE = path.join(__dirname, 'users.json');

// Charger les utilisateurs depuis le fichier
const loadUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const userData = JSON.parse(data);
      return {
        users: new Map(userData.users || []),
        counter: userData.counter || 1
      };
    }
  } catch (error) {
    console.error('❌ Error loading users:', error);
  }
  return { users: new Map(), counter: 1 };
};

// Sauvegarder les utilisateurs dans le fichier
const saveUsers = (users: Map<string, any>, counter: number) => {
  try {
    const userData = {
      users: Array.from(users.entries()),
      counter: users.size // Le compteur reflète le nombre d'utilisateurs actuels
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify(userData, null, 2));
    console.log('💾 Users saved to disk');
  } catch (error) {
    console.error('❌ Error saving users:', error);
  }
};

// Simulation d'une base de données avec persistance
const loadedData = loadUsers();
const users = loadedData.users as Map<string, any>;
let userCounter = loadedData.counter;

// Fonction pour récupérer un utilisateur par ID (requis par requireAuth)
const getUserById = async (id: string) => {
  const user = users.get(id);
  return user || null;
};

const JWT_SECRET = 'test-secret-key-at-least-32-characters-long';

console.log('🚀 Starting Lockify test server...\n');

// Route d'inscription
app.post('/register', async (req: any, res: any) => {
  try {
    console.log('📝 Registration attempt:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Hash du mot de passe avec Lockify
    const hashedPassword = await hashPassword(password);
    console.log('🔒 Password hashed successfully');
    
    // Simulation de sauvegarde en base
    const userId = String(userCounter++);
    users.set(userId, {
      id: userId,
      email,
      password: hashedPassword,
      role: 'user'
    });
    
    // Sauvegarder sur disque
    saveUsers(users, userCounter);
    
    console.log(`✅ User created with ID: ${userId}\n`);
res.json({ 
      message: 'User registered successfully',
      userId,
      email,
      hashedPassword
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Route de connexion
app.post('/login', async (req: any, res: any) => {
  try {
    console.log('🔑 Login attempt:', req.body.email);
    
    const { email, password } = req.body;
    
    // Recherche de l'utilisateur
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Vérification du mot de passe avec Lockify
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ Password validated');
    
    // Génération du token JWT avec Lockify
    const token = generateToken(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('🎫 JWT token generated\n');
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Route protégée utilisant le middleware Lockify
app.get('/profile', requireAuth(getUserById, JWT_SECRET), (req: any, res: any) => {
  console.log('🛡️ Protected route accessed by user:', req.user?.email);
  res.json({ 
    message: 'Access granted to protected route',
    user: req.user 
  });
});

// Route de test pour vérifier manuellement un token
app.post('/verify-token', (req: any, res: any) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    console.log('🔍 Manual token verification attempt');
    
    // Vérification manuelle du token avec Lockify
    const decoded = verifyToken(token, JWT_SECRET);
    
    console.log('✅ Token verified successfully:', decoded);
    
    res.json({
      message: 'Token is valid',
      decoded
    });
    
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Route pour voir tous les utilisateurs (pour débug)
app.get('/users', (req: any, res: any) => {
  const allUsers = Array.from(users.values()).map(user => ({
    id: user.id,
    email: user.email,
    role: user.role,
    hashedPassword: user.password
  }));
  
  res.json({
    message: 'All registered users',
    total: allUsers.length,
    users: allUsers
  });
});

// Route pour supprimer un utilisateur par ID
app.delete('/users/:id', (req: any, res: any) => {
  try {
    const userId = req.params.id;
    
    console.log(`🗑️ Delete attempt for user ID: ${userId}`);
    
    const user = users.get(userId);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Supprimer l'utilisateur
    users.delete(userId);
    
    // Sauvegarder sur disque
    saveUsers(users, userCounter);
    
    console.log(`✅ User ${user.email} (ID: ${userId}) deleted successfully\n`);
    
    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Route pour supprimer un utilisateur par email
app.delete('/users/email/:email', (req: any, res: any) => {
  try {
    const email = req.params.email;
    
    console.log(`🗑️ Delete attempt for user email: ${email}`);
    
    // Rechercher l'utilisateur par email
    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Supprimer l'utilisateur
    users.delete(user.id);
    
    // Sauvegarder sur disque
    saveUsers(users, userCounter);
    
    console.log(`✅ User ${email} (ID: ${user.id}) deleted successfully\n`);
    
    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Route pour supprimer TOUS les utilisateurs (dangereux - pour les tests)
app.delete('/users', (req: any, res: any) => {
  try {
    console.log('🗑️ Delete ALL users attempt');
    
    const userCount = users.size;
    
    // Vider la Map
    users.clear();
    
    // Remettre le compteur à 1
    userCounter = 1;
    
    // Sauvegarder sur disque
    saveUsers(users, userCounter);
    
    console.log(`✅ All ${userCount} users deleted successfully\n`);
    
    res.json({
      message: 'All users deleted successfully',
      deletedCount: userCount
    });
    
  } catch (error) {
    console.error('❌ Delete all error:', error);
    res.status(500).json({ error: 'Failed to delete all users' });
  }
});

// Route de test simple
app.get('/', (req: any, res: any) => {
  res.json({
    message: '🔐 Lockify Test Server',
    endpoints: {
      'POST /register': 'Register a new user',
      'POST /login': 'Login with email/password',
      'GET /profile': 'Protected route (requires Bearer token)',
      'POST /verify-token': 'Manually verify a JWT token',
      'GET /users': 'View all registered users (debug only)',
      'DELETE /users/:id': 'Delete user by ID',
      'DELETE /users/email/:email': 'Delete user by email',
      'DELETE /users': 'Delete ALL users (dangerous!)'
    },
    instructions: {
      '1': 'Register: POST /register with {"email": "test@example.com", "password": "MyPassword123!"}',
      '2': 'Login: POST /login with same credentials',
      '3': 'Access profile: GET /profile with "Authorization: Bearer YOUR_TOKEN"'
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Lockify test server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /              - API documentation');
  console.log('  POST   /register      - Register user');
  console.log('  POST   /login         - Login user');
  console.log('  GET    /profile       - Protected route');
  console.log('  POST   /verify-token  - Manual token verification');
  console.log('  GET    /users         - View all users (debug only)');
  console.log('  DELETE /users/:id     - Delete user by ID');
  console.log('  DELETE /users/email/:email - Delete user by email');
  console.log('  DELETE /users         - Delete ALL users (dangerous!)');
  console.log('\n🧪 Quick test commands:');
  console.log('curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d "{\\"email\\":\\"test@example.com\\",\\"password\\":\\"MyPassword123!\\"}"');
  console.log('curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\\"email\\":\\"test@example.com\\",\\"password\\":\\"MyPassword123!\\"}"');
  console.log('\n💡 Use the token from login in: curl -X GET http://localhost:3000/profile -H "Authorization: Bearer YOUR_TOKEN"');
});
