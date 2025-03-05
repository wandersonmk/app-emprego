-- Garantir que a tabela service_requests tem as colunas necessárias
ALTER TABLE IF EXISTS public.service_requests
    ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Garantir que temos a política de leitura correta
DROP POLICY IF EXISTS "Enable read for authenticated users" ON public.service_requests;
CREATE POLICY "Enable read for authenticated users" 
ON public.service_requests
FOR SELECT 
TO authenticated 
USING (true);

-- Garantir que temos a política de exclusão correta
DROP POLICY IF EXISTS "Enable delete for service owner" ON public.service_requests;
CREATE POLICY "Enable delete for service owner"
ON public.service_requests
FOR DELETE
TO authenticated
USING (auth.uid() = client_id);
