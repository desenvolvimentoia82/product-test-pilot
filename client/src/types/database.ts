// Database types for the frontend
export type UserRole = 'admin' | 'product_manager' | 'tester' | 'developer' | 'viewer';
export type ReleaseStatus = 'development' | 'ready_for_test' | 'testing' | 'approved' | 'released';

export interface Product {
  id: string;
  name: string;
  key: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Release {
  id: string;
  product_id: string;
  name: string;
  status: ReleaseStatus;
  changelog?: string;
  test_environment?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface TestSuite {
  id: string;
  product_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductMember {
  id: string;
  product_id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}