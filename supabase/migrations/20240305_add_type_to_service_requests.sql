-- Adiciona a coluna type na tabela service_requests
ALTER TABLE service_requests
ADD COLUMN type text NOT NULL DEFAULT 'presencial'
CHECK (type IN ('presencial', 'remoto', 'hibrido'));
