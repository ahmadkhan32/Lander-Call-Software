import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const createLeadSchema = z.object({
  full_name: z.string().min(1).max(200),
  phone: z.string().min(5).max(30),
  email: z.string().email().optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  notes: z.string().max(5000).optional().nullable(),
});

describe('Leads Module - Validation Schemas', () => {
  it('should accept valid lead data', () => {
    const validData = {
      full_name: 'John Doe',
      phone: '+1 (555) 234-5678',
      email: 'john.doe@example.com',
      company: 'Acme Corp',
      priority: 'high',
      notes: 'Interested in enterprise license.',
    };

    const parsed = createLeadSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.full_name).toBe('John Doe');
      expect(parsed.data.priority).toBe('high');
    }
  });

  it('should reject leads missing full_name', () => {
    const invalidData = {
      phone: '+15551234567',
    };

    const parsed = createLeadSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it('should reject invalid email formats', () => {
    const invalidData = {
      full_name: 'Jane Smith',
      phone: '+15551234567',
      email: 'not-an-email',
    };

    const parsed = createLeadSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it('should reject invalid priority values', () => {
    const invalidData = {
      full_name: 'Jane Smith',
      phone: '+15551234567',
      priority: 'super-urgent', // Not in enum
    };

    const parsed = createLeadSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });
});
