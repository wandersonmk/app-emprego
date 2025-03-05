-- Remover políticas existentes
DROP POLICY IF EXISTS "Enable delete for service owner" ON service_requests;
DROP POLICY IF EXISTS "Enable delete for service owner" ON service_proposals;

-- Habilitar RLS nas tabelas
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_proposals ENABLE ROW LEVEL SECURITY;

-- Política para permitir que o cliente exclua seus próprios serviços
CREATE POLICY "Enable delete for service owner"
ON service_requests
FOR DELETE
TO authenticated
USING (auth.uid() = client_id);

-- Política para permitir excluir propostas relacionadas ao serviço
CREATE POLICY "Enable delete for service owner"
ON service_proposals
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM service_requests
    WHERE service_requests.id = service_proposals.service_id
    AND service_requests.client_id = auth.uid()
  )
);

-- Garantir que o usuário autenticado tenha todas as permissões necessárias
GRANT ALL ON service_requests TO authenticated;
GRANT ALL ON service_proposals TO authenticated;
