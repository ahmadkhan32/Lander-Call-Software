import { describe, it, expect, vi } from 'vitest';
import { requirePermission, requireRole } from '../src/middleware/auth.js';

describe('Auth Middleware - requirePermission', () => {
  it('should return 403 if user has no permissions or is missing user object', () => {
    const middleware = requirePermission('leads.read');
    const req = {};
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Insufficient permissions: leads.read required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user lacks the required permission', () => {
    const middleware = requirePermission('leads.delete');
    const req = {
      user: {
        id: 'user-123',
        permissions: ['leads.read', 'leads.create'],
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Insufficient permissions: leads.delete required',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if user possesses the required permission', () => {
    const middleware = requirePermission('leads.read');
    const req = {
      user: {
        id: 'user-123',
        permissions: ['leads.read', 'calls.initiate'],
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

describe('Auth Middleware - requireRole', () => {
  it('should return 403 if user does not have the required role', () => {
    const middleware = requireRole('Business Admin', 'Super Admin');
    const req = {
      user: {
        roles: ['Agent'],
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Insufficient role',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if user has one of the required roles', () => {
    const middleware = requireRole('Business Admin', 'Super Admin');
    const req = {
      user: {
        roles: ['Agent', 'Business Admin'],
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
