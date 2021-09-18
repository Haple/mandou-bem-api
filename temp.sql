-- Resgates semanais
select count(*), date_trunc('week', created_at) AS created_at_week
from gift_card_requests gcr
group by created_at_week
--1 2 5

-- Validações semanais
select count(*), date_trunc('week', updated_at) AS updated_at_week
from gift_card_requests gcr
where gcr.status = 'used'
group by updated_at_week
-- 1

--Vales-presente mais resgatados
select count(*), gc.title from gift_card_requests gcr
inner join gift_cards gc
on gcr.gift_card_id = gc.id
group by gc.title, gc.id
