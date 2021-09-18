-- Resgates semanais
select count(*), date_trunc('week', created_at) AS week_date
from gift_card_requests gcr
where gcr.created_at >= current_date - interval '30' day
group by week_date

-- Validações semanais
select count(*), date_trunc('week', updated_at) AS week_date
from gift_card_requests gcr
where gcr.status = 'used'
and gcr.updated_at >= current_date - interval '30' day
group by week_date

--Vales-presente mais resgatados
select count(*), gc.title from gift_card_requests gcr
inner join gift_cards gc
on gcr.gift_card_id = gc.id
where gcr.created_at >= current_date - interval '30' day
group by gc.title, gc.id
