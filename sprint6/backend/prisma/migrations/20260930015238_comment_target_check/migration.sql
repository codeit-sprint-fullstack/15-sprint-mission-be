-- Add a DB-level CHECK constraint so a comment targets exactly one
-- of Product (productId) or Article (articleId).
ALTER TABLE "Comment"
ADD CONSTRAINT "chk_Comment_exactly_one_target" CHECK (
  ("productId" IS NOT NULL AND "articleId" IS NULL)
  OR ("productId" IS NULL AND "articleId" IS NOT NULL)
);