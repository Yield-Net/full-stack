CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address text UNIQUE NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone
) WITH (OIDS=FALSE);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    risk_tolerance text CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
    investment_amount numeric,
    investment_currency text,
    investment_horizon text CHECK (investment_horizon IN ('short', 'medium', 'long')),
    experience_level text CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
    investment_goals text[],
    preferred_activities text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
) WITH (OIDS=FALSE);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_strategies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    strategy_data json,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true
) WITH (OIDS=FALSE);
ALTER TABLE public.user_strategies ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    transaction_hash text,
    blockchain text,
    protocol text,
    activity text,
    amount numeric,
    token text,
    status text CHECK (status IN ('pending', 'confirmed', 'failed')),
    timestamp timestamp with time zone DEFAULT now()
) WITH (OIDS=FALSE);
ALTER TABLE public.user_transactions ENABLE ROW LEVEL SECURITY;
