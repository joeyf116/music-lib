import { pgTable, text, jsonb, timestamp, integer } from 'drizzle-orm/pg-core'

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

export const libraryEntries = pgTable('library_entries', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),           // chord | scale | arpeggio | etude | lick
  name: text('name').notNull(),
  instrument: text('instrument').notNull(),
  strings: integer('strings').notNull(),
  tuning: text('tuning').notNull(),
  root: text('root'),
  scaleType: text('scale_type'),
  chordType: text('chord_type'),
  position: text('position'),
  fretRange: jsonb('fret_range').$type<[number, number]>(),
  difficulty: text('difficulty'),
  tab: text('tab'),
  diagram: jsonb('diagram').$type<import('@/types').Diagram>(),
  formula: text('formula'),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
})

export type LibraryEntryRow = typeof libraryEntries.$inferSelect
export type NewLibraryEntryRow = typeof libraryEntries.$inferInsert

export type Song = typeof songs.$inferSelect
export type NewSong = typeof songs.$inferInsert
export type Playlist = typeof playlists.$inferSelect
export type NewPlaylist = typeof playlists.$inferInsert
