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

export interface TestCase {
  id: string;
  test_suite_id: string;
  title: string;
  description?: string;
  steps?: string;
  expected_result?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'inactive' | 'deprecated';
  created_at: string;
  updated_at: string;
}

export interface TestPlan {
  id: string;
  product_id: string;
  release_id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface TestExecution {
  id: string;
  test_plan_id: string;
  test_case_id: string;
  executor_name: string;
  status: 'pending' | 'passed' | 'failed' | 'blocked' | 'skipped';
  execution_date: string;
  notes?: string;
  attachments?: string[];
  execution_time?: number;
  created_at: string;
  updated_at: string;
}