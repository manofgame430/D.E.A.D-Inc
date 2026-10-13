#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/91d357fccf37463d8427516d06480e81a9df64f83e97ed379f0fb963e72db150/contract';
import endContract from '../../snapshots/91d357fccf37463d8427516d06480e81a9df64f83e97ed379f0fb963e72db150/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Encounter',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('duration', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('fearRating', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('monsterId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('roomId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('visitId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Guest',
        columns: [
          col('ageGroup', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('guestCode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Monster',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('species', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Room',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('difficulty', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Visit',
        columns: [
          col('completed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('duration', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('endTime', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('fearRating', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('guestId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startTime', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Guest',
        constraint: 'Guest_guestCode_key',
        columns: ['guestCode'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Monster',
        constraint: 'Monster_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Room',
        constraint: 'Room_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Encounter',
        index: 'Encounter_monsterId_idx_6ebc3e37',
        columns: ['monsterId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Encounter',
        index: 'Encounter_roomId_idx_fe51d647',
        columns: ['roomId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Encounter',
        index: 'Encounter_visitId_idx_fcfcb8fb',
        columns: ['visitId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Visit',
        index: 'Visit_guestId_idx_39c95865',
        columns: ['guestId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Encounter',
        foreignKey: {
          name: 'Encounter_visitId_fkey',
          columns: ['visitId'],
          references: { schema: 'public', table: 'Visit', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Encounter',
        foreignKey: {
          name: 'Encounter_monsterId_fkey',
          columns: ['monsterId'],
          references: { schema: 'public', table: 'Monster', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Encounter',
        foreignKey: {
          name: 'Encounter_roomId_fkey',
          columns: ['roomId'],
          references: { schema: 'public', table: 'Room', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Visit',
        foreignKey: {
          name: 'Visit_guestId_fkey',
          columns: ['guestId'],
          references: { schema: 'public', table: 'Guest', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
