
-- Criar enum para papéis de usuário
CREATE TYPE user_role AS ENUM ('admin', 'product_manager', 'tester', 'developer', 'viewer');

-- Criar enum para status de release
CREATE TYPE release_status AS ENUM ('development', 'ready_for_test', 'testing', 'approved', 'released');

-- Tabela de produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de membros do produto
CREATE TABLE product_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Tabela de releases
CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status release_status DEFAULT 'development',
  changelog TEXT,
  test_environment TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para produtos (usuários autenticados podem ver todos os produtos)
CREATE POLICY "Users can view all products" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create products" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update products" ON products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete products" ON products
  FOR DELETE TO authenticated USING (true);

-- Políticas RLS para membros de produto
CREATE POLICY "Users can view product members" ON product_members
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create product members" ON product_members
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update product members" ON product_members
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete product members" ON product_members
  FOR DELETE TO authenticated USING (true);

-- Políticas RLS para releases
CREATE POLICY "Users can view releases" ON releases
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create releases" ON releases
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update releases" ON releases
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can delete releases" ON releases
  FOR DELETE TO authenticated USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON releases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
