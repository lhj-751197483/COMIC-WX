/*
 Navicat Premium Data Transfer

 Source Server         : MYSQL80
 Source Server Type    : MySQL
 Source Server Version : 80023
 Source Host           : localhost:3306
 Source Schema         : flowers

 Target Server Type    : MySQL
 Target Server Version : 80023
 File Encoding         : 65001

 Date: 23/04/2021 03:51:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for device
-- ----------------------------
DROP TABLE IF EXISTS `device`;
CREATE TABLE `device`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '设备名称',
  `mode` int(0) NOT NULL DEFAULT 0 COMMENT '操作模式，1自动，0手动',
  `state` int(0) NOT NULL COMMENT '当前状态，1开，0关',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of device
-- ----------------------------
INSERT INTO `device` VALUES (1, 'Pump', 1, 1);
INSERT INTO `device` VALUES (2, 'Light_A', 1, 0);
INSERT INTO `device` VALUES (3, 'Light_B', 1, 0);

-- ----------------------------
-- Table structure for flower
-- ----------------------------
DROP TABLE IF EXISTS `flower`;
CREATE TABLE `flower`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '花卉ID（唯一）',
  `name` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '学名',
  `bestTempInD` float(4, 1) UNSIGNED ZEROFILL NOT NULL COMMENT '白天最佳生存温度',
  `bestTempInN` float(4, 1) UNSIGNED ZEROFILL NOT NULL COMMENT '夜晚最佳生存温度',
  `bestHum` float(4, 1) UNSIGNED ZEROFILL NOT NULL COMMENT '最佳湿度',
  `bestSmHum` float(4, 1) NOT NULL COMMENT '土壤最佳湿度',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `name`(`name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of flower
-- ----------------------------
INSERT INTO `flower` VALUES (17, '玫瑰', 11.0, 20.0, 34.0, 56.0);
INSERT INTO `flower` VALUES (18, '蒲公英', 25.0, 24.0, 56.0, 32.0);
INSERT INTO `flower` VALUES (22, '百合', 999.0, 99.0, 999.0, 999.0);

-- ----------------------------
-- Table structure for myflower
-- ----------------------------
DROP TABLE IF EXISTS `myflower`;
CREATE TABLE `myflower`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `pet_name` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `name` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '学名',
  `start_time` datetime(0) NOT NULL COMMENT '种植时间',
  `owner_id` int(0) NOT NULL COMMENT '花主ID',
  `dht11_id` int(0) NULL DEFAULT NULL COMMENT '温湿度传感器id',
  `lens_id` int(0) NULL DEFAULT NULL COMMENT '光照电阻传感器id',
  `smens_id` int(0) NULL DEFAULT NULL COMMENT '土壤温湿度传感器id',
  `flower_id` int(0) NULL DEFAULT NULL COMMENT '花库ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pet-name`(`pet_name`) USING BTREE,
  INDEX `name`(`name`) USING BTREE,
  INDEX `owner_id`(`owner_id`) USING BTREE,
  INDEX `dht11_id`(`dht11_id`) USING BTREE,
  INDEX `lens_id`(`lens_id`) USING BTREE,
  INDEX `smens_id`(`smens_id`) USING BTREE,
  INDEX `flower_id`(`flower_id`) USING BTREE,
  CONSTRAINT `myflower_ibfk_1` FOREIGN KEY (`name`) REFERENCES `flower` (`name`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `myflower_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `myflower_ibfk_3` FOREIGN KEY (`dht11_id`) REFERENCES `sensor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `myflower_ibfk_4` FOREIGN KEY (`lens_id`) REFERENCES `sensor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `myflower_ibfk_5` FOREIGN KEY (`smens_id`) REFERENCES `sensor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `myflower_ibfk_6` FOREIGN KEY (`flower_id`) REFERENCES `flower` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of myflower
-- ----------------------------
INSERT INTO `myflower` VALUES (25, '玫瑰二号', '玫瑰', '2021-04-22 00:00:00', 1, 1, 4, 6, 17);
INSERT INTO `myflower` VALUES (26, '蒲公英一号', '蒲公英', '2019-04-20 00:00:00', 1, 2, 3, 5, 18);
INSERT INTO `myflower` VALUES (27, '蒲公英二号', '蒲公英', '2019-02-21 00:00:00', 1, 1, 3, 6, 18);
INSERT INTO `myflower` VALUES (28, '玫瑰一号', '玫瑰', '2021-03-20 00:00:00', 1, 2, 4, 6, 17);
INSERT INTO `myflower` VALUES (29, '费利菊一号', NULL, '2020-06-22 00:00:00', 1, 2, 4, 6, NULL);
INSERT INTO `myflower` VALUES (30, '啊啊', '玫瑰', '2021-04-22 00:00:00', 1, 1, 4, 6, 17);

-- ----------------------------
-- Table structure for sensor
-- ----------------------------
DROP TABLE IF EXISTS `sensor`;
CREATE TABLE `sensor`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '传感器名字',
  `type` int(0) NOT NULL COMMENT '传感器类型， 1为温湿度，2为光照强度，3为土壤湿度',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`, `type`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sensor
-- ----------------------------
INSERT INTO `sensor` VALUES (1, '温湿度传感器一号', 1);
INSERT INTO `sensor` VALUES (2, '温湿度传感器二号', 1);
INSERT INTO `sensor` VALUES (3, '光敏电阻传感器一号', 2);
INSERT INTO `sensor` VALUES (4, '光敏电阻传感器二号', 2);
INSERT INTO `sensor` VALUES (5, '土壤湿度传感器一号', 3);
INSERT INTO `sensor` VALUES (6, '土壤湿度传感器二号', 3);

-- ----------------------------
-- Table structure for sensor_data
-- ----------------------------
DROP TABLE IF EXISTS `sensor_data`;
CREATE TABLE `sensor_data`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `value` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '传感器数据',
  `created_time` datetime(0) NOT NULL COMMENT '数据采集时间',
  `sensor_id` int(0) NOT NULL COMMENT '传感器id',
  `unit_type` int(0) NOT NULL COMMENT '传感器数据类型，0为温度，1为湿度，2为光照强度，3为土壤湿度',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sensor_id`(`sensor_id`) USING BTREE,
  CONSTRAINT `sensor_data_ibfk_1` FOREIGN KEY (`sensor_id`) REFERENCES `sensor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sensor_data
-- ----------------------------
INSERT INTO `sensor_data` VALUES (1, '42', '2021-03-31 15:49:26', 1, 0);
INSERT INTO `sensor_data` VALUES (2, '26', '2021-03-31 15:49:50', 1, 1);
INSERT INTO `sensor_data` VALUES (3, '24', '2021-03-31 15:50:25', 2, 0);
INSERT INTO `sensor_data` VALUES (4, '33', '2021-03-31 15:50:39', 2, 1);
INSERT INTO `sensor_data` VALUES (5, '45', '2021-03-31 15:50:56', 3, 2);
INSERT INTO `sensor_data` VALUES (6, '88', '2021-03-31 15:51:18', 4, 2);
INSERT INTO `sensor_data` VALUES (7, '63', '2021-03-31 15:51:39', 5, 3);
INSERT INTO `sensor_data` VALUES (8, '52', '2021-03-31 15:52:00', 6, 3);
INSERT INTO `sensor_data` VALUES (9, '28', '2021-03-31 16:33:13', 1, 0);
INSERT INTO `sensor_data` VALUES (10, '28', '2021-04-04 00:00:00', 1, 0);
INSERT INTO `sensor_data` VALUES (11, '12', '2021-04-09 00:00:00', 1, 0);
INSERT INTO `sensor_data` VALUES (12, '13', '2021-04-09 00:00:00', 1, 0);
INSERT INTO `sensor_data` VALUES (13, '25', '2021-04-10 03:07:51', 1, 0);
INSERT INTO `sensor_data` VALUES (14, '25', '2021-04-10 03:09:41', 1, 0);
INSERT INTO `sensor_data` VALUES (15, '25', '2021-04-10 03:12:34', 1, 0);
INSERT INTO `sensor_data` VALUES (16, '12', '2021-04-10 03:15:10', 1, 0);
INSERT INTO `sensor_data` VALUES (17, '12', '2021-04-10 03:24:20', 1, 0);
INSERT INTO `sensor_data` VALUES (18, '22', '2021-04-10 03:52:04', 1, 0);
INSERT INTO `sensor_data` VALUES (19, '12', '2021-04-10 03:52:42', 1, 0);
INSERT INTO `sensor_data` VALUES (20, '12', '2021-04-10 03:52:46', 1, 0);
INSERT INTO `sensor_data` VALUES (21, '12', '2021-04-10 03:52:48', 1, 0);
INSERT INTO `sensor_data` VALUES (22, '12', '2021-04-10 03:57:52', 1, 0);
INSERT INTO `sensor_data` VALUES (23, '12', '2021-04-10 16:48:35', 1, 0);
INSERT INTO `sensor_data` VALUES (24, '12', '2021-04-10 18:46:10', 1, 0);
INSERT INTO `sensor_data` VALUES (25, '12', '2021-04-11 23:37:13', 1, 0);
INSERT INTO `sensor_data` VALUES (26, '12', '2021-04-11 23:42:48', 3, 2);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `user_name` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` char(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `phone_number` char(11) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '手机号',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_name`(`user_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '吴华宇', '$2a$10$zMM2lGXIqj2WUCX4ZZWmgO5oh5skU5b50LyD6ZxM/5SD5pdccrqry', '17620526463');
INSERT INTO `user` VALUES (3, 'string1', '$2a$10$Xq8vbWRkFcsoWH4etoH3ReLWuZg6KP1xtZra3.vDJ4X4Q/k3J/cCK', '1111');
INSERT INTO `user` VALUES (4, 'string2', '$2a$10$uxlZKQ2XdpxStKguEXl0EOVpV.CHTEvW3GNbmp5ghYms61uR4tKLe', '1111');
INSERT INTO `user` VALUES (5, 'string3', '$2a$10$1ldEMXwyl/V.l/xDje76aufLWJ0P6bEf.3xTv8WYJy4.0EfO24am2', '1111');
INSERT INTO `user` VALUES (6, 'string5', '$2a$10$cc5SLk9UuGYNzPVILewFtum96/n2k1b/NREzgz6WxucFpnIvDh0ua', 'string');
INSERT INTO `user` VALUES (7, 'string9', '$2a$10$6Tni0rEjCtZm3xICOjymSemebB6N8RB2uHPu7LsOiZnUySdSbsB1C', 'string');
INSERT INTO `user` VALUES (8, '吴华宇1', '$2a$10$vZ/2OnOEyBkTahg.BywNteNPydnkUR/KGlDPvOcjda/N6uwrWpmm.', '15766474161');
INSERT INTO `user` VALUES (9, '吴华宇2', '$2a$10$y3wW.dcIBq31MS/efVgqA..UQWujDw456AOFaKhEqmqx/uYBSdV4C', '15766474161');
INSERT INTO `user` VALUES (10, '呜呜呜呜', '$2a$10$Vfv9Aa/g6NcFZYcHliWx5OM//5pWgIBxJYR7j.4DhIp6x2xaEZmtG', 'string');

SET FOREIGN_KEY_CHECKS = 1;
