-- Custom SQL migration file, put your code below! --

-- RLS backstop. A autorizacao real vive na camada de servidor (filtro por userId nas
-- queries do Drizzle), porque o role do pooler ignora RLS. Estas policies so entram em
-- acao se algum acesso vier pelo client SDK do Supabase (role authenticated, com JWT):
-- ai o usuario so enxerga as proprias linhas. Ver docs/plans/02-dados-auth.md secao 2.6.

-- Garante RLS ligado (idempotente).
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Tabelas com user_id: dono ve/edita so o que e seu.
CREATE POLICY "folders_owner" ON folders
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_owner" ON notes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tags_owner" ON tags
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_owner" ON tasks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "subscriptions_owner" ON subscriptions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- note_tags nao tem user_id: a posse e derivada da nota associada.
CREATE POLICY "note_tags_owner" ON note_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = note_tags.note_id AND notes.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = note_tags.note_id AND notes.user_id = auth.uid())
  );