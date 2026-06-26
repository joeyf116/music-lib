import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const songs = pgTable('songs', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  key: text('key'),
  capo: text('capo'),
  tuning: text('tuning'),
  difficulty: text('difficulty'),
  instrumentFocus: text('instrument_focus').notNull().default('guitar'),
  spotifyUrl: text('spotify_url'),
  tabUrl: text('tab_url'),
  youtubeUrl: text('youtube_url'),
  chordProgression: jsonb('chord_progression').$type<string[]>().notNull().default([]),
  notes: text('notes'),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  practiceStatus: text('practice_status').notNull().default('wantToLearn'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const playlists = pgTable('playlists', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  songIds: jsonb('song_ids').$type<string[]>().notNull().default([]),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  practiceGoal: text('practice_goal'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Song = typeof songs.$inferSelect
export type NewSong = typeof songs.$inferInsert
export type Playlist = typeof playlists.$inferSelect
export type NewPlaylist = typeof playlists.$inferInsert
