import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1749500062364 implements MigrationInterface {
    name = 'Init1749500062364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "version" integer NOT NULL, "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "artistId" uuid, "albumId" uuid, "duration" integer NOT NULL, CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "grammy" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorite_artists" ("favoritesId" uuid NOT NULL, "artistId" uuid NOT NULL, CONSTRAINT "PK_2a30571844769778e3dd68fa50a" PRIMARY KEY ("favoritesId", "artistId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_11682aea842abd83a8f5c57a3d" ON "favorite_artists" ("favoritesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_82be0072b2a229420a57f08157" ON "favorite_artists" ("artistId") `);
        await queryRunner.query(`CREATE TABLE "favorite_albums" ("favoritesId" uuid NOT NULL, "albumId" uuid NOT NULL, CONSTRAINT "PK_8267bb280840a37a46547faa56d" PRIMARY KEY ("favoritesId", "albumId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6d7b97c123859b18b9d9d3c95f" ON "favorite_albums" ("favoritesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9fe28ffb3ad15145d7d3b08503" ON "favorite_albums" ("albumId") `);
        await queryRunner.query(`CREATE TABLE "favorite_tracks" ("favoritesId" uuid NOT NULL, "trackId" uuid NOT NULL, CONSTRAINT "PK_9586c57be152d29282813822380" PRIMARY KEY ("favoritesId", "trackId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6ed3ffea4462a005e620e4cf3b" ON "favorite_tracks" ("favoritesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6b0c7d487a618e839e987b3db1" ON "favorite_tracks" ("trackId") `);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_62f595181306916265849fced48" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_5c52e761792791f57de2fec342d" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_artists" ADD CONSTRAINT "FK_11682aea842abd83a8f5c57a3d0" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorite_artists" ADD CONSTRAINT "FK_82be0072b2a229420a57f08157a" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorite_albums" ADD CONSTRAINT "FK_6d7b97c123859b18b9d9d3c95fa" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorite_albums" ADD CONSTRAINT "FK_9fe28ffb3ad15145d7d3b08503f" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorite_tracks" ADD CONSTRAINT "FK_6ed3ffea4462a005e620e4cf3ba" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorite_tracks" ADD CONSTRAINT "FK_6b0c7d487a618e839e987b3db1d" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_tracks" DROP CONSTRAINT "FK_6b0c7d487a618e839e987b3db1d"`);
        await queryRunner.query(`ALTER TABLE "favorite_tracks" DROP CONSTRAINT "FK_6ed3ffea4462a005e620e4cf3ba"`);
        await queryRunner.query(`ALTER TABLE "favorite_albums" DROP CONSTRAINT "FK_9fe28ffb3ad15145d7d3b08503f"`);
        await queryRunner.query(`ALTER TABLE "favorite_albums" DROP CONSTRAINT "FK_6d7b97c123859b18b9d9d3c95fa"`);
        await queryRunner.query(`ALTER TABLE "favorite_artists" DROP CONSTRAINT "FK_82be0072b2a229420a57f08157a"`);
        await queryRunner.query(`ALTER TABLE "favorite_artists" DROP CONSTRAINT "FK_11682aea842abd83a8f5c57a3d0"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_5c52e761792791f57de2fec342d"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_62f595181306916265849fced48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6b0c7d487a618e839e987b3db1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ed3ffea4462a005e620e4cf3b"`);
        await queryRunner.query(`DROP TABLE "favorite_tracks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9fe28ffb3ad15145d7d3b08503"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d7b97c123859b18b9d9d3c95f"`);
        await queryRunner.query(`DROP TABLE "favorite_albums"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82be0072b2a229420a57f08157"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11682aea842abd83a8f5c57a3d"`);
        await queryRunner.query(`DROP TABLE "favorite_artists"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`DROP TABLE "artists"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
