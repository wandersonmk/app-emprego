-- Tabela de propostas de serviço
CREATE TABLE IF NOT EXISTS public.service_proposals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id uuid REFERENCES public.service_requests(id) ON DELETE CASCADE,
    professional_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    description text NOT NULL,
    budget numeric(10,2) NOT NULL,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS public.service_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id uuid REFERENCES public.service_requests(id) ON DELETE CASCADE,
    reviewer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamp with time zone DEFAULT now()
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Políticas de segurança
ALTER TABLE public.service_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas para propostas
CREATE POLICY "Enable read access for service owner and professional" ON public.service_proposals
    FOR SELECT
    TO authenticated
    USING (
        professional_id = auth.uid() OR 
        service_id IN (
            SELECT id FROM public.service_requests WHERE client_id = auth.uid()
        )
    );

CREATE POLICY "Enable insert for professionals" ON public.service_proposals
    FOR INSERT
    TO authenticated
    WITH CHECK (professional_id = auth.uid());

-- Políticas para avaliações
CREATE POLICY "Enable read access for all authenticated users" ON public.service_reviews
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for service participants" ON public.service_reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (
        reviewer_id = auth.uid() AND
        service_id IN (
            SELECT id FROM public.service_requests 
            WHERE client_id = auth.uid() OR id IN (
                SELECT service_id FROM public.service_proposals 
                WHERE professional_id = auth.uid()
            )
        )
    );

-- Políticas para mensagens
CREATE POLICY "Enable read access for sender and recipient" ON public.messages
    FOR SELECT
    TO authenticated
    USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Enable insert for authenticated users" ON public.messages
    FOR INSERT
    TO authenticated
    WITH CHECK (sender_id = auth.uid());

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_proposals_updated_at
    BEFORE UPDATE ON public.service_proposals
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
