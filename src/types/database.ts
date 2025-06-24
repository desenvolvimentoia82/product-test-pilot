
export type UserRole = 'admin' | 'product_manager' | 'tester' | 'developer' | 'viewer';
export type ReleaseStatus = 'development' | 'ready_for_test' | 'testing' | 'approved' | 'released';
export type TestPriority = 'baixa' | 'media' | 'alta';
export type TestType = 'funcional' | 'integracao' | 'performance' | 'seguranca' | 'api' | 'aceitacao';
export type ExecutionStatus = 'passou' | 'falhou' | 'em_execucao' | 'nao_executado';
export type EvidenceType = 'screenshot' | 'video' | 'log' | 'documento';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  key: string;
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
  user?: User;
  product?: Product;
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
  product?: Product;
}

export interface TestSuite {
  id: string;
  product_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
  test_cases?: TestCase[];
  revisions?: SuiteRevision[];
}

export interface SuiteRevision {
  id: string;
  suite_id: string;
  author_id: string;
  date: string;
  description: string;
  author?: User;
  suite?: TestSuite;
}

export interface TestCase {
  id: string;
  suite_id: string;
  title: string;
  description?: string;
  priority: TestPriority;
  type: TestType;
  active: boolean;
  tags?: string[];
  preconditions?: string;
  steps?: string;
  expected_result?: string;
  created_at: string;
  updated_at: string;
  suite?: TestSuite;
}

export interface TestPlan {
  id: string;
  product_id: string;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
  suites?: TestSuite[];
}

export interface TestPlanSuite {
  id: string;
  test_plan_id: string;
  suite_id: string;
  test_plan?: TestPlan;
  suite?: TestSuite;
}

export interface TestExecution {
  id: string;
  release_id: string;
  suite_id: string;
  responsible_id: string;
  status: ExecutionStatus;
  execution_time?: number;
  observations?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  release?: Release;
  suite?: TestSuite;
  responsible?: User;
  evidences?: Evidence[];
}

export interface Evidence {
  id: string;
  execution_id: string;
  type: EvidenceType;
  file_url: string;
  file_name: string;
  file_size: number;
  description?: string;
  created_at: string;
  execution?: TestExecution;
}

export interface DashboardStats {
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  pending_tests: number;
  test_coverage: number;
  active_releases: number;
  total_products: number;
  total_suites: number;
}
