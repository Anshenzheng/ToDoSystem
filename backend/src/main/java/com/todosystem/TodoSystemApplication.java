package com.todosystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TodoSystemApplication {
    public static void main(String[] args) {
        SpringApplication.run(TodoSystemApplication.class, args);
        System.out.println("========================================");
        System.out.println("   待办事项管理平台 - 后端服务启动成功!");
        System.out.println("   访问地址: http://localhost:8080");
        System.out.println("========================================");
    }
}
