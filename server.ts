import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import prisma from './src/lib/prisma';
import { encrypt, decrypt } from './src/lib/encryption';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-hub-jwt-key';
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // --- Auth Middleware ---
  const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      (req as any).userId = decoded.userId;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- API Routes ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  console.log('Registering API routes...');

  // Auth
  app.post('/api/auth/signup', async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
      console.log(`Signup attempt for: ${email}`);
      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
        }
      });

      const org = await prisma.organization.create({
        data: {
          name: `${name}'s Organization`,
          ownerId: user.id
        }
      });

      await prisma.member.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: 'ADMIN'
        }
      });

      console.log(`User created: ${email}`);
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(400).json({ error: 'Email already exists or invalid data' });
    }
  });

  app.post('/api/auth/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
      console.log(`Login attempt for: ${email}`);
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        console.log(`User not found: ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        console.log(`Invalid password for: ${email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (err) {
      console.error('Login error:', err);
      next(err);
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  app.get('/api/auth/me', authenticate, async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).userId },
      select: { id: true, name: true, email: true }
    });
    res.json(user);
  });

  // Projects
  app.get('/api/projects', authenticate, async (req, res) => {
    const userId = (req as any).userId;
    const projects = await prisma.project.findMany({
      where: {
        organization: {
          members: { some: { userId } }
        }
      },
      include: {
        _count: { select: { credentials: true } }
      }
    });
    res.json(projects);
  });

  app.get('/api/projects/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const userId = (req as any).userId;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        organization: {
          include: {
            members: { where: { userId } }
          }
        }
      }
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // Check if user is member of the organization
    if (project.organization.members.length === 0) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(project);
  });

  app.post('/api/projects', authenticate, async (req, res) => {
    const { name, description, organizationId } = req.body;
    const userId = (req as any).userId;

    // Check if user is member of org
    const member = await prisma.member.findFirst({
      where: { userId, organizationId }
    });
    if (!member) return res.status(403).json({ error: 'Forbidden' });

    // Plan limits check
    const subscription = await prisma.subscription.findUnique({ where: { userId } });
    if (subscription?.plan === 'FREE') {
      const projectCount = await prisma.project.count({
        where: { organizationId }
      });
      if (projectCount >= 1) {
        return res.status(403).json({ error: 'Limite de projetos atingido (máx 1 no plano gratuito)' });
      }
    }

    const project = await prisma.project.create({
      data: { name, description, organizationId }
    });
    res.status(201).json(project);
  });

  // Credentials
  app.get('/api/credentials', authenticate, async (req, res) => {
    const userId = (req as any).userId;
    const { projectId } = req.query;

    const credentials = await prisma.credential.findMany({
      where: {
        projectId: projectId as string,
        project: {
          organization: {
            members: { some: { userId } }
          }
        }
      },
      include: {
        fields: {
          select: { id: true, fieldName: true, isSensitive: true }
        }
      }
    });
    res.json(credentials);
  });

  app.get('/api/credentials/:id', authenticate, async (req, res) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    const credential = await prisma.credential.findUnique({
      where: { id },
      include: {
        fields: true,
        project: { include: { organization: true } }
      }
    });

    if (!credential) return res.status(404).json({ error: 'Not found' });

    // Check access
    const member = await prisma.member.findFirst({
      where: { userId, organizationId: credential.project.organizationId }
    });
    if (!member) return res.status(403).json({ error: 'Forbidden' });

    // Decrypt sensitive fields
    const decryptedFields = credential.fields.map(field => ({
      ...field,
      value: field.isSensitive ? decrypt(field.encryptedValue) : field.encryptedValue
    }));

    // Log access
    await prisma.auditLog.create({
      data: {
        action: 'VIEW',
        userId,
        credentialId: id,
        details: `Viewed credential: ${credential.name}`
      }
    });

    res.json({ ...credential, fields: decryptedFields });
  });

  app.post('/api/credentials', authenticate, async (req, res, next) => {
    try {
      const { name, description, projectId, environment, fields } = req.body;
      const userId = (req as any).userId;

      console.log(`Creating credential: ${name} for project: ${projectId} by user: ${userId}`);

      if (!name) return res.status(400).json({ error: 'Credential name is required' });
      if (!projectId) return res.status(400).json({ error: 'Project ID is required' });
      if (!fields || !Array.isArray(fields) || fields.length === 0) {
        return res.status(400).json({ error: 'At least one field is required' });
      }

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { organization: true }
      });
      
      if (!project) {
        console.error(`Project not found: ${projectId}`);
        return res.status(404).json({ error: 'Project not found' });
      }

      const member = await prisma.member.findFirst({
        where: { userId, organizationId: project.organizationId }
      });
      
      if (!member || member.role === 'VIEWER') {
        console.error(`User ${userId} does not have permission for project ${projectId}`);
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Plan limits check
      const subscription = await prisma.subscription.findUnique({ where: { userId } });
      if (subscription?.plan === 'FREE') {
        const credentialCount = await prisma.credential.count({
          where: { project: { organizationId: project.organizationId } }
        });
        if (credentialCount >= 10) {
          return res.status(403).json({ error: 'Limite de credenciais atingido (máx 10 no plano gratuito)' });
        }
      }

      const credential = await prisma.credential.create({
        data: {
          name,
          description,
          projectId,
          environment,
          createdBy: userId,
          fields: {
            create: fields.map((f: any) => ({
              fieldName: f.fieldName,
              encryptedValue: f.isSensitive ? encrypt(f.value) : f.value,
              isSensitive: f.isSensitive
            }))
          }
        }
      });

      console.log(`Credential created successfully: ${credential.id}`);
      res.status(201).json(credential);
    } catch (err) {
      console.error('Credential creation error:', err);
      next(err);
    }
  });

  app.put('/api/credentials/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, environment, fields } = req.body;
      const userId = (req as any).userId;

      const credential = await prisma.credential.findUnique({
        where: { id },
        include: { project: true }
      });

      if (!credential) return res.status(404).json({ error: 'Not found' });

      const member = await prisma.member.findFirst({
        where: { userId, organizationId: credential.project.organizationId }
      });

      if (!member || member.role === 'VIEWER') return res.status(403).json({ error: 'Forbidden' });

      const updated = await prisma.$transaction(async (tx) => {
        await tx.credentialField.deleteMany({ where: { credentialId: id } });
        
        return await tx.credential.update({
          where: { id },
          data: {
            name,
            description,
            environment,
            fields: {
              create: fields.map((f: any) => ({
                fieldName: f.fieldName,
                encryptedValue: f.isSensitive ? encrypt(f.value) : f.value,
                isSensitive: f.isSensitive
              }))
            }
          }
        });
      });

      await prisma.auditLog.create({
        data: {
          action: 'UPDATE',
          userId,
          credentialId: id,
          details: `Updated credential: ${name}`
        }
      });

      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/api/credentials/:id', authenticate, async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      const credential = await prisma.credential.findUnique({
        where: { id },
        include: { project: true }
      });

      if (!credential) return res.status(404).json({ error: 'Not found' });

      const member = await prisma.member.findFirst({
        where: { userId, organizationId: credential.project.organizationId }
      });

      if (!member || member.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only admins can delete credentials' });
      }

      await prisma.credential.delete({ where: { id } });

      await prisma.auditLog.create({
        data: {
          action: 'DELETE',
          userId,
          details: `Deleted credential: ${credential.name}`
        }
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  });

  // Organizations & Team
  app.get('/api/organizations', authenticate, async (req, res) => {
    const userId = (req as any).userId;
    const orgs = await prisma.organization.findMany({
      where: { members: { some: { userId } } },
      include: { 
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { projects: true } }
      }
    });
    res.json(orgs);
  });

  app.post('/api/organizations/:id/members', authenticate, async (req, res) => {
    const { id: organizationId } = req.params;
    const { email, role } = req.body;
    const userId = (req as any).userId;

    // Check if requester is admin
    const requester = await prisma.member.findFirst({
      where: { userId, organizationId, role: 'ADMIN' }
    });
    if (!requester) return res.status(403).json({ error: 'Only admins can invite members' });

    const userToInvite = await prisma.user.findUnique({ where: { email } });
    if (!userToInvite) return res.status(404).json({ error: 'User not found' });

    try {
      const member = await prisma.member.create({
        data: { userId: userToInvite.id, organizationId, role: role || 'DEVELOPER' }
      });
      res.status(201).json(member);
    } catch (err) {
      res.status(400).json({ error: 'User is already a member' });
    }
  });

  app.put('/api/organizations/:id/members/:memberId', authenticate, async (req, res) => {
    const { id: organizationId, memberId } = req.params;
    const { role } = req.body;
    const userId = (req as any).userId;

    const requester = await prisma.member.findFirst({
      where: { userId, organizationId, role: 'ADMIN' }
    });
    if (!requester) return res.status(403).json({ error: 'Only admins can update roles' });

    const updated = await prisma.member.update({
      where: { id: memberId },
      data: { role }
    });
    res.json(updated);
  });

  app.delete('/api/organizations/:id/members/:memberId', authenticate, async (req, res) => {
    const { id: organizationId, memberId } = req.params;
    const userId = (req as any).userId;

    const requester = await prisma.member.findFirst({
      where: { userId, organizationId, role: 'ADMIN' }
    });
    if (!requester) return res.status(403).json({ error: 'Only admins can remove members' });

    await prisma.member.delete({ where: { id: memberId } });
    res.json({ success: true });
  });

  app.put('/api/organizations/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = (req as any).userId;

    const requester = await prisma.member.findFirst({
      where: { userId, organizationId: id, role: 'ADMIN' }
    });
    if (!requester) return res.status(403).json({ error: 'Only admins can update organization settings' });

    const updated = await prisma.organization.update({
      where: { id },
      data: { name }
    });
    res.json(updated);
  });

  // Billing
  app.get('/api/billing', authenticate, async (req, res) => {
    const userId = (req as any).userId;
    let subscription = await prisma.subscription.findUnique({ where: { userId } });
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: { userId, plan: 'FREE', status: 'ACTIVE' }
      });
    }
    res.json(subscription);
  });

  // Profile
  app.put('/api/profile', authenticate, async (req, res) => {
    const userId = (req as any).userId;
    const { name, email } = req.body;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name, email }
    });
    res.json({ id: updated.id, name: updated.name, email: updated.email });
  });

  app.post('/api/profile/password', authenticate, async (req, res) => {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) return res.status(400).json({ error: 'Senha atual incorreta' });

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    res.json({ success: true });
  });

  app.delete('/api/profile', authenticate, async (req, res) => {
    const userId = (req as any).userId;
    
    // Delete user and related data (Prisma cascade or manual)
    // For simplicity, we'll just delete the user. 
    // In a real app, you'd handle cleanup of orgs, projects, etc.
    await prisma.user.delete({ where: { id: userId } });
    
    res.clearCookie('token');
    res.json({ success: true });
  });

  console.log('API routes registered.');

  // Global error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({ 
      error: err.message || 'Internal Server Error',
      details: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('FATAL: Failed to start server:', err);
  process.exit(1);
});
