-- Mise Ö jour des arriäre-plans avec photos de familles heureuses 
UPDATE public.app_settings SET value = 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920' WHERE key = 'bg_login'; 
UPDATE public.app_settings SET value = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920' WHERE key = 'bg_signup'; 
UPDATE public.app_settings SET value = 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1920' WHERE key = 'bg_profile'; 
UPDATE public.app_settings SET value = 'https://images.unsplash.com/photo-1543269664-647b2dd9d5ca?w=1920' WHERE key = 'bg_admin'; 
UPDATE public.app_settings SET value = 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1920' WHERE key = 'bg_hero';
