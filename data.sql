UPDATE xzqa_author INNER JOIN
(SELECT COUNT(id) AS count,author_id FROM xzqa_article GROUP BY author_id) AS temp
ON xzqa_author.id=temp.author_id
SET article_number=count;