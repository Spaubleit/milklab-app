INSERT INTO position (id, name) VALUES (1, 'Администратор');
INSERT INTO position (id, name) VALUES (2, 'Оператор машинного доения');
INSERT INTO position (id, name) VALUES (3, 'Руководитель фермы');
INSERT INTO position (id, name) VALUES (4, 'test');

INSERT INTO role (id, name, value) VALUES (1, 'Администратор БД', 'DBAnmin');
INSERT INTO role (id, name, value) VALUES (2, 'Просмотр отчётов', 'Report');
INSERT INTO role (id, name, value) VALUES (3, 'Администратор', 'Admin');
INSERT INTO role (id, name, value) VALUES (4, 'Печать', 'Print');
INSERT INTO role (id, name, value) VALUES (5, 'Управление пользователями', 'User');

INSERT INTO "user" (id, username, lastname, firstname, middlename, password, enabled, position_id) VALUES (1, 'spaubleit', 'Лукашев', 'Александр', 'Игоревич', '$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC', TRUE, 1);
INSERT INTO "user" (id, username, lastname, firstname, middlename, position_id) VALUES (2, 'semvp', 'Семейчиков', 'Виктор', 'Петрович', 3);
INSERT INTO "user" (id, username, lastname, firstname, middlename, position_id) VALUES (3, 'vera', 'Иванова', 'Вера', 'Петровна', 2);
INSERT INTO "user" (id, username, lastname, firstname, middlename, position_id) VALUES (4, 'vanessa', 'Седалькова', 'Ванесса', 'Викторовна', 2);

INSERT INTO user_roles (role_id, user_id) VALUES (3, 1);
INSERT INTO user_roles (role_id, user_id) VALUES (2, 2);

INSERT INTO structure (id, name, type) VALUES (1, 'Гомельская', 'region');
INSERT INTO region (id) VALUES (1);

INSERT INTO structure (id, name, type) VALUES (2, 'Гомельский', 'district');
INSERT INTO district (id, region_id) VALUES (2, 1);

INSERT INTO structure (id, name, type) VALUES (3, 'Гомельское', 'household');
INSERT into household (id, district_id) VALUES (3, 2);

INSERT INTO structure (id, name, type, user_id) VALUES (4, 'Гагарино', 'farm', 3);
INSERT INTO farm(id, household_id) VALUES (4, 3);
INSERT INTO structure (id, name, type) VALUES (5, 'Калинино', 'farm');
INSERT INTO farm(id, household_id) VALUES (5, 3);

INSERT INTO "group" (id, farm_id, user_id, number) VALUES (1, 4, 3, 1);
INSERT INTO "group" (id, farm_id, user_id, number) VALUES (2, 4, 4, 2);
INSERT INTO "group" (id, farm_id, user_id, number) VALUES (3, 4, 4, 3);

INSERT INTO cow (id, nickname, number, group_id) VALUES (1, 'Светка', 54658, 1);
INSERT INTO cow (id, nickname, number, group_id) VALUES (2, 'Берлинка', 54662, 1);
INSERT INTO cow (id, nickname, number, group_id) VALUES (3, 'Ромашка', 54663, 1);
INSERT INTO cow (id, nickname, number, group_id) VALUES (4, 'Лыска', 54679, 1);
INSERT INTO cow (id, nickname, number, group_id) VALUES (5, 'Рогатка', 500, 3);

INSERT INTO container(id, number, state) VALUES (1, 1, 0);
INSERT INTO container(id, number, state) VALUES (2, 2, 1);
INSERT INTO container(id, number, state) VALUES (3, 3, 1);
INSERT INTO container(id, number, state) VALUES (4, 4, 2);
INSERT INTO container(id, number, state) VALUES (5, 5, 3);