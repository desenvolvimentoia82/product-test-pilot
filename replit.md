# Test Management System

## Overview
A comprehensive test management system for organizing products, releases, and test suites. Originally built with Lovable using Supabase, successfully migrated to Replit with PostgreSQL and Drizzle ORM.

## Project Architecture

### Backend
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **API**: RESTful endpoints for products, releases, and test suites
- **Schema**: Shared between client and server in `/shared/schema.ts`

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router DOM
- **UI**: Radix UI components with Tailwind CSS
- **State**: React Context for auth and product selection
- **Data Fetching**: Custom hooks with fetch API

### Database Schema
- `products`: Core product information
- `releases`: Product releases with status tracking
- `test_suites`: Organized test cases by product
- `product_members`: User roles per product (ready for future auth)

## Recent Changes
- **2024-06-24**: Database cleanup completed - all test data deleted from database
  - Removed all test_plans records (0 remaining)
  - Removed all test_plan_executions records (0 remaining)
  - Removed all test_case_executions records (0 remaining)
  - Fixed date handling in test plan creation with proper string-to-Date transformation
- **2024-06-24**: Database cleanup completed - all test suites deleted from database
  - Removed all test_suites records (0 remaining)
  - Removed all test_cases records (0 remaining) 
  - Removed all test_suite_versions records (0 remaining)
  - Fixed JavaScript error in TestSuites component with setIncludeArchived state management
- **2024-12-24**: Successfully migrated from Supabase to PostgreSQL
  - Replaced Supabase client with server-side API endpoints
  - Implemented Drizzle ORM for type-safe database operations
  - Updated frontend hooks to use REST API instead of Supabase
  - Removed authentication complexity for simplified demo mode
  - Fixed CSS issues with test status classes
  - Fixed duplicate "Planos de Teste" menu item in sidebar
  - Fixed test case creation functionality in test suites
  - Fixed test executions page routing and functionality
  - Improved test execution dialog to fetch real test cases
  - Updated execution URL from /executions to /test-executions
  - Fixed test execution display to show test case titles instead of IDs
  - Added test cases view dialog for managing cases within suites
  - Implemented revision control system for test suites
  - Updated dashboard with real database statistics
  - Implemented comprehensive test suite version control system
  - Added test_suite_versions table with automatic change tracking
  - Created version history dialog with revert functionality
  - Enhanced test suite editing with change summary documentation

- **2024-12-24**: Major refactoring of test management system per user requirements
  - Added revision control for test cases with version history
  - Changed test suite deletion to archiving with status field
  - Enhanced test suite filtering to hide archived by default
  - Completely refactored test plans and executions structure
  - Test plans now require direct association with test suites
  - Implemented execution tracking with unique numbers (EXEC-YYYY-NNNN format)
  - Added new status options: não_iniciada, em_andamento, concluída, interrompida, cancelada, aprovada, rejeitada
  - Created test_plan_executions table for execution control
  - Created test_case_executions table for individual test results
  - Added mandatory fields: result (passou/falhou/bloqueado) and resultado (description)
  - Implemented manual test case execution workflow

## User Preferences
*To be updated based on user interactions*

## Technical Decisions
- Using demo authentication (always logged in) for simplified onboarding
- PostgreSQL arrays for attachments in releases
- UUID primary keys for better scalability
- Timestamp fields with timezone support
- Proper foreign key relationships with cascade deletes