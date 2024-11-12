-- Uni recommendation based on Fee and Ranking
-- I assume that at this point: User has chosen the state + industry that they want
SELECT name, fee, duration -- fee
FROM unicourse
WHERE industry = %s and state = %s 
ORDER BY fee ASC
LIMIT 5;

SELECT name, fee, duration,  -- ranking
FROM unicourse
WHERE industry = %s and state = %s 
ORDER BY rank ASC
LIMIT 5;
